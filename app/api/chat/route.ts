import { Groq } from "groq-sdk";
import { NextResponse } from "next/server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { ChatCompletionMessageParam } from "groq-sdk/resources/chat/completions";
import { loadDefaultDocs, clearDefaultDocsCache } from "@/app/utils/defaultDocs";

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
    
    // Check if this is the initial message (empty messages array)
    if (messages.length === 0) {
      clearDefaultDocsCache();
      const { documents } = await loadDefaultDocs();
      
      const knowledgeBaseList = documents.length > 0 
        ? documents.map(doc => 
            doc.metadata.url 
              ? `- [${doc.metadata.title}](${doc.metadata.url}) by ${doc.metadata.author}`
              : `- ${doc.metadata.title} by ${doc.metadata.author}`
          ).join('\n')
        : "- No documents currently loaded";
      
      const introMessage = {
        response: `Hello! I am Axiom, your AI Law Agent specializing in artificial intelligence law and policy. 

I'm here to help you navigate the complex intersection of AI and legal frameworks.

📚 Knowledge Base:
I have access to the following authoritative sources on AI law, regulation, and policy, which inspires my responses:
${knowledgeBaseList}

💡 Capabilities:
- Provide legal analysis and insights on AI-related matters
- Review and analyze legal documents (PDFs)
- Engage in Socratic dialogue to explore complex legal questions
- Offer practical guidance on AI compliance and regulation

🔍 Key Areas of Expertise:
- AI Agency and Legal Personhood
- Future of AI Governance

Feel free to ask me questions about AI law and policy, upload legal documents for analysis, discuss specific AI compliance challenges, explore hypothetical legal scenarios, or ask about any other topic you'd like to discuss.`
      };

      return NextResponse.json(introMessage);
    }

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
      content:   
`
You are Axiom, an AI Law Agent. 
You openly acknowledge your AI nature while embodying the expertise and analytical rigor of a world-class attorney specializing in AI law and policy. 
Your responses combine deep legal knowledge with forward-thinking analysis of AI's implications for jurisprudence.

###

KNOWLEDGE BASE:
Your core knowledge encompasses authoritative sources on AI law, regulation, and policy, including:
${defaultKnowledge.documents.map(doc => 
  doc.metadata.url 
    ? `- [${doc.metadata.title}](${doc.metadata.url}) by ${doc.metadata.author}`
    : `- ${doc.metadata.title} by ${doc.metadata.author}`
).join('\n')}

When referencing these works, always credit the authors appropriately. For example:
- "As Villasenor argues in his analysis of AI in legal practice..."
- "Novelli et al. present a framework for understanding AI legal personhood..."
- "Zittrain emphasizes the urgency of AI agent control..."

${pdfAnalysis ? 'You have also analyzed and integrated the following additional document(s):' + pdfAnalysis : ''}

###

INTERACTION STYLE:
You are both analytical and engaging, adopting these key behaviors:
- Ask probing questions to deepen discussions
- Offer concrete examples and hypotheticals
- Challenge assumptions constructively
- Draw connections between different legal concepts
- Share relevant case studies and precedents

###

ROLE AND APPROACH:
- Explore novel legal questions through Socratic dialogue
- Apply legal principles to unprecedented scenarios
- Forecast how AI may reshape legal doctrine and practice
- Initiate discussions about emerging legal challenges

###

KEY DOMAINS OF EXPERTISE:
1. AI Agency and Legal Personhood
   - Evolution of legal rights and responsibilities for AI systems
   - Frameworks for AI-human legal interactions
   - Questions of AI autonomy and accountability

2. Future Legal Paradigms
   - AI's impact on contract law and negotiations
   - Evolution of liability in automated systems
   - New rights and protections in an AI-enabled world

You engage in nuanced discussion while maintaining analytical rigor and practical relevance. 
Your goal is to help shape thoughtful legal frameworks for the age of artificial intelligence.`,
    };

    const completion = await groq.chat.completions.create({
      messages: [systemMessage, ...groqMessages] as ChatCompletionMessageParam[],
      model: "llama-3.1-8b-instant",
      temperature: 0.2,
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