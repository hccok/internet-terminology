<template>
  <form class="search-bar" @submit.prevent="onSubmit">
    <div class="search-bar__box">
      <svg class="search-bar__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <input
        ref="inputRef"
        v-model="value"
        class="search-bar__input"
        type="search"
        :placeholder="placeholder"
        autocomplete="off"
        @input="$emit('input', value)"
      />
      <button
        v-if="value"
        type="button"
        class="search-bar__clear"
        @click="clear"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  placeholder: { type: String, default: '搜 checkout、LGTM…' },
  autofocus: { type: Boolean, default: false }
})

defineEmits(['input'])

const router = useRouter()
const value = ref('')
const inputRef = ref(null)

function onSubmit() {
  const q = value.value.trim()
  if (!q) return
  router.push({ name: 'Search', query: { q } })
}

function clear() {
  value.value = ''
}

onMounted(() => {
  if (props.autofocus && inputRef.value) {
    inputRef.value.focus()
  }
})
</script>

<style scoped>
.search-bar {
  padding: 4px 14px 2px;
}
.search-bar__box {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--surface-field);
  border-radius: 14px;
  padding: 10px 14px;
  border: 1px solid var(--surface-border);
  transition: border-color 0.2s, box-shadow 0.2s;
}
.search-bar__box:focus-within {
  border-color: rgba(96,165,250,0.3);
  box-shadow: 0 2px 12px rgba(96,165,250,0.12);
}
.search-bar__icon {
  flex-shrink: 0;
  color: var(--text-tertiary);
}
.search-bar__input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 15px;
  color: var(--text-primary);
  background: transparent;
  font-family: inherit;
}
.search-bar__input::placeholder {
  color: var(--text-muted);
}
.search-bar__input::-webkit-search-cancel-button,
.search-bar__input::-webkit-search-decoration {
  display: none;
}
.search-bar__clear {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border-radius: 12px;
  border: none;
  background: rgba(255,255,255,0.1);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255,255,255,0.4);
  padding: 0;
}
.search-bar__clear:active {
  background: rgba(255,255,255,0.18);
}
</style>
