<template>
    <div class="content">
        <p>In order to analyze one group, you have to select the videogame first:</p>
        <div class="offset-3 col-4">
            <select class="custom-select">
                <option selected>Videogame 1</option>
                <option>Videogame 2</option>
                <option>Videogame 3</option>
                <option>Videogame 4</option>
                <option>Videogame 5</option>
            </select>
        </div>
        <p style="margin-top: 10px;">Please, select the chapter you want to analyse:</p>
        <div>
           <div class="content">
               <div class="row offset-3">
                   <div class="col-3">
                       <select class="custom-select">
                           <option>Chapter 1</option>
                           <option>Chapter 2</option>
                           <option>Chapter 3</option>
                           <option>Chapter 4</option>
                           <option selected>Chapter 5</option>
                       </select>
                   </div>
                   <div class="col-3">
                       <button class="btn btn-dark" @click="chapter_info">Show Chapter info</button>
                   </div>
               </div>
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

                <button class="btn btn-outline-primary" @click="next">Next</button>
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
        },
        methods: {
            next(){
                this.$emit('PageNumber', this.pageNum+1);
            },

            home(){
                this.$emit('PageNumber', 0);
            },

            back(){
                this.$emit('PageNumber', this.pageNum-1);
            },
            chapter_info(){
                this.$emit('PageNumber', 1002);
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
