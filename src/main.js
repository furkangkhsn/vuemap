import Vue from 'vue'
import App from './App.vue'
import * as Maps from "vue2-google-maps";

Vue.config.productionTip = false

Vue.use(Maps, {
  load: {
    key: "AIzaSyCQcAAYcxP6HtJ8vZNrIRbKwfLHUbx0QdM",
    libraries: "places" // necessary for places input
  }
});

new Vue({
  render: h => h(App),
}).$mount('#app')
