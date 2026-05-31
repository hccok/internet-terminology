<template>
  <div class="home stars-bg">
    <div class="stars-layer stars--slow"></div>
    <div class="stars-layer stars--mid"></div>
    <div class="stars-layer stars--fast"></div>

    <!-- Hero -->
    <div class="hero">
      <div class="hero__inner">
        <div class="hero__badge">🌐 工作语言词典</div>
        <h1 class="hero__title">Internet Terminology</h1>
        <p class="hero__desc">互联网打工牛马的那些话</p>
        <div class="hero__stats">
          <span>354 词条</span>
          <span class="hero__dot">·</span>
          <span>5 大分类</span>
          <span class="hero__dot">·</span>
          <span>离线可用</span>
          <span class="hero__dot" v-if="favCount">·</span>
          <a class="hero__favs-link" v-if="favCount" @click="goFavorites">⭐ {{ favCount }} 收藏</a>
        </div>
      </div>
    </div>

    <!-- Content area -->
    <div class="home__content">
      <!-- Sticky search + category -->
      <div class="home__sticky">
        <div class="home__sticky-inner">
          <SearchBar />
          <CategoryNav
            :categories="categories"
            :active="activeCategory"
            @select="onCategorySelect"
          />
        </div>
      </div>

      <!-- Card stack -->
      <div class="stack" v-if="ring.length">
        <div class="stack__counter">
          <span class="stack__counter-num">{{ currentIndex + 1 }}</span>
          <span class="stack__counter-divider"></span>
          <span>{{ ring.length }}</span>
        </div>

        <div
          class="stack__stage"
          @touchstart="onTouchStart"
          @touchmove="onTouchMove"
          @touchend="onTouchEnd"
          @mousedown="onMouseDown"
          @mousemove="onMouseMove"
          @mouseup="onMouseUp"
          @mouseleave="onMouseUp"
          @keydown.left="onKeyLeft"
          @keydown.right="onKeyRight"
          tabindex="0"
        >
          <div
            v-for="card in stackCards"
            :key="card.term.id"
            class="stack-card"
            :class="{
              'stack-card--top': card.stackPos === 0,
              'stack-card--exiting': card.stackPos === 0 && exiting,
            }"
            :style="cardStyle(card)"
            @click="card.stackPos === 0 && !exiting && goDetail(card.term.id)"
          >
            <!-- Glass card with gradient top accent -->
            <div
              class="stack-card__glow"
              :style="{ background: `linear-gradient(135deg, ${categoryColors[card.term.category]}, ${categoryColors[card.term.category]}44)` }"
            ></div>
            <div class="stack-card__body">
              <h2 class="stack-card__term">{{ card.term.term }}</h2>
              <p class="stack-card__fullname" v-if="card.term.fullName">{{ card.term.fullName }}</p>
              <p class="stack-card__meaning">{{ card.term.meaning }}</p>
              <div class="stack-card__footer">
                <span
                  class="stack-card__cat"
                  :style="{ color: categoryColors[card.term.category] }"
                >{{ card.term.category }}</span>
                <span class="stack-card__arrow" v-if="card.stackPos === 0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Controls -->
        <div class="stack__controls">
          <button class="stack__btn" @click="swipeRight">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <span class="stack__tip">滑动或点击箭头切换</span>
          <button class="stack__btn" @click="swipeLeft">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>
      </div>

      <div class="home__empty" v-else>
        <div class="home__empty-icon">📭</div>
        <p>该分类暂无词条</p>
      </div>
    </div>

    <!-- FAB -->
    <button class="fab" @click="goContribute" title="贡献词条">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
        <line x1="12" y1="5" x2="12" y2="19"/>
        <line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
    </button>
  </div>
</template>

<script setup>
defineOptions({ name: 'Home' })
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import SearchBar from '@/components/SearchBar.vue'
import CategoryNav from '@/components/CategoryNav.vue'
import { getAllTerms, getTermsByCategory, getCategories } from '@/utils/search'
import { useFavorites } from '@/utils/favorites'

const SWIPE_THRESHOLD = 60
const SPREAD = 2

const router = useRouter()
const { ids } = useFavorites()
const favCount = computed(() => ids.value.length)

const terms = getAllTerms()
const cats = getCategories()
const categories = ['全部', ...cats]
const activeCategory = ref('日常聊天缩写')
const currentIndex = ref(0)

const categoryColors = {
  '编程开发': '#60a5fa',
  '职场汇报术语': '#f472b6',
  '外贸电商': '#22d3ee',
  '商务邮件缩写': '#f59e0b',
  '日常聊天缩写': '#c084fc'
}

const ring = computed(() => getTermsByCategory(activeCategory.value))

const stackCards = computed(() => {
  const len = ring.value.length
  if (len === 0) return []
  const result = []
  for (let i = -SPREAD; i <= SPREAD; i++) {
    const idx = ((currentIndex.value + i) % len + len) % len
    result.push({ term: ring.value[idx], stackPos: i })
  }
  return result
})

