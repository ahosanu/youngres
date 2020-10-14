import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import Header from "./components/Header/Header";
import VModal from 'vue-js-modal'
import axios from "axios";
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'

import '@/styles.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { faFacebookF } from '@fortawesome/free-brands-svg-icons';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import ButtonSection from "@/components/MainSection";
import Home from "@/components/pages/Home";
import VideogameAndChapter from "@/components/pages/VideogameAndChapter";
import UserWants from "@/components/pages/UserWants";
import MicroAnalysis from "@/components/pages/Micro/MicroAnalysis";
import VideoGameSelection from "@/components/pages/Micro/VideoGameSelection";
import LoginPage from "@/components/pages/LoginPage";
import EventView from "@/components/pages/Micro/EventView";

import router from './routes';
import store from './store';


axios.defaults.baseURL = 'http://138.100.158.35:8883/data/';
axios.defaults.headers.get['accept'] = 'application/json';
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

library.add( faTwitter );
library.add( faLinkedinIn );
library.add( faFacebookF  );
library.add( faTimes  );

Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.use(VueRouter);

//Vue.use(VModal);
Vue.use(VModal, { dynamic: true, dynamicDefaults: { clickToClose: false } })

/*Head component*/
Vue.component('app-header', Header);

/*Button Section component*/
Vue.component('main-section', ButtonSection);


/*Page Components*/
Vue.component('home-section', Home);
Vue.component('videogame-chapter', VideogameAndChapter);
Vue.component('user-wants', UserWants);
Vue.component('micro-analysis', MicroAnalysis);
Vue.component('video-game-section', VideoGameSelection);
Vue.component('login', LoginPage);
Vue.component('event-view', EventView);


new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App),
});
