import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Search from '../views/Search.vue'
import Detail from '../views/Detail.vue'
import Favorites from '../views/Favorites.vue'
import Contribute from '../views/Contribute.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/search', name: 'Search', component: Search },
  { path: '/detail/:id', name: 'Detail', component: Detail },
  { path: '/favorites', name: 'Favorites', component: Favorites },
  { path: '/contribute', name: 'Contribute', component: Contribute }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
