import express from 'express';
import { AssetController } from '../controllers/assetController';
import { AssetService } from '../services/assetService';
import { AssetRepository } from '../repositories/assetRepo';
import { PrismaClient } from '@prisma/client';
import { authToken } from '../middleware/auth';

const router = express.Router();

const prisma = new PrismaClient();
const assetRepository = new AssetRepository();
const assetService = new AssetService(assetRepository);
const assetController = new AssetController(assetService);

router.post('/create', assetController.createAsset);
router.post('/assign', authToken, assetController.addAssetToUser);
router.get('/location', authToken, assetController.findAssetByLocation);

export default router;