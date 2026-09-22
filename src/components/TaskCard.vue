<script setup lang="ts">
import { computed } from 'vue'
import type { Task, TaskPriority, TaskStatus } from '../types/task'
import { PRIORITY_LABEL, STATUS_LABEL, STATUSES } from '../types/task'

const props = defineProps<{
  task: Task
  draggableCard?: boolean
}>()

const emit = defineEmits<{
  edit: [task: Task]
  delete: [id: string]
  status: [id: string, status: TaskStatus]
  dragStart: [id: string]
  dragEnd: []
}>()

const priorityClass: Record<TaskPriority, string> = {
  high: 'border-l-red-500',
  medium: 'border-l-amber-400',
  low: 'border-l-emerald-500',
}

const badgeClass: Record<TaskPriority, string> = {
  high: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300',
  medium: 'bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-200',
  low: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
}

const createdLabel = computed(() =>
  new Intl.DateTimeFormat('zh-CN', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(props.task.createdAt),
)

function onDragStart(event: DragEvent) {
  if (!props.draggableCard || !event.dataTransfer) return
  event.dataTransfer.setData('text/plain', props.task.id)
  event.dataTransfer.effectAllowed = 'move'
  emit('dragStart', props.task.id)
}
</script>

<template>
  <article
    class="group rounded-2xl border border-zinc-200/80 border-l-4 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
    :class="[priorityClass[task.priority], task.status === 'done' ? 'opacity-80' : '']"
    :draggable="draggableCard"
    @dragstart="onDragStart"
    @dragend="emit('dragEnd')"
  >
    <div class="flex items-start gap-3">
      <div class="min-w-0 flex-1">
        <h3
          class="text-base font-semibold leading-6"
          :class="
            task.status === 'done'
              ? 'text-zinc-400 line-through dark:text-zinc-500'
              : 'text-zinc-900 dark:text-zinc-50'
          "
        >
          {{ task.title }}
        </h3>
        <p
          v-if="task.description"
          class="mt-1 line-clamp-3 text-sm leading-6 text-zinc-500 dark:text-zinc-400"
        >
          {{ task.description }}
        </p>
      </div>
      <div class="flex shrink-0 gap-1">
        <button
          type="button"
          class="h-9 rounded-lg px-2.5 text-sm text-zinc-500 hover:bg-zinc-100 hover:text-indigo-700 dark:hover:bg-zinc-800 dark:hover:text-indigo-300"
          @click="emit('edit', task)"
        >
          编辑
        </button>
        <button
          type="button"
          class="h-9 rounded-lg px-2.5 text-sm text-zinc-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-300"
          @click="emit('delete', task.id)"
        >
          删除
        </button>
      </div>
    </div>

    <div class="mt-4 flex flex-wrap items-center gap-2">
      <span class="rounded-full px-2.5 py-1 text-xs font-medium" :class="badgeClass[task.priority]">
        {{ PRIORITY_LABEL[task.priority] }}优先级
      </span>
      <label class="sr-only" :for="`status-${task.id}`">状态</label>
      <select
        :id="`status-${task.id}`"
        class="h-9 rounded-lg border border-zinc-200 bg-zinc-50 px-2 text-sm text-zinc-700 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200"
        :value="task.status"
        @change="emit('status', task.id, ($event.target as HTMLSelectElement).value as TaskStatus)"
      >
        <option v-for="status in STATUSES" :key="status" :value="status">
          {{ STATUS_LABEL[status] }}
        </option>
      </select>
      <span class="ml-auto text-xs text-zinc-400">{{ createdLabel }}</span>
    </div>
  </article>
</template>
