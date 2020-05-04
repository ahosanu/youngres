<template>
    <div class="container">
        <div class="content">
            <p>You have selected:</p>
            <br/>
            <div class="row">
                <div class="col-3">
                    <select class="custom-select">
                        <option selected>Videogame 1</option>
                        <option>Videogame 2</option>
                        <option>Videogame 3</option>
                        <option>Videogame 4</option>
                        <option>Videogame 5</option>
                    </select>
                </div>
                <div class="col-3">
                    <select class="custom-select" style="margin-left: 10px;">
                        <option>Chapter 1</option>
                        <option>Chapter 2</option>
                        <option>Chapter 3</option>
                        <option>Chapter 4</option>
                        <option selected>Chapter 5</option>
                    </select>
                </div>
                <div class="col-3">
                    <select class="custom-select" style="margin-left: 10px;">
                        <option selected>Multiple-choice</option>
                        <option>Temporal</option>
                        <option>A specific</option>
                    </select>
                </div>
                <div class="col-3">
                    <button class="btn btn-outline-primary">Filter</button>
                </div>
            </div>
            <br/>
            <div class="offset-2 col-7">
                <img src="@/assets/image2.png" style="width: 100%;" alt="">
            </div>
        </div>
        <div class="row">
            <div class="col-4">
                <button class="btn btn-outline-primary" @click="back">Back</button>
            </div>
            <div class="col-4 text-center">
                <button class="btn btn-outline-primary" @click="home">Home</button>
            </div>
            <div class="col-4 text-right">

                <button class="btn btn-outline-primary" @click="exportOpt">Export</button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            pageNum: {
                type: Number
            }
        } ,
        methods: {
            exportOpt(){

            },
            home(){
                this.$emit('PageNumber', 0);
            },

            back(){
                this.$emit('PageNumber', this.pageNum-1);
            }
        }
    }
</script>

<style scoped lang="scss">
    .content{
        margin: 50px 0;
    .custom-control{
        margin-top: 16px;
    }
    }
</style>
