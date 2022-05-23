import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Loader from '@moreillon/vue_loader'

Vue.use(VueAxios, axios)

Vue.config.productionTip = false

Vue.component('Loader', Loader)


// icons
import HomeIcon from 'vue-material-design-icons/Home.vue'
import AccountMultipleIcon from 'vue-material-design-icons/AccountMultiple.vue'
import PluseIcon from 'vue-material-design-icons/Plus.vue'
import AccountIcon from 'vue-material-design-icons/Account.vue'
import InformationOutlineIcon from 'vue-material-design-icons/InformationOutline.vue'
import DeleteIcon from 'vue-material-design-icons/Delete.vue'
import vuetify from './plugins/vuetify'
import i18n from './i18n'

Vue.component('home-icon', HomeIcon)
Vue.component('account-multiple-icon', AccountMultipleIcon)
Vue.component('plus-icon', PluseIcon)
Vue.component('account-icon', AccountIcon)
Vue.component('information-outline-icon', InformationOutlineIcon)
Vue.component('delete-icon', DeleteIcon)

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: h => h(App)
}).$mount('#app')
