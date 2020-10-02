import LoginPage from "@/components/pages/LoginPage";
import Header from "@/components/Header/Header";
import LoginInfo from "@/components/Header/LoginInfo";
import MainSection from "@/components/MainSection";
import VueRouter from "vue-router";
//import store from './store'
import Home from "@/components/pages/Home";
import VideoGameSelection from "@/components/pages/Micro/VideoGameSelection";
import ViewComponent from "@/components/ViewComponent";
import MicroAnalysis from "@/components/pages/Micro/MicroAnalysis";
import EventView from "@/components/pages/Micro/EventView";
import MacroAnalysis from "@/components/pages/Macro/MacroAnalysis";
import GroupEventView from "@/components/pages/Macro/GroupEventView";
import VideoGameSelectionGroup from "@/components/pages/Macro/VideoGameSelectionGroup";

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
                    path: 'single/VideoGameSelection',
                    component:  ViewComponent,
                    children: [
                        {
                            path: '',
                            component:  VideoGameSelection,
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
                },
                {
                    path: 'group/VideoGameSelection',
                    component:  ViewComponent,
                    children: [
                        {
                            path: '',
                            component:  VideoGameSelectionGroup,
                        },
                        {
                            path: ':game/:chapter/:version/:groupOne/:groupTwo/MacroAnalysis',
                            component: ViewComponent,
                            children: [
                                {
                                    path: '',
                                    component:  MacroAnalysis,
                                },
                                {
                                    path: ':event/:choice/EventView',
                                    component:  GroupEventView,
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
