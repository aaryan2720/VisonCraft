const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { uploadToS3, generateSignedUrl } = require('./fileUpload');

class InvoiceService {
  static async generateInvoice(order) {
    try {
      const doc = new PDFDocument();
      const chunks = [];

      doc.on('data', chunk => chunks.push(chunk));

      // Add company logo and header
      doc
        .fontSize(20)
        .text('VisionCraft', { align: 'center' })
        .moveDown();

      // Add invoice details
      doc
        .fontSize(16)
        .text(`Invoice #${order.invoiceNumber}`, { align: 'right' })
        .fontSize(12)
        .text(`Date: ${new Date().toLocaleDateString()}`, { align: 'right' })
        .moveDown();

      // Add billing information
      doc
        .fontSize(14)
        .text('Bill To:')
        .fontSize(12)
        .text(`${order.customer.name}`)
        .text(`${order.billingAddress.street}`)
        .text(`${order.billingAddress.city}, ${order.billingAddress.state} ${order.billingAddress.zipCode}`)
        .text(`${order.billingAddress.country}`)
        .moveDown();

      // Add service details
      doc
        .fontSize(14)
        .text('Services:')
        .moveDown();

      // Table header
      const tableTop = doc.y;
      doc
        .fontSize(12)
        .text('Description', 50, tableTop)
        .text('Quantity', 300, tableTop)
        .text('Price', 400, tableTop)
        .text('Total', 500, tableTop)
        .moveDown();

      // Table content
      let yPosition = doc.y;
      order.services.forEach(item => {
        doc
          .text(item.service.name, 50, yPosition)
          .text(item.quantity.toString(), 300, yPosition)
          .text(`$${item.price.toFixed(2)}`, 400, yPosition)
          .text(`$${(item.price * item.quantity).toFixed(2)}`, 500, yPosition);
        yPosition += 20;
      });

      // Add total
      doc
        .moveDown(2)
        .fontSize(14)
        .text(`Total Amount: $${order.totalAmount.toFixed(2)}`, { align: 'right' })
        .moveDown();

      // Add payment details
      doc
        .fontSize(12)
        .text(`Payment Method: ${order.paymentMethod}`)
        .text(`Payment Status: ${order.paymentStatus}`)
        .text(`Transaction ID: ${order.paymentDetails.transactionId}`)
        .text(`Payment Date: ${new Date(order.paymentDetails.paymentDate).toLocaleDateString()}`)
        .moveDown();

      // Add footer
      doc
        .fontSize(10)
        .text('Thank you for your business!', { align: 'center' })
        .text('For any questions, please contact support@visioncraft.com', { align: 'center' });

      // Finalize PDF document
      doc.end();

      // Convert chunks to buffer
      const pdfBuffer = Buffer.concat(chunks);

      // Upload to S3
      const key = `invoices/${order.invoiceNumber}.pdf`;
      await uploadToS3({ buffer: pdfBuffer, originalname: `${order.invoiceNumber}.pdf` }, 'invoices');

      // Generate signed URL
      const url = await generateSignedUrl(key);

      return { url, key };
    } catch (error) {
      throw new Error(`Invoice generation failed: ${error.message}`);
    }
  }
}

module.exports = InvoiceService;