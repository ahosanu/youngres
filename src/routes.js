import LoginPage from "@/components/pages/LoginPage";
import Header from "@/components/Header/Header";
import LoginInfo from "@/components/Header/LoginInfo";
import MainSection from "@/components/MainSection";
import VueRouter from "vue-router";
//import store from './store'
import Home from "@/components/pages/Home";
import VideoGameSelection from "@/components/pages/VideoGameSelection";
import ViewComponent from "@/components/ViewComponent";
import MicroAnalysis from "@/components/pages/MicroAnalysis";
import EventView from "@/components/pages/EventView";
import ChapterInfo from "@/components/pages/ChapterInfo";

export default new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/login',
            components: {
                default: LoginPage,
                header: Header,
            },
            name: 'loginPage'
        },
        {
            path: '/main',
            components: {
                header: Header,
                default: MainSection,
                'header-login-info': LoginInfo,
            }/*,
            beforeEnter (to, from, next) {
               if(store.getters.isAuthenticated)
                    next();
               else {
                   console.log('login execute')
                   next('/login')

               }
            }*/,
            children: [
                {
                    path: '',
                    component:  Home,
                },
                {
                    path: ':type/VideoGameSelection',
                    component:  ViewComponent,
                    children: [
                        {
                            path: '',
                            component:  VideoGameSelection,
                        },
                        {
                            path: ':game/:chapter/:version/ChapterInfo',
                            component: ChapterInfo,
                        },
                        {
                            path: ':game/:chapter/:version/MicroAnalysis',
                            component: ViewComponent,
                            children: [
                                {
                                    path: '',
                                    component:  MicroAnalysis,
                                },
                                {
                                    path: ':event/:choice/EventView',
                                    component:  EventView,
                                }
                            ]
                        }
                    ]
                }
            ]


        },
        {
            path: '*', redirect: '/login'
        }
    ]
});
