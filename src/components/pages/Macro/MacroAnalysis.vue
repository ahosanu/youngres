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
                <div class="col-md-2">
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
            <div class="row mt-3">
              <div class="col-md-3 offset-2">
                <select class="custom-select" v-model="SelectGroupOne" >
                  <option v-for="(item, index) in groupsList" :key="index" :value="item.group_id">{{item.group_id}} </option>
                </select>
              </div>
              <div class="col-md-3">
                <select class="custom-select" v-model="SelectGroupTwo">
                  <option v-for="(item, index) in groupsList" :key="index" :value="item.group_id">{{item.group_id}}</option>
                </select>
              </div>
            </div>
            <div class="row">
                <div class="col-md-9">
                    <v-chart :options="chartData"/>
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
            <div class="col-md-4">
                <button class="btn btn-primary" @click="back">Back</button>
            </div>
            <div class="col-md-4 text-center">
                <button class="btn btn-primary" @click="home">Home</button>
            </div>
            <div class="col-md-4 text-right">
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
    import axios from "axios"

    export default {
        components: {
            'v-chart': ECharts
        },
        data: function(){
            return {
                loading: true,
                chartData: null,
                Answers: [10, 20 , 50, 15, 50, 80, 25, 30, 80, 95],
                choice: 'choice',
                decisions: [],
                max_choice: 0,
                distinct_event: [],
                distinct_event_temp: [],
                unique_decision_final:[],
                unique_decision_final_temp:[],
                max_choice_two: 0,
                distinct_event_two: [],
                distinct_event_temp_two: [],
                unique_decision_final_two:[],
                unique_decision_final_temp_two:[],
                decisions_two: [],
                type: null,
                game: null,
                version: null,
                chapter: null,
                chartDATA: [],
                chartDATATwo: [],
                result: [],
                chapters: [],
                groupsList: [],
                SelectGroupOne: null,
                SelectGroupTwo: null,
                GroupFilter: null,
                filterHeader: null,
                getFilterHeader: null,
                filterStudent: []
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
              this.loading = false;

            })).catch(errors => {
              console.log(errors);
            })


            this.$root.$on('loadFilterHeaderGroup', (Filter) => { // here you need to use the arrow function
              this.getFilterHeader = [];
              this.getFilterHeader = Filter;
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
            filter(){

              this.$root.$emit('loadFilterDate', [this.GroupFilter, this.filterStudent, "group"]);
              this.$modal.show('filter');

            },
            back(){
                this.$router.push('/main/group/VideoGameSelection/');
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
              this.chartDATA = [];
                var groupOneFilter = this.copy(this.getFilterHeader);
                var groupTwoFilter =   this.copy(this.getFilterHeader);


                if(this.getFilterHeader === null){
                  groupOneFilter =  {"group": [
                      {
                        "key": "group_id",
                        "min_value": this.SelectGroupOne
                      }
                    ]};
                  groupTwoFilter =  {"group": [
                      {
                        "key": "group_id",
                        "min_value": this.SelectGroupTwo
                      }
                    ]};
                  this.getData(groupOneFilter, groupTwoFilter);
                }else{

                  groupTwoFilter.group.push({
                    "key": "group_id",
                    "min_value": this.SelectGroupTwo
                  });

                  groupOneFilter.group.push({
                    "key": "group_id",
                    "min_value": this.SelectGroupOne
                  });
                  this.getData(groupOneFilter, groupTwoFilter);
                }

            },
            getData(groupOneFilter, groupTwoFilter){


              const requestOne = axios.get("decision?gameCode="+this.game+"&gameVersion="+this.version+"&chapterCode="+this.chapter, { 'headers': { 'filters': JSON.stringify(groupOneFilter)}});
              const requestTwo = axios.get("decision?gameCode="+this.game+"&gameVersion="+this.version+"&chapterCode="+this.chapter, { 'headers': { 'filters': JSON.stringify(groupTwoFilter)}});


              axios.all([requestOne, requestTwo]).then(axios.spread((...responses) => {
                /*Group One*/
                this.decisions = responses[0].data;

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


                /*Group Two Data*/
                this.decisions_two = responses[1].data;

                this.dataAnalysisTwo();

                for( i=0; i < this.unique_decision_final_two.length; i++ ) {
                  this.chartDATATwo[i] = [];
                  for( x=0; x < this.max_choice_two; x++)
                    this.chartDATATwo[i][x] = 0;
                }
                for( p =0; p < this.unique_decision_final_two.length; p++){
                  list = this.unique_decision_final_two[p].choices;
                  for( j=0; j < list.length; j++) {
                    this.chartDATATwo[j][p] = { key: list[j].name, description: list[j].description , value: list[j].percent};
                  }
                }
                this.barChartLoad();

                this.loading = false;


              })).catch(errors => {
                console.log(errors);
              })

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
                this.unique_decision_final_temp.push([value.eventCode, ch, value.description, this.SelectGroupOne, "g1"]);
              });
            });

            this.unique_decision_final =  uniqueEventList;



          },
            copy (o) { // copy object or array
            let output, v, key;
            output = Array.isArray(o) ? [] : {};

            for (key in o) {
              v = o[key];
              if(v) {
                output[key] = (typeof v === "object") ? this.copy(v) : v;
              } else {
                output[key] = v;
              }
            }
            return output;
          },
            dataAnalysisTwo(){
            this.distinct_event_two = [];
            this.distinct_event_temp_two = [];
            let uniqueEventList_two = [];
            let uniqueEventListTmp_two = [];
            this.unique_decision_final_temp_two = [];
            this.unique_decision_final_two = [];


            for(var i =0; i < this.decisions_two.length ; i++){
              var item = this.decisions_two[i];
              if(item.eventType === 'choice') {
                var filter = uniqueEventList_two.findIndex((data) => data.eventCode === item.eventCode);
                if (filter === -1) {
                  uniqueEventList_two.push(
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
                  let ch_index = uniqueEventList_two[filter].choices.findIndex((data) => data.name === item.choice);
                  uniqueEventList_two[filter].totalChoice++;

                  if(ch_index === -1) {
                    uniqueEventList_two[filter].choices.push({
                      name: item.choice,
                      count: 1,
                      percent: 0
                    });
                  }else {
                    uniqueEventList_two[filter].choices[ch_index].count++;
                  }
                }
              }else{
                let filter_tmp = uniqueEventListTmp_two.findIndex((data) => data.eventCode === item.eventCode);
                if (filter_tmp === -1) {
                  uniqueEventListTmp_two.push(
                      {
                        'eventCode': item.eventCode,
                        'description': item.eventDescription,
                        'choices': [item.choice]
                      });
                }else{
                  uniqueEventListTmp_two[filter_tmp].choices.findIndex((data) => data.name === item.choice);
                  uniqueEventListTmp_two[filter_tmp].choices.push(item.choice);

                }
              }
            }
            uniqueEventList_two.forEach((value) => {
              if(this.max_choice_two < value.choices.length)
                this.max_choice_two = value.choices.length;
              this.distinct_event_two.push(value.eventCode);
              value.choices.forEach((ch) => {
                ch.percent = ((ch.count / value.totalChoice) * 100).toFixed(2);
              });
            });
            uniqueEventListTmp_two.forEach((value) => {
              this.distinct_event_temp_two.push(value.eventCode);
              value.choices.forEach((ch) => {
                this.unique_decision_final_temp_two.push([value.eventCode, ch, value.description, this.SelectGroupTwo ,"g2"]);
              });
            });

            this.unique_decision_final_two =  uniqueEventList_two;



          },
            barChartLoad(){
                if(this.choice === 'choice') {
                   /* var emphasisStyle = {
                        itemStyle: {
                            barBorderWidth: 1,
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowOffsetY: 0,
                            shadowColor: 'rgba(0,0,0,0.5)'
                        }
                    };*/
                    this.chartData = {
                        backgroundColor: '#fff',
                        tooltip: {
                            formatter: function (params) {
                                return 'Answer: “'+params.data.key+'” <br/>Selected by: '+
                                    params.value+'% of the students';
                            }
                        },
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
                              barWidth: '20',
                                data: this.chartDATA[0]
                            },
                            {
                                name: 'bar2',
                                type: 'bar',
                                stack: 'one',
                              barWidth: '20',
                                data: this.chartDATA[1]
                            },
                            {
                                name: 'bar3',
                                type: 'bar',
                                stack: 'one',
                              barWidth: '20',
                                data: this.chartDATA[2]
                            },
                            {
                                name: 'bar4',
                                type: 'bar',
                                stack: 'one',
                              barWidth: '20',
                                data: this.chartDATA[3]
                            },
                            {
                                name: 'bar5',
                                type: 'bar',
                                stack: 'one',
                              barWidth: '20',
                                data: this.chartDATA[4]
                            },
                            {
                                name: 'bar6',
                                type: 'bar',
                                stack: 'one',
                              barWidth: '20',
                                data: this.chartDATA[5]
                            },
                            {
                                name: 'bar7',
                                type: 'bar',
                                stack: 'one',
                              barWidth: '20',
                                data: this.chartDATA[6]
                            },
                            {
                                name: 'bar8',
                                type: 'bar',
                                stack: 'one',
                              barWidth: '20',
                                data: this.chartDATA[7]
                            },
                            {
                                name: 'bar9',
                                type: 'bar',
                                stack: 'one',
                              barWidth: '20',
                                data: this.chartDATA[8]
                            },
                            {
                                name: 'bar10',
                                type: 'bar',
                                stack: 'one',
                              barWidth: '20',
                                data: this.chartDATA[9]
                            },
                            {
                                name: 'bar11',
                                type: 'bar',
                                stack: 'one',
                              barWidth: '20',
                                data: this.chartDATA[10]
                            },
                            {
                                name: 'bar12',
                                type: 'bar',
                                stack: 'one',
                                barWidth: '20',
                                data: this.chartDATA[11]
                            },
                            {
                              name: 'bar13',
                              type: 'bar',
                              stack: 'two',
                              barWidth: '20',
                              data: this.chartDATATwo[0]
                            },
                            {
                              name: 'bar14',
                              type: 'bar',
                              stack: 'two',
                              barWidth: '20',
                              data: this.chartDATATwo[1]
                            },
                            {
                              name: 'bar15',
                              type: 'bar',
                              stack: 'two',
                              barWidth: '20',
                              data: this.chartDATATwo[2]
                            },
                            {
                              name: 'bar16',
                              type: 'bar',
                              stack: 'two',
                              barWidth: '20',
                              data: this.chartDATATwo[3]
                            },
                            {
                              name: 'bar17',
                              type: 'bar',
                              stack: 'two',
                              barWidth: '20',
                              data: this.chartDATATwo[4]
                            },
                            {
                              name: 'bar18',
                              type: 'bar',
                              stack: 'two',
                              barWidth: '20',
                              data: this.chartDATATwo[5]
                            },
                            {
                              name: 'bar19',
                              type: 'bar',
                              stack: 'two',
                              barWidth: '20',
                              data: this.chartDATATwo[6]
                            },
                            {
                              name: 'bar20',
                              type: 'bar',
                              stack: 'two',
                              barWidth: '20',
                              data: this.chartDATATwo[7]
                            },
                            {
                              name: 'bar21',
                              type: 'bar',
                              stack: 'two',
                              barWidth: '20',
                              data: this.chartDATATwo[8]
                            },
                            {
                              name: 'bar22',
                              type: 'bar',
                              stack: 'two',
                              barWidth: '20',
                              data: this.chartDATATwo[9]
                            },
                            {
                              name: 'bar23',
                              type: 'bar',
                              stack: 'two',
                              barWidth: '20',
                              data: this.chartDATATwo[10]
                            },
                            {
                              name: 'bar24',
                              type: 'bar',
                              stack: 'two',
                              barWidth: '20',
                              data: this.chartDATATwo[11]
                            }
                        ]
                    };
                }else{
                    this.chartData = {
                        backgroundColor: '#fff',
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

                          let count = 0;
                          let count_two = 0;

                          let sum_two =0;
                          let mean_two;
                          let std_two;

                          let g1 ,g2;

                          params.forEach((value) => {
                            if(value.data[4] === "g1") {
                              sum = sum + parseFloat(value.data[1]);
                              description = value.data[2];
                              Event = value.name;
                              g1 = value.data[3];
                              count++;
                            }
                          });
                          mean = (sum / count ).toFixed(2);

                          sum = 0;
                          params.forEach((value) => {
                            if(value.data[4] === "g1") {
                              let x = (parseFloat(value.data[1]) - mean);
                              sum = sum + (x * x);
                            }
                          });
                          std = sum / (count - 1);




                          params.forEach((value) => {
                            if(value.data[4] === "g2") {
                              sum_two = sum_two + parseFloat(value.data[1]);
                              g2 = value.data[3];
                              count_two++;
                            }
                          });
                          mean_two = (sum_two / count_two ).toFixed(2);

                          sum_two = 0;
                          params.forEach((value) => {
                            if(value.data[4] === "g2") {
                              let x = (parseFloat(value.data[1]) - mean_two);
                              sum_two = sum_two + (x * x);
                            }
                          });
                          std_two = sum_two / (count_two - 1);


                          return Event+' : '+description+'<br/>'+g1+' Avg: ' + mean + 'secs.<br/>'+g1+' Std: ' + std.toFixed(2)+'secs.<br/> '+g2+' Avg: ' + mean_two + 'secs.<br/>'+g2+' Std: ' + std_two.toFixed(2)+'secs.';
                        }
                      },
                        xAxis: {
                            scale: true,
                            data: this.distinct_event_temp,
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
                                data: this.unique_decision_final_temp,
                            },
                            {
                                name: this.groupTwo,
                                type: 'scatter',
                                data: this.unique_decision_final_temp_two,
                           }
                        ]
                    };
                }
            },
            gotoEvent(value){
                this.$router.push('/main/group/VideoGameSelection/'+this.game+'/'+this.chapter+'/'+this.version+'/'+ this.SelectGroupOne +'/'+ this.SelectGroupTwo +'/MacroAnalysis/' + value + '/'+this.choice+'/EventView');
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
