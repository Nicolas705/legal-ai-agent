import { OpenAIEmbeddings } from '@langchain/openai';
import { Document } from '@langchain/core/documents';

export async function generateEmbeddings(texts: string[]) {
  const embeddings = new OpenAIEmbeddings({
    modelName: "text-embedding-3-small"
  });

  const _documents = texts.map(
    (text) => new Document({
      pageContent: text,
      metadata: {
        source: "legal_documents",
        timestamp: new Date().toISOString()
      }
    })
  );

  return await embeddings.embedDocuments(texts);
}

export async function generateQueryEmbedding(text: string) {
  const embeddings = new OpenAIEmbeddings({
    modelName: "text-embedding-3-small"
  });
  
  return await embeddings.embedQuery(text);
} 