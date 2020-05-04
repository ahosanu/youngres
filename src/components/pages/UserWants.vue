<template>
    <div class="container">
        <div class="content">
            <p>You have selected:</p>
            <div class="row offset-1">
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
            </div>
            <br/>
            <p>
                Now, you can filter the events you want to visualize:
            </p>
            <div>
                <div class="custom-control custom-radio">
                    <input type="radio" id="customRadio1" name="customRadio" class="custom-control-input">
                    <label class="custom-control-label" for="customRadio1">Show only multi-choice events</label>
                </div>
                <div class="custom-control custom-radio">
                    <input type="radio" id="customRadio2" name="customRadio" class="custom-control-input">
                    <label class="custom-control-label" for="customRadio2">Show temporal events</label>
                </div>
                <div class="custom-control custom-radio">
                    <input type="radio" id="customRadio3" name="customRadio" class="custom-control-input">
                    <label class="custom-control-label" for="customRadio3">Select a specific event</label>
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
