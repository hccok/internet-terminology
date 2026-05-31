<template>
  <div class="detail stars-bg" v-if="term">
    <div class="stars-layer stars--slow"></div>
    <div class="stars-layer stars--mid"></div>
    <div class="stars-layer stars--fast"></div>

    <!-- Nav bar -->
    <div class="detail__nav">
      <button class="detail__back" @click="goBack">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>
      <span class="detail__nav-title">词条详情</span>
      <template v-if="term.fromUser">
        <button class="detail__home" @click="editTerm" title="编辑词条" style="margin-right:4px">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
        <button class="detail__home detail__icon-btn--danger" @click="deleteTerm" title="删除词条">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
        </button>
      </template>
      <button class="detail__home" @click="goHome" title="回到首页" v-else>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      </button>
    </div>

    <div class="detail__card">
      <!-- Glow accent -->
      <div
        class="detail__glow"
        :style="{ background: `linear-gradient(135deg, ${catColor}, ${catColor}44)` }"
      ></div>

      <!-- Header -->
      <div class="detail__header">
        <div class="detail__term-row">
          <h1 class="detail__term">{{ term.term }}</h1>
          <button
            v-if="isSpeakable(term.term)"
            class="detail__icon-btn"
            :class="{ 'detail__icon-btn--speaking': isSpeaking }"
            @click="speakTerm"
            :aria-label="'朗读 ' + term.term"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
            </svg>
          </button>
          <button class="detail__icon-btn" :class="{ 'detail__icon-btn--active': isFav }" @click="toggleFav">
            <svg width="18" height="18" viewBox="0 0 24 24" :fill="isFav ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </button>
          <button class="detail__icon-btn" @click="copyTerm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
          </button>
        </div>
        <p class="detail__fullname" v-if="term.fullName">{{ term.fullName }}</p>
        <span
          class="detail__cat-badge"
          :style="{ color: catColor }"
        >
          {{ term.category }}
        </span>
      </div>

      <div class="detail__divider"></div>

      <!-- Meaning -->
      <div class="detail__section">
        <div class="detail__section-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
        </div>
        <div>
          <h3 class="detail__label">释义</h3>
          <p class="detail__meaning">{{ term.meaning }}</p>
        </div>
      </div>

      <!-- Scene -->
      <div class="detail__section">
        <div class="detail__section-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
          </svg>
        </div>
        <div style="flex:1">
          <h3 class="detail__label">场景例句</h3>
          <div class="detail__scene-box">
            <span class="detail__scene-mark">"</span>
            <p class="detail__scene-text">{{ term.scene }}</p>
            <span class="detail__scene-mark detail__scene-mark--end">"</span>
          </div>
        </div>
      </div>

      <!-- Note -->
      <div class="detail__section" v-if="term.note">
        <div class="detail__section-icon detail__section-icon--warn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f87171" stroke-width="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>
        <div>
          <h3 class="detail__label detail__label--warn">注意</h3>
          <p class="detail__note">{{ term.note }}</p>
        </div>
      </div>

      <!-- Related -->
      <div class="detail__section" v-if="relatedTerms.length">
        <div class="detail__section-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
        </div>
        <div>
          <h3 class="detail__label">相关词条</h3>
          <div class="detail__related">
            <button
              v-for="r in relatedTerms"
              :key="r.id"
              class="detail__related-chip"
              @click="goDetail(r.id)"
            >
              {{ r.term }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Share button -->
    <div class="detail__actions">
      <button class="detail__share-btn" @click="copyLink">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
        </svg>
        复制链接分享给同事
      </button>
    </div>
  </div>

  <div class="detail detail--empty stars-bg" v-else>
    <div class="stars-layer stars--slow"></div>
    <div class="stars-layer stars--mid"></div>
    <div class="detail__empty-icon">🔍</div>
    <p class="detail__empty-text">词条不存在</p>
    <button class="detail__empty-back" @click="goBack">返回首页</button>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getTermById, getRelatedTerms } from '@/utils/search'
import { useFavorites } from '@/utils/favorites'
import { useSpeech } from '@/utils/speech'
import { useUserTerms } from '@/utils/userTerms'
import { showToast, showDialog } from 'vant'

const route = useRoute()
const router = useRouter()
const { isFavorite, toggle } = useFavorites()
const { speak, isSpeakable, isSpeaking } = useSpeech()
const { remove } = useUserTerms()

const categoryColors = {
  '编程开发': '#60a5fa',
  '职场汇报术语': '#f472b6',
  '外贸电商': '#22d3ee',
  '商务邮件缩写': '#f59e0b',
  '日常聊天缩写': '#c084fc'
}

const term = computed(() => getTermById(route.params.id))
const isFav = computed(() => term.value ? isFavorite(term.value.id) : false)
const catColor = computed(() => categoryColors[term.value?.category] || '#60a5fa')

function toggleFav() {
  if (!term.value) return
  const added = toggle(term.value.id)
  showToast(added ? '已收藏' : '已取消收藏')
}

const relatedTerms = computed(() => {
  if (!term.value?.related) return []
  return getRelatedTerms(term.value.related)
})

const navStack = ref([])

