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
      <p class="title">You have selected:</p>
      <div class="row">
        <div class="col-3">
          <select class="custom-select" v-model="chapter" style="margin-left: 10px;" @change="changeChapter($event)">
            <option v-for="(item, index) in chapters" :key="index" :value="item">{{item}} </option>
          </select>
        </div>
        <div class="col-3">
          <select class="custom-select" v-if="choice === 'choice'" v-model="gameevent" style="margin-left: 10px;" @change="changeEvent($event)">
            <option v-for="(item, index) in distinct_event" :key="index" :value="item">{{item}} </option>
          </select>

          <select class="custom-select" v-if="choice === 'timed'" v-model="gameevent" style="margin-left: 10px;" @change="changeEvent($event)">
            <option v-for="(item, index) in distinct_event_temp" :key="index" :value="item">{{item}} </option>
          </select>
        </div>
        <!--<div class="col-3">
            <button class="btn btn-outline-primary">Filter</button>
        </div>-->
      </div>
      <br/>
      <div class="row">
        <div class="col-7">
          <v-chart :options="chartData"/>
        </div>
        <div class="col-5">
          <strong>{{gameevent}}:</strong>
          <p>{{description}}</p>



          <strong>Highlights:</strong>
          <p v-for="(item, index) in this.highlights" :key="index">{{item}}</p>

          <span v-if="choice === 'choice'">
             <strong>Possible Choices:</strong>
          <ul>
            <li v-for="item in possibleChoices" :key="item">
              {{item}}
            </li>
          </ul>
            <strong>Student selected decision:</strong>
                    <br/>
                    <div class="ans" v-for="(item,index, key) in AnswerList" :key="key">
                        <p>- Answer 1: “{{item.name}}”.</p>
                        <p>{{groupOne}} Selected by: {{item.percent}}%</p>
                        <p>{{groupTwo}} Selected by: {{item.percent}}%</p>
                    </div>
                    </span>
          <span v-if="choice === 'timed'">
                    <strong>Statistics:</strong>

                    <div class="ans">
                        <p>Mean: {{mean_val}} secs.</p>
                        <p>Std: {{std}}  secs.</p>
                    </div>
                    </span>
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
      <div class="col-4 text-right">

        <button class="btn btn-primary export" @click="exportOpt">Export</button>
      </div>
    </div>
  </div>
</template>

<script>
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import 'echarts-gl'
import axios from "axios";

