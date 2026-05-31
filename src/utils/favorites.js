import { ref, watch } from 'vue'

const STORAGE_KEY = 'it-terms-favorites'

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

const ids = ref(load())

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids.value))
}

export function useFavorites() {
  function isFavorite(id) {
    return ids.value.includes(Number(id))
  }

  function toggle(id) {
    const nid = Number(id)
    const idx = ids.value.indexOf(nid)
    if (idx >= 0) {
      ids.value.splice(idx, 1)
    } else {
      ids.value.push(nid)
    }
    save()
    return isFavorite(nid)
  }

  function remove(id) {
    const nid = Number(id)
    const idx = ids.value.indexOf(nid)
    if (idx >= 0) {
      ids.value.splice(idx, 1)
      save()
    }
  }

  return { ids, isFavorite, toggle, remove }
}
