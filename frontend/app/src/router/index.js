import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Calender from '../views/Calender.vue'
import Timetable from '../views/Timetable.vue'
import UnitCounter from '../views/UnitCounter.vue'
import Settings from '../views/Settings.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path: '/', name: 'Home', component: Home},
    {path: '/login', name: 'Login', component: Login},
    {path: '/calender', name: 'Calender', component: Calender},
    {path: '/timetable', name: 'Timetable', component: Timetable},
    {path: '/unitcounter', name: 'UnitCounter', component: UnitCounter},
    {path: '/settings', name: 'Settings', component: Settings},
  ]
})

export default router
