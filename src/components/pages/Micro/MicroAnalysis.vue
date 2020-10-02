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
                <div class="col-md-9">
                    <v-chart :options="chartData" width="100%"/>
                </div>
                <div class="col-md-3">
                    <p class="sub-title">Click to view Single Event Info:</p>
                    <ul class="eventlist" v-if="choice === 'choice'">
                        <li v-for="(item, index, key) in unique_decision_final" :key="key" @click="gotoEvent(item.eventCode)"> {{item.eventCode}}</li>
                    </ul>

                    <ul class="eventlist" v-if="choice === 'timed'">
                        <li v-for="(item, index, key) in distinct_event_temp" :key="key" @click="gotoEvent(item)"> {{item}}</li>
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
              GroupFilter: []
            }
        },
        mounted(){

            this.type = this.$route.params.type;
            this.game = this.$route.params.game;
            this.chapter = this.$route.params.chapter;



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
            this.loading = false;

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
                this.chartDATA = [];
                this.loading = true;
                axios.get("decision").then(res => {
                  this.decisions = JSON.parse(res.request.response);

                  this.dataAnalysis();

                  for(var i=0; i < this.unique_decision_final.length; i++ ) {
                    this.chartDATA[i] = [];
                    for(var x=0; x < this.max_choice; x++)
                      this.chartDATA[i][x] = 0;
                  }
                  for(var p =0; p < this.unique_decision_final.length; p++){
                    var list = this.unique_decision_final[p].choices;
                    for(var j=0; j < list.length; j++) {
                      this.chartDATA[j][p] = { key: list[j].name, description: list[j].description , value: list[j].percent};
                    }
                  }
                  this.barChartLoad();

                  this.loading = false;
                });


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
                this.distinct_event = [];
                this.distinct_event_temp = [];
                let uniqueEventList = [];
                let uniqueEventListTmp = [];
                this.unique_decision_final_temp = [];
                this.unique_decision_final = [];


                for(var i =0; i < this.decisions.length ; i++){
                    var item = this.decisions[i];
                    if(item.eventType === 'choice') {
                        var filter = uniqueEventList.findIndex((data) => data.eventCode === item.eventCode);
                        if (filter === -1) {
                            uniqueEventList.push(
                                {
                                    'eventCode': item.eventCode,
                                    'description': item.eventDescription,
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
                                    'description': item.eventDescription,
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
                    value.choices.forEach((ch) => {
                        this.unique_decision_final_temp.push([value.eventCode, ch, value.description]);
                    });
                });

                this.unique_decision_final =  uniqueEventList;



            },
            barChartLoad(){


                if(this.choice === 'choice') {
                    var emphasisStyle = {
                        itemStyle: {
                            barBorderWidth: 1,
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowOffsetY: 0,
                            shadowColor: 'rgba(0,0,0,0.5)'
                        }
                    };
                    this.chartData = {
                        backgroundColor: '#fff',

                        tooltip: {
                            formatter: function (params) {
                                return 'Answer: “'+params.data.key+'” <br/>Selected by: '+
                                    params.value+'% of the students';
                            }
                        },
                        calculable: true,
                        xAxis: {
                            data: this.distinct_event,
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
                        series: [
                            {
                                name: 'bar',
                                type: 'bar',
                                stack: 'one',
                                emphasis: emphasisStyle,
                                barWidth: 20,
                                data: this.chartDATA[0]
                            },
                            {
                                name: 'bar2',
                                type: 'bar',
                                stack: 'one',
                                emphasis: emphasisStyle,
                                barWidth: 20,
                                data: this.chartDATA[1]
                            },
                            {
                                name: 'bar3',
                                type: 'bar',
                                stack: 'one',
                                emphasis: emphasisStyle,
                                barWidth: 20,
                                data: this.chartDATA[2]
                            },
                            {
                                name: 'bar4',
                                type: 'bar',
                                stack: 'one',
                                emphasis: emphasisStyle,
                                barWidth: 20,
                                data: this.chartDATA[3]
                            },
                            {
                                name: 'bar5',
                                type: 'bar',
                                stack: 'one',
                                emphasis: emphasisStyle,
                                barWidth: 20,
                                data: this.chartDATA[4]
                            },
                            {
                                name: 'bar6',
                                type: 'bar',
                                stack: 'one',
                                emphasis: emphasisStyle,
                                barWidth: 20,
                                data: this.chartDATA[5]
                            },
                            {
                                name: 'bar7',
                                type: 'bar',
                                stack: 'one',
                                emphasis: emphasisStyle,
                                barWidth: 20,
                                data: this.chartDATA[6]
                            },
                            {
                                name: 'bar8',
                                type: 'bar',
                                stack: 'one',
                                emphasis: emphasisStyle,
                                barWidth: 20,
                                data: this.chartDATA[7]
                            },
                            {
                                name: 'bar9',
                                type: 'bar',
                                stack: 'one',
                                emphasis: emphasisStyle,
                                barWidth: 20,
                                data: this.chartDATA[8]
                            },
                            {
                                name: 'bar10',
                                type: 'bar',
                                stack: 'one',
                                emphasis: emphasisStyle,
                                barWidth: 20,
                                data: this.chartDATA[9]
                            },
                            {
                                name: 'bar11',
                                type: 'bar',
                                stack: 'one',
                                emphasis: emphasisStyle,
                                barWidth: 20,
                                data: this.chartDATA[10]
                            },
                            {
                                name: 'bar12',
                                type: 'bar',
                                stack: 'one',
                                emphasis: emphasisStyle,
                                barWidth: 20,
                                data: this.chartDATA[11]
                            }
                        ]
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
                                std = sum / (params.length - 1);

                                return Event+' : '+description+'<br/>Avg: ' + mean + 'secs.<br/>Std: ' + std.toFixed(2)+'secs.';
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
            },
            gotoEvent(value){
                this.$router.push('/main/single/VideoGameSelection/'+this.game+'/'+this.chapter+'/'+this.version+'/MicroAnalysis/' + value + '/'+this.choice+'/EventView');
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
