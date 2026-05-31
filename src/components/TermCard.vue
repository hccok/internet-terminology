<template>
  <div
    class="term-card"
    @click="goDetail"
  >
    <div class="term-card__glow" :style="{ background: `linear-gradient(135deg, ${categoryColor}, ${categoryColor}44)` }"></div>
    <div class="term-card__body">
      <div class="term-card__top">
        <div class="term-card__head">
          <span class="term-card__term">{{ term.term }}</span>
          <button
            v-if="isSpeakable(term.term)"
            class="term-card__speak"
            :class="{ 'term-card__speak--active': isSpeaking }"
            @click.stop="speakTerm"
            :aria-label="'朗读 ' + term.term"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
            </svg>
          </button>
          <span class="term-card__fullname" v-if="term.fullName">{{ term.fullName }}</span>
        </div>
        <div class="term-card__arrow">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </div>
      </div>

      <p class="term-card__meaning">{{ term.meaning }}</p>

      <div class="term-card__scene" v-if="term.scene">
        <svg class="term-card__scene-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
        </svg>
        <span>{{ term.scene }}</span>
      </div>

      <div class="term-card__footer">
        <span class="term-card__cat" :style="{ color: categoryColor }">
          {{ term.category }}
        </span>
        <span class="term-card__user-badge" v-if="term.fromUser">用户贡献</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useSpeech } from '@/utils/speech'

const props = defineProps({
  term: { type: Object, required: true },
  categoryColor: { type: String, default: '#60a5fa' }
})

const router = useRouter()
const { speak, isSpeakable, isSpeaking } = useSpeech()

function goDetail() {
  router.push({ name: 'Detail', params: { id: props.term.id } })
}

function speakTerm() {
  speak(props.term.term)
}
</script>

<style scoped>
.term-card {
  background: var(--glass-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: var(--glass-border);
  border-radius: 16px;
  margin: 0 14px 10px;
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.2s, border-color 0.2s;
}
.term-card:active {
  transform: scale(0.985);
  border-color: rgba(255,255,255,0.2);
}
.term-card__glow {
  height: 3px;
  opacity: 0.8;
}
.term-card__body {
  padding: 14px 18px 16px;
}
.term-card__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 6px;
}
.term-card__head {
  display: flex;
  align-items: baseline;
  gap: 8px;
  flex-wrap: wrap;
}
.term-card__term {
  font-size: 17px;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.3px;
}
.term-card__speak {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  transition: all 0.15s;
  flex-shrink: 0;
}
.term-card__speak:active {
  background: var(--surface-field);
  color: var(--text-secondary);
}
.term-card__speak--active {
  color: #60a5fa;
  background: rgba(96,165,250,0.15);
}
.term-card__fullname {
  font-size: 11px;
  color: var(--text-tertiary);
  font-weight: 400;
}
.term-card__arrow {
  flex-shrink: 0;
  margin-top: 2px;
  opacity: 0;
  transform: translateX(-4px);
  transition: all 0.2s;
  color: var(--text-muted);
}
.term-card:active .term-card__arrow {
  opacity: 1;
  transform: translateX(0);
}
.term-card__meaning {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.55;
  margin-bottom: 8px;
}
.term-card__scene {
  display: flex;
  gap: 6px;
  font-size: 13px;
  color: var(--text-tertiary);
  line-height: 1.6;
  background: rgba(255,255,255,0.04);
  padding: 9px 12px;
  border-radius: 10px;
  margin-bottom: 10px;
  align-items: flex-start;
  border: 1px solid rgba(255,255,255,0.05);
}
.term-card__scene-icon {
  flex-shrink: 0;
  margin-top: 2px;
  color: var(--text-muted);
}
.term-card__footer {
  display: flex;
  gap: 6px;
}
.term-card__cat {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
}
.term-card__user-badge {
  font-size: 10px;
  color: var(--text-muted);
  padding: 2px 8px;
  border-radius: 8px;
  background: rgba(96,165,250,0.1);
  border: 1px solid rgba(96,165,250,0.15);
}
</style>
