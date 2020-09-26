<template>
    <div class="container">
      <div class="loading" v-if="loading">
        <div class="centerScreen">
          <div class="spinner-grow text-dark" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
      </div>
        <div class="content">
            <div class="main-content">
            <div style="margin-bottom: 30px;">
                This is the information regarding:

                <select class="custom-select col-3" v-model="game" @change="selectedGame()">
                    <option v-for="item in gameList" :value="item" :key="item.gameCode">{{item.gameCode}}</option>
                </select>

                <select class="custom-select col-3" v-model="chapter" @change="loadChapterInfo()" style="margin-left: 10px;">
                    <option v-for="item in chapters" :key="item">{{item}}</option>
                </select>
            </div>
            <div class="row">
                <div class="col-4">
                    <img :src="snapshot" alt="">
                </div>
                <div class="col-8">
                    <strong>Description:</strong>
                    {{description}}
                    <strong>Highlights:</strong>
                    <ul>
                      <li v-for="item in Highlights" :key="item">
                        {{item}}
                      </li>
                    </ul>
                </div>
            </div>
        </div>
            <div class="row" style="padding: 20px 0">
                <div class="col-4">
                    <button class="btn btn-primary" @click="back">Back</button>
                </div>
                <div class="col-4 text-center">
                    <button class="btn btn-primary" @click="home">Home</button>
                </div>
            </div>
        </div>


    </div>
</template>

<script>
    import axios from "axios";
    export default {

        data: function(){
            return {
                type: null,
                game: null,
                version: null,
                chapter: null,
                chapters: [],
                gameList: [],
                Highlights: [],
                result: null,
                description: "",
                snapshot: "",
                loading: true,
                result_game: null,
            }
        },
        mounted() {


            axios.get('descriptions/games')
              .then(res => {
                this.result_game = JSON.parse(res.request.response).games;
                this.gameList = this.result_game;

                this.gameList.filter(item => {
                  if (item.gameCode === this.$route.params.game) {
                    this.game = item;
                    this.chapters = item.chapters;
                    this.chapter = this.$route.params.chapter;
                    return true;
                  }
                  this.loadChapterInfo();
                });

              });


        },
        methods:{
            home(){
                this.$router.push('/main');
            },
            back(){
                this.$router.push('/main/single/VideoGameSelection/');
            },
            selectedGame(){
                this.chapters = this.game.chapters;
                this.chapter = this.chapters[0];
                this.loadChapterInfo();
            },
            loadChapterInfo(){
              this.loading = true;
              axios.get('descriptions/chapter?gameCode='+this.game+'&gameVersion='+this.$route.params.version+'&chapterCode='+this.chapter)
                  .then(response => {
                    this.result = JSON.parse(response.request.response);
                    this.Highlights = this.result.highlights;
                    this.description = this.result.chapterDescription;
                    this.snapshot = this.result.snapshot;

                    this.loading = false;
                  });
            }
    }

    }
</script>

<style scoped lang="scss">
    .btn-primary{
        padding: 4px 19px;
        background: #e35219;
        border: 0;
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
    .content{
        margin: 50px 0;
        img{
            width: 100%;
        }
    }
    .main-content{
      min-height: 500px;
    }
</style>
