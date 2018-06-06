import Vue from 'vue'
import Router from 'vue-router'
import SensorWorld from '@/components/SensorWorld'
import SensorShow from '@/components/SensorSingle'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'SensorWorld',
      component: SensorWorld
    },
    {
      path: '/:id',
      name: 'SensorShow',
      component: SensorShow
    }
  ]
})
