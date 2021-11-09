import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueQrcodeReader from "vue-qrcode-reader";
import { initializeApp } from "firebase/app";
import vuetify from './plugins/vuetify'

const firebaseConfig = {
  apiKey: "AIzaSyD3trUUi_cll4AcWAVCGfvQeReZoyORkfA",
  authDomain: "test-7b568.firebaseapp.com",
  databaseURL: "https://test-7b568-default-rtdb.firebaseio.com",
  projectId: "test-7b568",
  storageBucket: "test-7b568.appspot.com",
  messagingSenderId: "953934075140",
  appId: "1:953934075140:web:f327e0b806d9cca2e16c51"
};
initializeApp(firebaseConfig);

Vue.use(VueQrcodeReader);



Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

//https://spreadsheets.google.com/feeds/list/2PACX-1vTFnvUJEBYc_Tltfyv68OtgOJL-A4xVPhWS9RSMXIFxryZ_8mjOoCaf3xOiWyVPFB2_Nzefoz2F7LRh/1/public/values?alt=json