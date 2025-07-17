// API Response Types
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

// Project Types
export interface Project {
  id: string;
  name: string;
  description?: string;
  owner_id: string;
  status: 'active' | 'completed' | 'paused';
  project_type: 'network' | 'web' | 'mobile' | 'api';
  target_count: number;
  created_at: string;
  updated_at?: string;
  last_accessed: string;
}

export interface ProjectCreate {
  name: string;
  description?: string;
  project_type: 'network' | 'web' | 'mobile' | 'api';
  status?: 'active' | 'completed' | 'paused';
  target_count?: number;
}

export interface ProjectUpdate {
  name?: string;
  description?: string;
  status?: 'active' | 'completed' | 'paused';
  target_count?: number;
}

// Target Types
export interface Target {
  id: string;
  project_id: string;
  name: string;
  target_url?: string;
  target_ip?: string;
  target_type: 'website' | 'ip';
  status: 'pending' | 'scanning' | 'completed' | 'failed';
  created_at: string;
}

export interface TargetCreate {
  project_id: string;
  name: string;
  target_url?: string;
  target_ip?: string;
  target_type: 'website' | 'ip';
  status?: 'pending' | 'scanning' | 'completed' | 'failed';
}

// Agent Types
export interface AgentExecuteRequest {
  agent_type: 'web_classifier' | 'web_pentester' | 'network_scanner';
  target: string;
  project_id: string;
  target_id: string;
  options?: Record<string, any>;
}

export interface AgentExecuteResponse {
  test_run_id: string;
  status: string;
  message: string;
}

export interface TestRun {
  id: string;
  project_id: string;
  target_id: string;
  agent_type: string;
  engine_type: string;
  status: 'running' | 'completed' | 'failed';
  started_at: string;
  completed_at?: string;
  duration_seconds?: number;
}

export interface TestResult {
  id: string;
  test_run_id: string;
  result_type: string;
  severity: 'info' | 'low' | 'medium' | 'high' | 'critical';
  confidence_score: number;
  title: string;
  description?: string;
  raw_data?: Record<string, any>;
  created_at: string;
}

// Error Types
export interface ApiError {
  detail: string;
  status_code?: number;
}