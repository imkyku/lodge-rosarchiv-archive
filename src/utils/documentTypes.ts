
// Document attachment type
export interface DocumentAttachment {
  name: string;
  description?: string;
  url: string;
  type: string; // MIME type (e.g. image/jpeg, application/pdf)
  size?: number; // File size in bytes
}

// Document barcode type
export interface DocumentBarcode {
  value: string;
  type?: string; // e.g., "CODE128", "QR", etc.
}

// Interface for document content
export interface DocumentContent {
  text: string;
  imageUrls?: string[];
  attachments?: DocumentAttachment[];
  barcode?: string;
}
