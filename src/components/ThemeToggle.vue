<script setup lang="ts">
import { ref } from 'vue'
import { applyTheme, currentTheme, type Theme } from '../utils/theme'

const theme = ref<Theme>(currentTheme())

function toggle() {
  const next: Theme = theme.value === 'dark' ? 'light' : 'dark'
  theme.value = next
  applyTheme(next)
}
</script>

<template>
  <button
    type="button"
    class="inline-flex h-11 items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 transition hover:border-indigo-300 hover:text-indigo-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-indigo-400 dark:hover:text-indigo-200"
    :aria-label="theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'"
    @click="toggle"
  >
    <span class="text-base leading-none" aria-hidden="true">{{ theme === 'dark' ? '☀' : '☾' }}</span>
    {{ theme === 'dark' ? '浅色' : '深色' }}
  </button>
</template>
