import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import path from 'path';
import fs from 'fs';

let defaultDocsContent: string | null = null;

export async function loadDefaultDocs(): Promise<string> {
  // Return cached content if already loaded
  if (defaultDocsContent) {
    return defaultDocsContent;
  }

  try {
    const docsDir = path.join(process.cwd(), 'public', 'default-docs');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true });
      console.log('Created default-docs directory:', docsDir);
      return ""; // Return empty string if no documents exist yet
    }

    const files = fs.readdirSync(docsDir);
    const pdfFiles = files.filter(file => file.endsWith('.pdf'));
    
    console.log('Found PDF files:', pdfFiles);
    
    if (pdfFiles.length === 0) {
      console.log('No PDF files found in default-docs directory');
      return "";
    }

    let allContent: string[] = [];

    for (const pdfFile of pdfFiles) {
      const filePath = path.join(docsDir, pdfFile);
      const buffer = fs.readFileSync(filePath);
      
      // Create blob from buffer
      const blob = new Blob([buffer], { type: 'application/pdf' });
      
      // Load and process PDF
      const loader = new PDFLoader(blob);
      const docs = await loader.load();

      // Split into manageable chunks
      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      });
      const splits = await textSplitter.splitDocuments(docs);

      // Combine chunks with clear separation
      const pdfContent = splits
        .map((split) => split.pageContent.trim())
        .filter(content => content.length > 0)
        .join("\n\n");

      allContent.push(pdfContent);
    }

    defaultDocsContent = allContent.join("\n\n=== Next Document ===\n\n");
    return defaultDocsContent;

  } catch (error) {
    console.error("Error loading default docs:", error);
    return "";
  }
} 