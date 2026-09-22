export type TaskStatus = 'todo' | 'in-progress' | 'done'
export type TaskPriority = 'high' | 'medium' | 'low'

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  createdAt: number
  updatedAt: number
}

export interface TaskInput {
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
}

export const STATUSES: TaskStatus[] = ['todo', 'in-progress', 'done']

export const STATUS_LABEL: Record<TaskStatus, string> = {
  todo: '待办',
  'in-progress': '进行中',
  done: '完成',
}

export const PRIORITIES: TaskPriority[] = ['high', 'medium', 'low']

export const PRIORITY_LABEL: Record<TaskPriority, string> = {
  high: '高',
  medium: '中',
  low: '低',
}
