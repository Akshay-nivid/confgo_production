import B2 from 'backblaze-b2';
import fs from 'fs';
import { Readable } from 'stream';
import { Logger } from '../utils/logger';
import { b2Config } from '../config/b2Config';

class B2Helper {
  private b2: B2;
  private bucketId: string;
  private authToken: string | null = null;
  private authExpiration: number | null = null;

  constructor() {
    this.b2 = new B2({
      applicationKeyId: b2Config.applicationKeyId,
      applicationKey: b2Config.applicationKey,
    });
    this.bucketId = b2Config.bucketId;
  }

  /**
   * Authorizes the B2 client.
   */
  private async authorize(): Promise<void> {
    if (this.authToken && this.authExpiration && Date.now() < this.authExpiration) {
      return;
    }
    try {
      const response = await this.b2.authorize();
      this.authToken = response.data.authorizationToken;
      this.authExpiration = Date.now() + 6 * 60 * 60 * 1000; // 6 hours expiry
    } catch (error) {
      Logger.error('failed to authorize b2',error)
      throw new Error(`Something went wrong. Please try again later.`);
    }
  }

  /**
   * Uploads a file to the B2 bucket.
   * @param filePath - Local path to the file.
   * @param fileName - Desired file name in B2 (including path).
   * @returns B2 file ID and file info.
   */
  async uploadFile(filePath: string, fileName: string): Promise<{fileId: string}> {
    try {
      await this.authorize();
      
      const fileContent = fs.readFileSync(filePath);
      const uploadUrlResponse = await this.b2.getUploadUrl({ bucketId: this.bucketId });
      const uploadResponse = await this.b2.uploadFile({
        uploadUrl: uploadUrlResponse.data.uploadUrl,
        uploadAuthToken: uploadUrlResponse.data.authorizationToken,
        fileName: fileName,
        data: fileContent,
      });

      return {
        fileId: uploadResponse.data.fileId,
      };
    } catch (error) {
      throw new Error(`File upload failed`);
    }
  }


  /**
   * Retrieves a readable file stream for the given file ID.
   * @param fileId - Backblaze file ID.
   * @returns A promise that resolves with a readable stream for the file.
   */
  async getFileStreamById(fileId: string): Promise<Readable> {
    try {
      await this.authorize();

      const downloadResponse = await this.b2.downloadFileById({
        fileId,
        responseType: 'stream',
      });

      if (!downloadResponse.data) {
        throw new Error('error fetching file');
      }

      return downloadResponse.data;
    } catch (error) {
      throw new Error(`Error fetching file`);
    }
  }

}

export default B2Helper;