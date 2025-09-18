'use client'

import { useState, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { 
  ArrowLeft, 
  Upload, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward,
  Scissors,
  Volume2,
  Download,
  Film,
  Zap,
  Layers
} from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function VideoTools() {
  const { user } = useAuth()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('video/')) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setVideoPreview(url)
    }
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file && file.type.startsWith('video/')) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setVideoPreview(url)
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
  }

  const processVideo = async () => {
    if (!selectedFile) return
    
    setIsProcessing(true)
    // Simulate video processing
    await new Promise(resolve => setTimeout(resolve, 5000))
    setIsProcessing(false)
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
              <Film className="h-6 w-6 text-purple-600" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Video Editor Suite
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {!selectedFile ? (
          <div className="max-w-4xl mx-auto">
            <div
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center cursor-pointer hover:border-purple-500 transition-colors"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                Upload a Video
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Drag and drop a video file here, or click to browse
              </p>
              <p className="text-sm text-gray-500">
                Supports MP4, AVI, MOV, WebM, and more formats
              </p>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
            
            {/* Feature Showcase */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                <Scissors className="h-8 w-8 text-purple-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Precision Editing</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Cut, trim, and splice videos with frame-perfect accuracy
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                <Zap className="h-8 w-8 text-purple-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Effects & Transitions</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Add professional effects, filters, and smooth transitions
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                <Layers className="h-8 w-8 text-purple-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Multi-Track Timeline</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Layer video, audio, and graphics on unlimited tracks
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Video Preview */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Video Preview</h3>
              
              <div className="bg-black rounded-lg overflow-hidden">
                {videoPreview && (
                  <video
                    src={videoPreview}
                    className="w-full max-h-96 object-contain"
                    controls
                    onLoadedMetadata={(e) => {
                      const video = e.target as HTMLVideoElement
                      setDuration(video.duration)
                    }}
                    onTimeUpdate={(e) => {
                      const video = e.target as HTMLVideoElement
                      setCurrentTime(video.currentTime)
                    }}
                  />
                )}
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Timeline</h3>
              
              <div className="space-y-4">
                {/* Timeline Tracks */}
                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium w-20">Video 1</span>
                    <div className="flex-1 h-12 bg-purple-100 dark:bg-purple-900/30 rounded border-2 border-purple-200 dark:border-purple-700 flex items-center px-4">
                      <div className="bg-purple-500 h-8 rounded w-3/4 flex items-center justify-center text-white text-xs font-medium">
                        {selectedFile?.name || 'Video Track'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium w-20">Audio 1</span>
                    <div className="flex-1 h-8 bg-green-100 dark:bg-green-900/30 rounded border border-green-200 dark:border-green-700 flex items-center px-4">
                      <div className="bg-green-500 h-4 rounded w-3/4 flex items-center justify-center text-white text-xs">
                        Audio Track
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline Controls */}
                <div className="flex items-center gap-4 pt-4 border-t">
                  <Button variant="ghost" size="sm">
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setIsPlaying(!isPlaying)}>
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <SkipForward className="h-4 w-4" />
                  </Button>
                  
                  <div className="flex-1 mx-4">
                    <input
                      type="range"
                      min="0"
                      max={duration || 100}
                      value={currentTime}
                      className="w-full"
                      onChange={(e) => setCurrentTime(Number(e.target.value))}
                    />
                  </div>
                  
                  <span className="text-sm text-gray-600 dark:text-gray-300 min-w-20">
                    {Math.floor(currentTime)}s / {Math.floor(duration)}s
                  </span>
                </div>
              </div>
            </div>

            {/* Editing Tools */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Basic Edits */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Basic Edits</h3>
                
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Scissors className="h-4 w-4 mr-2" />
                    Cut/Split
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Film className="h-4 w-4 mr-2" />
                    Trim
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Volume2 className="h-4 w-4 mr-2" />
                    Audio Sync
                  </Button>
                </div>
              </div>

              {/* Effects */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Effects</h3>
                
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Zap className="h-4 w-4 mr-2" />
                    Transitions
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Color Correction
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Filters
                  </Button>
                </div>
              </div>

              {/* Export Settings */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Export</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Quality</label>
                    <select className="w-full p-2 border rounded dark:bg-gray-700">
                      <option value="4k">4K (2160p)</option>
                      <option value="1080p">Full HD (1080p)</option>
                      <option value="720p">HD (720p)</option>
                      <option value="480p">SD (480p)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Format</label>
                    <select className="w-full p-2 border rounded dark:bg-gray-700">
                      <option value="mp4">MP4</option>
                      <option value="avi">AVI</option>
                      <option value="mov">MOV</option>
                      <option value="webm">WebM</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <Button 
                onClick={processVideo}
                disabled={isProcessing}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isProcessing ? 'Processing Video...' : 'Render Video'}
              </Button>
              
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              
              <Button variant="ghost" onClick={() => setSelectedFile(null)}>
                Clear Project
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}