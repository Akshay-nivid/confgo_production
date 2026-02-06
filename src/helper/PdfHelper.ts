import moment from 'moment';
import { QRCodeHelper } from './QRCodeHelper';
import {
  PDFDocument,
  PDFFont,
  PDFPage,
  RGB,
  rgb,
  StandardFonts,
} from 'pdf-lib';
const fs = require('fs');
const path = require('path');

/**
 * PDF Service
 * @author Neethu
 */
export class PDFHelper {
  private qrCodeService: QRCodeHelper;

  constructor() {
    this.qrCodeService = new QRCodeHelper();
  }



  /**
   * Method to create Event Tags - Pdf files
   * @param eventDetails
   * @returns
   */
  async generatePDFWithQRCode(eventDetails: {
    eventName: string;
    name: string;
    date: string;
    id: string;
url:string;
    qrCode?: string;
    location?: string;
    phone?: string;
    email?: string;
  }): Promise<Buffer> {
    try {
      const { eventName, date, qrCode, location, email, phone } = eventDetails;
      // Ensure date is valid
      const dateFormatted = moment(date, 'DD/MM/YYYY HH:mm');
      const dateFormated = dateFormatted.format('Do MMMM YYYY');
      const timeFormated = dateFormatted.format('hh:mm: a');
      const qrCodeBase64 = await this.qrCodeService.generateQRCode(qrCode);
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([450, 700]); // Adjusted size
      const { width, height } = page.getSize();
      const fontDesc = await pdfDoc.embedFont(StandardFonts.TimesRoman);
      const fontHead = await pdfDoc.embedFont(StandardFonts.CourierBold);
      const textColor = rgb(0, 0, 0);


 

      const wrapText = (
        text: string,
        maxWidth: number,
        font: PDFFont,
        fontSize: number,
        alignment: 'left' | 'center' = 'left' // Default alignment is left
      ): Array<{ text: string; xOffset: number }> => {
        const words = text.split(' ');
        const lines: string[] = [];
        let currentLine = '';

        words.forEach((word) => {
          const lineWithWord = currentLine ? `${currentLine} ${word}` : word;
          const textWidth = font.widthOfTextAtSize(lineWithWord, fontSize);
          if (textWidth < maxWidth) {
            currentLine = lineWithWord;
          } else {
            lines.push(currentLine);
            currentLine = word;
          }
        });

        if (currentLine) {
          lines.push(currentLine);
        }

        // Return lines with calculated offsets for center alignment
        return lines.map((line) => {
          if (alignment === 'center') {
            const textWidth = font.widthOfTextAtSize(line, fontSize);
            const xOffset = Math.max((maxWidth - textWidth) / 2, 0); // Ensure no negative offset
            return { text: line, xOffset };
          }
          return { text: line, xOffset: 0 }; // Left alignment
        });
      };

      // Function to center text
      const drawCenteredText = (text: any, y: any, size: any, font: any) => {
        const textWidth = font.widthOfTextAtSize(text, size);
        page.drawText(text, {
          x: (width - textWidth) / 2, // Centering formula
          y,
          size,
          font: font,
          color: textColor,
        });
      };

      // Background Styling
      page.drawRectangle({
        x: 0,
        y: 0,
        width,
        height,
        color: rgb(1, 0.9216, 0.8627), // Light cream background
      });

      // **Event Name Section**
      const maxEventWidth = (width * 3) / 4; // 3/4 of the page width
      const eventLines = wrapText(
        eventName,
        maxEventWidth,
        fontHead,
        20,
        'left'
      ); // Wrap event name dynamically

      const eventY = height - 35;
      // Draw each wrapped line
      eventLines.forEach((line, index) => {
        // page.drawText(line.text, {
        //   x: 10,
        //   y: eventY - index * 24, // Adjust line spacing
        //   size: 20,
        //   font: fontHead,
        //   color: rgb(0, 0, 0),
        // });
        drawCenteredText(line.text, eventY - index * 24, 22, fontHead);
      });

      // Decorated Date & Time Section
      drawCenteredText('Date & Time', height - 120, 22, fontHead);

      drawCenteredText(dateFormated, height - 140, 14, fontDesc);
      drawCenteredText(timeFormated, height - 160, 14, fontDesc);

      // **Location Section**
      const maxTextWidth = width - 120; // Adjust for padding

      // Ensure location is available
      const safeLocation = location ?? 'Location not available';

      // Wrap the location text into multiple lines
      const locationLines = wrapText(
        safeLocation,
        maxTextWidth,
        fontDesc,
        12,
        'center'
      );

      // Initial y position for location text
      const locationY = height - 237;

      // Draw Location Header
      drawCenteredText('Location', height - 217, 22, fontHead);

      // Draw wrapped location text dynamically
      locationLines.forEach((line, index) => {
        const yPosition = locationY - index * 16; // Adjust line spacing
        if (yPosition > 50) {
          // Ensure it doesn’t go off the page
          drawCenteredText(line.text, yPosition, 12, fontDesc);
        }
      });

      // Define function to draw dashed lines
      const drawDashedLine = (
        page: PDFPage,
        startX: number,
        startY: number,
        endX: number,
        endY: number,
        dashLength = 5,
        gapLength = 3
      ) => {
        let x = startX;
        let y = startY;
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
        const dashGap = dashLength + gapLength;
        const dashCount = Math.floor(distance / dashGap);

        for (let i = 0; i < dashCount; i++) {
          const x1 = x + (dashLength / distance) * deltaX;
          const y1 = y + (dashLength / distance) * deltaY;

          page.drawLine({
            start: { x, y },
            end: { x: x1, y: y1 },
            thickness: 1,
            color: rgb(255 / 255, 140 / 255, 53 / 255),
          });

          x += (dashGap / distance) * deltaX;
          y += (dashGap / distance) * deltaY;
        }
      };

      // Draw dashed border (4 sides)
      drawDashedLine(page, 40, height - 65, width - 40, height - 65); // Top
      drawDashedLine(page, 40, height - 490, width - 40, height - 490); // Bottom
      drawDashedLine(page, 40, height - 65, 40, height - 490); // Left
      drawDashedLine(page, width - 40, height - 65, width - 40, height - 490); // Right

      // Get the page size

      // // Ticket ID Section
      // page.drawText('Ticket ID:', {
      //   x: width / 2 - 25,
      //   y: height - 200,
      //   size: 12,
      //   font,
      //   color: textColor,
      // });
      // page.drawText('11', {
      //   x: width / 2 - 50,
      //   y: height - 220,
      //   size: 10,
      //   font,
      //   color: textColor,
      // });

      // QR Code
      const qrCodeBuffer = Buffer.from(qrCodeBase64.split(',')[1], 'base64');
      const qrImage = await pdfDoc.embedPng(qrCodeBuffer);
      const qrDims = qrImage.scale(1);

      page.drawImage(qrImage, {
        x: width / 2 - qrDims.width / 2,
        y: height - 440,
        width: qrDims.width,
        height: qrDims.height,
      });

      // Additional Details


      drawCenteredText('Contact Help Desk', height - 550, 12, fontHead);

      drawCenteredText(`Email: ${email}`, height - 560, 9, fontDesc);

      drawCenteredText(`Phone: ${phone}`, height - 570, 9, fontDesc);


      const footerHeight = 100;

      // Footer
      page.drawRectangle({
        x: 0,
        y: 0,
        width,
        height: footerHeight,
        color: rgb(0, 0, 0),
      });

      // Function to center text
      const drawCenteredFooterText = (text: any, yOffset: any, size: any) => {
        const textWidth = fontDesc.widthOfTextAtSize(text, size);
        const x = (width - textWidth) / 2; // Center horizontally
        const y = (footerHeight - size) / 2 + yOffset; // Adjust within footer
        page.drawText(text, {
          x,
          y,
          size,
          font: fontDesc,
          color: rgb(1, 1, 1),
        });
      };
      // Centered Footer Texts
      drawCenteredFooterText(
        `Thank you for being part of ${eventName}!`,
        20,
        10
      );
      drawCenteredFooterText('We are thrilled to have you onboard!', 5, 10);
      const pdfBytes = await pdfDoc.save();
      return Buffer.from(pdfBytes);
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  }
}
