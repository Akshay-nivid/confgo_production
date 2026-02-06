import { Asset } from '../../models/Asset';
import { ResponseDTO } from '../ResponseDTO';

export interface CreateAssetDTO {
  name: string;
  mimeType: string;
  sourcePath: string;
  size: number;
}

export interface AssetResponseDTO {
  id: string;
  name: string;
  mimeType: string;
  sourcePath: string;
  size: number;
  companyId?: number;
  userId?: number;
  createdBy: number;
  modifiedBy: number;
  createdOn: Date;
}

export const createAssetResponse = (asset: Asset): AssetResponseDTO => ({
  id: asset.dataValues.id,
  name: asset.dataValues.name,
  mimeType: asset.dataValues.mimeType,
  sourcePath: asset.dataValues.sourcePath,
  size: asset.dataValues.size,
  companyId: asset.dataValues.companyId,
  userId: asset.dataValues.userId,
  createdBy: asset.dataValues.createdBy || 0,
  createdOn: asset.dataValues.createdOn || new Date(),
  modifiedBy: asset.dataValues.modifiedBy || 0
});
export interface AssetFilterDTO {
  companyId?: number;
  name?: string;
}

