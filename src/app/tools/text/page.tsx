'use client'

import { useState, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { 
  ArrowLeft, 
  Upload, 
  Download, 
  FileText, 
  Type,
  Hash,
  Code,
  Globe
} from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function TextTools() {
  const { user } = useAuth()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [textContent, setTextContent] = useState('')
  const [outputFormat, setOutputFormat] = useState('txt')
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedTool, setSelectedTool] = useState<string>('convert')

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setTextContent(e.target?.result as string)
      }
      reader.readAsText(file)
    }
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setTextContent(e.target?.result as string)
      }
      reader.readAsText(file)
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
  }

  const processText = async () => {
    setIsProcessing(true)
    
    // Simulate text processing based on selected tool
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    let processedText = textContent
    
    switch (selectedTool) {
      case 'markdown':
        // Convert plain text to markdown
        processedText = textContent
          .split('\n\n')
          .map(paragraph => paragraph.trim())
          .filter(p => p.length > 0)
          .map(paragraph => {
            if (paragraph.length < 50) {
              return `# ${paragraph}`
            } else {
              return paragraph
            }
          })
          .join('\n\n')
        break
      case 'html':
        // Convert to HTML
        processedText = `<!DOCTYPE html>
<html>
<head>
    <title>Converted Document</title>
</head>
<body>
${textContent.split('\n\n').map(p => `    <p>${p.trim()}</p>`).join('\n')}
</body>
</html>`
        break
      case 'json':
        // Convert to JSON structure
        const lines = textContent.split('\n').filter(line => line.trim())
        processedText = JSON.stringify({
          content: lines,
          metadata: {
            lineCount: lines.length,
            wordCount: textContent.split(/\s+/).length,
            charCount: textContent.length
          }
        }, null, 2)
        break
    }
    
    setTextContent(processedText)
    setIsProcessing(false)
  }

  const downloadFile = () => {
    const blob = new Blob([textContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `converted.${outputFormat}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
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
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.push('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-green-600" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Text Processing Tools
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Tool Selection Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Text Tools</h3>
              
              <div className="space-y-2">
                <ToolOption
                  id="convert"
                  title="Format Converter"
                  description="Convert between text formats"
                  selected={selectedTool === 'convert'}
                  onClick={() => setSelectedTool('convert')}
                  icon={<Type className="h-4 w-4" />}
                />
                
                <ToolOption
                  id="markdown"
                  title="Markdown Generator"
                  description="Convert text to Markdown"
                  selected={selectedTool === 'markdown'}
                  onClick={() => setSelectedTool('markdown')}
                  icon={<Hash className="h-4 w-4" />}
                />
                
                <ToolOption
                  id="html"
                  title="HTML Converter"
                  description="Generate HTML from text"
                  selected={selectedTool === 'html'}
                  onClick={() => setSelectedTool('html')}
                  icon={<Globe className="h-4 w-4" />}
                />
                
                <ToolOption
                  id="json"
                  title="JSON Formatter"
                  description="Structure text as JSON"
                  selected={selectedTool === 'json'}
                  onClick={() => setSelectedTool('json')}
                  icon={<Code className="h-4 w-4" />}
                />
              </div>
            </div>
          </div>

          {/* Main Work Area */}
          <div className="lg:col-span-3">
            {!selectedFile && !textContent ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <div
                  className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center cursor-pointer hover:border-green-500 transition-colors"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Upload a Text File
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Drag and drop a text file here, or click to browse
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports TXT, MD, CSV, JSON, and more
                  </p>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".txt,.md,.csv,.json,.xml,.html"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
                
                <div className="mt-8">
                  <h4 className="text-lg font-semibold mb-4">Or type/paste text directly:</h4>
                  <textarea
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    placeholder="Enter your text here..."
                    className="w-full h-32 p-4 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* File Info */}
                {selectedFile && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-green-600" />
                        <span className="font-medium">{selectedFile.name}</span>
                        <span className="text-sm text-gray-500">
                          ({Math.round(selectedFile.size / 1024)} KB)
                        </span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => {
                        setSelectedFile(null)
                        setTextContent('')
                      }}>
                        Clear
                      </Button>
                    </div>
                  </div>
                )}

                {/* Text Editor */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Text Content</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>Words: {textContent.split(/\s+/).filter(w => w.length > 0).length}</span>
                      <span>•</span>
                      <span>Characters: {textContent.length}</span>
                    </div>
                  </div>
                  
                  <textarea
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    className="w-full h-96 p-4 border rounded-lg font-mono text-sm dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Your text content will appear here..."
                  />
                </div>

                {/* Processing Options */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold mb-4">Processing Options</h3>
                  
                  {selectedTool === 'convert' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Output Format</label>
                        <select 
                          value={outputFormat}
                          onChange={(e) => setOutputFormat(e.target.value)}
                          className="w-full p-2 border rounded dark:bg-gray-700"
                        >
                          <option value="txt">Plain Text (.txt)</option>
                          <option value="md">Markdown (.md)</option>
                          <option value="html">HTML (.html)</option>
                          <option value="csv">CSV (.csv)</option>
                          <option value="json">JSON (.json)</option>
                          <option value="xml">XML (.xml)</option>
                        </select>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="preserve-formatting" />
                        <label htmlFor="preserve-formatting" className="text-sm">
                          Preserve original formatting
                        </label>
                      </div>
                    </div>
                  )}
                  
                  {selectedTool === 'markdown' && (
                    <div className="space-y-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Markdown Conversion</h4>
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          Automatically converts paragraphs and detects headings based on content length.
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="auto-headings" defaultChecked />
                        <label htmlFor="auto-headings" className="text-sm">
                          Auto-detect headings
                        </label>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="code-blocks" />
                        <label htmlFor="code-blocks" className="text-sm">
                          Convert indented text to code blocks
                        </label>
                      </div>
                    </div>
                  )}
                  
                  {selectedTool === 'html' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">HTML Template</label>
                        <select className="w-full p-2 border rounded dark:bg-gray-700">
                          <option value="basic">Basic HTML5</option>
                          <option value="styled">With CSS Styling</option>
                          <option value="bootstrap">Bootstrap Template</option>
                        </select>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="include-meta" defaultChecked />
                        <label htmlFor="include-meta" className="text-sm">
                          Include meta tags
                        </label>
                      </div>
                    </div>
                  )}
                  
                  {selectedTool === 'json' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">JSON Structure</label>
                        <select className="w-full p-2 border rounded dark:bg-gray-700">
                          <option value="lines">Split by lines</option>
                          <option value="paragraphs">Split by paragraphs</option>
                          <option value="words">Split by words</option>
                          <option value="custom">Custom structure</option>
                        </select>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="include-metadata" defaultChecked />
                        <label htmlFor="include-metadata" className="text-sm">
                          Include metadata (word count, etc.)
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button 
                    onClick={processText}
                    disabled={isProcessing || !textContent.trim()}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isProcessing ? 'Processing...' : 'Process Text'}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={downloadFile}
                    disabled={!textContent.trim()}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  
                  <Button variant="ghost" onClick={() => {
                    setSelectedFile(null)
                    setTextContent('')
                  }}>
                    Clear All
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

interface ToolOptionProps {
  id: string
  title: string
  description: string
  selected: boolean
  onClick: () => void
  icon?: React.ReactNode
}

function ToolOption({ title, description, selected, onClick, icon }: ToolOptionProps) {
  return (
    <div
      className={`p-3 rounded-lg cursor-pointer transition-colors ${
        selected 
          ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800' 
          : 'border-2 border-transparent hover:bg-gray-50 dark:hover:bg-gray-700'
      }`}
      onClick={onClick}
    >
      <div className="flex items-start gap-2">
        {icon && <div className="text-green-600 mt-0.5">{icon}</div>}
        <div>
          <h4 className="font-medium text-sm">{title}</h4>
          <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{description}</p>
        </div>
      </div>
    </div>
  )
}