<script setup lang="ts">
import { computed, ref } from 'vue'
import KanbanBoard from './components/KanbanBoard.vue'
import TaskList from './components/TaskList.vue'
import TaskModal from './components/TaskModal.vue'
import ThemeToggle from './components/ThemeToggle.vue'
import { useTasks } from './stores/taskStore'
import type { Task, TaskInput } from './types/task'

const { tasks, addTask, updateTask, deleteTask, setStatus } = useTasks()

const view = ref<'list' | 'board'>('list')
const modalOpen = ref(false)
const editing = ref<Task | null>(null)

const total = computed(() => tasks.length)

function openCreate() {
  editing.value = null
  modalOpen.value = true
}

function openEdit(task: Task) {
  editing.value = task
  modalOpen.value = true
}

function closeModal() {
  modalOpen.value = false
  editing.value = null
}

function saveTask(input: TaskInput) {
  if (editing.value) updateTask(editing.value.id, input)
  else addTask(input)
  closeModal()
}
</script>

<template>
  <div class="min-h-screen bg-[#f4f5f8] text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
    <header class="sticky top-0 z-20 border-b border-zinc-200/80 bg-[#f4f5f8]/90 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90">
      <div class="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-4 sm:px-6">
        <div class="mr-auto flex items-center gap-3">
          <span class="grid h-10 w-10 place-items-center rounded-2xl bg-indigo-600 text-lg font-semibold text-white">
            任
          </span>
          <div>
            <h1 class="text-lg font-semibold leading-6">任务管理</h1>
            <p class="text-xs text-zinc-500 dark:text-zinc-400">共 {{ total }} 个任务 · 保存在这台浏览器</p>
          </div>
        </div>

        <div class="flex rounded-full bg-white p-1 ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-700">
          <button
            type="button"
            class="h-9 rounded-full px-4 text-sm font-medium"
            :class="view === 'list' ? 'bg-indigo-600 text-white' : 'text-zinc-600 dark:text-zinc-300'"
            @click="view = 'list'"
          >
            列表
          </button>
          <button
            type="button"
            class="h-9 rounded-full px-4 text-sm font-medium"
            :class="view === 'board' ? 'bg-indigo-600 text-white' : 'text-zinc-600 dark:text-zinc-300'"
            @click="view = 'board'"
          >
            看板
          </button>
        </div>

        <ThemeToggle />
        <button
          type="button"
          class="h-11 rounded-full bg-indigo-600 px-4 text-sm font-medium text-white hover:bg-indigo-500"
          @click="openCreate"
        >
          新建任务
        </button>
      </div>
    </header>

    <main class="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <TaskList
        v-if="view === 'list'"
        :tasks="tasks"
        @edit="openEdit"
        @delete="deleteTask"
        @status="setStatus"
      />
      <KanbanBoard
        v-else
        :tasks="tasks"
        @edit="openEdit"
        @delete="deleteTask"
        @status="setStatus"
      />
    </main>

    <TaskModal :open="modalOpen" :task="editing" @close="closeModal" @save="saveTask" />
  </div>
</template>
