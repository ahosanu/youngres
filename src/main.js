import Vue from 'vue'
import App from './App.vue'
import Header from "./components/Header";

import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'

import '@/styles.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { faFacebookF } from '@fortawesome/free-brands-svg-icons';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import ButtonSection from "@/components/MainSection";
import ChapterInfo from "@/components/pages/ChapterInfo";
import Home from "@/components/pages/Home";
import VideogameAndChapter from "@/components/pages/VideogameAndChapter";
import UserWants from "@/components/pages/UserWants";
import MicroAnalysis from "@/components/pages/MicroAnalysis";



library.add( faTwitter );
library.add( faLinkedinIn );
library.add( faFacebookF  );

Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);



/*Head component*/
Vue.component('app-header', Header);

/*Button Section component*/
Vue.component('main-section', ButtonSection);


/*Page Components*/
Vue.component('chapter-info', ChapterInfo);
Vue.component('home-section', Home);
Vue.component('videogame-chapter', VideogameAndChapter);
Vue.component('user-wants', UserWants);
Vue.component('micro-analysis', MicroAnalysis);


new Vue({
  render: h => h(App),
}).$mount('#app')
