<template>
    <div class="container">
        <home-section v-if="pageNumber === 0" :pageNum='0' @PageNumber="setPageNumber($event)"></home-section>
        <videogame-chapter v-if="pageNumber === 1" :pageNum='1' @PageNumber="setPageNumber($event)"></videogame-chapter>
        <user-wants v-if="pageNumber === 2" :pageNum='2' @PageNumber="setPageNumber($event)"></user-wants>
        <chapter-info v-if="pageNumber === 1002" :pageNum='2' @PageNumber="setPageNumber($event)"></chapter-info>
        <micro-analysis v-if="pageNumber === 3" :pageNum='3' @PageNumber="setPageNumber($event)"></micro-analysis>
    </div>
</template>

<script>



    export default {
        data: function(){
            return {
                homeBtn: false,
                backBtn: false,
                nextBtn: true,
                pageNumber: 0,
                maxPageNumber: 3,

            };
        },
        methods: {
            next(){
                this.pageNumber++;
                this.homeBtn = true;
                this.backBtn = true;
                this.nextBtn = true;

                if(this.pageNumber == 0){
                    this.homeBtn = false;
                    this.backBtn = false;
                }

                if(this.pageNumber == this.maxPageNumber){
                    this.nextBtn = false;
                }




            },
            back(){
                this.pageNumber--;
                this.homeBtn = true;
                this.backBtn = true;
                this.nextBtn = true;

                if(this.pageNumber == 0){
                    this.homeBtn = false;
                    this.backBtn = false;
                }

                if(this.pageNumber == this.maxPageNumber){
                    this.nextBtn = false;
                }




            },
            home(){
                this.homeBtn = false;
                this.backBtn = false;
                this.nextBtn = true;
                this.pageNumber = 0;
            },
            setPageNumber(data){
                this.pageNumber = data;
                this.homeBtn = true;
                this.backBtn = true;
                this.nextBtn = true;

                if(this.pageNumber == 0){
                    this.homeBtn = false;
                    this.backBtn = false;
                }

                if(this.pageNumber == this.maxPageNumber){
                    this.nextBtn = false;
                }
            }

        }
    }
</script>

<style scoped lang="scss">

</style>
