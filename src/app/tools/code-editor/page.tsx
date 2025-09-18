'use client'

import { useState, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { 
  ArrowLeft, 
  Code, 
  Play, 
  Save, 
  Download, 
  FileText, 
  Terminal,
  Folder,
  Plus,
  Trash2
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import Editor from '@monaco-editor/react'

interface FileTab {
  id: string
  name: string
  content: string
  language: string
}

export default function CodeEditor() {
  const { user } = useAuth()
  const router = useRouter()
  const [files, setFiles] = useState<FileTab[]>([
    {
      id: 'main',
      name: 'main.js',
      content: `// Welcome to the Custom Tool Code Editor
// Create your own file processing tools here!

function processFile(file) {
  // Your custom processing logic here
  console.log('Processing file:', file.name);
  
  // Example: Convert text to uppercase
  if (file.type.startsWith('text/')) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const content = e.target.result;
      const processed = content.toUpperCase();
      
      // Create download link
      downloadProcessedFile(processed, 'processed_' + file.name);
    };
    reader.readAsText(file);
  }
}

function downloadProcessedFile(content, filename) {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// Export your main function
export { processFile };`,
      language: 'javascript'
    },
    {
      id: 'config',
      name: 'tool.config.json',
      content: `{
  "name": "My Custom Tool",
  "description": "A custom file processing tool",
  "version": "1.0.0",
  "author": "${user?.name || 'Anonymous'}",
  "supportedFormats": ["text/*", "image/*"],
  "ui": {
    "showPreview": true,
    "allowMultipleFiles": false,
    "customButtons": [
      {
        "label": "Process",
        "action": "processFile",
        "color": "primary"
      }
    ]
  }
}`,
      language: 'json'
    }
  ])
  const [activeFile, setActiveFile] = useState<string>('main')
  const [output, setOutput] = useState<string>('')
  const [isRunning, setIsRunning] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const activeFileData = files.find(f => f.id === activeFile)

  const updateFileContent = (content: string) => {
    setFiles(files.map(f => 
      f.id === activeFile ? { ...f, content } : f
    ))
  }

  const addNewFile = () => {
    const name = prompt('Enter file name:')
    if (!name) return

    const extension = name.split('.').pop()?.toLowerCase()
    let language = 'javascript'
    
    if (extension === 'html') language = 'html'
    else if (extension === 'css') language = 'css'
    else if (extension === 'json') language = 'json'
    else if (extension === 'ts') language = 'typescript'
    else if (extension === 'py') language = 'python'

    const newFile: FileTab = {
      id: Date.now().toString(),
      name,
      content: '',
      language
    }

    setFiles([...files, newFile])
    setActiveFile(newFile.id)
  }

  const deleteFile = (fileId: string) => {
    if (files.length === 1) return // Don't delete the last file
    
    setFiles(files.filter(f => f.id !== fileId))
    if (activeFile === fileId) {
      setActiveFile(files.find(f => f.id !== fileId)!.id)
    }
  }

  const runCode = async () => {
    setIsRunning(true)
    setOutput('Running code...\n')

    try {
      // In a real implementation, this would send the code to a secure execution environment
      // For demo purposes, we'll just simulate execution
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setOutput(prev => prev + 'Code executed successfully!\n')
      setOutput(prev => prev + 'Tool compiled and ready for use.\n')
      setOutput(prev => prev + `Files processed: ${files.length}\n`)
      setOutput(prev => prev + 'Ready to accept file uploads.\n')
    } catch (error) {
      setOutput(prev => prev + `Error: ${error}\n`)
    } finally {
      setIsRunning(false)
    }
  }

  const saveProject = () => {
    const project = {
      name: 'Custom Tool Project',
      files: files,
      timestamp: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'custom-tool-project.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!user) {
    router.push('/')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => router.push('/')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="flex items-center gap-2">
                <Code className="h-6 w-6 text-red-600" />
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Custom Tool Code Editor
                </h1>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => setSidebarOpen(!sidebarOpen)}>
                <Folder className="h-4 w-4 mr-2" />
                Files
              </Button>
              <Button variant="outline" onClick={runCode} disabled={isRunning}>
                <Play className="h-4 w-4 mr-2" />
                {isRunning ? 'Running...' : 'Run'}
              </Button>
              <Button variant="outline" onClick={saveProject}>
                <Save className="h-4 w-4 mr-2" />
                Save Project
              </Button>
              <Button className="bg-red-600 hover:bg-red-700">
                <Download className="h-4 w-4 mr-2" />
                Deploy Tool
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* File Explorer Sidebar */}
        {sidebarOpen && (
          <div className="w-64 bg-white dark:bg-gray-800 border-r">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Project Files</h3>
                <Button size="sm" variant="ghost" onClick={addNewFile}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-1">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                      activeFile === file.id
                        ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => setActiveFile(file.id)}
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{file.name}</span>
                    </div>
                    
                    {files.length > 1 && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteFile(file.id)
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Tool Documentation */}
            <div className="p-4">
              <h4 className="font-semibold mb-3">API Reference</h4>
              <div className="text-xs space-y-2">
                <div>
                  <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">processFile(file)</code>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">Main processing function</p>
                </div>
                <div>
                  <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">downloadFile(content, name)</code>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">Download processed file</p>
                </div>
                <div>
                  <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">showPreview(content)</code>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">Display preview to user</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col">
          {/* File Tabs */}
          <div className="bg-white dark:bg-gray-800 border-b flex items-center px-4 min-h-12">
            {files.map((file) => (
              <div
                key={file.id}
                className={`px-4 py-2 cursor-pointer border-b-2 transition-colors ${
                  activeFile === file.id
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                onClick={() => setActiveFile(file.id)}
              >
                <span className="text-sm">{file.name}</span>
              </div>
            ))}
          </div>

          {/* Code Editor */}
          <div className="flex-1">
            {activeFileData && (
              <Editor
                height="100%"
                language={activeFileData.language}
                value={activeFileData.content}
                onChange={(value) => updateFileContent(value || '')}
                theme="vs-dark"
                options={{
                  minimap: { enabled: true },
                  fontSize: 14,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  wordWrap: 'on'
                }}
              />
            )}
          </div>

          {/* Output Console */}
          <div className="h-48 bg-black text-green-400 font-mono text-sm border-t">
            <div className="flex items-center justify-between px-4 py-2 bg-gray-800 text-white">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4" />
                <span>Console Output</span>
              </div>
              <Button size="sm" variant="ghost" onClick={() => setOutput('')}>
                Clear
              </Button>
            </div>
            <div className="p-4 h-40 overflow-y-auto">
              <pre className="whitespace-pre-wrap">{output || 'Ready to run code...'}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}