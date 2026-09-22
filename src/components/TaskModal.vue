<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import type { Task, TaskInput, TaskPriority, TaskStatus } from '../types/task'
import { PRIORITIES, PRIORITY_LABEL, STATUSES, STATUS_LABEL } from '../types/task'

const props = defineProps<{
  open: boolean
  task: Task | null
}>()

const emit = defineEmits<{
  close: []
  save: [input: TaskInput]
}>()

const title = ref('')
const description = ref('')
const status = ref<TaskStatus>('todo')
const priority = ref<TaskPriority>('medium')
const error = ref('')
const titleInput = ref<HTMLInputElement | null>(null)

const heading = computed(() => (props.task ? '编辑任务' : '新建任务'))

function resetForm() {
  title.value = props.task?.title ?? ''
  description.value = props.task?.description ?? ''
  status.value = props.task?.status ?? 'todo'
  priority.value = props.task?.priority ?? 'medium'
  error.value = ''
}

function close() {
  emit('close')
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') close()
}

watch(
  () => props.open,
  async (open) => {
    if (!open) {
      window.removeEventListener('keydown', onKeydown)
      return
    }
    resetForm()
    window.addEventListener('keydown', onKeydown)
    await nextTick()
    titleInput.value?.focus()
  },
)

onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))

function submit() {
  if (!title.value.trim()) {
    error.value = '标题不能为空'
    titleInput.value?.focus()
    return
  }
  emit('save', {
    title: title.value,
    description: description.value,
    status: status.value,
    priority: priority.value,
  })
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-end justify-center bg-zinc-950/50 p-4 sm:items-center"
      @click.self="close"
    >
      <form
        class="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl dark:bg-zinc-900"
        role="dialog"
        aria-modal="true"
        :aria-label="heading"
        @submit.prevent="submit"
      >
        <div class="flex items-start justify-between gap-4">
          <div>
            <h2 class="text-xl font-semibold text-zinc-900 dark:text-zinc-50">{{ heading }}</h2>
            <p class="mt-1 text-sm text-zinc-500 dark:text-zinc-400">标题必填，描述可以留空。</p>
          </div>
          <button
            type="button"
            class="h-10 rounded-full px-3 text-sm text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            @click="close"
          >
            关闭
          </button>
        </div>

        <label class="mt-6 block text-sm font-medium text-zinc-700 dark:text-zinc-200" for="task-title">
          标题
        </label>
        <input
          id="task-title"
          ref="titleInput"
          v-model="title"
          type="text"
          maxlength="80"
          class="mt-2 h-12 w-full rounded-xl border border-zinc-200 bg-white px-3 text-base text-zinc-900 outline-none ring-indigo-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
          placeholder="例如：完成看板拖拽"
          @input="error = ''"
        />
        <p v-if="error" class="mt-2 text-sm text-red-600">{{ error }}</p>

        <label class="mt-4 block text-sm font-medium text-zinc-700 dark:text-zinc-200" for="task-description">
          描述
        </label>
        <textarea
          id="task-description"
          v-model="description"
          rows="3"
          maxlength="400"
          class="mt-2 w-full resize-none rounded-xl border border-zinc-200 bg-white px-3 py-3 text-base text-zinc-900 outline-none ring-indigo-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
          placeholder="选填"
        />

        <div class="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-200" for="task-priority">
              优先级
            </label>
            <select
              id="task-priority"
              v-model="priority"
              class="mt-2 h-12 w-full rounded-xl border border-zinc-200 bg-white px-3 text-base text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
            >
              <option v-for="item in PRIORITIES" :key="item" :value="item">
                {{ PRIORITY_LABEL[item] }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-200" for="task-status">
              状态
            </label>
            <select
              id="task-status"
              v-model="status"
              class="mt-2 h-12 w-full rounded-xl border border-zinc-200 bg-white px-3 text-base text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
            >
              <option v-for="item in STATUSES" :key="item" :value="item">
                {{ STATUS_LABEL[item] }}
              </option>
            </select>
          </div>
        </div>

        <div class="mt-6 flex justify-end gap-2">
          <button
            type="button"
            class="h-11 rounded-full px-4 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            @click="close"
          >
            取消
          </button>
          <button
            type="submit"
            class="h-11 rounded-full bg-indigo-600 px-5 text-sm font-medium text-white hover:bg-indigo-500"
          >
            保存
          </button>
        </div>
      </form>
    </div>
  </Teleport>
</template>
