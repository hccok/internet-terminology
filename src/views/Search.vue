<template>
  <div class="search-page stars-bg">
    <div class="stars-layer stars--slow"></div>
    <div class="stars-layer stars--mid"></div>
    <div class="stars-layer stars--fast"></div>

    <div class="search-page__bar">
      <button class="search-page__back" @click="$router.back()">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>
      <div class="search-page__bar-input">
        <SearchBar
          :placeholder="'搜 checkout、LGTM…'"
          :autofocus="true"
          @input="onInput"
        />
      </div>
    </div>

    <div class="search-page__meta" v-if="query">
      找到 <strong>{{ results.length }}</strong> 个结果
    </div>

    <div class="search-page__list" v-if="results.length">
      <TermCard
        v-for="term in results"
        :key="term.id"
        :term="term"
        :category-color="categoryColors[term.category]"
      />
    </div>

    <div class="search-page__empty" v-if="query && !results.length">
      <div class="search-page__empty-icon">🤔</div>
      <p class="search-page__empty-title">没找到相关词条</p>
      <p class="search-page__empty-hint">试试英文、缩写、或者换个关键词</p>
    </div>

    <div class="search-page__hint" v-if="!query">
      <div class="search-page__hint-icon">⌨️</div>
      <p>输入关键词开始搜索</p>
      <div class="search-page__suggestions">
        <span class="search-page__suggest-label">试试搜：</span>
        <span class="search-page__suggest-chip" v-for="s in suggestions" :key="s" @click="quickSearch(s)">{{ s }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import SearchBar from '@/components/SearchBar.vue'
import TermCard from '@/components/TermCard.vue'
import { searchTerms } from '@/utils/search'

const route = useRoute()
const query = ref(route.query.q || '')
const results = ref([])

const categoryColors = {
  '编程开发': '#60a5fa',
  '职场汇报术语': '#f472b6',
  '外贸电商': '#22d3ee',
  '商务邮件缩写': '#f59e0b',
  '日常聊天缩写': '#c084fc'
}

const suggestions = ['LGTM', 'merge', 'PR', 'bug', '部署']

function doSearch() {
  results.value = searchTerms(query.value)
}

watch(() => route.query.q, (val) => {
  query.value = val || ''
  doSearch()
}, { immediate: true })

function onInput(val) {
  query.value = val
  if (!val.trim()) {
    results.value = []
  } else {
    doSearch()
  }
}

function quickSearch(term) {
  query.value = term
  doSearch()
}
</script>

<style scoped>
.search-page {
  padding-bottom: 40px;
  position: relative;
}

/* Nav bar */
.search-page__bar {
  position: sticky;
  top: 0;
  z-index: 10;
  background: rgba(15, 13, 26, 0.75);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  padding: 0 6px 4px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  display: flex;
  align-items: center;
  gap: 6px;
}
.search-page__back {
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
.search-page__back:active { transform: scale(0.92); }
.search-page__bar-input {
  flex: 1;
  min-width: 0;
}

/* Meta */
.search-page__meta {
  font-size: 13px;
  color: var(--text-tertiary);
  padding: 10px 16px 4px;
  position: relative;
  z-index: 1;
}
.search-page__meta strong {
  color: #60a5fa;
  font-weight: 700;
}

/* List */
.search-page__list {
  padding-top: 6px;
  position: relative;
  z-index: 1;
}

/* Empty */
.search-page__empty {
  text-align: center;
  padding: 80px 20px;
  position: relative;
  z-index: 1;
}
.search-page__empty-icon {
  font-size: 52px;
  margin-bottom: 14px;
}
.search-page__empty-title {
  font-size: 17px;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 6px;
}
.search-page__empty-hint {
  font-size: 14px;
  color: var(--text-tertiary);
}

/* Hint / suggestions */
.search-page__hint {
  text-align: center;
  padding: 80px 20px;
  color: var(--text-tertiary);
  font-size: 15px;
  position: relative;
  z-index: 1;
}
.search-page__hint-icon {
  font-size: 44px;
  margin-bottom: 12px;
}
.search-page__suggestions {
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
}
.search-page__suggest-label {
  font-size: 13px;
  color: var(--text-tertiary);
}
.search-page__suggest-chip {
  font-size: 13px;
  font-weight: 500;
  padding: 5px 12px;
  border-radius: 14px;
  background: var(--surface-field);
  color: var(--text-secondary);
  border: 1px solid var(--surface-border);
  cursor: pointer;
  transition: all 0.15s;
}
.search-page__suggest-chip:active {
  background: rgba(96,165,250,0.2);
  color: #fff;
  border-color: rgba(96,165,250,0.35);
}
</style>
