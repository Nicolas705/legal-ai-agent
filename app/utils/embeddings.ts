import { OpenAIEmbeddings } from '@langchain/openai';
import { kv } from '@vercel/kv';

interface StoredDocument {
  content: string;
  embedding: number[];
  metadata: {
    source: string;
    timestamp: string;
    [key: string]: string | number | boolean;
  };
}

export async function generateEmbeddings(
  texts: string[], 
  source: string = 'default',
  additionalMetadata: Record<string, string | number | boolean> = {}
) {
  const embeddings = new OpenAIEmbeddings({
    modelName: "text-embedding-3-small"
  });

  try {
    // Generate embeddings for all texts
    const embeddingVectors = await embeddings.embedDocuments(texts);

    // Create and store documents with their embeddings
    const documents: StoredDocument[] = texts.map((text, index) => ({
      content: text,
      embedding: embeddingVectors[index],
      metadata: {
        source,
        timestamp: new Date().toISOString(),
        ...additionalMetadata
      }
    }));

    // Store documents in KV store
    // Using a compound key pattern: docs:{source}:{timestamp}
    for (const doc of documents) {
      const docKey = `docs:${doc.metadata.source}:${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      await kv.set(docKey, doc);
    }

    return embeddingVectors;
  } catch (error) {
    console.error('Error generating embeddings:', error);
    throw error;
  }
}

export async function generateQueryEmbedding(text: string) {
  const embeddings = new OpenAIEmbeddings({
    modelName: "text-embedding-3-small"
  });
  
  return await embeddings.embedQuery(text);
}

export async function getStoredDocuments(source?: string): Promise<StoredDocument[]> {
  const pattern = source ? `docs:${source}:*` : 'docs:*';
  const keys = await kv.keys(pattern);
  const documents = await Promise.all(keys.map(key => kv.get<StoredDocument>(key)));
  return documents.filter((doc): doc is StoredDocument => doc !== null);
} 