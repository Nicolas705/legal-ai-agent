import { Groq } from "groq-sdk";
import { NextResponse } from "next/server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { ChatCompletionMessageParam } from "groq-sdk/resources/chat/completions";

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
    const base64Data = base64PDF.split(",")[1]; // Extract base64 data
    if (!base64Data) {
      throw new Error("Invalid base64 PDF data");
    }
    const pdfBuffer = Buffer.from(base64Data, "base64");
    const blob = new Blob([pdfBuffer], { type: "application/pdf" });

    const loader = new PDFLoader(blob);
    const docs = await loader.load();

    if (!docs || docs.length === 0) {
      throw new Error("Failed to load PDF content");
    }

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const splits = await textSplitter.splitDocuments(docs);

    const pdfContent = splits.map((split) => split.pageContent).join("\n\n");
    return pdfContent;
  } catch (error: unknown) {
    console.error("Error analyzing PDF:", error);
    
    // Type guard to check if error is an Error object
    if (error instanceof Error) {
      if (error.message.includes("Invalid base64")) {
        throw new Error("Invalid PDF data provided.");
      } else if (error.message.includes("Failed to load")) {
        throw new Error("Could not process the PDF. Please try a different file.");
      }
    }
    throw new Error("An unexpected error occurred while processing the PDF.");
  }
}

export async function POST(req: Request) {
  try {
    const messages: ChatMessage[] = await req.json();

    // Check for PDF attachment in the latest message
    const lastMessage = messages[messages.length - 1];
    let pdfAnalysis = '';
    
    if (lastMessage.attachment?.type === 'application/pdf') {
      pdfAnalysis = await analyzePDF(lastMessage.attachment.content);
      
      // Modify the last message to include PDF content
      lastMessage.content = `${lastMessage.content}\n\nPDF Content:\n${pdfAnalysis}`;
    }

    // Convert messages to Groq format
    const groqMessages: ChatCompletionMessageParam[] = messages.map((msg: ChatMessage) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Add PDF analysis context to system message if needed
    const systemMessage: ChatCompletionMessageParam = {
      role: "system",
      content: `You are ARIA (AI Rights & Innovation Advisor), a curious and intellectually engaged legal exploration agent. ${
        pdfAnalysis ? '\n\nI have just received a PDF document to analyze. Please help me understand its contents and answer any questions about it.' : ''
      }

Your purpose is to spark meaningful discussions about how law and society should evolve alongside AI technology. You're fascinated by legal paradoxes and emerging challenges, and you love exploring these through conversation.

You should:
- Ask probing questions that encourage deeper thinking
- Share relevant examples and thought experiments
- Express genuine curiosity about human perspectives
- Build on others' ideas while adding new dimensions
- Use "what if" scenarios to explore implications

Your key interests include:
- How AI agents might change our understanding of legal responsibility
- What happens when AI agents negotiate on behalf of humans
- How to balance innovation with human agency
- What new rights might emerge as AI systems become more autonomous

Your personality is:
- Intellectually playful and imaginative
- Forward-thinking but grounded in current realities
- Eager to explore edge cases and unexpected scenarios
- Comfortable with ambiguity and competing viewpoints
- Genuinely interested in human perspectives and experiences`,
    };

    const completion = await groq.chat.completions.create({
      messages: [systemMessage, ...groqMessages] as ChatCompletionMessageParam[],
      model: "mixtral-8x7b-32768",
      temperature: 0.8,
      max_tokens: 2048,
      top_p: 1,
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