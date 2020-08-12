<template>
    <div class="container">
        <div class="content">
            <div style="margin-bottom: 30px;">
                This is the information regarding:

                <select class="custom-select col-3">
                    <option selected>Videogame 1</option>
                    <option>Videogame 2</option>
                    <option>Videogame 3</option>
                    <option>Videogame 4</option>
                    <option>Videogame 5</option>
                </select>

                <select class="custom-select col-3" style="margin-left: 10px;">
                    <option>Chapter 1</option>
                    <option>Chapter 2</option>
                    <option>Chapter 3</option>
                    <option>Chapter 4</option>
                    <option selected>Chapter 5</option>
                </select>
            </div>
            <div class="row">
                <div class="col-4">
                    <img src="@/assets/image1.png" alt="">
                </div>
                <div class="col-8">
                    <strong>Description:</strong> Here comes a description of the selected
                    chapter. Designed to <br/>
                    …..<br/>
                    ….<br/>
                    ….<br/>
                    ….<br/>
                    ….<br/>
                    ….<br/>
                    ….<br/>
                    <strong>Highlights:</strong> These highlights will be used to guide
                    teachers about the lessons of the videogame and
                    different strategies that can be followed depending on
                    the results of the students.
                </div>
            </div>

            <div class="row" style="padding: 20px 0">
                <div class="col-4">
                    <button class="btn btn-outline-primary" @click="back">Back</button>
                </div>
                <div class="col-4 text-center">
                    <button class="btn btn-outline-primary" @click="home">Home</button>
                </div>
            </div>
        </div>


    </div>
</template>

<script>
    export default {
        data: function(){
            return {
                type: null,
                game: null,
                version: null,
                chapter: null,
                chapters: [],
            }
        },
        mounted() {

            this.type = this.$route.params.type;
            this.game = this.$route.params.game;
            this.chapter = this.$route.params.chapter;
        },
        methods:{
            home(){
                this.$router.push('/main');
            },
            back(){
                this.$router.push('/main/'+this.type+'/VideoGameSelection/');
            },
        }

    }
</script>

<style scoped lang="scss">
    .content{
        margin: 50px 0;
        img{
            width: 100%;
        }
    }
</style>
