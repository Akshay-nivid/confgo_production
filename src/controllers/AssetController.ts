import { Request, Response, NextFunction } from 'express';
import { AssetService } from '../services/AssetService';
import { handleError } from '../utils/error_util';
import { extractListRequestData } from '../utils/request_util';
import { Asset } from '../models/Asset';
import { createPaginatedResponse } from '../utils/response_util';
import { extractAssetData } from '../handlers/asset/assetHandler';
import { createAssetResponse } from '../dtos/asset/AssetDTO';
import { JwtPayload } from 'jsonwebtoken';
import { UserService } from '../services/UserService';
import multer from 'multer';
import path from 'path';
import { AppError } from '../utils/AppError';
import { Logger } from '../utils/logger';
import { Transaction } from 'sequelize';
import { sequelize } from '../models';

export class AssetController {
  private assetService = new AssetService();
  private userService = new UserService();
  private storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
      // Set the destination for file uploads
      cb(null, 'uploads/');
    },
    filename: (_req, file, cb) => {
      // Set a unique filename by combining the original file name and timestamp
      const originalName = file.originalname
        .trim()
        .split('.')[0]
        .slice(0, 20)
        .replace(/\s+/g, '-') // Replace whitespace with hyphens
        .replace(/[^\w-]/g, ''); // Remove non-alphanumeric characters except hyphens
      cb(
        null,
        `${originalName}-${Date.now()}${path.extname(file.originalname)}`
      );
    },
  });
  private upload = multer({ storage: this.storage });
  /**
   * Handles file upload and saves file data to the database.
   * @param req
   * @param res
   * @param next
   */
  async uploadAsset(req: Request, res: Response, next: NextFunction) {
    const transaction: Transaction = await sequelize.transaction();
    try {
      // Use a Promise to handle the asynchronous file upload process with Multer
      await new Promise<void>((resolve, reject) => {
        this.upload.array('file',10)(req, res, (err) => {
          if (err) {
            reject(new Error('Failed to upload file'));
          } else {
            resolve();
          }
        });
      });  
      const userId = (req.user as JwtPayload)?.id;
      const userRole = (req.user as JwtPayload)?.userRole;
      if (!userId) {
        throw new Error('User authentication failed.');
      }
      let id;
      if (userRole == 'USER') {
        id = userId;

        if (!id) {
          throw new Error('User information could not be verified');
        }
      } else {
        id = await this.userService.getCompanyId(userId);
        if (!id) {
          throw new Error('Company information could not be verified');
        }
      }
      const filesData = req.files as Express.Multer.File[] || [];
      if (filesData.length === 0) {
        throw new Error('No file uploaded.');
      }
      const fileDataList = filesData.map((file) => extractAssetData(req, file));
      const savedFiles = await Promise.all(
        fileDataList.map(async (fileData) => {
          try {
            return await this.assetService.uploadAsset(
              fileData,
              id,
              userRole,
              transaction
            );
          } catch (error) {
            Logger.error('File upload failed for:', fileData.name, error);
            throw error;
          }
        })
      );

      const responseData = savedFiles?.map(createAssetResponse);
      await transaction.commit();
      res.status(201).json({
        status: 'success',
        message: 'File upload success',
        data: responseData,
      });
    } catch (error) {
      transaction.rollback();
      Logger.error("Error uploadAsset",error);
      handleError(next, error);
    }
  }
  /**
   * Handles the request to get all assets.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  async getAllAssets(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req.user as JwtPayload)?.id;
      const { filters, limit, offset, sortBy, sortDirection } =
        extractListRequestData(req);
      const companyId = await this.userService.getCompanyId(userId);
      if (!companyId) {
        throw new Error('Company information could not be verified');
      }
      const baseFilter = { companyId };
      const finalFilters = { ...baseFilter, ...filters };
      const { rows: assets, count: total } =
        await this.assetService.getAllAssets(
          finalFilters,
          limit,
          offset,
          sortBy,
          sortDirection
        );
      const filteredAssets = assets.map((asset: Asset) =>
        this.filterAssetFields(asset)
      );
      const response = createPaginatedResponse(
        filteredAssets,
        total,
        limit,
        offset
      );
      res.status(200).json(response);
    } catch (error) {
      handleError(next, error);
    }
  }
  /**
   * Filters the asset fields based on the requested fields.
   * @param asset - The asset object to filter.
   * @param fields - Array of fields to include in the response.
   * @returns The filtered asset object.
   */
  private filterAssetFields(asset: Asset) {
    return asset;
  }

  async getAsset(req: Request, res: Response, next: NextFunction) {
    try {
      const assetId = req.params.id;
      const asset = await this.assetService.getAssetById(assetId);
      if (!asset) { 
        throw new AppError('File not found',404)
      }
      const fileId = asset.dataValues.sourcePath;
      const mimeType = asset.dataValues.mimeType;
      const fileStream = await this.assetService.getFileStream(fileId);
      res.setHeader('Content-Type', mimeType);
      fileStream.pipe(res);
    } catch (error) {
      Logger.error('error getAsset:',error)
      handleError(next, error);
    }
  }
}
