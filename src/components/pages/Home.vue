<template>
    <div class="content">
        <p>Please, select the type of analysis you want to perform:</p>
        <div>
            <div class="custom-control custom-radio">
                <input type="radio" id="customRadio1" name="customRadio" class="custom-control-input">
                <label class="custom-control-label" for="customRadio1">Micro analysis (single group)</label>
            </div>
            <div class="custom-control custom-radio">
                <input type="radio" id="customRadio2" name="customRadio" class="custom-control-input">
                <label class="custom-control-label" for="customRadio2">Macro analysis (two groups)</label>
            </div>
        </div>
        <div class="row">
            <div class="col-4">
            </div>
            <div class="col-4 text-center">
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
