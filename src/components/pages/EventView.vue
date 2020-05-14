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
            <p>You have selected:</p>
            <br/>
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
                    <!--<img src="@/assets/image2.png" style="width: 100%;" alt="">-->
                </div>
                <div class="col-5">
                    <strong>Event 4:</strong>
                    <p>{{description}}</p>

                    <strong>Highlights:</strong>
                   <p v-for="(item, index) in this.highlights" :key="index">{{item}}</p>
                    <span v-if="choice === 'choice'">
                    There are three possible answers:
                    <br/>
                    <div class="ans" v-for="(item,index, key) in AnswerList" :key="key">
                        <p>- Answer 1: “{{item.name}}”.</p>
                        <p>Selected by: {{item.percent}}%</p>
                    </div>
                    </span>
                    <span v-if="choice === 'timed'">
                    Statistics:

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
                <button class="btn btn-outline-primary" @click="back">Back</button>
            </div>
            <div class="col-4 text-center">
                <button class="btn btn-outline-primary" @click="home">Home</button>
            </div>
            <div class="col-4 text-right">

                <button class="btn btn-outline-primary" @click="exportOpt">Export</button>
            </div>
        </div>
    </div>
</template>

<script>
    //import axios from "axios";
    import ECharts from 'vue-echarts'
    import 'echarts/lib/chart/bar'
    import 'echarts/lib/component/tooltip'
    import 'echarts-gl'

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
                type: null,
                game: null,
                version: null,
                chapter: null,
                gameevent: null,
                chartDATA: [],
                AnswerList: [],
                mean_val: 0,
                std: 0,

            };
        },
        mounted(){

            this.type = this.$route.params.type;
            this.game = this.$route.params.game;
            this.gameevent = this.$route.params.event;
            this.chapter = this.$route.params.chapter;
            this.choice = this.$route.params.choice;


            this.$store.state.games = [
                {
                    "chapters": [
                        "chapter 1",
                        "chapter 2",
                        "chapter 3"
                    ],
                    "countries": [
                        "Spain",
                        "Finland"
                    ],
                    "gameCode": "Game 1",
                    "gameDescription": "Game were LGTBI content is discussed",
                    "gameVersion": "v0.1",
                    "numberPlayers": "60"
                },
                {
                    "chapters": [
                        "chapter 1",
                        "chapter 2",
                        "chapter 3"
                    ],
                    "countries": [
                        "Spain",
                        "Bangladesh"
                    ],
                    "gameCode": "Game 2",
                    "gameDescription": "Game 2 were LGTBI content is discussed",
                    "gameVersion": "v0.1",
                    "numberPlayers": "40"
                },
                {
                    "chapters": [
                        "chapter 1",
                        "chapter 2",
                        "chapter 3",
                        "chapter 4",
                        "chapter 5",
                    ],
                    "countries": [
                        "Spain",
                        "Bangladesh"
                    ],
                    "gameCode": "Game 3",
                    "gameDescription": "Game 2 were LGTBI content is discussed",
                    "gameVersion": "v0.1",
                    "numberPlayers": "40"
                },

            ];

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

        },
        methods: {
            exportOpt(){

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


                this.decisions = [
                    {
                        "choice": "cat",
                        "eventCode": "ee1",
                        "eventDescription": "student is asked for its favorite pet...",
                        "eventType": "choice"
                    },
                    {
                        "choice": "dog",
                        "eventCode": "ee1",
                        "eventDescription": "student is asked for its favorite pet...",
                        "eventType": "choice"
                    },
                    {
                        "choice": "rr",
                        "eventCode": "e1",
                        "eventDescription": "student is asked for its favorite pet...",
                        "eventType": "choice"
                    },
                    {
                        "choice": "rr4",
                        "eventCode": "Event 1",
                        "eventDescription": "student is asked for its favorite pet...",
                        "eventType": "choice"
                    },
                    {
                        "choice": "rr",
                        "eventCode": "Event 1",
                        "eventDescription": "student is asked for its favorite pet...",
                        "eventType": "choice"
                    },
                    {
                        "choice": "rrr",
                        "eventCode": "e1",
                        "eventDescription": "student is asked for its favorite pet...",
                        "eventType": "choice"
                    },
                    {
                        "choice": "rr",
                        "eventCode": "e1",
                        "eventDescription": "student is asked for its favorite pet...",
                        "eventType": "choice"
                    },
                    {
                        "choice": "dd",
                        "eventCode": "e1",
                        "eventDescription": "student is asked for its favorite pet...",
                        "eventType": "choice"
                    },
                    {
                        "choice": "catfish",
                        "eventCode": "e2",
                        "eventDescription": "student is asked for its favorite fish...",
                        "eventType": "choice"
                    },
                    {
                        "choice": "salmon",
                        "eventCode": "e2",
                        "eventDescription": "student is asked for its favorite fish...",
                        "eventType": "choice"
                    },
                    {
                        "choice": "salmon",
                        "eventCode": "edas2",
                        "eventDescription": "student is asked for its favorite fish...",
                        "eventType": "choice"
                    },

                    {
                        "choice": "90",
                        "eventCode": "e3",
                        "eventDescription": "Seconds waiting for your friend",
                        "eventType": "timed"
                    },
                    {
                        "choice": "10",
                        "eventCode": "e3",
                        "eventDescription": "Seconds waiting for your friend",
                        "eventType": "timed"
                    },
                    {
                        "choice": "90",
                        "eventCode": "e3",
                        "eventDescription": "Seconds waiting for your friend",
                        "eventType": "timed"
                    },
                    {
                        "choice": "5",
                        "eventCode": "e4",
                        "eventDescription": "3rd waiting for your friend",
                        "eventType": "timed"
                    },
                    {
                        "choice": "10",
                        "eventCode": "e4",
                        "eventDescription": "3rd waiting for your friend",
                        "eventType": "timed"
                    }
                ];

                this.result = {
                    "eventCode": "e3",
                    "eventDescription": "Seconds waiting for your friend",
                    "eventType": "timed",
                    "highlights": [ "H1 - Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,." ],
                    "possibleChoices": [
                        "10",
                        "90"
                    ]
                };

                this.dataAnalysis();

                this.highlights = this.result.highlights;
                this.description = this.result.eventDescription;

                this.loadEvent();

                this.loading = false;
            },
            home(){

                this.$router.push('/main');
            },
            back(){
                this.$router.push('/main/'+this.type+'/VideoGameSelection/'+this.game+'/'+this.chapter+'/'+this.version+'/MicroAnalysis');
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
                                type: 'bar',
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
                            max: 100
                        },
                        series: [
                            {
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
</style>
