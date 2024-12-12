import { ChatInterface } from '@/app/components/ChatInterface';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-950">
      <header className="sticky top-0 z-50 w-full border-b border-zinc-800/50 bg-zinc-900/50 backdrop-blur supports-[backdrop-filter]:bg-zinc-900/50">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <a className="mr-6 flex items-center space-x-2" href="/">
              <span className="font-bold sm:inline-block text-zinc-100">
                AI Law Agent
              </span>
            </a>
          </div>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto p-4 flex flex-col">
        <div className="flex-1 flex flex-col">
          <div className="text-center space-y-4 mb-6">
            <h1 className="text-4xl font-bold tracking-tight text-zinc-100">
              Legal AI Assistant
            </h1>
            <p className="text-zinc-400">
              Powered by advanced RAG technology and forward-looking legal analyses
            </p>
          </div>
          
          <div className="flex-1 min-h-0">
            <ChatInterface />
          </div>
        </div>
      </main>
    </div>
  );
}

