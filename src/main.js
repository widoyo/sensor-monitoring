// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import SuiVue from 'semantic-ui-vue'
import Moment from 'vue-moment'
import VueHighcharts from 'vue-highcharts'
import App from './App'
import router from './router'

Vue.config.productionTip = false
Vue.use(SuiVue)
Vue.use(VueHighcharts)
Vue.use(Moment)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
