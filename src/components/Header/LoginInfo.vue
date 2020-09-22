<template>
    <div class="container">
        <div class="row">
            <div class="col-6 col-md-6">
                <img src="@/assets/logo2.png" class="logo">
            </div>
            <div class="col-6 col-md-6 content">
                Welcome, <strong>{{this.$store.state.userName}}</strong>
                <button class="btn btn-res" @click="logout"> logout</button>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapActions} from "vuex";

    export default {
        methods: mapActions([
            'logout'
        ]),
    }
</script>

<style scoped lang="scss">

    .container{
        margin-bottom: 40px;
    }
    .logo{
        width: 210px;
    }
    .content{
        align-self: center;
        text-align: right;
    .btn-res{
        border-radius: 0;
        color: #fff;
        background-color: #e35219;
        border-color: #dc3545;
        padding: 4px 16px;
        margin-left: 10px;
    }
    }
</style>
