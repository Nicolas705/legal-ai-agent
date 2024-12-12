import { ChatInterface } from '@/app/components/ChatInterface';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-background/95">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <a className="mr-6 flex items-center space-x-2" href="/">
              <span className="font-bold sm:inline-block">AI Law Agent</span>
            </a>
          </div>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="flex flex-col gap-8 items-center">
          <div className="max-w-[750px] w-full text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">Legal AI Assistant</h1>
            <p className="text-muted-foreground">
              Powered by advanced RAG technology and forward-looking legal analyses
            </p>
          </div>
          
          <div className="w-full max-w-[800px]">
            <ChatInterface />
          </div>
        </div>
      </main>
    </div>
  );
}

