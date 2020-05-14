<template>
    <div class="container">

        <modal name="filter" :width="900" height="auto">
            <p style="text-align: center; padding: 20px; font-weight: bold;">Filter</p>
            <div class="row">
                <div class="col-4">

                    <p style="text-align: center">
                        <input type="checkbox" > Group
                    </p>

                    <div class="group" style="padding: 0">
                        <div class="group">
                            <p>
                                <input type="checkbox" > Country
                            </p>
                            <select>
                                <option>Span1</option>
                                <option>Span1</option>
                                <option>Span1</option>
                            </select>

                            <p>
                                <input type="checkbox" > City
                            </p>
                            <select>
                                <option>Span1</option>
                                <option>Span1</option>
                                <option>Span1</option>
                            </select>
                        </div>
                        <p style="text-align: center">
                            <input type="checkbox" > Specific Groups
                        </p>
                        <div class="group">
                            <p>
                                <input type="checkbox" > ID 1
                            </p>
                            <p>
                                <input type="checkbox" > ID 2
                            </p>
                            <p>
                                <input type="checkbox" > ID 3
                            </p>
                            <button class="btn btn-info" style="margin-right: 3px">Unselect All</button>
                            <button class="btn btn-info">Select All</button>
                        </div>

                    </div>

                </div>
                <div class="col-4">
                    <p style="text-align: center">
                        <input type="checkbox" > Student
                    </p>

                    <div class="group">
                        <p>
                            <input type="checkbox" > Age
                        </p>
                        <p>
                            Min <input type="text" style="width: 30px">
                            Max <input type="text" style="width: 30px">
                        </p>
                        <p>
                            <input type="checkbox" > Gender
                        </p>

                        <select>
                            <option>Male</option>
                            <option>Female</option>
                        </select>

                    </div>
                </div>
                <div class="col-4">
                    <p style="text-align: center">
                        <input type="checkbox" > Test
                    </p>

                    <div class="group">
                        <p>
                            <input type="checkbox" >
                        </p>
                        <select>
                            <option>Span1</option>
                            <option>Span1</option>
                            <option>Span1</option>
                        </select>

                        <p>
                            <input type="checkbox" >
                        </p>
                        <select>
                            <option>Span1</option>
                            <option>Span1</option>
                            <option>Span1</option>
                        </select>

                    </div>
                </div>
            </div>
        </modal>
        <router-view></router-view>
    </div>
</template>

<script>



   // import axios from "axios";

    export default {
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
    .group{
        border: 1px solid gray;
        margin: 10px;
        padding: 10px;
        p{
            padding: 10px 0;
            margin: 0;
        }
    }
</style>
