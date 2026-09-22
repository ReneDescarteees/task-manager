import type { Task } from '../types/task'

export const TASKS_KEY = 'task-manager-tasks'

export function loadTasks(): Task[] | null {
  const raw = localStorage.getItem(TASKS_KEY)
  if (raw === null) return null
  try {
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isTask)
  } catch {
    return []
  }
}

export function saveTasks(tasks: Task[]) {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks))
}

function isTask(value: unknown): value is Task {
  if (!value || typeof value !== 'object') return false
  const task = value as Partial<Task>
  return (
    typeof task.id === 'string' &&
    typeof task.title === 'string' &&
    typeof task.description === 'string' &&
    (task.status === 'todo' || task.status === 'in-progress' || task.status === 'done') &&
    (task.priority === 'high' || task.priority === 'medium' || task.priority === 'low') &&
    typeof task.createdAt === 'number' &&
    typeof task.updatedAt === 'number'
  )
}