export default {
  components: {
    'v-chart': ECharts
  },
  data: function() {

    return {
      result: null,
      description: null,
      highlights: [],
      Answers: [],
      Answers_tmp: [],
      chartData: null,
      loading: true,
      chapters: [],
      choice: null,
      decisions: [],
      distinct_event: [],
      distinct_event_temp: [],
      unique_decision_final:[],
      unique_decision_final_temp:[],
      game: null,
      version: null,
      chapter: null,
      gameevent: null,
      chartDATA: [],
      AnswerList: [],
      mean_val: 0,
      std: 0,
      groupOne: null,
      groupTwo: null,
      possibleChoice: [],
    };
  },
  mounted(){

    this.game = this.$route.params.game;
    this.gameevent = this.$route.params.event;
    this.chapter = this.$route.params.chapter;
    this.choice = this.$route.params.choice;
    this.version = this.$route.params.version;



    this.groupOne = this.$route.params.groupOne;
    this.groupTwo = this.$route.params.groupTwo;


    axios.get('descriptions/games')
        .then(resx => {
          this.$store.state.games = JSON.parse(resx.request.response).games;

          let key = this.game;
          this.result = this.$store.state.games;
          let res = this.result.filter(
              function(data){
                if(data.gameCode === key)
                  return data
              }
          );
          if(res.length > 0){
            res = res[0];
            this.chapters = res.chapters;
            this.version = res.gameVersion;
          }


          this.loadData();

          this.loading = false;
        });



  },
  methods: {
    exportOpt(){
      window.print();
    },
    changeChapter(event){
      this.chapter = event.target.value;
      this.loadData();
    },
    changeEvent(event){
      this.gameevent = event.target.value;
      this.loadEvent();
    },
    loadData(){
      this.loading = true;



      axios.get("decision?gameCode="+this.game+"&gameVersion="+this.version+"&chapterCode="+this.chapter).then(res => {
        this.decisions = JSON.parse(res.request.response);

        this.dataAnalysis();

        axios.get("descriptions/event").then(resd => {
          this.result = JSON.parse(resd.request.response);
          this.highlights = this.result.highlights;
          this.description = this.result.eventDescription;
          this.possibleChoices = this.result.possibleChoices;
          this.loadEvent();
          this.loading = false;
        });

      });





    },
    home(){

      this.$router.push('/main');
    },
    back(){

      this.$router.push('/main/group/VideoGameSelection/'+this.game+'/'+this.chapter+'/'+this.version+'/'+ this.groupOne +'/'+ this.groupTwo +'/MacroAnalysis');
    },
    loadEvent(){
      let key = this.gameevent;
      if(this.choice === 'choice') {

        let viewEvent = this.unique_decision_final.filter(function (data) {
          if (data.eventCode === key)
            return data;
        });

        if (viewEvent.length > 0) {
          viewEvent = viewEvent[0];
          this.AnswerList = viewEvent.choices;
          this.Answers = [];
          for (let i = 0; i < this.AnswerList.length; i++) {
            this.Answers.push(this.AnswerList[i].percent);
          }
        }
      }else{
        let viewEvent = this.unique_decision_final_temp.filter(function (data) {
          if (data.eventCode === key)
            return data;
        });

        if (viewEvent.length > 0) {
          viewEvent = viewEvent[0];
          this.Answers_tmp = [];
          for (let i = 0; i < viewEvent.choices.length; i++) {
            this.Answers_tmp.push(['s'+(i+1),viewEvent.choices[i]]);
          }
        }
        this.getMeanValue();
        this.getStd();
      }

      this.barChartLoad();
    },
    dataAnalysis(){

      this.distinct_event = [];
      this.distinct_event_temp = [];
      let uniqueEventList = [];
      let uniqueEventListTmp = [];
      for(var i =0; i < this.decisions.length ; i++){
        var item = this.decisions[i];
        if(item.eventType === 'choice') {
          var filter = uniqueEventList.findIndex((data) => data.eventCode === item.eventCode);
          if (filter === -1) {
            uniqueEventList.push(
                {
                  'eventCode': item.eventCode,
                  'totalChoice': 1,
                  'choices': [
                    {
                      name: item.choice,
                      count: 1,
                      percent: 0
                    }
                  ]
                });
          }else{
            let ch_index = uniqueEventList[filter].choices.findIndex((data) => data.name === item.choice);
            uniqueEventList[filter].totalChoice++;

            if(ch_index === -1) {
              uniqueEventList[filter].choices.push({
                name: item.choice,
                count: 1,
                percent: 0
              });
            }else {
              uniqueEventList[filter].choices[ch_index].count++;
            }
          }
        }else{
          let filter_tmp = uniqueEventListTmp.findIndex((data) => data.eventCode === item.eventCode);
          if (filter_tmp === -1) {
            uniqueEventListTmp.push(
                {
                  'eventCode': item.eventCode,
                  'choices': [item.choice]
                });
          }else{
            uniqueEventListTmp[filter_tmp].choices.findIndex((data) => data.name === item.choice);
            uniqueEventListTmp[filter_tmp].choices.push(item.choice);

          }
        }
      }
      uniqueEventList.forEach((value) => {
        if(this.max_choice < value.choices.length)
          this.max_choice = value.choices.length;
        this.distinct_event.push(value.eventCode);
        value.choices.forEach((ch) => {
          ch.percent = ((ch.count / value.totalChoice) * 100).toFixed(2);
        });
      });
      uniqueEventListTmp.forEach((value) => {
        this.distinct_event_temp.push(value.eventCode);
      });
      this.unique_decision_final_temp = uniqueEventListTmp;
      this.unique_decision_final =  uniqueEventList;
    },
    barChartLoad(){
      if(this.choice === 'choice') {
        var dataAxis = [];
        var data = this.Answers;


        for (var i = 0; i < data.length; i++) {
          dataAxis.push('Answ ' + (i + 1));
        }
        this.chartData = {
          tooltip: {},
          xAxis: {
            data: dataAxis,

            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
            z: 10
          },
          yAxis: {
            max: 100,
            type: 'value',
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              textStyle: {
                color: '#999'
              },
              formatter: '{value}%'
            }
          },
          dataZoom: [
            {
              type: 'inside'
            }
          ],
          series: [
            {
              name: this.groupOne,
              type: 'bar',
              barWidth: 20,
              data: data
            },
            {
              name: this.groupTwo,
              type: 'bar',
              barWidth: 20,
              data: data
            }
          ]
        }
      }else{
        let xAxisData = [];
        this.Answers_tmp.forEach((value, index) => {
          xAxisData.push('s'+(index+1));
        });

        this.chartData = {
          tooltip: {},
          xAxis: {
            scale: true,
            data: xAxisData
          },
          yAxis: {
            scale: true,
            min: 0,
            max: 100,
            axisLabel:{
              formatter: '{value} Secs'
            }
          },
          legend: {},
          series: [
            {
              name: this.groupOne,
              symbolSize: 20,
              type: 'scatter',
              data: this.Answers_tmp,
            },
            {
              name: this.groupTwo,
              type: 'scatter',
              data: this.Answers_tmp,
            }
          ]
        };
      }
    },
    getMeanValue(){
      let sum = 0;
      this.Answers_tmp.forEach((value) => {
        sum= sum + parseFloat(value[1]);
      });
      this.mean_val = (sum/this.Answers_tmp.length).toFixed(2);
    },
    getStd(){
      let sum = 0;
      this.Answers_tmp.forEach((value) => {
        let x = (parseFloat(value[1]) - this.mean_val);
        sum += (x*x);
      });
      this.std = (sum/(this.Answers_tmp.length - 1)).toFixed(2);
    }
  }
}
</script>

<style scoped lang="scss">
.title{
  font-weight: 500;
}
.btn-success{
  padding: 4px 19px;
  border: 0;
}
.btn-primary{
  padding: 4px 19px;
  background: #e35219;
  border: 0;
}
.custom-select{
  text-transform: capitalize;
  font-weight: bold;
}
.export{
  background: #154a84;
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
.ans {
  margin: 10px 0;
  p {
    padding: 0;
    margin: 0;
  }
}

.echarts {width: 100% !important;}
</style>
