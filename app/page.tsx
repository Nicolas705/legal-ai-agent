import { ChatInterface } from '@/app/components/ChatInterface';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-50/90 to-purple-50/90 dark:from-indigo-950 dark:to-purple-950">
      <header className="sticky top-0 z-50 w-full border-b border-purple-100/20 dark:border-purple-800/20 bg-white/80 dark:bg-zinc-900/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <a className="mr-6 flex items-center space-x-2" href="/">
              <span className="font-bold sm:inline-block bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                AI Law Agent
              </span>
            </a>
          </div>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto p-4 flex flex-col">
        <div className="flex-1 flex flex-col">
          <div className="text-center space-y-4 mb-6">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              Legal AI Assistant
            </h1>
            <p className="text-indigo-600/70 dark:text-indigo-300/70">
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

