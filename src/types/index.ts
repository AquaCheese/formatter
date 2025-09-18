export interface User {
  id: string
  email: string
  name?: string
  avatar_url?: string
  created_at: string
}

export interface UserTool {
  id: string
  user_id: string
  name: string
  description: string
  type: 'visual' | 'code'
  config: any
  created_at: string
  updated_at: string
}

export interface UserProject {
  id: string
  user_id: string
  name: string
  tool_type: string
  progress: any
  files: FileData[]
  created_at: string
  updated_at: string
}

export interface FileData {
  id: string
  name: string
  size: number
  type: string
  url?: string
  processed?: boolean
  created_at: string
}

export interface ProcessingJob {
  id: string
  type: 'convert' | 'edit' | 'process'
  status: 'pending' | 'processing' | 'completed' | 'failed'
  input_file: FileData
  output_file?: FileData
  progress: number
  error?: string
  created_at: string
}