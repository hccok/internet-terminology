<template>
  <div class="contribute stars-bg">
    <div class="stars-layer stars--slow"></div>
    <div class="stars-layer stars--mid"></div>
    <div class="stars-layer stars--fast"></div>

    <!-- Nav bar -->
    <div class="contribute__nav">
      <button class="contribute__back" @click="goBack">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>
      <span class="contribute__nav-title">{{ editingId ? '编辑词条' : '贡献词条' }}</span>
      <button v-if="editingId" class="contribute__cancel" @click="resetForm">取消编辑</button>
    </div>

    <!-- Form -->
    <div class="contribute__card">
      <div class="contribute__field">
        <label class="contribute__label">词条名称 <span class="contribute__required">*</span></label>
        <input
          v-model="form.term"
          class="contribute__input"
          placeholder="例如：checkout"
          maxlength="50"
        />
      </div>

      <div class="contribute__field">
        <label class="contribute__label">全称</label>
        <input
          v-model="form.fullName"
          class="contribute__input"
          placeholder="例如：git checkout"
          maxlength="80"
        />
      </div>

      <div class="contribute__field">
        <label class="contribute__label">分类 <span class="contribute__required">*</span></label>
        <div class="contribute__cats">
          <button
            v-for="cat in categories"
            :key="cat.name"
            class="contribute__cat-btn"
            :class="{ 'contribute__cat-btn--active': form.category === cat.name }"
            :style="form.category === cat.name ? { background: cat.color + '22', borderColor: cat.color + '44', color: cat.color } : {}"
            @click="form.category = cat.name"
          >
            {{ cat.emoji }} {{ cat.name }}
          </button>
        </div>
      </div>

      <div class="contribute__field">
        <label class="contribute__label">释义 <span class="contribute__required">*</span></label>
        <textarea
          v-model="form.meaning"
          class="contribute__textarea"
          placeholder="这个词是什么意思？"
          rows="3"
          maxlength="200"
        ></textarea>
      </div>

      <div class="contribute__field">
        <label class="contribute__label">场景例句</label>
        <textarea
          v-model="form.scene"
          class="contribute__textarea"
          placeholder="用这个词造个句子"
          rows="2"
          maxlength="300"
        ></textarea>
      </div>

      <div class="contribute__field">
        <label class="contribute__label">注意事项</label>
        <textarea
          v-model="form.note"
          class="contribute__textarea"
          placeholder="有什么需要特别注意的？"
          rows="2"
          maxlength="200"
        ></textarea>
      </div>

      <div class="contribute__field">
        <label class="contribute__label">别名（逗号分隔）</label>
        <input
          v-model="form.aliasesStr"
          class="contribute__input"
          placeholder="例如：check out, co"
          maxlength="100"
        />
      </div>

      <div class="contribute__field">
        <label class="contribute__label">相关词条（逗号分隔）</label>
        <input
          v-model="form.relatedStr"
          class="contribute__input"
          placeholder="例如：branch, merge, clone"
          maxlength="100"
        />
      </div>

      <button class="contribute__submit" @click="handleSubmit" :disabled="!canSubmit">
        {{ editingId ? '更新词条' : '提交词条' }}
      </button>
    </div>

    <!-- My contributions -->
    <div class="contribute__section" v-if="userTerms.length">
      <div class="contribute__divider">
        <span class="contribute__divider-line"></span>
        <span class="contribute__divider-text">我的贡献 ({{ userTerms.length }} 条)</span>
        <span class="contribute__divider-line"></span>
      </div>

      <div class="contribute__list">
        <div
          v-for="ut in userTerms"
          :key="ut.id"
          class="contribute__item"
        >
          <div class="contribute__item-body" @click="goDetail(ut.id)">
            <span class="contribute__item-term">{{ ut.term }}</span>
            <span class="contribute__item-meaning">{{ ut.meaning }}</span>
            <span class="contribute__item-cat" :style="{ color: categoryColors[ut.category] }">{{ ut.category }}</span>
          </div>
          <div class="contribute__item-actions">
            <button class="contribute__item-btn" @click="editTerm(ut)" title="编辑">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            <button class="contribute__item-btn contribute__item-btn--del" @click="deleteTerm(ut)" title="删除">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="contribute__section" v-else-if="!editingId">
      <div class="contribute__divider">
        <span class="contribute__divider-text" style="color: var(--text-muted)">还没有贡献词条</span>
      </div>
    </div>

    <div class="safe-area-bottom" style="height: 80px"></div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserTerms } from '@/utils/userTerms'
