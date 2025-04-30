
// Document attachment type
export interface DocumentAttachment {
  name: string;
  fileName: string;
  description?: string;
  url: string;
  type: string;
  size: number; // Теперь это обязательное поле
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
