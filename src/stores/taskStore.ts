import { reactive, watch } from 'vue'
import type { Task, TaskInput, TaskStatus } from '../types/task'
import { loadTasks, saveTasks } from '../utils/storage'

function createTask(
  title: string,
  description: string,
  status: TaskStatus,
  priority: Task['priority'],
  createdAt: number,
): Task {
  return {
    id: crypto.randomUUID(),
    title,
    description,
    status,
    priority,
    createdAt,
    updatedAt: createdAt,
  }
}

function seedTasks(): Task[] {
  const now = Date.now()
  return [
    createTask('准备课堂演示', '把列表、看板和深色模式各走一遍。', 'in-progress', 'high', now - 1000 * 60 * 40),
    createTask('整理本周待办', '标题写清楚，描述可以后补。', 'todo', 'medium', now - 1000 * 60 * 20),
    createTask('确认数据会保留', '刷新页面后，这三条示例还在。', 'done', 'low', now - 1000 * 60 * 5),
  ]
}

const stored = loadTasks()
const state = reactive<{ tasks: Task[] }>({
  tasks: stored ?? seedTasks(),
})

if (stored === null) saveTasks(state.tasks)

watch(
  () => state.tasks,
  (tasks) => saveTasks(tasks),
  { deep: true },
)

function addTask(input: TaskInput) {
  const now = Date.now()
  state.tasks.unshift({
    id: crypto.randomUUID(),
    title: input.title.trim(),
    description: input.description.trim(),
    status: input.status,
    priority: input.priority,
    createdAt: now,
    updatedAt: now,
  })
}

function updateTask(id: string, input: TaskInput) {
  const task = state.tasks.find((item) => item.id === id)
  if (!task) return
  task.title = input.title.trim()
  task.description = input.description.trim()
  task.status = input.status
  task.priority = input.priority
  task.updatedAt = Date.now()
}

function deleteTask(id: string) {
  const index = state.tasks.findIndex((item) => item.id === id)
  if (index >= 0) state.tasks.splice(index, 1)
}

function setStatus(id: string, status: TaskStatus) {
  const task = state.tasks.find((item) => item.id === id)
  if (!task || task.status === status) return
  task.status = status
  task.updatedAt = Date.now()
}

export function useTasks() {
  return {
    tasks: state.tasks,
    addTask,
    updateTask,
    deleteTask,
    setStatus,
  }
}
