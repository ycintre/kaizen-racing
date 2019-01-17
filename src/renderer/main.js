import 'material-design-icons/iconfont/material-icons.css'
import 'typeface-roboto/index.css'
import Vue from 'vue';

import VueMaterial from 'vue-material';
import 'vue-material/dist/theme/default-dark.css';
import 'vue-material/dist/vue-material.min.css';

import App from './App';
import router from './router';

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.config.productionTip = false;
Vue.use(VueMaterial);

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  template: '<App/>'
}).$mount('#app');
