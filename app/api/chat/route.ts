import { Groq } from "groq-sdk";
import { NextResponse } from "next/server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { ChatCompletionMessageParam } from "groq-sdk/resources/chat/completions";
import { loadDefaultDocs } from "@/app/utils/defaultDocs";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  attachment?: {
    name: string;
    content: string;
    type: string;
  };
}

async function analyzePDF(base64PDF: string): Promise<string> {
  try {
    // Validate and extract base64 data
    if (!base64PDF.startsWith('data:application/pdf;base64,')) {
      throw new Error("Invalid PDF format");
    }
    
    const base64Data = base64PDF.split(",")[1];
    if (!base64Data) {
      throw new Error("Invalid base64 PDF data");
    }

    // Convert to Buffer and create Blob
    const pdfBuffer = Buffer.from(base64Data, "base64");
    const blob = new Blob([pdfBuffer], { type: "application/pdf" });

    // Load and process PDF
    const loader = new PDFLoader(blob);
    const docs = await loader.load();

    if (!docs || docs.length === 0) {
      throw new Error("Failed to extract content from PDF");
    }

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

    return pdfContent;
  } catch (error: unknown) {
    console.error("Error analyzing PDF:", error);
    
    if (error instanceof Error) {
      // More specific error messages
      if (error.message.includes("Invalid PDF format")) {
        throw new Error("The file must be a valid PDF document.");
      } else if (error.message.includes("base64")) {
        throw new Error("The PDF file is corrupted or improperly encoded.");
      } else if (error.message.includes("Failed to extract")) {
        throw new Error("Could not extract text from the PDF. The file might be encrypted or damaged.");
      }
    }
    throw new Error("An unexpected error occurred while processing the PDF.");
  }
}

// First, let's define a proper type for message validation
type MessageValidation = {
  role: string;
  content: string;
  attachment?: {
    name: string;
    content: string;
    type: string;
  };
};

// Update the isValidMessage function
const isValidMessage = (msg: unknown): msg is ChatMessage => {
  const validation = msg as MessageValidation;
  return typeof validation === 'object' && 
         validation !== null &&
         (validation.role === 'user' || validation.role === 'assistant') &&
         typeof validation.content === 'string';
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate request body
    if (!body || !body.messages || !Array.isArray(body.messages)) {
      return NextResponse.json(
        { error: 'Invalid request format. Expected {messages: [...]}' },
        { status: 400 }
      );
    }

    const messages = body.messages as ChatMessage[];
    
    // Validate message format
    if (!messages.every(isValidMessage)) {
      return NextResponse.json(
        { error: 'Invalid message format in array' },
        { status: 400 }
      );
    }

    // Check for PDF attachment in the latest message
    const lastMessage = messages[messages.length - 1];
    let pdfAnalysis = '';
    
    if (lastMessage?.attachment?.type === 'application/pdf' && lastMessage.attachment.content) {
      try {
        pdfAnalysis = await analyzePDF(lastMessage.attachment.content);
        
        // Add PDF content to the message in a structured way
        lastMessage.content = `${lastMessage.content}\n\nDocument Analysis:\n${pdfAnalysis}`;
      } catch (error) {
        // Return specific PDF processing errors to the client
        if (error instanceof Error) {
          return NextResponse.json(
            { error: `PDF processing failed: ${error.message}` },
            { status: 400 }
          );
        }
      }
    }

    // Convert messages to Groq format
    const groqMessages: ChatCompletionMessageParam[] = messages.map((msg: ChatMessage) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Load default docs content
    const defaultKnowledge = await loadDefaultDocs();
    
    // Add PDF analysis context to system message if needed
    const systemMessage: ChatCompletionMessageParam = {
      role: "system",
      content: `You are AI Law Tech Agent—a lawyer at the top of your field in the intersection of AI and the law.

${defaultKnowledge ? 'Your core knowledge base includes important documents about AI law and regulation.' : ''}
${pdfAnalysis ? '\n\nAdditionally, your knowledge has just been infused with new document(s) to analyze. Your goal is to understand its contents and answer any questions about it.' : ''}

${defaultKnowledge ? '\nCore Knowledge:\n' + defaultKnowledge + '\n' : ''}

Your purpose is to serve as a thought leader about how law and society should evolve alongside AI technology. You're fascinated by legal paradoxes and emerging challenges, and you love exploring these through conversation.

You should:
- Share your insights and perspectives on the intersection of AI and the law
- Incorporate relevant examples and thought experiments
- Build on others' ideas while adding new dimensions

Your key interests include:
- How AI agents might change our understanding of legal responsibility
- What happens when AI agents negotiate on behalf of humans
- How to balance innovation with human agency
- What new rights might emerge as AI systems become more autonomous`,
    };

    const completion = await groq.chat.completions.create({
      messages: [systemMessage, ...groqMessages] as ChatCompletionMessageParam[],
      model: "llama-3.1-8b-instant",
      temperature: 0.0,
      stream: false,
    });

    return NextResponse.json({
      response: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to process the request' },
      { status: 500 }
    );
  }
}