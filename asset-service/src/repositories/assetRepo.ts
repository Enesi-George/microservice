import { PrismaClient, Prisma, Asset, UserAsset } from "@prisma/client";


const prisma = new PrismaClient();

interface AssetWithDistance extends Asset {
    distance: number;
}

export class AssetRepository {
    public async createAsset(assetData: any): Promise<Asset> {
        try {
            return await prisma.$queryRaw`
            INSERT INTO "Asset" (id, name, ide, latitude, longitude)
            VALUES (
                gen_random_uuid(), 
                ${assetData.name}, 
                ${assetData.ide}, 
                ${assetData.latitude}, 
                ${assetData.longitude}
            )
            RETURNING *;
        `;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2010") {
                    console.log(error);
                    throw new Error("One or more field(s) is required");
                }
                throw new Error("An error occurred while creating the asset.");
            }
            console.log(error);
            throw new Error("Don't fret! An error has occurred. Please contact the administrator.");
        }
    }


    public async addAssetToUser(userId: string, assetIde: string): Promise<UserAsset> {
        try {
            return await prisma.userAsset.create({
                data: {
                    userId,
                    assetIde,
                },
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2003') {
                    throw new Error("The specified asset ide or user is invalid.");
                }
            }
            if (error instanceof Prisma.PrismaClientValidationError) {
                console.error("Validation error:", error);
                throw new Error("One or more field(s) is required");
            }
            console.error("Unexpected error:", error);
            throw new Error("Don't fret!! An error has occurred. Please contact the administrator.");
        }
    }


    public async findAssetByLocation(latitude: number, longitude: number, distance: number): Promise<AssetWithDistance[]> {
        try {
            const point = Prisma.sql`ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography`;

            const assets = await prisma.asset.findMany({
                where: {
                    userAssets: {
                        some: {} // Ensures the asset is in the user-asset table
                    }
                },
                include: {
                    userAssets: true
                }
            });

            const assetsWithDistance = assets.map(asset => {
                const assetPoint = Prisma.sql`ST_SetSRID(ST_MakePoint(${asset.longitude}, ${asset.latitude}), 4326)::geography`;
                return prisma.$queryRaw<[AssetWithDistance]>`
              SELECT *, 
                ST_Distance(${assetPoint}, ${point}) as distance
              FROM "Asset"
              WHERE id = ${asset.id}
            `.then(result => result[0]);
            });

            const result = await Promise.all(assetsWithDistance);

            return result
                .filter(asset => asset.distance <= distance)
                .sort((a, b) => a.distance - b.distance);
        } catch (error) {
            console.error("Error in findAssetByLocation:", error);
            throw new Error("An unexpected error occurred while finding assets by location.");
        }
    }
}
