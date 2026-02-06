import { CreateAssetDTO } from '../../dtos/asset/AssetDTO';
import { Request } from 'express';
import { AppError } from '../../utils/AppError';

/**
 * Extracts and validates asset data from the request object.
 * @param req - The Express request object containing the uploaded file and additional data.
 * @returns The validated file data (name, mime type, source path, size).
 * @throws AppError if any validation fails.
 */
export const extractAssetData = (
  req: Request, file: Express.Multer.File
): CreateAssetDTO => {
  try {
    const { maxSize, acceptedTypes } = req.body;
    const maxSizeInMB = maxSize ? parseFloat(maxSize) : 10;
    const maxFileSize = maxSizeInMB * 1024 * 1024;
    const allowedTypes =
      acceptedTypes && acceptedTypes.trim() !== ''
        ? acceptedTypes.split(',')
        : [];

    if (!file) {
      throw new AppError('No file uploaded', 400);
    }
    if (file.size > maxFileSize) {
      throw new AppError(
        `File size exceeds the allowed limit of ${maxSizeInMB}MB`,
        400
      );
    }

    if (allowedTypes.length > 0 && !allowedTypes.includes(file.mimetype)) {
      throw new AppError(
        `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`,
        400
      );
    }
    const originalName = file.originalname.trim().split('.')[0].slice(0, 20);
    return {
      name: originalName,
      mimeType: file.mimetype,
      sourcePath: file.path,
      size: file.size,
    };
  } catch (err) {
    throw err;
  }
};
