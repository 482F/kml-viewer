import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import Utils from '482-vue-utils'

Vue.config.productionTip = false

Vue.use(Utils.Plugins)

new Vue({
  vuetify,
  render: (h) => h(App),
}).$mount('#app')
