<script setup lang="ts">
import { computed, ref } from 'vue'
import TaskCard from './TaskCard.vue'
import type { Task, TaskStatus } from '../types/task'
import { STATUS_LABEL, STATUSES } from '../types/task'

const props = defineProps<{
  tasks: Task[]
}>()

const emit = defineEmits<{
  edit: [task: Task]
  delete: [id: string]
  status: [id: string, status: TaskStatus]
}>()

const draggingId = ref<string | null>(null)
const overStatus = ref<TaskStatus | null>(null)

const columns = computed(() =>
  STATUSES.map((status) => ({
    status,
    label: STATUS_LABEL[status],
    tasks: props.tasks
      .filter((task) => task.status === status)
      .sort((a, b) => b.createdAt - a.createdAt),
  })),
)

const columnTone: Record<TaskStatus, string> = {
  todo: 'bg-zinc-100/80 dark:bg-zinc-900/80',
  'in-progress': 'bg-indigo-50/80 dark:bg-indigo-950/30',
  done: 'bg-emerald-50/70 dark:bg-emerald-950/20',
}

function onDragOver(event: DragEvent, status: TaskStatus) {
  event.preventDefault()
  if (event.dataTransfer) event.dataTransfer.dropEffect = 'move'
  overStatus.value = status
}

function onDragLeave(event: DragEvent, status: TaskStatus) {
  const current = event.currentTarget as HTMLElement
  const related = event.relatedTarget as Node | null
  if (related && current.contains(related)) return
  if (overStatus.value === status) overStatus.value = null
}

function onDrop(event: DragEvent, status: TaskStatus) {
  event.preventDefault()
  const id = event.dataTransfer?.getData('text/plain') || draggingId.value
  overStatus.value = null
  draggingId.value = null
  if (id) emit('status', id, status)
}
</script>

<template>
  <section class="grid items-start gap-4 lg:grid-cols-3">
    <div
      v-for="column in columns"
      :key="column.status"
      class="min-h-80 rounded-3xl p-3 transition"
      :class="[
        columnTone[column.status],
        overStatus === column.status ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-[#f4f5f8] dark:ring-offset-zinc-950' : '',
      ]"
      @dragover="onDragOver($event, column.status)"
      @dragleave="onDragLeave($event, column.status)"
      @drop="onDrop($event, column.status)"
    >
      <header class="mb-3 flex items-center justify-between px-2 pt-1">
        <h2 class="text-sm font-semibold tracking-wide text-zinc-700 dark:text-zinc-200">
          {{ column.label }}
        </h2>
        <span class="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-300">
          {{ column.tasks.length }}
        </span>
      </header>

      <div class="grid gap-3">
        <TaskCard
          v-for="task in column.tasks"
          :key="task.id"
          :task="task"
          draggable-card
          class="cursor-grab active:cursor-grabbing"
          :class="draggingId === task.id ? 'opacity-40' : ''"
          @edit="emit('edit', $event)"
          @delete="emit('delete', $event)"
          @status="(id, status) => emit('status', id, status)"
          @drag-start="draggingId = $event"
          @drag-end="draggingId = null"
        />
        <p
          v-if="!column.tasks.length"
          class="rounded-2xl border border-dashed border-zinc-300 px-3 py-10 text-center text-sm text-zinc-400 dark:border-zinc-700"
        >
          拖到这里
        </p>
      </div>
    </div>
  </section>
</template>
