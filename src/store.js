import Vue from 'vue'
import Vuex from 'vuex'
import router  from './routes'
import axios from "axios";
Vue.use(Vuex);


export default new Vuex.Store({
    state: {
        userName: null,
        token: null,
        alert: false,
        selectedData: [],
        games: [],
        filter: [],
        filterStudent: []
    },
    mutations: {
        logout: state => {
            state.userName = null;
            localStorage.removeItem('token');
            router.push('/');
        },
        login: (state, payload) => {

            axios.post("login", null, {
                headers: {
                    user: payload.user,
                    password: payload.password
                }
            }).then(res => {
                state.userName = 'Teacher';
                state.token = 'Bearer '+res.data.token;
                state.alert = false;
                axios.defaults.headers.common['Authorization'] = state.token;
                localStorage.setItem('token', state.token);
                router.push('/main');
            }).catch(error => {
                state.alert = true;
                console.log(error);
            });


        },
        updateSession: (state, payload) => {
            state.userName = payload.user;
            state.token = payload.token;
            axios.defaults.headers.common['Authorization'] = state.token;
        }
    },
    actions: {
        logout: ({commit}) => {
            commit('logout');
        },
        login: ({commit}, payload) => {
            commit('login', payload);
        },
        tryToLogin ({commit}) {
            const  token = localStorage.getItem('token');
            if(!token) {
                router.push('login');
                return
            }
            commit('updateSession', {user: 'Teacher', token: token});
        }
    },
    getters: {
        isAuthenticated(state) {
            return state.token !== null;
        }
    }
});
