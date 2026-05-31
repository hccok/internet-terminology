import terms from '@/data/terms.json'
import { getUserTerms } from './userTerms'

function getAllTerms() {
  return [...terms, ...getUserTerms()]
}

export function searchTerms(query) {
  if (!query || !query.trim()) return []

  const q = query.trim().toLowerCase()
  const result = []

  for (const term of getAllTerms()) {
    let score = 0

    // exact match
    if (term.term.toLowerCase() === q) score += 100
    // term starts with
    if (term.term.toLowerCase().startsWith(q)) score += 50
    // term contains
    if (term.term.toLowerCase().includes(q)) score += 30
    // fullName match
    if (term.fullName && term.fullName.toLowerCase().includes(q)) score += 25
    // meaning match
    if (term.meaning.toLowerCase().includes(q)) score += 15
    // alias match
    if (term.aliases && term.aliases.some(a => a.toLowerCase() === q)) score += 100
    if (term.aliases && term.aliases.some(a => a.toLowerCase().startsWith(q))) score += 50
    if (term.aliases && term.aliases.some(a => a.toLowerCase().includes(q))) score += 20
    // category match
    if (term.category.includes(q)) score += 10

    // fuzzy: strip spaces
    const compact = q.replace(/\s+/g, '')
    if (term.term.toLowerCase().replace(/\s+/g, '').includes(compact)) score += 20

    if (score > 0) {
      result.push({ ...term, score })
    }
  }

  result.sort((a, b) => b.score - a.score)
  return result
}

export function getTermsByCategory(category) {
  if (!category || category === '全部') return getAllTerms()
  return getAllTerms().filter(t => t.category === category)
}

const CATEGORY_ORDER = [
  '日常聊天缩写',
  '商务邮件缩写',
  '编程开发',
  '职场汇报术语',
  '外贸电商'
]

export function getCategories() {
  return CATEGORY_ORDER
}

export function getTermById(id) {
  return getAllTerms().find(t => t.id === Number(id)) || null
}

export function getRelatedTerms(relatedSlugs) {
  if (!relatedSlugs || !relatedSlugs.length) return []
  return relatedSlugs
    .map(slug => getAllTerms().find(t => t.term === slug))
    .filter(Boolean)
}

export { getAllTerms }