// --- Swipe state ---
const dragging = ref(false)
const exiting = ref(false)
const dragX = ref(0)
const exitDir = ref(0)

function cardStyle(card) {
  const pos = card.stackPos
  const zMap = { '-2': 6, '-1': 8, '0': 10, '1': 8, '2': 6 }
  const base = {
    zIndex: zMap[pos] ?? 1,
    transition: (dragging.value && pos === 0)
      ? 'none'
      : 'transform 0.35s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.35s cubic-bezier(0.23, 1, 0.32, 1)'
  }

  if (pos === 0 && exiting.value) {
    return {
      ...base,
      transform: `translateX(${exitDir.value * 120}%) rotate(${exitDir.value * 20}deg) scale(1)`,
      opacity: 0,
      zIndex: 10
    }
  }

  if (pos === 0 && dragging.value) {
    const rot = dragX.value * 0.05
    return {
      ...base,
      transform: `translateX(${dragX.value}px) rotate(${rot}deg) scale(1)`,
      opacity: 1,
      zIndex: 10
    }
  }

  const xMap = {
    '-2': 'calc(-1 * var(--spread-2))',
    '-1': 'calc(-1 * var(--spread-1))',
    '0': '0px',
    '1': 'var(--spread-1)',
    '2': 'var(--spread-2)'
  }
  const scaleMap = { '-2': 0.72, '-1': 0.85, '0': 1, '1': 0.85, '2': 0.72 }
  const opacityMap = { '-2': 0.75, '-1': 0.9, '0': 1, '1': 0.9, '2': 0.75 }
  const shadowMap = {
    '-2': '0 4px 16px rgba(0,0,0,0.2)',
    '-1': '0 8px 24px rgba(0,0,0,0.3)',
    '0': '0 16px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1) inset',
    '1': '0 8px 24px rgba(0,0,0,0.3)',
    '2': '0 4px 16px rgba(0,0,0,0.2)'
  }

  return {
    ...base,
    transform: `translateX(${xMap[pos]}) scale(${scaleMap[pos]})`,
    opacity: opacityMap[pos],
    boxShadow: shadowMap[pos]
  }
}

function onCategorySelect(cat) {
  activeCategory.value = cat
  currentIndex.value = 0
}

// --- Pointer handling ---
let startX = 0

function dragStart(clientX) {
  if (exiting.value || ring.value.length <= 1) return
  startX = clientX
  dragging.value = true
}
function dragMove(clientX) {
  if (!dragging.value) return
  dragX.value = clientX - startX
}
function dragEnd() {
  if (!dragging.value) return
  dragging.value = false
  commitSwipe()
}

function doExit(dir) {
  if (exiting.value) return
  exiting.value = true
  exitDir.value = dir
  const len = ring.value.length
  setTimeout(() => {
    currentIndex.value = dir > 0
      ? (currentIndex.value - 1 + len) % len
      : (currentIndex.value + 1) % len
    dragX.value = 0
    exiting.value = false
    exitDir.value = 0
  }, 300)
}

function commitSwipe() {
  if (Math.abs(dragX.value) >= SWIPE_THRESHOLD) {
    doExit(dragX.value > 0 ? 1 : -1)
  } else {
    dragX.value = 0
  }
}

function onTouchStart(e) {
  dragStart(e.touches[0].clientX)
}
function onTouchMove(e) {
  if (!dragging.value) return
  dragMove(e.touches[0].clientX)
  if (Math.abs(dragX.value) > 10 && e.cancelable) e.preventDefault()
}
function onTouchEnd() { dragEnd() }
function onMouseDown(e) {
  e.preventDefault()
  dragStart(e.clientX)
}
function onMouseMove(e) { dragMove(e.clientX) }
function onMouseUp() { dragEnd() }
function swipeRight() { doExit(1) }
function swipeLeft() { doExit(-1) }
function onKeyLeft(e) {
  if (!e.target.closest('input, textarea, [contenteditable]')) swipeRight()
}
function onKeyRight(e) {
  if (!e.target.closest('input, textarea, [contenteditable]')) swipeLeft()
}

function goDetail(id) { router.push({ name: 'Detail', params: { id } }) }
function goFavorites() { router.push({ name: 'Favorites' }) }
function goContribute() { router.push({ name: 'Contribute' }) }
</script>

<style scoped>
/* ===== Base ===== */
.home {
  min-height: 100vh;
  user-select: none;
  -webkit-user-select: none;
  outline: none;
}


