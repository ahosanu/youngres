<template>
    <div class="container text-center">
        <img src="@/assets/logo2.png" class="logo">
        <p>Please, log into the system:</p>
            <div class="alert alert-danger" v-if="this.$store.state.alert" role="alert">
               Wrong User & Password!
            </div>
            <form onsubmit="return false">
            <div class="m-3">User: <input type="text" v-model="userName"></div>
            <div class="m-3">Password: <input type="password" v-model="password" size="15"></div>


            <button type="submit" @click="login()" class="btn btn-res">Login</button>
            </form>
    </div>
</template>

<script>
    export default {
        data: function () {
            return {
                userName: '',
                password: '',
            };
        },
        methods: {
            login(){

              this.$store.dispatch('login', {user: this.userName, password: this.password});

            }
        }
    }
</script>

<style scoped lang="scss">
    .logo{
        width: 210px;
    }

    .btn-res{
        border-radius: 0;
        color: #fff;
        background-color: #e35219;
        border-color: #dc3545;
        padding: 4px 16px;
        margin-left: 10px;
    }
</style>
