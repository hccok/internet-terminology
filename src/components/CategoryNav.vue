<template>
  <div class="category-nav">
    <div class="category-nav__scroll" ref="scrollRef">
      <button
        v-for="cat in categories"
        :key="cat"
        class="category-nav__chip"
        :class="{ 'category-nav__chip--active': cat === active }"
        :style="cat === active ? { background: activeColor + '30', borderColor: activeColor + '55', color: '#fff', boxShadow: `0 2px 12px ${activeColor}30` } : {}"
        @click="select(cat)"
      >
        <span class="category-nav__emoji">{{ icons[cat] || '📌' }}</span>
        {{ cat }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'

const props = defineProps({
  categories: { type: Array, required: true },
  active: { type: String, default: '全部' }
})

const emit = defineEmits(['select'])
const scrollRef = ref(null)

const icons = {
  '全部': '🔥',
  '编程开发': '💻',
  '职场汇报术语': '📊',
  '外贸电商': '🛒',
  '商务邮件缩写': '✉️',
  '日常聊天缩写': '💬'
}

const categoryColors = {
  '编程开发': '#60a5fa',
  '职场汇报术语': '#f472b6',
  '外贸电商': '#22d3ee',
  '商务邮件缩写': '#f59e0b',
  '日常聊天缩写': '#c084fc'
}

const activeColor = computed(() => {
  return categoryColors[props.active] || '#60a5fa'
})

function select(cat) {
  emit('select', cat)
  nextTick(() => {
    if (!scrollRef.value) return
    const chips = scrollRef.value.children
    const idx = props.categories.indexOf(cat)
    if (idx >= 0 && chips[idx]) {
      chips[idx].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    }
  })
}
</script>

<style scoped>
.category-nav {
  padding: 6px 0 8px;
}
.category-nav__scroll {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
  overflow-x: visible;
  padding: 0 14px;
}
.category-nav__scroll::-webkit-scrollbar {
  display: none;
}
.category-nav__chip {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
  padding: 7px 15px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  background: var(--surface-field);
  color: var(--text-secondary);
  border: 1px solid var(--surface-border);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
  white-space: nowrap;
  font-family: inherit;
}
.category-nav__chip:active {
  transform: scale(0.95);
}
.category-nav__chip--active {
  box-shadow: 0 2px 12px rgba(96,165,250,0.25);
}
.category-nav__emoji {
  font-size: 14px;
  line-height: 1;
}
</style>