function goBack() {
  if (navStack.value.length > 0) {
    const prevId = navStack.value.pop()
    router.replace({ name: 'Detail', params: { id: prevId } })
  } else {
    router.back()
  }
}
function goDetail(id) {
  if (term.value) navStack.value.push(term.value.id)
  router.replace({ name: 'Detail', params: { id } })
}
function goHome() {
  router.push({ name: 'Home' })
}
function speakTerm() {
  speak(term.value.term)
}
function editTerm() {
  router.push({ name: 'Contribute', query: { edit: term.value.id } })
}
async function deleteTerm() {
  try {
    await showDialog({
      title: '确认删除',
      message: `确定要删除「${term.value.term}」吗？删除后不可恢复。`,
      confirmButtonText: '删除',
      confirmButtonColor: '#f87171',
      cancelButtonText: '取消',
      showCancelButton: true
    })
    remove(term.value.id)
    showToast('已删除')
    router.replace({ name: 'Home' })
  } catch {}
}
async function copyTerm() {
  try { await navigator.clipboard.writeText(term.value.term); showToast('已复制') } catch {}
}
async function copyLink() {
  try {
    await navigator.clipboard.writeText(window.location.href)
    showToast('链接已复制，发给同事吧')
  } catch {
    showToast(window.location.href)
  }
}
</script>

<style scoped>
/* ===== Base ===== */
.detail {
  min-height: 100vh;
  padding: 0 0 40px;
}


/* ===== Nav ===== */
.detail__nav {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  position: sticky;
  top: 0;
  z-index: 10;
  background: rgba(15, 13, 26, 0.75);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}
.detail__back,
.detail__home {
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
  flex-shrink: 0;
}
.detail__back:active,
.detail__home:active { transform: scale(0.92); }
.detail__nav-title {
  flex: 1;
  text-align: center;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-secondary);
}

/* ===== Card ===== */
.detail__card {
  margin: 12px 14px 0;
  border-radius: 22px;
  padding: 0;
  overflow: hidden;
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: var(--glass-border);
}
.detail__glow {
  height: 5px;
  opacity: 0.9;
}
.detail__header {
  text-align: center;
  padding: 24px 22px 0;
}
.detail__term-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.detail__term {
  font-size: 34px;
  font-weight: 900;
  color: var(--text-primary);
  letter-spacing: -0.8px;
  line-height: 1.2;
}
.detail__icon-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: var(--surface-field);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-tertiary);
  transition: all 0.15s;
}
.detail__icon-btn:active { background: var(--surface-elevated); }
.detail__icon-btn--active {
  color: #fbbf24;
  background: rgba(251,191,36,0.15);
}
.detail__icon-btn--speaking {
  color: #60a5fa;
  background: rgba(96,165,250,0.15);
}
.detail__icon-btn--danger:active {
  color: #f87171;
  background: rgba(248,113,113,0.15);
}
.detail__fullname {
  font-size: 13px;
  color: var(--text-tertiary);
  margin: 4px 0 10px;
}
.detail__cat-badge {
  display: inline-block;
  font-size: 12px;
  font-weight: 700;
  padding: 4px 14px;
  border-radius: 12px;
  letter-spacing: 0.5px;
}
.detail__divider {
  height: 1px;
  background: rgba(255,255,255,0.06);
  margin: 18px 22px 0;
}

/* ===== Sections ===== */
.detail__section {
  display: flex;
  gap: 12px;
  padding: 20px 22px;
}
.detail__section:last-child { padding-bottom: 28px; }
.detail__section-icon {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: var(--surface-field);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-tertiary);
  margin-top: 1px;
}
.detail__section-icon--warn {
  background: rgba(248,113,113,0.12);
}
.detail__label {
  font-size: 11px;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-bottom: 6px;
}
.detail__label--warn { color: #f87171; }
.detail__meaning {
  font-size: 16px;
  color: var(--text-secondary);
  line-height: 1.7;
}

/* ===== Scene ===== */
.detail__scene-box {
  position: relative;
  background: rgba(255,255,255,0.04);
  border-radius: 14px;
  padding: 16px 18px;
  border: 1px solid rgba(255,255,255,0.06);
}
.detail__scene-mark {
  font-size: 28px;
  font-weight: 900;
  color: var(--text-muted);
  line-height: 1;
  font-family: var(--font-display);
}
.detail__scene-mark--end {
  display: block;
  text-align: right;
  margin-top: -4px;
}
.detail__scene-text {
  font-size: 15px;
  color: var(--text-secondary);
  line-height: 1.75;
}

/* ===== Note ===== */
.detail__note {
  font-size: 14px;
  color: #fca5a5;
  line-height: 1.65;
  background: rgba(248,113,113,0.08);
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid rgba(248,113,113,0.15);
}

/* ===== Related ===== */
.detail__related {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.detail__related-chip {
  font-size: 13px;
  font-weight: 500;
  padding: 6px 14px;
  border-radius: 16px;
  border: 1px solid var(--surface-border);
  background: var(--surface-field);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.15s;
}
.detail__related-chip:active {
  border-color: rgba(255,255,255,0.25);
  color: var(--text-primary);
  background: var(--surface-elevated);
}

/* ===== Share ===== */
.detail__actions {
  margin: 24px 14px 0;
}
.detail__share-btn {
  width: 100%;
  padding: 14px;
  border-radius: 14px;
  border: 1px solid var(--surface-border);
  background: var(--surface-elevated);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: var(--text-secondary);
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
}
.detail__share-btn:active {
  background: var(--surface-elevated);
  transform: scale(0.98);
}

/* ===== Empty ===== */
.detail--empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.detail__empty-icon {
  font-size: 56px;
  margin-bottom: 16px;
  position: relative;
  z-index: 1;
}
.detail__empty-text {
  font-size: 16px;
  color: var(--text-tertiary);
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
}
.detail__empty-back {
  padding: 10px 28px;
  border-radius: 20px;
  border: 1px solid var(--surface-border);
  background: var(--surface-elevated);
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  position: relative;
  z-index: 1;
}
</style>
