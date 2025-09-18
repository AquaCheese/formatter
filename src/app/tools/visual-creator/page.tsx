'use client'

import { useState, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { 
  ArrowLeft, 
  Palette, 
  Plus, 
  Trash2, 
  Move,
  Square,
  Circle,
  Type,
  Upload,
  Save,
  Play,
  Settings
} from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ToolComponent {
  id: string
  type: 'input' | 'button' | 'text' | 'image' | 'output'
  x: number
  y: number
  width: number
  height: number
  properties: Record<string, any>
}

export default function VisualToolCreator() {
  const { user } = useAuth()
  const router = useRouter()
  const canvasRef = useRef<HTMLDivElement>(null)
  const [components, setComponents] = useState<ToolComponent[]>([])
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null)
  const [draggedComponent, setDraggedComponent] = useState<string | null>(null)
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [toolName, setToolName] = useState('My Custom Tool')

  const componentTypes = [
    { type: 'input', label: 'File Input', icon: Upload },
    { type: 'button', label: 'Action Button', icon: Square },
    { type: 'text', label: 'Text Label', icon: Type },
    { type: 'image', label: 'Image Display', icon: Circle },
    { type: 'output', label: 'Output Area', icon: Square }
  ]

  const addComponent = (type: ToolComponent['type']) => {
    const newComponent: ToolComponent = {
      id: `${type}-${Date.now()}`,
      type,
      x: 100,
      y: 100,
      width: type === 'button' ? 120 : type === 'text' ? 200 : 300,
      height: type === 'text' ? 40 : type === 'button' ? 40 : 100,
      properties: {
        label: type === 'button' ? 'Button' : type === 'text' ? 'Text Label' : `${type} component`,
        placeholder: type === 'input' ? 'Choose file...' : '',
        action: type === 'button' ? 'process' : ''
      }
    }
    setComponents([...components, newComponent])
  }

  const deleteComponent = (id: string) => {
    setComponents(components.filter(c => c.id !== id))
    if (selectedComponent === id) {
      setSelectedComponent(null)
    }
  }

  const updateComponent = (id: string, updates: Partial<ToolComponent>) => {
    setComponents(components.map(c => 
      c.id === id ? { ...c, ...updates } : c
    ))
  }

  const handleMouseDown = (e: React.MouseEvent, componentId: string) => {
    e.preventDefault()
    setSelectedComponent(componentId)
    setDraggedComponent(componentId)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedComponent || !canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    updateComponent(draggedComponent, { x, y })
  }

  const handleMouseUp = () => {
    setDraggedComponent(null)
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
                <Palette className="h-6 w-6 text-orange-600" />
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Visual Tool Creator
                </h1>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <input
                type="text"
                value={toolName}
                onChange={(e) => setToolName(e.target.value)}
                className="px-3 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                placeholder="Tool name"
              />
              <Button variant="outline" onClick={() => setIsPreviewMode(!isPreviewMode)}>
                <Play className="h-4 w-4 mr-2" />
                {isPreviewMode ? 'Edit' : 'Preview'}
              </Button>
              <Button className="bg-orange-600 hover:bg-orange-700">
                <Save className="h-4 w-4 mr-2" />
                Save Tool
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Component Palette */}
        {!isPreviewMode && (
          <div className="w-64 bg-white dark:bg-gray-800 border-r p-4">
            <h3 className="text-lg font-semibold mb-4">Components</h3>
            
            <div className="space-y-2">
              {componentTypes.map(({ type, label, icon: Icon }) => (
                <Button
                  key={type}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => addComponent(type as ToolComponent['type'])}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {label}
                </Button>
              ))}
            </div>

            {/* Properties Panel */}
            {selectedComponent && (
              <div className="mt-8">
                <h4 className="font-semibold mb-4">Properties</h4>
                
                {(() => {
                  const component = components.find(c => c.id === selectedComponent)
                  if (!component) return null

                  return (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">Label</label>
                        <input
                          type="text"
                          value={component.properties.label || ''}
                          onChange={(e) => updateComponent(component.id, {
                            properties: { ...component.properties, label: e.target.value }
                          })}
                          className="w-full p-2 border rounded text-sm dark:bg-gray-700"
                        />
                      </div>
                      
                      {component.type === 'input' && (
                        <div>
                          <label className="block text-sm font-medium mb-1">Placeholder</label>
                          <input
                            type="text"
                            value={component.properties.placeholder || ''}
                            onChange={(e) => updateComponent(component.id, {
                              properties: { ...component.properties, placeholder: e.target.value }
                            })}
                            className="w-full p-2 border rounded text-sm dark:bg-gray-700"
                          />
                        </div>
                      )}
                      
                      {component.type === 'button' && (
                        <div>
                          <label className="block text-sm font-medium mb-1">Action</label>
                          <select
                            value={component.properties.action || 'process'}
                            onChange={(e) => updateComponent(component.id, {
                              properties: { ...component.properties, action: e.target.value }
                            })}
                            className="w-full p-2 border rounded text-sm dark:bg-gray-700"
                          >
                            <option value="process">Process File</option>
                            <option value="convert">Convert Format</option>
                            <option value="download">Download Result</option>
                            <option value="clear">Clear All</option>
                          </select>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-sm font-medium mb-1">Width</label>
                          <input
                            type="number"
                            value={component.width}
                            onChange={(e) => updateComponent(component.id, {
                              width: Number(e.target.value)
                            })}
                            className="w-full p-2 border rounded text-sm dark:bg-gray-700"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Height</label>
                          <input
                            type="number"
                            value={component.height}
                            onChange={(e) => updateComponent(component.id, {
                              height: Number(e.target.value)
                            })}
                            className="w-full p-2 border rounded text-sm dark:bg-gray-700"
                          />
                        </div>
                      </div>
                      
                      <Button
                        variant="destructive"
                        size="sm"
                        className="w-full"
                        onClick={() => deleteComponent(component.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Component
                      </Button>
                    </div>
                  )
                })()}
              </div>
            )}
          </div>
        )}

        {/* Canvas Area */}
        <div className="flex-1 bg-gray-100 dark:bg-gray-900 p-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm h-full relative overflow-hidden">
            <div className="absolute top-4 left-4 text-sm text-gray-500">
              {isPreviewMode ? 'Preview Mode' : 'Design Mode'} - {toolName}
            </div>
            
            <div
              ref={canvasRef}
              className="absolute inset-0 mt-12"
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            >
              {components.map((component) => (
                <div
                  key={component.id}
                  className={`absolute border-2 transition-colors ${
                    selectedComponent === component.id
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-orange-300'
                  } ${isPreviewMode ? 'border-none' : 'cursor-move'}`}
                  style={{
                    left: component.x,
                    top: component.y,
                    width: component.width,
                    height: component.height
                  }}
                  onMouseDown={(e) => !isPreviewMode && handleMouseDown(e, component.id)}
                >
                  {/* Component Content */}
                  <div className="w-full h-full flex items-center justify-center p-2">
                    {component.type === 'input' && (
                      <div className="w-full">
                        <label className="block text-sm font-medium mb-1">
                          {component.properties.label}
                        </label>
                        <input
                          type="file"
                          placeholder={component.properties.placeholder}
                          className="w-full p-2 border rounded text-sm"
                          disabled={!isPreviewMode}
                        />
                      </div>
                    )}
                    
                    {component.type === 'button' && (
                      <button
                        className="w-full h-full bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
                        disabled={!isPreviewMode}
                      >
                        {component.properties.label}
                      </button>
                    )}
                    
                    {component.type === 'text' && (
                      <div className="w-full text-center">
                        {component.properties.label}
                      </div>
                    )}
                    
                    {component.type === 'image' && (
                      <div className="w-full h-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-500">
                        Image Preview
                      </div>
                    )}
                    
                    {component.type === 'output' && (
                      <div className="w-full h-full border border-gray-300 rounded p-2 bg-gray-50 dark:bg-gray-700">
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          Output will appear here
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Selection Indicators */}
                  {!isPreviewMode && selectedComponent === component.id && (
                    <>
                      <div className="absolute -top-6 left-0 bg-orange-600 text-white px-2 py-1 text-xs rounded">
                        {component.type}
                      </div>
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-600 rounded-full"></div>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-orange-600 rounded-full"></div>
                      <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-orange-600 rounded-full"></div>
                      <div className="absolute -top-1 -left-1 w-3 h-3 bg-orange-600 rounded-full"></div>
                    </>
                  )}
                </div>
              ))}

              {/* Empty State */}
              {components.length === 0 && !isPreviewMode && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <Palette className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">Start Building Your Tool</h3>
                    <p>Drag components from the left panel to create your custom tool</p>
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