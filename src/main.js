import 'babel-polyfill';
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import fastclick from 'fastclick';
import VueLazyLoad from 'vue-lazyload';
import VueClipboard from 'vue-clipboard2';
import 'common/js/validate';
/* eslint-disable no-unused-vars */
// import vConsole from 'vconsole';

import 'common/scss/index.scss';

fastclick.attach(document.body);

Vue.use(VueLazyLoad, {
  loading: require('common/image/default.png')
});
Vue.use(VueClipboard);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});
