export interface Course {
  id: string;
  title: string;
  code: string; // e.g. "ENG-PLACE"
  description: string;
  level: string;
  category: string;
  iconName: string;
  isFree: boolean;
  lessonsCount: number;
  tags: string[];
  htmlContent?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActivationCode {
  id: string;
  code: string;
  courseId: string;
  courseTitle: string;
  isUsed: boolean;
  usedAt?: string | null;
  usedBy?: string | null;
  createdAt: string;
  notes?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  imageUrl?: string;
}

export interface AdminAuthResponse {
  success: boolean;
  token?: string;
  message?: string;
}
