import { OpenAIEmbeddings } from '@langchain/openai';

export async function generateEmbeddings(texts: string[]) {
  const embeddings = new OpenAIEmbeddings({
    modelName: "text-embedding-3-small"
  });

  return await embeddings.embedDocuments(texts);
}

export async function generateQueryEmbedding(text: string) {
  const embeddings = new OpenAIEmbeddings({
    modelName: "text-embedding-3-small"
  });
  
  return await embeddings.embedQuery(text);
} 