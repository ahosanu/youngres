<template>
    <div class="row">
        <div class="col-4">
            <button class="btn btn-outline-primary" v-if="$route.path !== '/main'" @click="back">Back</button>
        </div>
        <div class="col-4 text-center">
            <button class="btn btn-outline-primary" v-if="$route.path !== '/main'" @click="home">Home</button>
        </div>
        <div class="col-4 text-center" >
            <button class="btn btn-outline-primary"  @click="next">Next</button>
        </div>
    </div>
</template>

<script>
    import router from "@/routes";

    export default {
        methods: {

            home(){
                router.push('/main');
            },

            back(){
                router.back();
            },
            next() {

            }
        }
    }
</script>

<style scoped>
    .row{
        padding: 30px 0;
    }
</style>
