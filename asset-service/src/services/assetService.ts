import { Asset, UserAsset } from "@prisma/client";
import { AssetRepository } from "../repositories/assetRepo";

export class AssetService {
    constructor(private readonly assetRespository: AssetRepository) {}

    public async createAsset(assetData: any): Promise<Asset> {
        const result = await this.assetRespository.createAsset(assetData);
        console.log(result);
        return result;
    }

    public async addAssetToUser(userId: string, assetId: string): Promise<UserAsset> {
        const result = await this.assetRespository.addAssetToUser(userId, assetId);
        return result;
    }

    public async findAssetByLocation(latitude: number, longitude: number, distance: number) {
        const result = await this.assetRespository.findAssetByLocation(latitude, longitude, distance);
        return result;
    }
}
