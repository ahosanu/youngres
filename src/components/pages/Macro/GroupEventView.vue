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
        <div class="col-md-3">
          <select class="custom-select" v-model="chapter" style="margin-left: 10px;" @change="changeChapter($event)">
            <option v-for="(item, index) in chapters" :key="index" :value="item">{{item}} </option>
          </select>
        </div>
        <div class="col-md-3">
          <select class="custom-select" v-if="choice === 'multiple-choice'" v-model="gameevent" style="margin-left: 10px;" @change="loadData($event)">
            <option v-for="(item, index) in distinct_event" :key="index" :value="item">{{item}} </option>
          </select>

          <select class="custom-select" v-if="choice === 'timed'" v-model="gameevent" style="margin-left: 10px;" @change="loadData($event)">
            <option v-for="(item, index) in distinct_event_temp" :key="index" :value="item">{{item}} </option>
          </select>
        </div>
        <div class="col-md-3">
<!--            <button class="btn btn-outline-primary">Filter</button>-->

          <button class="btn btn-dark" style="margin-left: 10px" @click="chapterInfo()">Chapter Info</button>
        </div>
      </div>
      <br/>
      <div class="row">
        <div class="col-md-7">
          <v-chart :options="chartData"/>
        </div>
        <div class="col-md-5">
          <strong>{{gameevent}}:</strong>
          <p>{{description}}</p>



          <strong>Highlights:</strong>
          <p v-for="(item, index) in this.highlights" :key="index">{{item}}</p>

          <span v-if="choice === 'multiple-choice'">
             <strong>Possible Choices: ({{possibleChoices.length}})</strong>
            <p>
              <span class="text-uppercase" v-for="(item, index) in possibleChoices" :key="item">
                {{item}}{{(possibleChoices.length - 1 > index) ? ',' : ''}}
              </span>

            </p>


            <strong>Student decisions among possible choices: ({{possibleChoices.length}})</strong>
                    <br/>
                    <div class="ans" v-for="(item,index, key) in possibleChoices" :key="key">
                      <p>- Answer {{index+1}}: “{{item}}”.</p>
                      <p> {{groupOne}} Selected by: {{possibleChoicesGroupOne[index].value !== 'NaN' ? possibleChoicesGroupOne[index].value : 0}}%</p>
                      <p> {{groupTwo}} Selected by: {{possibleChoicesGroupTwo[index].value !== 'NaN' ? possibleChoicesGroupTwo[index].value : 0}}%</p>
                    </div>
                    </span>
          <span v-if="choice === 'timed'">
                    <strong>Statistics:</strong>

                    <div class="ans">
                        <p>{{groupOne}} Mean: {{mean_val !== 'NaN' ? mean_val : 0 }} secs.</p>
                        <p>{{groupOne}} Std: {{std}}  secs.</p>
                    </div>

                    <div class="ans">
                        <p>{{groupTwo}} Mean: {{mean_val_two !== 'NaN' ? mean_val_two : 0}} secs.</p>
                        <p>{{groupTwo}} Std: {{stdTwo}}  secs.</p>
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
      AnswersTwo: [],
      Answers_tmp_two: [],
      chartData: null,
      loading: true,
      chapters: [],
      choice: null,
      decisions: [],
      distinct_event: [],
      distinct_event_temp: [],
      unique_decision_final:[],
      unique_decision_final_temp:[],
      decisions_two: [],
      distinct_event_two: [],
      distinct_event_temp_two: [],
      unique_decision_final_two:[],
      unique_decision_final_temp_two:[],
      game: null,
      version: null,
      chapter: null,
      gameevent: null,
      chartDATA: [],
      chartDATATwo: [],
      AnswerList: [],
      AnswerListTwo: [],
      mean_val: 0,
      mean_val_two: 0,
      std: 0,
      stdTwo: 0,
      groupOne: null,
      groupTwo: null,
      possibleChoices: [],
      possibleChoicesGroupOne: [],
      possibleChoicesGroupTwo: []
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

        });





  },
  methods: {
    exportOpt(){
      window.print();
    },
    changeChapter(event){
      this.distinct_event = [];
      this.distinct_event_temp = [];
      this.loading = true;
      this.chapter = event.target.value;

      const requestOne = axios.get("decision?gameCode="+this.game+"&gameVersion="+this.version+"&chapterCode="+this.chapter, { headers: { filters: this.$route.query.groupOne}});
      const requestTwo = axios.get("decision?gameCode="+this.game+"&gameVersion="+this.version+"&chapterCode="+this.chapter, { headers: { filters: this.$route.query.groupTwo}});

      axios.all([requestOne, requestTwo]).then(axios.spread((...responses) => {

          responses[0].data.decisions.forEach(value => {
          if(value.eventType === "multiple-choice") {
            let i = 0;
            for (; i < this.distinct_event.length; i++) {
              if(this.distinct_event[i] === value.eventCode){
                break;
              }
            }
            if(i === this.distinct_event.length)
              this.distinct_event.push(value.eventCode)
          }else{
            let i = 0;
            for (; i < this.distinct_event_temp.length; i++) {
              if(this.distinct_event_temp[i] === value.eventCode){
                break;
              }
            }
            if(i === this.distinct_event_temp.length)
              this.distinct_event_temp.push(value.eventCode)
          }

        });

        responses[1].data.decisions.forEach(value => {
          if(value.eventType === "multiple-choice") {
            let i = 0;
            for (; i < this.distinct_event.length; i++) {
              if(this.distinct_event[i] === value.eventCode){
                break;
              }
            }
            if(i === this.distinct_event.length)
              this.distinct_event.push(value.eventCode)
          }else{
            let i = 0;
            for (; i < this.distinct_event_temp.length; i++) {
              if(this.distinct_event_temp[i] === value.eventCode){
                break;
              }
            }
            if(i === this.distinct_event_temp.length)
              this.distinct_event_temp.push(value.eventCode)
          }

        });

        if(this.choice === "multiple-choice") {
          if (this.distinct_event.length > 0)
            this.gameevent = this.distinct_event[0];
        }else{
          if (this.distinct_event_temp.length > 0)
            this.gameevent = this.distinct_event_temp[0];
        }
        this.loadData();

      }));







    },
    changeEvent(event){
      this.gameevent = event.target.value;
      this.loadEvent();
    },
    loadData(){

      this.loading = true;

      const requestOne = axios.get("decision?gameCode="+this.game+"&gameVersion="+this.version+"&chapterCode="+this.chapter, { headers: { filters: this.$route.query.groupOne}});
      const requestTwo = axios.get("decision?gameCode="+this.game+"&gameVersion="+this.version+"&chapterCode="+this.chapter, { headers: { filters: this.$route.query.groupTwo}});

      const requestThree = axios.get("descriptions/event?gameCode="+this.game+"&gameVersion="+this.version+"&chapterCode="+this.chapter+"&eventCode="+this.gameevent);

      axios.all([requestOne, requestTwo, requestThree]).then(axios.spread((...responses) => {
        this.possibleChoicesGroupOne = [];
        this.possibleChoicesGroupTwo = [];
        this.decisions = responses[0].data.decisions;
        this.result = responses[2].data;

        this.dataAnalysis(); //Group One

        this.highlights = this.result.highlights;
        this.description = this.result.eventDescription;
        this.possibleChoices = this.result.possibleChoices;

        this.decisions_two = responses[1].data.decisions;


        this.dataAnalysisTwo(); //Group One

        this.possibleChoices.forEach((value) => {
          this.possibleChoicesGroupOne.push({
            choice: value,
            EventOneCount: 0,
            value: 0
          });
          this.possibleChoicesGroupTwo.push({
            choice: value,
            EventOneCount: 0,
            value: 0
          });

        });


        this.decisions.forEach((value) => {

          if(value.eventType === "multiple-choice" && value.eventCode === this.gameevent) {
            this.possibleChoicesGroupOne.forEach((valuex) => {
              if(value.choice === valuex.choice)
                valuex.EventOneCount++;
            });
          }
        });
        this.decisions_two.forEach((value) => {

          let i;
          for(i =0; i < this.distinct_event.length; i++ ){
            if(this.distinct_event[i] === value.eventCode){
              break;
            }
          }
          if( i === this.distinct_event.length  && value.eventType === this.choice)
            this.distinct_event.push(value.eventCode);


          if(value.eventType === "multiple-choice" && value.eventCode === this.gameevent) {
            this.possibleChoicesGroupTwo.forEach((valuex) => {
              if(value.choice === valuex.choice)
                valuex.EventOneCount++;
            });
          }
        });


        let len = 0;
        let len_two = 0;
        this.possibleChoicesGroupOne.forEach((value)=>{
          len+=value.EventOneCount;
        });
        this.possibleChoicesGroupTwo.forEach((value)=>{
          len_two+=value.EventOneCount;
        });

        this.possibleChoicesGroupOne.forEach((value)=>{
          if(len > 0)
              value.value=((value.EventOneCount/len)*100).toFixed(2);
        });
        this.possibleChoicesGroupTwo.forEach((value)=>{
          if(len_two > 0)
              value.value=((value.EventOneCount/len_two)*100).toFixed(2);
        });
        /*if(this.distinct_event.length > 0) {
          this.gameevent = this.distinct_event[0];
        }*/

        this.loadEvent();

        this.loading = false;


      })).catch(errors => {
        console.log(errors);
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
      if(this.choice !== 'multiple-choice') {

        let viewEvent = this.unique_decision_final_temp.filter(function (data) {
          if (data.eventCode === key)
            return data;
        });
        let viewEventTwo = this.unique_decision_final_temp_two.filter(function (data) {
          if (data.eventCode === key)
            return data;
        });

        if (viewEvent.length > 0) {
          viewEvent = viewEvent[0];
          this.Answers_tmp = [];
          for (let i = 0; i < viewEvent.choices.length; i++) {
            this.Answers_tmp.push(['s'+(i+1),viewEvent.choices[i], this.groupOne, viewEvent.eventCode]);
          }
        }
        if (viewEventTwo.length > 0) {
          viewEventTwo = viewEventTwo[0];
          this.Answers_tmp_two = [];
          for (let i = 0; i < viewEventTwo.choices.length; i++) {
            this.Answers_tmp_two.push(['s'+(i+1), viewEventTwo.choices[i], this.groupTwo, viewEvent.eventCode]);
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
        //todo: multiple-choice
        if(item.eventType !== 'multiple-choice') {

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
    dataAnalysisTwo(){
      this.distinct_event_two = [];
      this.distinct_event_temp_two = [];
      let uniqueEventList = [];
      let uniqueEventListTmp = [];
      for(var i =0; i < this.decisions_two.length ; i++){
        var item = this.decisions_two[i];
        if(item.eventType !== 'multiple-choice') {
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

        this.distinct_event_two.push(value.eventCode);

        value.choices.forEach((ch) => {
          ch.percent = ((ch.count / value.totalChoice) * 100).toFixed(2);
        });

      });



      uniqueEventListTmp.forEach((value) => {
        this.distinct_event_temp_two.push(value.eventCode);

        i=0;
        for(; i < this.distinct_event_temp.length; i++){
          if(this.distinct_event_temp[i] === value.eventCode)
            break;
        }
        if(i === this.distinct_event_temp.length && value.eventType === this.choice)
          this.distinct_event_temp.push(value.eventCode);
      });
      this.unique_decision_final_temp_two = uniqueEventListTmp;
      this.unique_decision_final_two =  uniqueEventList;





    },
    barChartLoad(){
      if(this.choice === 'multiple-choice') {
        /*var dataAxis = [];

        for (var i = 0; i < this.possibleChoices.length; i++) {
          dataAxis.push('Answ ' + (i + 1));
        }*/
        this.chartData = {
          tooltip: {
            formatter: function (params) {

              return 'Answer: “'+params.data.choice+'” <br/>Selected by: '+
                  params.value+'% of the students';
            }
          },
          legend:{
            data: [this.groupOne, this.groupTwo],
          },
          xAxis: {
            data: this.possibleChoices,

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
              label: {
                show: true,
                position: 'insideBottom',

                align: 'left',
                verticalAlign: 'middle',
                rotate: 90,
                formatter: '{name|{a}}',
                fontSize: 12,
                rich: {
                  name: {
                    textBorderColor: '#ffffff'
                  }
                }
              },
              data: this.possibleChoicesGroupOne
            },
            {
              name: this.groupTwo,
              type: 'bar',
              barWidth: 20,
              label: {
                show: true,
                position: 'insideBottom',

                align: 'left',
                verticalAlign: 'middle',
                rotate: 90,
                formatter: '{name|{a}}',
                fontSize: 12,
                rich: {
                  name: {
                    textBorderColor: '#ffffff'
                  }
                }
              },
              data: this.possibleChoicesGroupTwo
            }
          ]
        }
      }else{
        let xAxisData = [];

        if(this.Answers_tmp.length > this.Answers_tmp_two.length) {
          this.Answers_tmp.forEach((value, index) => {
            xAxisData.push('s' + (index + 1));
          });
        }else{
          this.Answers_tmp_two.forEach((value, index) => {
            xAxisData.push('s' + (index + 1));
          });
        }

        var des = this.description;
        this.chartData = {
          tooltip: {
            formatter: function (params) {
              return params.value[2]+'<br/>'+params.value[3]+': '+des+'<br/>Time: '+params.value[1]+' secs.';
            }
          },
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
          legend: {

          },
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
              data: this.Answers_tmp_two,
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


      let sumTwo = 0;
      this.Answers_tmp_two.forEach((value) => {
        sumTwo= sumTwo + parseFloat(value[1]);
      });
      this.mean_val_two = (sumTwo/this.Answers_tmp_two.length).toFixed(2);

    },
    getStd(){
      let sum = 0;
      this.Answers_tmp.forEach((value) => {
        let x = (parseFloat(value[1]) - this.mean_val);
        sum += (x*x);
      });
      this.std = Math.sqrt(sum/(this.Answers_tmp.length)).toFixed(2);

      let sumTwo = 0;
      this.Answers_tmp_two.forEach((value) => {
        let z = (parseFloat(value[1]) - this.mean_val_two);
        sumTwo += (z*z);
      });
      this.stdTwo = Math.sqrt(sumTwo/(this.Answers_tmp_two.length)).toFixed(2);
    },
    chapterInfo(){
      this.$root.$emit('viewChapterInfo', {
        game: this.game,
        version: this.version,
        chapter: this.chapter
      });
      this.$modal.show("chapter_info");
    }
  }
}
</script>

<style scoped lang="scss">
.title{
  font-weight: bold;
  font-size: 18px;
  color: #e35219;
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
