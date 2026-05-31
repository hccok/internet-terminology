<template>
  <div class="favs stars-bg">
    <div class="stars-layer stars--slow"></div>
    <div class="stars-layer stars--mid"></div>
    <div class="stars-layer stars--fast"></div>

    <!-- Header -->
    <div class="favs__nav">
      <button class="favs__back" @click="goBack">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>
      <span class="favs__nav-title">我的收藏</span>
      <span class="favs__count" v-if="favList.length">{{ favList.length }} 条</span>
    </div>

    <!-- List -->
    <div class="favs__list" v-if="favList.length">
      <transition-group name="card-list">
        <TermCard
          v-for="term in favList"
          :key="term.id"
          :term="term"
          :category-color="categoryColors[term.category]"
        />
      </transition-group>
    </div>

    <!-- Empty -->
    <div class="favs__empty" v-else>
      <div class="favs__empty-icon">⭐</div>
      <p class="favs__empty-title">还没有收藏词条</p>
      <p class="favs__empty-hint">在词条详情页点击星标即可收藏</p>
      <button class="favs__empty-btn" @click="goBack">去逛逛</button>
    </div>

    <div class="safe-area-bottom" style="height: 80px"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import TermCard from '@/components/TermCard.vue'
import { useFavorites } from '@/utils/favorites'
import { getTermById } from '@/utils/search'

const router = useRouter()
const { ids } = useFavorites()

const categoryColors = {
  '编程开发': '#60a5fa',
  '职场汇报术语': '#f472b6',
  '外贸电商': '#22d3ee',
  '商务邮件缩写': '#f59e0b',
  '日常聊天缩写': '#c084fc'
}

const favList = computed(() => {
  return ids.value
    .map(id => getTermById(id))
    .filter(Boolean)
})

function goBack() {
  router.push({ name: 'Home' })
}
</script>

<style scoped>
.favs {
  position: relative;
}

/* Nav */
.favs__nav {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  position: sticky;
  top: 0;
  z-index: 10;
  background: rgba(15, 13, 26, 0.75);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}
.favs__back {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid var(--surface-border);
  background: var(--surface-field);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  transition: transform 0.15s;
}
.favs__back:active {
  transform: scale(0.92);
}
.favs__nav-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}
.favs__count {
  margin-left: auto;
  font-size: 13px;
  color: var(--text-tertiary);
}

/* List */
.favs__list {
  padding-top: 8px;
  position: relative;
  z-index: 1;
}

.card-list-enter-active {
  transition: all 0.35s ease-out;
}
.card-list-leave-active {
  transition: all 0.2s ease-in;
}
.card-list-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.card-list-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Empty */
.favs__empty {
  text-align: center;
  padding: 120px 20px;
  position: relative;
  z-index: 1;
}
.favs__empty-icon {
  font-size: 52px;
  margin-bottom: 14px;
}
.favs__empty-title {
  font-size: 17px;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 6px;
}
.favs__empty-hint {
  font-size: 14px;
  color: var(--text-tertiary);
  margin-bottom: 24px;
}
.favs__empty-btn {
  padding: 10px 32px;
  border-radius: 20px;
  border: 1px solid rgba(96,165,250,0.3);
  background: rgba(96,165,250,0.2);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}
.favs__empty-btn:active {
  background: rgba(96,165,250,0.35);
}
</style>
