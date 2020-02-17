import Vue from 'vue'
import App from './App.vue'
import router from './router'
import iview from "view-design";
import "view-design/dist/styles/iview.css";
import api from './api'

import VueMeta from 'vue-meta';

Vue.config.productionTip = false

Vue.use(iview);
Vue.use(api);
Vue.use(VueMeta);

new Vue({
  el: '#app',
  router,
  render: h => h(App)
});
