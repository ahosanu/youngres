<template>
    <div class="content">
        <div class="loading" v-if="loading">
            <div class="centerScreen">
                <div class="spinner-grow text-dark" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
            </div>
        </div>
        <div class="row main-content">
            <div class="col-8">
                <p class="title">Please select a Video Game and Chapter:</p>
                <div class="row">

                    <div class=" col-4">
                        <select class="custom-select" @change="selectGame($event)">
                            <option v-for="(item, index) in result" :key="index" :value="index">{{item.gameCode}} </option>
                        </select>
                    </div>
                    <div class="col-4">
                        <select class="custom-select"  @change="selectChapter($event)">
                            <option v-for="(item, index) in chapter" :key="index" :value="item">{{item}} </option>
                        </select>
                    </div>
                    <div class="col-4">
                       <button class="btn btn-dark" @click="chapterInfo()">View Chapter Info</button>
                    </div>
                </div>

                <!--<p style="margin-top: 10px;">Please select Option filter:</p>
                <div>
                    <div class="content">
                        <div class="row offset-3">

                            <div class="col-3">
                                <button class="btn btn-dark">Filter</button>
                            </div>
                        </div>
                    </div>
                </div>-->
                <!--<p style="margin-top: 10px;">filter the events you want to visualize:</p>-->
            </div>
            <div class="col-4">
                <strong>Game Description: </strong> {{description}}
                <br>
                <br>
                <br>
                <br>
                <strong>Players Info: </strong>
                <br>
                Number of Students Played: {{NumPlay}}
                <br>
              <strong>Participated Countries:</strong>
              <ol><li v-for="(item, index) in country" :key="index">{{item}}</li></ol>
            </div>
        </div>
        <!--<div class="row m-3">
            <div class="col-4">
                <div class="custom-control custom-radio">
                    <input type="radio" id="customRadio1" name="customRadio" class="custom-control-input">
                    <label class="custom-control-label" for="customRadio1">Show only multi-choice events</label>
                </div>
            </div>
            <div class="col-4">

                <div class="custom-control custom-radio">
                    <input type="radio" id="customRadio2" name="customRadio" class="custom-control-input">
                    <label class="custom-control-label" for="customRadio2">Show temporal events</label>
                </div>
            </div>
            <div class="col-4">

                <div class="custom-control custom-radio">
                    <input type="radio" id="customRadio3" name="customRadio" class="custom-control-input">
                    <label class="custom-control-label" for="customRadio3">Show specific event</label>
                </div>
            </div>
        </div>-->
        <div class="row" style="padding: 20px 0">
            <div class="col-4">
                <button class="btn btn-primary" @click="back">Back</button>
            </div>
            <div class="col-4 text-center">
                <button class="btn btn-primary" @click="home">Home</button>
            </div>
            <div class="col-4 text-right">

                <button class="btn btn-primary" @click="next">Next</button>
            </div>
        </div>
    </div>
</template>

<script>

    import  axios from "axios";
    axios.defaults.headers.common['access-control-allow-origin'] = '*';
    export default {
        data: function(){
            return {
                loading: true,
                result: [], //all data in the variable
                country: null, //country
                flag: [], //all flags
                chapter:[],
                description: null,
                NumPlay: 0,
                events: [],
                selectedChapter: '',
                selectedGame: '',
                selectedGameVersion: '',
            };
        },
        mounted () {

            //Get User ALl events druing initial load

          axios.get('descriptions/games?limit=20')
              .then(res => {
                this.result = JSON.parse(res.request.response).games;
                this.$store.state.selectedData = this.result;
                this.loading = false;
                if(this.result.length > 0){
                  this.loadGameData(0);
                }
              });


        },
        methods: {
            next(){
              this.$router.push('/main/single/VideoGameSelection/'+this.selectedGame+'/'+this.selectedChapter+'/'+ this.selectedGameVersion +'/MicroAnalysis');
            },
            chapterInfo(){

              this.$root.$emit('viewChapterInfo', {
                game: this.selectedGame,
                version: this.selectedGameVersion,
                chapter: this.selectedChapter
              });
              this.$modal.show("chapter_info");
               // this.$router.push('/main/single/VideoGameSelection/'+this.selectedGame+'/'+this.selectedChapter+'/'+ this.selectedGameVersion +'/ChapterInfo');

            },

            home(){
                this.$router.push('/main');
            },

            back(){
                this.$router.push('/main');
            },
            selectChapter(event){
                this.selectedChapter = event.target.value;
            }
            ,
            selectGame(event){
                this.loadGameData(event.target.value);
            },
            loadGameData(index){

                this.description = this.result[index].gameDescription;
                this.selectedGame = this.result[index].gameCode;
                this.NumPlay = this.result[index].numberPlayers;
                this.chapter = this.result[index].chapters;
                this.selectedGameVersion = this.result[index].gameVersion;
                this.selectedChapter = this.chapter[0];
                this.country = this.result[index].countries;
/*                var listCountry =this.result[index].contries;
this.flag = [];
                for(var item in listCountry){
                    var name = listCountry[item].trim().toLocaleLowerCase();

                    axios.get('https://restcountries.eu/rest/v2/name/'+name).then(
                        res => {
                            var list = JSON.parse(res.request.response);
                            this.flag.push(list[0]);
                        }

                    );
                }*/
            }
        }
    }
</script>

<style scoped lang="scss">
    .flags{
        width: 50px;
        margin-right: 5px;
    }
    .loading {
        position: fixed;
        top: 0;
        left: 0;
        background: #0000003d;
        height: 100%;
        width: 100%;
        z-index: 99999;
        .centerScreen {
            position: fixed;
            width: 100%;
            transform: translate(50%, 50%);
            height: 100%;
            margin-left: -2.5rem;
            margin-top: -2.5rem;

            .spinner-grow {
                width: 5rem;
                height: 5rem;
            }

            .text-dark {
                color: #e35219 !important;
            }
        }
    }
    .custom-select{
        text-transform: capitalize;
        font-weight: bold;
    }
    .main-content{
        min-height: 500px;
    }

    .title{
      font-weight: bold;
      font-size: 18px;
      color: #e35219;
    }

    .btn-primary{
        padding: 4px 19px;
        background: #e35219;
        border: 0;
    }
</style>
