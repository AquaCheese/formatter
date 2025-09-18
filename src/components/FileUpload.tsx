'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Upload, X, FileText, Image, Video, Music } from 'lucide-react'
import { FileData } from '@/types'
import { formatFileSize, getFileExtension, isImageFile, isVideoFile, isTextFile } from '@/lib/utils'

interface FileUploadProps {
  onFilesSelected: (files: FileData[]) => void
  acceptedTypes?: string[]
  maxFiles?: number
  maxSize?: number // in bytes
  className?: string
}

export function FileUpload({ 
  onFilesSelected, 
  acceptedTypes = ['*'],
  maxFiles = 10,
  maxSize = 100 * 1024 * 1024, // 100MB
  className = ''
}: FileUploadProps) {
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const [uploadedFiles, setUploadedFiles] = useState<FileData[]>([])
  const [isDragOver, setIsDragOver] = useState(false)

  const handleFiles = useCallback(async (files: FileList) => {
    const newFiles: FileData[] = []
    const filesToProcess = Array.from(files).slice(0, maxFiles)

    for (const file of filesToProcess) {
      if (file.size > maxSize) {
        alert(`File ${file.name} is too large. Maximum size is ${formatFileSize(maxSize)}`)
        continue
      }

      const fileId = `${file.name}-${Date.now()}-${Math.random()}`
      
      const fileData: FileData = {
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        created_at: new Date().toISOString(),
        processed: false
      }

      newFiles.push(fileData)
      
      // Simulate upload progress
      setUploadProgress(prev => ({ ...prev, [fileId]: 0 }))
      
      // Simulate upload with progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 50))
        setUploadProgress(prev => ({ ...prev, [fileId]: i }))
      }

      // Create object URL for preview
      fileData.url = URL.createObjectURL(file)
    }

    setUploadedFiles(prev => [...prev, ...newFiles])
    onFilesSelected(newFiles)
  }, [maxFiles, maxSize, onFilesSelected])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFiles(files)
    }
  }, [handleFiles])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      handleFiles(files)
    }
  }, [handleFiles])

  const removeFile = (fileId: string) => {
    const file = uploadedFiles.find(f => f.id === fileId)
    if (file?.url) {
      URL.revokeObjectURL(file.url)
    }
    
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId))
    setUploadProgress(prev => {
      const newProgress = { ...prev }
      delete newProgress[fileId]
      return newProgress
    })
  }

  const getFileIcon = (fileName: string, fileType: string) => {
    if (isImageFile(fileName)) return <Image className="h-6 w-6 text-blue-500" />
    if (isVideoFile(fileName)) return <Video className="h-6 w-6 text-purple-500" />
    if (isTextFile(fileName)) return <FileText className="h-6 w-6 text-green-500" />
    if (fileType.startsWith('audio/')) return <Music className="h-6 w-6 text-yellow-500" />
    return <FileText className="h-6 w-6 text-gray-500" />
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragOver
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
        }`}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <input
          id="file-input"
          type="file"
          multiple={maxFiles > 1}
          onChange={handleFileSelect}
          className="hidden"
          accept={acceptedTypes.includes('*') ? undefined : acceptedTypes.join(',')}
        />
        
        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        
        {isDragOver ? (
          <p className="text-blue-600 dark:text-blue-400">
            Drop the files here...
          </p>
        ) : (
          <div>
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              Drag and drop files here, or click to browse
            </p>
            <p className="text-sm text-gray-500">
              Max {maxFiles} files, up to {formatFileSize(maxSize)} each
            </p>
          </div>
        )}
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Uploaded Files</h4>
          
          {uploadedFiles.map((file) => (
            <div key={file.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              {getFileIcon(file.name, file.type)}
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                
                {uploadProgress[file.id] !== undefined && uploadProgress[file.id] < 100 && (
                  <div className="mt-2">
                    <Progress value={uploadProgress[file.id]} className="h-2" />
                    <p className="text-xs text-gray-500 mt-1">
                      Uploading... {uploadProgress[file.id]}%
                    </p>
                  </div>
                )}
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFile(file.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}