import { getTermById, getAllTerms } from '@/utils/search'
import { showToast, showDialog } from 'vant'

defineOptions({ name: 'Contribute' })

const route = useRoute()
const router = useRouter()
const { userTerms, add, update, remove } = useUserTerms()

const categories = [
  { name: '编程开发', emoji: '💻', color: '#60a5fa' },
  { name: '外贸电商', emoji: '📦', color: '#22d3ee' },
  { name: '职场汇报术语', emoji: '📊', color: '#f472b6' },
  { name: '商务邮件缩写', emoji: '✉️', color: '#f59e0b' },
  { name: '日常聊天缩写', emoji: '💬', color: '#c084fc' }
]

const categoryColors = {
  '编程开发': '#60a5fa',
  '职场汇报术语': '#f472b6',
  '外贸电商': '#22d3ee',
  '商务邮件缩写': '#f59e0b',
  '日常聊天缩写': '#c084fc'
}

const editingId = ref(null)

const emptyForm = () => ({
  term: '',
  fullName: '',
  category: '编程开发',
  meaning: '',
  scene: '',
  note: '',
  aliasesStr: '',
  relatedStr: ''
})

const form = reactive(emptyForm())

const canSubmit = computed(() => {
  return form.term.trim() && form.category && form.meaning.trim()
})

function resetForm() {
  Object.assign(form, emptyForm())
  editingId.value = null
}

