import path from 'path';
import { Asset } from '../models/Asset';
import { BaseService } from './BaseService';
import { Op } from 'sequelize';
import fs from 'fs';
import {
  AssetFilterDTO,
  CreateAssetDTO,
} from '../dtos/asset/AssetDTO';
import { Logger } from '../utils/logger';
import { Readable } from 'stream';
import B2Helper from '../helper/B2Helper';
import { Transaction } from 'sequelize';

export class AssetService {
  private assetService: BaseService<Asset>;
  private b2Helper = new B2Helper();

  constructor() {
    this.assetService = new BaseService(
      Asset as unknown as { new (): Asset } & typeof Asset
    );
  }

  /**
   * Fetches all assets with optional filters, pagination, sorting, and limit.
   * @param filters - Object containing filters to apply to the query.
   * @param limit - Number of assets to return.
   * @param offset - Number of assets to skip for pagination.
   * @param sortBy - Field to sort by.
   * @param sortDirection - Direction to sort (ASC or DESC).
   * @returns A list of assets and the total count of assets matching the criteria.
   */
  async getAllAssets(
    filters: AssetFilterDTO,
    limit: number,
    offset: number,
    sortBy: string,
    sortDirection: string
  ): Promise<{ rows: Asset[]; count: number }> {
    try {
      const where: { name?: { [Op.like]: string }; companyId?: number } = {};
      if (filters?.name) {
        where.name = { [Op.like]: `%${filters.name}%` };
      }
      if (filters?.companyId) {
        where.companyId = filters.companyId;
      }

      const { count, rows } = await this.assetService.findAndCountAll({
        where,
        limit,
        offset,
        order: [[sortBy, sortDirection.toUpperCase()]],
      });
      return { rows, count };
    } catch (error) {
      Logger.error('Error getAllAssets', error);
      throw error;
    }
  }
  /**
   * Retrieves a readable file stream for the given file Id.
   * @param fileId - b2 file Id.
   * @returns A promise that resolves with a readable stream for the file.
   */
  async getFileStream(fileId: string): Promise<Readable> {
    try {
      // Return the file stream using the download URL
      const downloadResponse = await this.b2Helper.getFileStreamById(fileId);
      return downloadResponse;
    } catch (error) {
      Logger.error('error fetching file from b2:', error);
      throw new Error('Error fetching file');
    }
  }

  /**
   * Retrieves an asset by its ID from the database.
   * @param assetId - The ID of the asset to retrieve.
   * @returns A promise that resolves with the asset or null if not found.
   */
  async getAssetById(assetId: string): Promise<Asset | null> {
    try {
      return this.assetService.findOne({ where: { id: assetId } });
    } catch (error) {
      Logger.error('Error getAssetById', error);
      throw error;
    }
  }
  /**
   * Uploads the asset to B2 and creates a corresponding asset record in the database.
   * @param fileData - The data associated with the file being uploaded.
   * @param userId - The ID of the user uploading the file.
   * @param userRole - The role of the user.
   * @returns The created asset object after the file is uploaded and saved.
   */
  async uploadAsset(
    fileData: CreateAssetDTO,
    userId: number,
    userRole: string,
    transaction?: Transaction
  ): Promise<Asset> {
    try {
      const sanitizeFileName = (name: string): string => {
        if (!name || typeof name !== 'string') {
          return `file-${userId}`; // Fallback name if input is invalid
        }

        let sanitized = name
          .normalize('NFKD') // Convert special characters
          .replace(/[^\w\s.-]/g, '') // Remove special characters except letters, numbers, ., -, and spaces
          .trim() // Trim leading/trailing spaces
          .replace(/\s+/g, '-') // Replace spaces with hyphens
          .replace(/-+/g, '-') // Remove multiple dashes
          .toLowerCase(); // Convert to lowercase

        return sanitized || `file-${userId}`; // If empty after sanitization, use fallback
      };
      // Prefix for the file name to maintain a folder structure
      const namePrefix = 'cg/';

      // Generate a unique file name by appending the timestamp to the original file name
      const fileExtension = path.extname(fileData.sourcePath); // Get file extension
      const baseName = path.basename(fileData.name, fileExtension); // Remove extension from original name
      const sanitizedFileName = sanitizeFileName(baseName);
      const fileName = `${namePrefix}${sanitizedFileName}-${Date.now()}${fileExtension}`;

      // Upload the file to Backblaze B2 storage
      const { fileId } = await this.b2Helper.uploadFile(
        fileData.sourcePath,
        fileName
      );

      // Cleanup: remove local file safely
      if (fs.existsSync(fileData.sourcePath)) {
        fs.unlinkSync(fileData.sourcePath);
      }

      const req = {
        name: fileData.name,
        sourcePath: fileId,
        mimeType: fileData.mimeType,
        size: fileData.size,
        userId: userRole === 'USER' ? userId : undefined,
        companyId: userRole !== 'USER' ? userId : undefined,
        createdBy: userId,
        modifiedBy: userId,
      };
      const assetData = await this.assetService.create(req, transaction);
      return assetData;
    } catch (error) {
      // Ensure local file cleanup on error
      if (fs.existsSync(fileData.sourcePath)) {
        fs.unlinkSync(fileData.sourcePath);
      }
      Logger.error('Error UploadAsset:', error);
      throw error;
    }
  }
}
