import { Request, Response, NextFunction } from "express";
import { AssetService } from "../services/assetService";


interface AuthenticatedRequest extends Request {
    user?: {
        userId: string;
    };
}

export class AssetController {
    constructor(private readonly assetService: AssetService) { }

    public createAsset = async (req: Request, res: Response) => {
        try {
            const asset = await this.assetService.createAsset(req.body);
            res.status(201).json({ message: "success", data: asset });
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                console.log(error);

                res.status(500).json({ error: "Don't fret!!! An error occurred, Please contact the administrator" });
            }
        }
    };

    public addAssetToUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({ error: "User not authenticated" });
                return;
            }

            const { assetIde } = req.body;
            if (!assetIde) {
                res.status(400).json({ error: "Asset IDE is required" });
                return;
            }

            const userAsset = await this.assetService.addAssetToUser(userId, assetIde);
            res.status(201).json({ message: "success", data: userAsset });
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: "Don't fret! An error occurred, Please contact the administrator" });
            }
        }
    }
    public findAssetByLocation = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { latitude, longitude, distance } = req.query;

            const assets = await this.assetService.findAssetByLocation(
                Number(latitude),
                Number(longitude),
                Number(distance)
            );
            res.status(200).json({ message: "success", data: assets });
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: "Don't fret! An error occurred, Please contact the administrator" });
            }
        }
    };
}
