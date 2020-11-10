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
            <p class="title">To visualize Event decisions, select Game, Chapter and Event type (Choice/ Timed):</p>
            <div class="row">
                <div class=" col-md-2">
                    <select class="custom-select" v-model="game" @change="selectGame($event)">
                        <option v-for="(item, index) in result" :key="index" :value="item.gameCode">{{item.gameCode}} </option>
                    </select>
                </div>
                <div class="col-md-2">
                    <select class="custom-select" v-model="chapter"  @change="selectChapter($event)">
                        <option v-for="(item, index) in chapters" :key="index" :value="item">{{item}} </option>
                    </select>
                </div>
                <div class="col-md-3">
                    <select class="custom-select" @change="selectChoice($event)">
                        <option selected value="choice">Multiple-choice</option>
                        <option value="timed">Temporal</option>
                        <!--<option value="xpe">A specific</option>-->
                    </select>
                </div>
                <div class="col-md-5 mt-sm-3 mt-md-0">
                    <button class="btn btn-primary" @click="filter()">Filter</button>
                    <button class="btn btn-success" style="margin-left: 10px" @click="submitData()">Visualize</button>
                    <button class="btn btn-dark" style="margin-left: 10px" @click="chapterInfo()">Chapter Info</button>
                </div>
            </div>
            <div class="row">
                <div class="col-md-8">
                    <v-chart :options="chartData" width="100%"/>
                </div>
                <div class="col-md-4">
                    <p class="sub-title">Click to view Single Event Info:</p>
                    <ul class="eventlist" v-if="choice === 'choice'">
                        <li v-for="(item, index, key) in choiceList" :key="key" @click="gotoEvent(item.value)"> {{item.value}}: {{item.description}}</li>
                    </ul>

                    <ul class="eventlist" v-if="choice === 'timed'">
                        <li v-for="(item, index, key) in distinct_event_temp" :key="key" @click="gotoEvent(item.value)"> {{item.value}}: {{item.description}}</li>
                    </ul>
                    <div v-if="(unique_decision_final.length === 0 && choice === 'choice') || (distinct_event_temp.length === 0 && choice === 'timed')">
                      No data found.
                    </div>
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
//    import axois from "axios";
    import ECharts from 'vue-echarts'
    import 'echarts/lib/chart/bar'
    import 'echarts/lib/component/tooltip'
    import 'echarts-gl'
