import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import path from 'path';
import fs from 'fs';

let defaultDocsContent: {
  content: string;
  documents: DefaultDoc[];
} | null = null;

// First, define an interface for the document metadata
interface DefaultDoc {
  content: string;
  metadata: {
    title: string;
    url?: string;
    author: string;
  };
}

// Add a function to clear the cache
export function clearDefaultDocsCache() {
  defaultDocsContent = null;
}

export async function loadDefaultDocs(): Promise<{
  content: string;
  documents: DefaultDoc[];
}> {
  try {
    const docsDir = path.join(process.cwd(), 'public', 'default-docs');
    
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true });
      console.log('Created default-docs directory:', docsDir);
      return { content: "", documents: [] };
    }

    const files = fs.readdirSync(docsDir);
    console.log('Found files in default-docs:', files);

    // Look for both PDF and JSON files
    const pdfFiles = files.filter(file => file.endsWith('.pdf'));
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    
    console.log('PDF files:', pdfFiles);
    console.log('JSON files:', jsonFiles);

    const documents: DefaultDoc[] = [];
    const allContent: string[] = [];
    const processedTitles = new Set<string>(); // Track processed titles to avoid duplicates

    // Process JSON files first
    for (const jsonFile of jsonFiles) {
      const filePath = path.join(docsDir, jsonFile);
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const metadata = JSON.parse(content);
        
        // Check if we've already processed this title
        if (!processedTitles.has(metadata.title)) {
          processedTitles.add(metadata.title);
          documents.push({
            content: metadata.title,
            metadata: {
              title: metadata.title,
              url: metadata.url,
              author: metadata.author
            }
          });
          console.log('Loaded JSON document:', metadata.title);
        }
      } catch (error) {
        console.error('Error processing JSON file:', jsonFile, error);
      }
    }

    for (const pdfFile of pdfFiles) {
      const filePath = path.join(docsDir, pdfFile);
      const buffer = fs.readFileSync(filePath);
      
      // Try to load metadata from accompanying JSON file
      const metadataPath = filePath.replace('.pdf', '.json');
      let metadata = {
        title: pdfFile.replace('.pdf', ''),
        author: 'Unknown Author'
      };
      
      if (fs.existsSync(metadataPath)) {
        try {
          const metadataContent = fs.readFileSync(metadataPath, 'utf8');
          metadata = { ...metadata, ...JSON.parse(metadataContent) };
        } catch (error) {
          console.error('Error reading metadata:', error);
        }
      }
      
      const blob = new Blob([buffer], { type: 'application/pdf' });
      const loader = new PDFLoader(blob);
      const docs = await loader.load();

      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      });
      const splits = await textSplitter.splitDocuments(docs);

      const pdfContent = splits
        .map((split) => split.pageContent.trim())
        .filter(content => content.length > 0)
        .join("\n\n");

      allContent.push(pdfContent);
      documents.push({
        content: pdfContent,
        metadata
      });
    }

    const result = {
      content: allContent.join("\n\n=== Next Document ===\n\n"),
      documents: documents.filter((doc, index, self) => 
        index === self.findIndex((d) => d.metadata.title === doc.metadata.title)
      ) // Additional deduplication
    };
    
    console.log('Final loaded documents:', result.documents);
    defaultDocsContent = result;
    return result;
  } catch (error) {
    console.error("Error loading default docs:", error);
    return { content: "", documents: [] };
  }
} 