/* ===== Hero ===== */
.hero {
  position: relative;
  padding: 36px 20px 32px;
  z-index: 1;
}
@media (max-width: 480px) {
  .hero {
    padding: 20px 16px 20px;
  }
  .hero__title { font-size: 28px; }
  .hero__desc { font-size: 14px; margin-bottom: 10px; }
}
.hero__inner {
  text-align: center;
}
.hero__badge {
  display: inline-block;
  background: var(--surface-elevated);
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 600;
  padding: 4px 14px;
  border-radius: 20px;
  letter-spacing: 1px;
  margin-bottom: 12px;
  backdrop-filter: blur(8px);
  border: 1px solid var(--surface-border);
}
.hero__title {
  font-size: 32px;
  font-weight: 900;
  background: linear-gradient(135deg, #e0e7ff, #a5b4fc, #c4b5fd);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
  margin-bottom: 6px;
}
.hero__desc {
  font-size: 15px;
  color: var(--text-tertiary);
  margin-bottom: 16px;
}
.hero__stats {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--text-muted);
}
.hero__dot { opacity: 0.3; }
.hero__favs-link {
  color: #fbbf24;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: opacity 0.15s;
}
.hero__favs-link:active { opacity: 0.7; }

/* ===== Content ===== */
.home__content {
  max-width: 420px;
  margin: 0 auto;
  padding: 0 0 24px;
  position: relative;
  z-index: 1;
}

/* ===== Sticky ===== */
.home__sticky {
  position: sticky;
  top: 0;
  z-index: 20;
  padding: 0 0 4px;
}
.home__sticky-inner {
  background: transparent;
  padding-bottom: 4px;
  margin-top: -8px;
}

/* ===== Stack ===== */
.stack { padding-top: 12px; }

.stack__counter {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 18px;
  font-size: 13px;
  color: var(--text-tertiary);
  font-weight: 500;
}
@media (max-width: 480px) {
  .stack__counter { margin-bottom: 8px; }
}
.stack__counter-num {
  font-size: 24px;
  font-weight: 900;
  color: var(--text-primary);
}
.stack__counter-divider {
  width: 20px;
  height: 1px;
  background: rgba(255,255,255,0.12);
}

/* ===== Stage ===== */
.stack__stage {
  position: relative;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  --spread-1: 55px;
  --spread-2: 95px;
}
@media (min-width: 480px) {
  .stack__stage {
    height: 400px;
    overflow: visible;
    --spread-1: 130px;
    --spread-2: 240px;
  }
}
@media (max-width: 480px) {
  .stack__stage {
    height: 340px;
  }
}

/* ===== Card ===== */
.stack-card {
  position: absolute;
  inset: 0;
  margin: auto;
  width: 76%;
  max-width: 300px;
  height: 100%;
  border-radius: 22px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  will-change: transform, opacity;
  transform-origin: center center;
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: var(--glass-border);
}
@media (min-width: 480px) {
  .stack-card {
    width: 78%;
    max-width: 340px;
  }
  .stack-card__term { font-size: 30px; }
  .stack-card__body { padding: 26px 22px 20px; }
}
.stack-card--top {
  cursor: pointer;
  border-color: rgba(255,255,255,0.15);
}

/* Glow accent — top gradient strip */
.stack-card__glow {
  height: 5px;
  flex-shrink: 0;
  opacity: 0.9;
}

/* Card body */
.stack-card__body {
  flex: 1;
  padding: 24px 18px 18px;
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.stack-card__term {
  font-size: 28px;
  font-weight: 900;
  color: var(--text-primary);
  letter-spacing: -0.6px;
  line-height: 1.15;
  word-break: break-all;
}
.stack-card__fullname {
  font-size: 13px;
  color: var(--text-tertiary);
  margin-top: 4px;
  margin-bottom: 18px;
}
.stack-card__meaning {
  font-size: 16px;
  color: var(--text-secondary);
  line-height: 1.7;
  flex: 1;
}
.stack-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
  padding-top: 14px;
  border-top: 1px solid rgba(255,255,255,0.06);
}
.stack-card__cat {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
}
.stack-card__arrow {
  color: var(--text-muted);
  display: flex;
}

/* Exiting */
.stack-card--exiting {
  transition: transform 0.3s ease-in, opacity 0.3s ease-in !important;
}

/* ===== Controls ===== */
.stack__controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-top: 24px;
}
.stack__btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid var(--surface-border);
  background: var(--surface-field);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  transition: all 0.2s;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
.stack__btn:hover {
  background: var(--surface-elevated);
  border-color: rgba(255,255,255,0.2);
  color: var(--text-primary);
}
.stack__btn:active {
  transform: scale(0.9);
}
.stack__tip {
  font-size: 13px;
  color: var(--text-muted);
  letter-spacing: 0.5px;
}

/* ===== Empty ===== */
.home__empty {
  text-align: center;
  padding: 100px 20px;
  color: var(--text-muted);
}
.home__empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

/* FAB */
.fab {
  position: fixed;
  bottom: 28px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: var(--glass-border);
  background: var(--glass-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  color: var(--text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 30;
  box-shadow: 0 8px 24px rgba(0,0,0,0.3);
  transition: all 0.2s;
}
.fab:active {
  transform: scale(0.92);
  background: rgba(255,255,255,0.12);
}
</style>