function editTerm(ut) {
  editingId.value = ut.id
  form.term = ut.term
  form.fullName = ut.fullName || ''
  form.category = ut.category
  form.meaning = ut.meaning
  form.scene = ut.scene || ''
  form.note = ut.note || ''
  form.aliasesStr = (ut.aliases || []).join(', ')
  form.relatedStr = (ut.related || []).join(', ')
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function handleSubmit() {
  if (!canSubmit.value) return

  const termText = form.term.trim()
  const duplicate = getAllTerms().find(
    t => t.term.toLowerCase() === termText.toLowerCase()
  )

  if (duplicate && !editingId.value) {
    const source = duplicate.fromUser ? '你的贡献列表' : '内置词库'
    try {
      await showDialog({
        title: '词条已存在',
        message: `「${duplicate.term}」在${source}中已存在。\n\n释义：${duplicate.meaning}\n\n确定还要添加吗？`,
        confirmButtonText: '仍然添加',
        cancelButtonText: '取消',
        showCancelButton: true
      })
    } catch {
      return
    }
  }

  const data = {
    term: termText,
    fullName: form.fullName.trim() || '',
    category: form.category,
    meaning: form.meaning.trim(),
    scene: form.scene.trim() || '',
    note: form.note.trim() || '',
    aliases: form.aliasesStr.split(',').map(s => s.trim()).filter(Boolean),
    related: form.relatedStr.split(',').map(s => s.trim()).filter(Boolean)
  }

  if (editingId.value) {
    update(editingId.value, data)
    showToast('已更新')
  } else {
    add(data)
    showToast('已添加')
  }
  resetForm()
}

async function deleteTerm(ut) {
  try {
    await showDialog({
      title: '确认删除',
      message: `确定要删除「${ut.term}」吗？删除后不可恢复。`,
      confirmButtonText: '删除',
      confirmButtonColor: '#f87171',
      cancelButtonText: '取消',
      showCancelButton: true
    })
    remove(ut.id)
    if (editingId.value === ut.id) resetForm()
    showToast('已删除')
  } catch {}
}

function goDetail(id) {
  router.push({ name: 'Detail', params: { id } })
}

function goBack() {
  if (editingId.value) {
    resetForm()
    return
  }
  router.back()
}

onMounted(() => {
  const editId = route.query.edit
  if (editId) {
    const term = getTermById(Number(editId))
    if (term && term.fromUser) {
      editTerm(term)
      router.replace({ name: 'Contribute' })
    }
  }
})
</script>

<style scoped>
.contribute {
  min-height: 100vh;
  padding-bottom: 40px;
}

/* Nav */
.contribute__nav {
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
.contribute__back {
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
.contribute__back:active { transform: scale(0.92); }
.contribute__nav-title {
  flex: 1;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}
.contribute__cancel {
  font-size: 13px;
  color: var(--text-tertiary);
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px 4px;
}

/* Card */
.contribute__card {
  margin: 12px 14px 0;
  border-radius: 22px;
  padding: 24px 20px;
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: var(--glass-border);
  position: relative;
  z-index: 1;
}

/* Fields */
.contribute__field {
  margin-bottom: 18px;
}
.contribute__label {
  display: block;
  font-size: 11px;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 1.2px;
  margin-bottom: 6px;
}
.contribute__required {
  color: #f87171;
}
.contribute__input,
.contribute__textarea {
  width: 100%;
  padding: 11px 14px;
  border-radius: 12px;
  border: 1px solid var(--surface-border);
  background: var(--surface-field);
  color: var(--text-primary);
  font-size: 15px;
  font-family: var(--font-sans);
  transition: border-color 0.2s;
  resize: vertical;
}
.contribute__input:focus,
.contribute__textarea:focus {
  outline: none;
  border-color: rgba(255,255,255,0.2);
}
.contribute__input::placeholder,
.contribute__textarea::placeholder {
  color: var(--text-muted);
}

/* Category buttons */
.contribute__cats {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.contribute__cat-btn {
  font-size: 12px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 12px;
  border: 1px solid var(--surface-border);
  background: var(--surface-field);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.15s;
}
.contribute__cat-btn:active { transform: scale(0.96); }

/* Submit */
.contribute__submit {
  width: 100%;
  margin-top: 6px;
  padding: 13px;
  border-radius: 14px;
  border: none;
  background: linear-gradient(135deg, #60a5fa, #a78bfa);
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}
.contribute__submit:active { transform: scale(0.98); opacity: 0.9; }
.contribute__submit:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

/* Section divider */
.contribute__section {
  margin: 24px 14px 0;
  position: relative;
  z-index: 1;
}
.contribute__divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}
.contribute__divider-line {
  flex: 1;
  height: 1px;
  background: rgba(255,255,255,0.06);
}
.contribute__divider-text {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-tertiary);
  white-space: nowrap;
}

/* User term list items */
.contribute__list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.contribute__item {
  display: flex;
  align-items: center;
  background: var(--glass-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: var(--glass-border);
  border-radius: 14px;
  overflow: hidden;
}
.contribute__item-body {
  flex: 1;
  padding: 14px 16px;
  cursor: pointer;
  min-width: 0;
  transition: background 0.15s;
}
.contribute__item-body:active {
  background: rgba(255,255,255,0.03);
}
.contribute__item-term {
  display: block;
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
}
.contribute__item-meaning {
  display: block;
  font-size: 13px;
  color: var(--text-secondary);
  margin-top: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.contribute__item-cat {
  display: inline-block;
  font-size: 10px;
  font-weight: 700;
  margin-top: 4px;
}
.contribute__item-actions {
  display: flex;
  gap: 2px;
  padding-right: 8px;
  flex-shrink: 0;
}
.contribute__item-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-tertiary);
  transition: all 0.15s;
}
.contribute__item-btn:active {
  background: var(--surface-field);
  color: var(--text-secondary);
}
.contribute__item-btn--del:active {
  color: #f87171;
  background: rgba(248,113,113,0.12);
}
</style>
