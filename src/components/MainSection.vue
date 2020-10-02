<template>
    <div class="container">
        <filter-view></filter-view>
        <chapter-info></chapter-info>
        <router-view></router-view>
    </div>
</template>

<script>



   // import axios from "axios";

   import filterModel from "@/components/filterModel";
   import ChapterInfoModal from "@/components/pages/ChapterInfoModal";

   export default {
        components:{
            'filter-view': filterModel,
            'chapter-info': ChapterInfoModal
        },
        data: function(){
            return {
            };
        },
        mounted(){
           /* axios.get('http://torresquevedo.eui.upm.es:8883/data/descriptions/games', { headers: { 'accept': 'application/json', 'Authorization': 'Basic c2Fyb2FyOjEyMzQ=' } })
                .then(response => {
                    console.log(response.data.games)
                    let res = response.data.filter(
                        function(data){
                            if(data.gameCode === 'G1')
                                return data
                        }
                    )
                    console.log(res)
                });*/


        },
        methods: {
        },
    }
</script>

<style scoped lang="scss">

</style>
