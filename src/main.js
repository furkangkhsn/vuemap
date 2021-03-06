import Vue from 'vue';
import App from './App.vue';
import * as Maps from "vue2-google-maps";
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTrash, faCogs, faDrawPolygon, faPlus, faBackward, faForward, faTimesCircle, faCheckCircle, faSave, faLocationArrow, faClock, faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
library.add(faTrash, faCogs, faDrawPolygon, faPlus, faBackward, faForward, faTimesCircle, faCheckCircle, faSave, faLocationArrow, faClock, faSyncAlt);

Vue.component('fi', FontAwesomeIcon);

Vue.config.productionTip = false

Vue.use(Maps, {
  load: {
    key: "AIzaSyCQcAAYcxP6HtJ8vZNrIRbKwfLHUbx0QdM",
    libraries: "places" // necessary for places input
  }
});

window.v = new Vue({
  render: h => h(App),
}).$mount("#app");