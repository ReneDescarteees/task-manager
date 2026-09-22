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

const filter = ref<'all' | TaskStatus>('all')

const filters: { id: 'all' | TaskStatus; label: string }[] = [
  { id: 'all', label: '全部' },
  ...STATUSES.map((status) => ({ id: status, label: STATUS_LABEL[status] })),
]

const visibleTasks = computed(() => {
  const sorted = [...props.tasks].sort((a, b) => b.createdAt - a.createdAt)
  if (filter.value === 'all') return sorted
  return sorted.filter((task) => task.status === filter.value)
})
</script>

<template>
  <section>
    <div class="mb-4 flex flex-wrap gap-2">
      <button
        v-for="item in filters"
        :key="item.id"
        type="button"
        class="h-10 rounded-full px-4 text-sm font-medium transition"
        :class="
          filter === item.id
            ? 'bg-indigo-600 text-white'
            : 'bg-white text-zinc-600 ring-1 ring-zinc-200 hover:text-indigo-700 dark:bg-zinc-900 dark:text-zinc-300 dark:ring-zinc-700'
        "
        @click="filter = item.id"
      >
        {{ item.label }}
      </button>
    </div>

    <div v-if="visibleTasks.length" class="grid gap-3">
      <TaskCard
        v-for="task in visibleTasks"
        :key="task.id"
        :task="task"
        @edit="emit('edit', $event)"
        @delete="emit('delete', $event)"
        @status="(id, status) => emit('status', id, status)"
      />
    </div>
    <div
      v-else
      class="rounded-3xl border border-dashed border-zinc-300 bg-white/70 px-6 py-16 text-center dark:border-zinc-700 dark:bg-zinc-900/60"
    >
      <p class="text-lg font-medium text-zinc-800 dark:text-zinc-100">还没有任务</p>
      <p class="mt-2 text-sm text-zinc-500 dark:text-zinc-400">点击右上角「新建任务」，标题必填，描述可以不写。</p>
    </div>
  </section>
</template>
