'use client'

import { useState, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { 
  ArrowLeft, 
  Upload, 
  Download, 
  RotateCcw, 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Crop,
  Palette,
  Sparkles
} from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ImageTools() {
  const { user } = useAuth()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedTool, setSelectedTool] = useState<string>('convert')

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
  }

  const processImage = async () => {
    if (!selectedFile) return
    
    setIsProcessing(true)
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsProcessing(false)
  }

  const convertToVector = async () => {
    if (!selectedFile) return
    
    setIsProcessing(true)
    // Simulate vector conversion
    await new Promise(resolve => setTimeout(resolve, 3000))
    setIsProcessing(false)
    
    // In a real implementation, this would use a vectorization library
    alert('Vector conversion completed! This is a demo - real implementation would use advanced algorithms.')
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
              <Palette className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Image Tools
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tool Selection Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Available Tools</h3>
              
              <div className="space-y-2">
                <ToolOption
                  id="convert"
                  title="Format Converter"
                  description="Convert between different image formats"
                  selected={selectedTool === 'convert'}
                  onClick={() => setSelectedTool('convert')}
                />
                
                <ToolOption
                  id="resize"
                  title="Resize & Crop"
                  description="Resize images and crop to specific dimensions"
                  selected={selectedTool === 'resize'}
                  onClick={() => setSelectedTool('resize')}
                />
                
                <ToolOption
                  id="enhance"
                  title="Image Enhancement"
                  description="Adjust brightness, contrast, and colors"
                  selected={selectedTool === 'enhance'}
                  onClick={() => setSelectedTool('enhance')}
                />
                
                <ToolOption
                  id="vector"
                  title="Vector Converter"
                  description="Convert raster images to vector format"
                  selected={selectedTool === 'vector'}
                  onClick={() => setSelectedTool('vector')}
                  icon={<Sparkles className="h-4 w-4" />}
                />
              </div>
            </div>
          </div>

          {/* Main Work Area */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              {!selectedFile ? (
                <div
                  className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center cursor-pointer hover:border-blue-500 transition-colors"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Upload an Image
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Drag and drop an image file here, or click to browse
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Supports JPG, PNG, GIF, WebP, and more
                  </p>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Image Preview */}
                  <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold">Preview</h3>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <RotateCw className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ZoomOut className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ZoomIn className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {imagePreview && (
                      <div className="flex justify-center">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="max-w-full max-h-96 object-contain rounded"
                        />
                      </div>
                    )}
                  </div>

                  {/* Tool Controls */}
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-4">
                      {selectedTool === 'convert' && 'Format Conversion'}
                      {selectedTool === 'resize' && 'Resize & Crop'}
                      {selectedTool === 'enhance' && 'Image Enhancement'}
                      {selectedTool === 'vector' && 'Vector Conversion'}
                    </h3>
                    
                    {selectedTool === 'convert' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Output Format</label>
                          <select className="w-full p-2 border rounded dark:bg-gray-700">
                            <option value="png">PNG</option>
                            <option value="jpg">JPEG</option>
                            <option value="webp">WebP</option>
                            <option value="gif">GIF</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Quality (%)</label>
                          <input type="range" min="1" max="100" defaultValue="90" className="w-full" />
                        </div>
                      </div>
                    )}
                    
                    {selectedTool === 'resize' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Width (px)</label>
                            <input type="number" placeholder="800" className="w-full p-2 border rounded dark:bg-gray-700" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Height (px)</label>
                            <input type="number" placeholder="600" className="w-full p-2 border rounded dark:bg-gray-700" />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" id="maintain-aspect" defaultChecked />
                          <label htmlFor="maintain-aspect" className="text-sm">Maintain aspect ratio</label>
                        </div>
                      </div>
                    )}
                    
                    {selectedTool === 'enhance' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Brightness</label>
                          <input type="range" min="-100" max="100" defaultValue="0" className="w-full" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Contrast</label>
                          <input type="range" min="-100" max="100" defaultValue="0" className="w-full" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Saturation</label>
                          <input type="range" min="-100" max="100" defaultValue="0" className="w-full" />
                        </div>
                      </div>
                    )}
                    
                    {selectedTool === 'vector' && (
                      <div className="space-y-4">
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="h-5 w-5 text-blue-600" />
                            <h4 className="font-medium text-blue-900 dark:text-blue-100">AI-Powered Vectorization</h4>
                          </div>
                          <p className="text-sm text-blue-800 dark:text-blue-200">
                            Convert your raster image to a scalable vector format using advanced algorithms.
                          </p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2">Vector Type</label>
                          <select className="w-full p-2 border rounded dark:bg-gray-700">
                            <option value="svg">SVG (Scalable Vector Graphics)</option>
                            <option value="ai">Adobe Illustrator (.ai)</option>
                            <option value="pdf">PDF Vector</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2">Detail Level</label>
                          <select className="w-full p-2 border rounded dark:bg-gray-700">
                            <option value="high">High Detail (slower)</option>
                            <option value="medium">Medium Detail</option>
                            <option value="low">Low Detail (faster)</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    {selectedTool === 'vector' ? (
                      <Button 
                        onClick={convertToVector}
                        disabled={isProcessing}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {isProcessing ? 'Converting to Vector...' : 'Convert to Vector'}
                        <Sparkles className="h-4 w-4 ml-2" />
                      </Button>
                    ) : (
                      <Button 
                        onClick={processImage}
                        disabled={isProcessing}
                      >
                        {isProcessing ? 'Processing...' : 'Apply Changes'}
                      </Button>
                    )}
                    
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    
                    <Button variant="ghost" onClick={() => setSelectedFile(null)}>
                      Clear
                    </Button>
                  </div>
                </div>
              )}
            </div>
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
          ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800' 
          : 'border-2 border-transparent hover:bg-gray-50 dark:hover:bg-gray-700'
      }`}
      onClick={onClick}
    >
      <div className="flex items-start gap-2">
        {icon && <div className="text-blue-600 mt-0.5">{icon}</div>}
        <div>
          <h4 className="font-medium text-sm">{title}</h4>
          <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{description}</p>
        </div>
      </div>
    </div>
  )
}