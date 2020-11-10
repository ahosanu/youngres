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
          <select class="custom-select" v-model="choice"  @change="selectChoice($event)">
            <option selected value="multiple-choice">Multiple-choice</option>
            <option value="timed">Temporal</option>
            <!--<option value="xpe">A specific</option>-->
          </select>
        </div>
        <div class="col-md-5 mt-sm-3 mt-md-0">
          <button class="btn btn-success" style="margin-left: 10px" @click="submit()">Visualize</button>
          <button class="btn btn-dark" style="margin-left: 10px" @click="chapterInfo()">Chapter Info</button>
        </div>
      </div>
      <div class="row mt-3">
        <div class="col-md-3">
          <select class="custom-select" v-model="SelectGroupOne" >
            <option v-for="(item, index) in groupsList" :key="index" :value="item.group_id">{{item.group_id}} </option>
          </select>

        </div>
        <div class="col-md-1"><button class="btn btn-primary" @click="filterGroupOne()">Filter</button></div>
        <div class="col-md-3">
          <select class="custom-select" v-model="SelectGroupTwo">
            <option v-for="(item, index) in groupsList" :key="index" :value="item.group_id">{{item.group_id}}</option>
          </select>
        </div>
        <div class="col-md-1"><button class="btn btn-primary" @click="filterGroupTwo()">Filter</button></div>
      </div>
      <div class="row">
        <div class="col-md-9">
          <v-chart :options="chartDatas"/>
        </div>
        <div class="col-md-3">
          <p class="sub-title">Click to view Single Event Info:</p>
          <ul class="eventlist" v-if="choice === 'multiple-choice'">
            <li v-for="(item, index, key) in this.choiceList" :key="key" @click="gotoEvent(item.value)"> {{item.value}}: {{item.description}}</li>
          </ul>

          <div v-if="(this.choiceList.length === 0 && choice === 'multiple-choice') || (this.choiceList.length === 0 && choice === 'timed')">
           No data found.
          </div>

          <ul class="eventlist" v-if="choice === 'timed'">
            <li v-for="(item, index, key) in time_event_list_name" :key="key" @click="gotoEvent(item.value)"> {{item.value}}: {{item.description}}</li>
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
      chartDatas: null,
      choice: 'multiple-choice',
      decisions: [],
      max_choice: 0,
      decisions_two: [],
      type: null,
      game: null,
      version: null,
      chapter: null,
      result: [],
      chapters: [],
      groupsList: [],
      SelectGroupOne: null,
      SelectGroupTwo: null,
      GroupFilter: null,
      filterHeader: null,
      getFilterHeader: null,
      getFilterHeader_two: null,
      filterStudent: [],
      nextPageFilterOne: null,
      nextPageFilterTwo: null,
      listData: [],
      choiceList: [],
      choiceList_name: [],
      unique_decision_final_time_one: [],
      unique_decision_final_time_two: [],
      unique_decision_final_one: [],
      unique_decision_final_two: [],
      time_event_list: [],
      time_event_list_name: [],
      time_event_list_two: [],
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
      this.submitDataTwo();
      this.getData();
    })).catch(errors => {
      console.log(errors);
    })


    this.$root.$on('loadFilterHeaderGroup', (Filter) => { // here you need to use the arrow function
      this.getFilterHeader = {};
      this.getFilterHeader = Filter;
      //console.log(Filter);
      this.submitData();
      this.getData();
    });


    this.$root.$on('loadFilterHeaderGroupTwo', (Filter) => { // here you need to use the arrow function
      this.getFilterHeader_two = {};
      this.getFilterHeader_two = Filter;
      //console.log(Filter);
      this.submitDataTwo();
      this.getData();
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
    filterGroupOne(){

      this.$root.$emit('loadFilterDate', [this.GroupFilter, this.filterStudent, "group"]);
      this.$modal.show('filter');

    },
    filterGroupTwo(){

      this.$root.$emit('loadFilterDateTwo', [this.GroupFilter, this.filterStudent, "group"]);
      this.$modal.show('filterTwo');

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
    submit(){
      this.submitData();
      this.submitDataTwo();
      this.getData();
    },
    submitData(){
      this.loading = true;


      if(this.getFilterHeader === null || JSON.stringify(this.getFilterHeader) === JSON.stringify({})){
        this.getFilterHeader =  {"group": [
            {
              "key": "group_id",
              "min_value": this.SelectGroupOne
            }
          ]};

      }else{

        if(this.getFilterHeader.group !== undefined){

          if(this.getFilterHeader.group === null)
            this.getFilterHeader.group = [];
          let i =0;
         for( ;i < this.getFilterHeader.group.length; i++){
           if(this.getFilterHeader.group[i].min_value === this.SelectGroupOne && this.getFilterHeader.group[i].key === "group_id")
             break;
         }

         if(i === this.getFilterHeader.group.length){
           this.getFilterHeader.group.push({
             "key": "group_id",
             "min_value": this.SelectGroupOne
           });
         }

        }else {
          this.getFilterHeader.group = [];
          this.getFilterHeader.group.push({
            "key": "group_id",
            "min_value": this.SelectGroupOne
          });
        }


      }


    },
    submitDataTwo(){
      this.loading = true;
      if(this.getFilterHeader_two === null || JSON.stringify(this.getFilterHeader_two) === JSON.stringify({})){
        this.getFilterHeader_two =  {"group": [
            {
              "key": "group_id",
              "min_value": this.SelectGroupTwo
            }
          ]};

      }else{

        if(this.getFilterHeader_two.group !== undefined){

          if(this.getFilterHeader_two.group === null)
            this.getFilterHeader_two.group = [];
          let i =0;
          for( ;i < this.getFilterHeader_two.group.length; i++){
            if(this.getFilterHeader_two.group[i].min_value === this.SelectGroupTwo && this.getFilterHeader_two.group[i].key === "group_id")
              break;
          }

          if(i === this.getFilterHeader_two.group.length){
            this.getFilterHeader_two.group.push({
              "key": "group_id",
              "min_value": this.SelectGroupTwo
            });
          }

        }else {
          this.getFilterHeader_two.group = [];
          this.getFilterHeader_two.group.push({
            "key": "group_id",
            "min_value": this.SelectGroupTwo
          });
        }


      }



    },
    getData(){

      this.filterCheck();

      const requestOne = axios.get("decision?gameCode="+this.game+"&gameVersion="+this.version+"&chapterCode="+this.chapter, { headers: { filters: JSON.stringify(this.getFilterHeader)}});
      const requestTwo = axios.get("decision?gameCode="+this.game+"&gameVersion="+this.version+"&chapterCode="+this.chapter, { headers: { filters: JSON.stringify(this.getFilterHeader_two)}});





      axios.all([requestOne, requestTwo]).then(axios.spread((...responses) => {
        /*Group One*/
        this.decisions = responses[0].data.decisions;
        this.decisions_two = responses[1].data.decisions;
        this.Choice();

        this.dataAnalysis();
        this.dataAnalysisTwo();

        this.listData = [];

        let group_one = this.copy(this.choiceList_name);
        let group_two = this.copy(this.choiceList_name);
        group_one.forEach( value => {
          this.unique_decision_final_one.forEach(event => {
            let p = 0;
            for(;p < event.choice.length; p++){
              if(event.choice[p].name === value.name) {
                try {
                  value.choice.push({
                    name: event.choice[p].name,
                    value: event.choice[p].value,
                    event: event.value,
                    description: event.choice[p].description,
                    group: this.SelectGroupOne
                  });
                }catch (e) {
                  e.toString();
                }
                break;
              }
            }

            if(p === event.choice.length) {
              try {
                value.choice.push({
                  name: value.name,
                  value: 0,
                  event: event.value,
                  description: value.description,
                  group: this.SelectGroupOne
                });
              }catch (e) {
                e.toString();
              }
            }

          });
        });
        group_two.forEach( value => {
          this.unique_decision_final_two.forEach(event => {
            let p = 0;
            for(;p < event.choice.length; p++){
              if(event.choice[p].name === value.name) {
                try {
                  value.choice.push({
                    name: event.choice[p].name,
                    value: event.choice[p].value,
                    event: event.value,
                    description: event.choice[p].description,
                    group: this.SelectGroupTwo
                  });
                }catch (e) {
                  e.toString();
                }
                break;
              }
            }

            if(p === event.choice.length) {
              try {
                value.choice.push({
                  name: value.name,
                  value: 0,
                  event: event.value,
                  description: value.description,
                  group: this.SelectGroupTwo
                });
              }catch (e) {
                e.toString();
              }
            }

          });
        });

        let i = 0;



        group_one.forEach( value => {
          i++;
          if(value.choice !== undefined){


            var gr = this.SelectGroupOne;

            this.listData.push(
                {
                  name: this.SelectGroupOne+i,
                  type: 'bar',
                  stack: 'one',
                  barWidth: '20',
                  label: {
                    show: true,
                    position: 'insideBottom',

                    align: 'left',
                    verticalAlign: 'middle',
                    rotate: 90,
                    formatter: function(param) {
                      return param.data.value ? gr : '' ;
                    },
                    fontSize: 12,
                    rich: {
                      name: {
                        textBorderColor: '#ffffff'
                      }
                    }
                  },
                  data: value.choice
                }
            );
          }

        });

        group_two.forEach( value => {
          i++;


          if(value.choice !== undefined) {


            var gr = this.SelectGroupTwo;
            this.listData.push(
                {
                  name: this.SelectGroupTwo + i,
                  type: 'bar',
                  stack: 'two',
                  barWidth: '20',
                  label: {
                    show: true,
                    position: 'insideBottom',

                    align: 'left',
                    verticalAlign: 'middle',
                    rotate: 90,
                    formatter: function(param) {
                      return param.data.value ? gr : '';
                    },
                    fontSize: 12,
                    rich: {
                      name: {
                        textBorderColor: '#ffffff'
                      }
                    }
                  },
                  data: value.choice
                }
            );
          }
        });


        this.barChartLoad();

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
      let uniqueEventList = this.copy(this.choiceList);
      let uniqueEventListTime = [];


      for(let i =0; i < this.decisions.length;i++){
        let obj = this.decisions[i];
        if(obj.eventType === "timed"){

          let e =0;
          for(; e < uniqueEventListTime.length; e++){
            if(uniqueEventListTime[e].eventCode === obj.eventCode){

              let obj_event = uniqueEventListTime[e];
              let x = 0;
              for(; x < obj_event.choice.length; x++){
                if(obj_event.choice[x].name === obj.choice){
                  break;
                }
              }
              if(x === obj_event.choice.length){
                obj_event.choice.push({
                  value: obj.choice,
                  event: obj.eventCode,
                  description: obj.eventDescription
                });
              }

              break;
            }
          }
          if(e === uniqueEventListTime.length){
            uniqueEventListTime.push({
              eventCode: obj.eventCode,
              group: this.SelectGroupOne,
              choice: [{
                value: obj.choice,
                event: obj.eventCode,
                description: obj.eventDescription
              }]
            });


          }


        }else{
          let e =0;
          for(; e < uniqueEventList.length; e++){
            if(uniqueEventList[e].value === obj.eventCode){

              let obj_event = uniqueEventList[e];
              let x = 0;
              for(; x < obj_event.choice.length; x++){
                if(obj_event.choice[x].name === obj.choice){
                  obj_event.choice[x].count++;
                  break;
                }
              }
              break;
            }
          }

        }


      }


      uniqueEventList.forEach((value) => {
        let sum = 0;
        for(let i=0; i < value.choice.length; i++){
          sum+=value.choice[i].count;
        }
        for(let i=0; i < value.choice.length; i++){
          if(sum > 0)
          value.choice[i].value = (value.choice[i].count/sum)*100;
        }
      });
      // console.log(uniqueEventList)
     // console.log(uniqueEventListTime)

      this.unique_decision_final_one = uniqueEventList;
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
      let uniqueEventList = this.copy(this.choiceList);
      let uniqueEventListTime = [];

      for(let i =0; i < this.decisions_two.length;i++){
        let obj = this.decisions_two[i];
        if(obj.eventType === "timed"){

          let e =0;
          for(; e < uniqueEventListTime.length; e++){
            if(uniqueEventListTime[e].eventCode === obj.eventCode){

              let obj_event = uniqueEventListTime[e];
              let x = 0;
              for(; x < obj_event.choice.length; x++){
                if(obj_event.choice[x].name === obj.choice){
                  break;
                }
              }
              if(x === obj_event.choice.length){
                obj_event.choice.push({
                  value: obj.choice,
                  event: obj.eventCode,
                  description: obj.eventDescription
                });
              }

              break;
            }
          }
          if(e === uniqueEventListTime.length){
            uniqueEventListTime.push({
              eventCode: obj.eventCode,
              group: this.SelectGroupOne,
              choice: [{
                value: obj.choice,
                event: obj.eventCode,
                description: obj.eventDescription
              }]
            });


          }


        }else{
          let e =0;
          for(; e < uniqueEventList.length; e++){
            if(uniqueEventList[e].value === obj.eventCode){

              let obj_event = uniqueEventList[e];
              let x = 0;
              for(; x < obj_event.choice.length; x++){
                if(obj_event.choice[x].name === obj.choice){
                  obj_event.choice[x].count++;
                  break;
                }
              }
              break;
            }
          }
        }


      }


      uniqueEventList.forEach((value) => {
        let sum = 0;
        for(let i=0; i < value.choice.length; i++){
          sum+=value.choice[i].count;
        }
        for(let i=0; i < value.choice.length; i++){
          if(sum > 0)
              value.choice[i].value = (value.choice[i].count/sum)*100;
        }
      });
     // console.log(uniqueEventList)
      //console.log(uniqueEventListTime)
      this.unique_decision_final_two = uniqueEventList;

    },
    filterCheck(){

      if(this.getFilterHeader.group !== undefined){
        for(let i=0; i < this.getFilterHeader.group.length; i++){
          if(this.getFilterHeader.group[i].key === "group_id")
            this.getFilterHeader.group.splice(i, 1);
        }

        let q = 0;
        for( ;q < this.getFilterHeader.group.length; q++){
          if(this.getFilterHeader.group[q].key === "group_id" && this.getFilterHeader.group[q].min_value === this.SelectGroupOne)
            break;
        }

        if(q === this.getFilterHeader.group.length)
          this.getFilterHeader.group.push({
            "key": "group_id",
            "min_value": this.SelectGroupOne
          });

      }else{
        this.getFilterHeader.group = [];
        this.getFilterHeader.group.push({
          "key": "group_id",
          "min_value": this.SelectGroupOne
        });
      }

      if(this.getFilterHeader_two.group !== undefined){
        for(let i=0; i < this.getFilterHeader_two.group.length; i++){
          if(this.getFilterHeader_two.group[i].key === "group_id")
            this.getFilterHeader_two.group.splice(i, 1);
        }

        let q = 0;
        for( ;q < this.getFilterHeader_two.group.length; q++){
          if(this.getFilterHeader_two.group[q].key === "group_id" && this.getFilterHeader_two.group[q].min_value === this.SelectGroupTwo)
            break;
        }

        if(q === this.getFilterHeader_two.group.length)
          this.getFilterHeader_two.group.push({
            "key": "group_id",
            "min_value": this.SelectGroupTwo
          });

      }else{
        this.getFilterHeader_two.group = [];
        this.getFilterHeader_two.group.push({
          key: "group_id",
          min_value: this.SelectGroupTwo
        });
      }

    },
    Choice(){
      let choiceList = [];
      let choiceList_name = [];
      let choiceList_name_time = [];
      this.time_event_list = [];
      this.time_event_list_two = [];

      this.decisions.forEach(value=>{
        if(value.eventType !== "timed"){

          let x =0;
          for(; x < choiceList_name.length ; x++){
            if(choiceList_name[x].name === value.choice){

                  break;
              }
            }

          if(x === choiceList_name.length)
            choiceList_name.push({name: value.choice, description: value.eventDescription,  event: value.eventCode,choice: []});
        }else {
          /*
          * choice": "90",
                "eventCode": "e.G1.1.2",
                "eventDescription": "Seconds waiting for your friend?",
                "eventType": "timed"*/
          this.time_event_list.push([value.eventCode, value.choice, value.eventDescription, this.SelectGroupOne ,"g1"])
          let x =0;
          for(; x < choiceList_name_time.length ; x++){
            if(choiceList_name_time[x].value === value.eventCode){
              break;
            }
          }

          if(x === choiceList_name_time.length)
            choiceList_name_time.push({value: value.eventCode, description: value.eventDescription});
        }
      });
      this.decisions_two.forEach(value=>{
        if(value.eventType !== "timed"){

          let x =0;
          for(; x < choiceList_name.length ; x++){
            if(choiceList_name[x].name === value.choice){

              break;
            }
          }

          if(x === choiceList_name.length)
            choiceList_name.push({name: value.choice, description: value.eventDescription,  event: value.eventCode,choice: []});
        }else {

          this.time_event_list_two.push([value.eventCode, value.choice, value.eventDescription , this.SelectGroupTwo ,"g2"])
          let x =0;
          for(; x < choiceList_name_time.length ; x++){
            if(choiceList_name_time[x].value === value.eventCode){
              break;
            }
          }

          if(x === choiceList_name_time.length)
            choiceList_name_time.push({value: value.eventCode, description: value.eventDescription});
        }
      });


      this.decisions.forEach(value=>{
        if(value.eventType !== "timed"){



          let x =0;
          for(; x < choiceList.length ; x++){
            if(choiceList[x].value === value.eventCode){

              let c = 0;
              for(;c < choiceList[x].choice.length; c++){
                if( choiceList[x].choice[c].name === value.choice)
                  break;
              }

              if(choiceList[x].choice.length === c)
                choiceList[x].choice.push(
                    {
                      name: value.choice,
                      count: 0,
                      value: 0,
                      event: value.eventCode,
                      description: value.eventDescription
                    }
                );

              break;
            }
          }
          if(x === choiceList.length)
            choiceList.push({
              value: value.eventCode,
              group: this.SelectGroupTwo,
              description: value.eventDescription,
              choice: [{
                name: value.choice,
                count: 0,
                value: 0,
                event: value.eventCode,
                description: value.eventDescription
              }]
            });



        }
      });
      this.decisions_two.forEach(value=>{
        if(value.eventType !== "timed"){

          let x =0;
          for(; x < choiceList.length ; x++){
            if(choiceList[x].value === value.eventCode){

              let c = 0;
              for(;c < choiceList[x].choice.length; c++){
                if( choiceList[x].choice[c].name === value.choice)
                  break;
              }

              if(choiceList[x].choice.length === c)
                choiceList[x].choice.push(
                    {
                      name: value.choice,
                      count: 0,
                      value: 0,
                      event: value.eventCode,
                      description: value.eventDescription
                    }
                );

              break;
            }
          }
          if(x === choiceList.length)
            choiceList.push({
              value: value.eventCode,
              description: value.eventDescription,
              group: this.SelectGroupTwo,
              choice: [{
                name: value.choice,
                count: 0,
                value: 0,
                event: value.eventCode,
                description: value.eventDescription
              }]
            });



        }
      });


      this.choiceList = choiceList;
      this.choiceList_name = choiceList_name;
      this.time_event_list_name = choiceList_name_time;
      //console.log(choiceList_name)
    },
    barChartLoad(){
      this.loading = true;

      var groupOne = this.SelectGroupOne;
      var groupTwo = this.SelectGroupTwo;

      if(this.choice === "multiple-choice") {
        this.chartDatas = {
          backgroundColor: '#fff',
          tooltip: {
            formatter: function (params) {
             // console.log(params)
              return params.data.event +': '+params.data.description+'<br>Answer: “'+params.data.name+'” <br/>Selected by: '+
                  params.value+'% of the students';
            }
          },
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
          series: this.listData
        };
      }else{
        this.chartDatas = {
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


              params.forEach((value) => {
                if(value.data[4] === "g1") {
                  sum = sum + parseFloat(value.data[1]);
                  description = value.data[2];
                  Event = value.name;
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
              std = Math.sqrt(sum / (count));




              params.forEach((value) => {
                if(value.data[4] === "g2") {
                  sum_two = sum_two + parseFloat(value.data[1]);
                  description = value.data[2];
                  Event = value.name;
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
              std_two = Math.sqrt(sum_two / (count_two));


              return Event+' : '+description+'<br/>'+groupOne+' Avg: ' + (mean === 'NaN' ? 0 : mean ) + ' secs.<br/>'+groupOne+' Std: ' + std.toFixed(2)+' secs.<br/> '+groupTwo+' Avg: ' + (mean_two === 'NaN' ? 0 : mean_two ) + ' secs.<br/>'+groupTwo+' Std: ' + std_two.toFixed(2)+' secs.';
            }
          },
          xAxis: {
            scale: true,
            data: this.time_event_list_name,
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
              data: this.time_event_list,
            },
            {
              name: this.groupTwo,
              type: 'scatter',
              data: this.time_event_list_two,
            }
          ]
        };
      }
      this.loading = false;
    },
    gotoEvent(value){
      this.$router.push({path: '/main/group/VideoGameSelection/'+this.game+'/'+this.chapter+'/'+this.version+'/'+ this.SelectGroupOne +'/'+ this.SelectGroupTwo +'/MacroAnalysis/' + value + '/'+this.choice+'/EventView', query:  {groupOne: JSON.stringify(this.getFilterHeader), groupTwo: JSON.stringify(this.getFilterHeader_two)}});
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
