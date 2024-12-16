declare module 'pdf-parse' {
  interface PDFData {
    numpages: number;
    numrender: number;
    info: {
      PDFFormatVersion: string;
      IsAcroFormPresent: boolean;
      IsXFAPresent: boolean;
      [key: string]: unknown;
    };
    metadata: Record<string, unknown>;
    text: string;
    version: string;
  }

  function PDFParse(
    dataBuffer: Buffer | Uint8Array,
    options?: {
      pagerender?: (pageData: Record<string, unknown>) => string;
      max?: number;
      version?: string;
    }
  ): Promise<PDFData>;

  export = PDFParse;
} 