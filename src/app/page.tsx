'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { AuthModal } from '@/components/AuthModal'
import { Button } from '@/components/ui/button'
import { 
  Sparkles, 
  Image, 
  Video, 
  FileText, 
  Code, 
  Palette, 
  LogOut,
  User,
  Settings,
  Plus
} from 'lucide-react'

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const [authModalOpen, setAuthModalOpen] = useState(false)

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                FormatHub
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Professional file formatting suite with advanced tools for images, videos, text, and more. 
              Create your own custom tools with visual builders or code editors.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button 
                size="lg" 
                onClick={() => setAuthModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Get Started Free
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => setAuthModalOpen(true)}
              >
                Sign In
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <Image className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Image Tools</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Convert, edit, and vectorize images with professional-grade tools
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <Video className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Video Editor</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Advanced video editing suite with timeline, effects, and transitions
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <Code className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Custom Tools</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Build your own tools with visual builders or embedded IDE
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                FormatHub
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Welcome, {user.name || user.email}
              </span>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Your Workspace
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Choose a tool to get started or create your own custom solution
          </p>
        </div>

        {/* Tool Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <ToolCard
            icon={<Image className="h-8 w-8" />}
            title="Image Tools"
            description="Format, convert, and vectorize images"
            color="bg-blue-500"
            href="/tools/image"
          />
          
          <ToolCard
            icon={<Video className="h-8 w-8" />}
            title="Video Editor"
            description="Advanced video editing and processing"
            color="bg-purple-500"
            href="/tools/video"
          />
          
          <ToolCard
            icon={<FileText className="h-8 w-8" />}
            title="Text Tools"
            description="Convert and format text documents"
            color="bg-green-500"
            href="/tools/text"
          />
          
          <ToolCard
            icon={<Palette className="h-8 w-8" />}
            title="Visual Tool Creator"
            description="Build custom tools visually"
            color="bg-orange-500"
            href="/tools/visual-creator"
          />
          
          <ToolCard
            icon={<Code className="h-8 w-8" />}
            title="Code Editor"
            description="Create tools with embedded IDE"
            color="bg-red-500"
            href="/tools/code-editor"
          />
          
          <ToolCard
            icon={<Plus className="h-8 w-8" />}
            title="Create New Tool"
            description="Start building something custom"
            color="bg-gray-500"
            href="/tools/new"
          />
        </div>

        {/* Recent Projects */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-semibold mb-4">Recent Projects</h3>
          <div className="text-gray-500 dark:text-gray-400 text-center py-8">
            No recent projects. Start by selecting a tool above!
          </div>
        </div>
      </main>
    </div>
  )
}

interface ToolCardProps {
  icon: React.ReactNode
  title: string
  description: string
  color: string
  href: string
}

function ToolCard({ icon, title, description, color, href }: ToolCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 cursor-pointer group">
      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${color} text-white mb-4 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm">
        {description}
      </p>
    </div>
  )
}
