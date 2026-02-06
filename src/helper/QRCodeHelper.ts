import QRCode from 'qrcode';

/**
 * Qrcode Service
 * @author Neethu
 */
export class QRCodeHelper {
  constructor() {}

  async generateQRCode(data: any): Promise<string> {
    try {
      const jsonString = JSON.stringify(data); // Convert object to JSON string
      const qrCode = await QRCode.toDataURL(jsonString); // Generate QR code
      console.log('QR Code Generated: ', qrCode); // Debugging log
      return qrCode;
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw error;
    }
  }
}