import axios from "axios";
    //import filterModel from "@/components/filterModel";

    export default {
        components: {
            'v-chart': ECharts
        },
        data: function(){
            return {
                chartData: null,
                loading: true,
                choice: 'choice',
                decisions: [],
                max_choice: 0,
                distinct_event: [],
                distinct_event_temp: [],
                unique_decision_final:[],
                unique_decision_final_temp:[],
                type: null,
                game: null,
                version: null,
                chapter: null,
                chartDATA: [],
                result: [],
                chapters: [],
                filterStudent: [],
                GroupFilter: [],
                getFilterHeader: null,
                choiceList: null,
                choiceList_name: null
            }
        },
        mounted(){





          this.game = this.$route.params.game;
          this.chapter = this.$route.params.chapter;
          this.version = this.$route.params.version;

          const requestOne = axios.get("descriptions/games");
          const requestTwo = axios.get("filters/group");
          const requestThree = axios.get("filters/student");


          axios.all([requestOne, requestTwo, requestThree ]).then(axios.spread((...responses) => {
            this.$store.state.games = responses[0].data.games;
            this.GroupFilter = responses[1].data
            this.filterStudent = responses[2].data

            this.groupsList = this.GroupFilter.group_ids;
            this.SelectGroupOne = this.$route.params.groupOne;
            this.SelectGroupTwo = this.$route.params.groupTwo;
            this.loadData();
            this.submitData();

          })).catch(errors => {
            console.log(errors);
          })


          axios.get('descriptions/games')
              .then(res => {
                this.$store.state.games = JSON.parse(res.request.response).games;
                this.loading = false;
                this.loadData();
                this.submitData();
              });


          this.$root.$on('loadFilterHeaderSingle', (Filter) => { // here you need to use the arrow function
            this.getFilterHeader = {};
            if(Filter.group !== null && Filter.group !== undefined) {
              if(Filter.student === null )
                delete  Filter.student;

              this.getFilterHeader = Filter;

            } else if(Filter.student !== null && Filter.student !== undefined) {

              if(Filter.group === null )
                delete  Filter.group;

              this.getFilterHeader = Filter;
            }

            this.submitData();

          });

        }
        ,
        methods: {
            exportOpt(){
                window.print();
            },
            home(){
                this.$router.push('/main');
            },
          chapterInfo(){
            this.$root.$emit('viewChapterInfo', {
              game: this.game,
              version: this.version,
              chapter: this.chapter
            });
            this.$modal.show("chapter_info");
          },
            filter(){

              this.$root.$emit('loadFilterDate', [this.GroupFilter, this.filterStudent, "single"]);
              this.$modal.show('filter');

            },
            back(){
                this.$router.push('/main/single/VideoGameSelection/');
            },
            selectGame(event){
                this.game = event.target.value;
                this.loadData();
            },
            selectChoice(event){
                this.choice = event.target.value;
                this.barChartLoad();

            },
            selectChapter(event){
                this.chapter = event.target.value;

            },
            submitData(){

                this.loading = true;
                if(this.getFilterHeader !== null && JSON.stringify(this.getFilterHeader) !== JSON.stringify({})) {

                  axios.get("decision?gameCode=" + this.game + "&gameVersion=" + this.version + "&chapterCode=" + this.chapter, {headers: {filters: JSON.stringify(this.getFilterHeader)}}).then(res => {
                    this.decisions = res.data.decisions;

                    this.dataAnalysis();


                    this.barChartLoad();
                  });

                }else {
                  axios.get("decision?gameCode=" + this.game + "&gameVersion=" + this.version + "&chapterCode=" + this.chapter).then(res => {
                    this.decisions = res.data.decisions;
                    this.dataAnalysis();
                    let i =0;
                    this.chartDATA = [];
                    this.unique_decision_final.forEach(value => {
                      this.chartDATA.push({
                        name: 'bar'+ i++,
                        type: 'bar',
                        stack: 'one',
                        barWidth: 20,
                        data: value.choice
                      });
                    });

                    this.barChartLoad();
                  });
                }
            },
            loadData(){
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
                    //this.chapter = this.chapters[0];
                }

            },
            dataAnalysis(){
                this.distinct_event_temp = [];


                this.unique_decision_final_temp = [];
                this.unique_decision_final = [];
              var eventList = [];
              var choice = [];


                this.decisions.forEach(value => {

                  if(value.eventType === 'timed'){
                    this.unique_decision_final_temp.push([value.eventCode, value.choice, value.eventDescription]);
                    let t = 0;
                    for( ; t < this.distinct_event_temp.length; t++){
                      if(this.distinct_event_temp[t].value === value.eventCode){
                        break;
                      }
                    }
                    if(this.distinct_event_temp.length === t)
                      this.distinct_event_temp.push({value: value.eventCode, description: value.eventDescription});


                  }else{
                    let i=0;
                    for (; i < eventList.length; i++){


                      if(eventList[i].value === value.eventCode) {
                        eventList[i].count++;
                        break;
                      }
                    }
                    if(i === eventList.length)
                      eventList.push({value: value.eventCode, count: 1, description: value.eventDescription});


                    let p = 0;
                    for (; p < choice.length; p++){
                      if(choice[p].value === value.choice)
                        break;
                    }
                    if(p === choice.length)
                      choice.push({value: value.choice, choice: []});

                  }

                });



              choice.forEach(value => {
                eventList.forEach(value1 => {
                  value.choice.push({
                    value: 0,
                    name: value.value,
                    count: 0,
                    event: value1.value,
                    description: value1.description
                  });
                });

              });


              this.decisions.forEach(value => {

                if(value.eventType !== 'timed'){

                  choice.forEach(value1 => {

                    let x = 0;
                    for(; x < value1.choice.length; x++){
                      if(value1.choice[x].event === value.eventCode && value1.choice[x].name === value.choice)
                        value1.choice[x].count++;

                    }

                  });
                }

              });


              choice.forEach(value1 => {

                value1.choice.forEach(value2 => {

                  let m =0;
                  for(; m < eventList.length; m++){
                    if(eventList[m].value === value2.event){
                      value2.value = (value2.count/eventList[m].count)*100;
                    }
                  }

                });

              });


              this.unique_decision_final = choice;
              this.choiceList = eventList;



            },
            barChartLoad(){


                if(this.choice === 'choice') {
                    this.chartData = {
                        backgroundColor: '#fff',
                        tooltip: {
                            formatter: function (params) {
                              console.log(params)
                                return params.data.event +': '+params.data.description+'<br>Answer: “'+params.data.name+'” <br/>Selected by: '+
                                    params.value+'% of the students';
                            }
                        },
                        calculable: true,
                        xAxis: {
                            data: this.choiceList,
                            axisLine: {onZero: true},
                            splitLine: {show: true},
                            splitArea: {show: false}
                        },
                        yAxis: {
                            max: 100,
                            splitArea: {show: false},
                            axisLabel:{
                                formatter: '{value}%'
                            }
                        },
                        series: this.chartDATA
                    };
                }else{
                    this.chartData = {
                        xAxis: {
                            scale: true,
                            data: this.distinct_event_temp
                        },
                        yAxis: {
                            scale: true,
                            min: 0,
                            max: 100,
                            axisLabel:{
                                formatter: '{value} Secs'
                            }
                        },
                        tooltip: {
                            trigger: 'axis',
                            axisPointer:{
                                type: 'shadow'
                            },
                            formatter: function (params) {
                                let sum =0;
                                let mean;
                                let std;
                                let Event;
                                let description;

                                params.forEach((value) => {
                                    sum = sum + parseFloat(value.data[1]);
                                    description = value.data[2];
                                    Event = value.name;
                                });
                                mean = (sum / params.length ).toFixed(2);

                                sum = 0;
                                params.forEach((value) => {
                                    let x = (parseFloat(value.data[1]) - mean);
                                    sum = sum + (x*x);
                                });
                                std = Math.sqrt(sum / (params.length));

                                return Event+' : '+description+'<br/>Avg: ' + mean + ' secs.<br/>Std: ' + std.toFixed(2)+' secs.';
                            }
                        },
                        series: [
                            {
                                type: 'scatter',
                                data: this.unique_decision_final_temp,
                            }
                        ]
                    };
                }

              this.loading = false;
            },
            gotoEvent(value){
                if(this.getFilterHeader === null || JSON.stringify(this.getFilterHeader) === "{}")
                  this.$router.push({path:'/main/single/VideoGameSelection/'+this.game+'/'+this.chapter+'/'+this.version+'/MicroAnalysis/' + value + '/'+this.choice+'/EventView'});
                else
                  this.$router.push({path:'/main/single/VideoGameSelection/'+this.game+'/'+this.chapter+'/'+this.version+'/MicroAnalysis/' + value + '/'+this.choice+'/EventView', query:  {filter: JSON.stringify(this.getFilterHeader)}});
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
    .sub-title{
      color: #e35219;
      margin: 26px 0 6px;
    }
    .btn-success, .btn-dark{
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
    .content{
        margin: 50px 0;
    .custom-control{
        margin-top: 16px;
    }
    }
    .eventlist{
        list-style: none;
        padding: 0;
        li {
            padding: 1px 10px;
            background: #325973;
            color: white;
            border: 1px solid white;
            cursor: pointer;
        }
        li:hover{
            background: #848484;
        }
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
    .echarts {width: 100% !important;}
</style>
