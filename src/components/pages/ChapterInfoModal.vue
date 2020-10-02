<template>
  <modal name="chapter_info" :width="900" height="auto" >
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
          <div class="row">
            <div class="col-md-5">
              <img :src="snapshot" alt="">
            </div>
            <div class="col-md-7">
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
        <div style="padding: 0;  text-align: right">
            <button class="btn btn-primary" @click="close()">Close</button>
        </div>
      </div>


    </div>
  </modal>
</template>

<script>
import axios from "axios";
export default {

  data: function(){
    return {
      Highlights: [],
      description: "",
      snapshot: "",
      loading: true,
    }
  },
  mounted() {


    this.$root.$on('viewChapterInfo', (data) => {
      this.loading = true;
      axios.get('descriptions/chapter?gameCode='+data.game+'&gameVersion='+data.version+'&chapterCode='+data.chapter)
          .then(response => {
            var result = JSON.parse(response.request.response);
            this.Highlights = result.highlights;
            this.description = result.chapterDescription;
            this.snapshot = result.snapshot;
            this.loading = false;
          });

    });


  },
  methods:{
    close(){
      this.$modal.hide("chapter_info")
    }
  }

}
</script>

<style scoped lang="scss">

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
  .btn {
    border-radius: 0;
    color: #fff;
    background-color: #e35219;
    border-color: #dc3545;
    padding: 4px 16px;
    margin-left: 10px;
  }
}
.main-content{
  min-height: 300px;
}
</style>
