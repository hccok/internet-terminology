import { ref } from 'vue'

const STORAGE_KEY = 'it-terms-user-terms'

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

const userTerms = ref(load())
let idCounter = 0

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(userTerms.value))
}

function nextId() {
  idCounter++
  return -(Date.now() + idCounter)
}

export function useUserTerms() {
  function add(termData) {
    const term = {
      ...termData,
      id: nextId(),
      fromUser: true,
      aliases: termData.aliases || [],
      related: termData.related || []
    }
    userTerms.value.push(term)
    save()
    return term
  }

  function update(id, data) {
    const idx = userTerms.value.findIndex(t => t.id === id)
    if (idx >= 0) {
      userTerms.value[idx] = {
        ...userTerms.value[idx],
        ...data,
        id,
        fromUser: true,
        aliases: data.aliases || userTerms.value[idx].aliases,
        related: data.related || userTerms.value[idx].related
      }
      save()
    }
  }

  function remove(id) {
    userTerms.value = userTerms.value.filter(t => t.id !== id)
    save()
  }

  return { userTerms, add, update, remove }
}

export function getUserTerms() {
  return userTerms.value
}
