<template>
    <modal name="filter" height="auto" class="mymodal">
        <p style="text-align: center; padding: 20px; font-weight: bold;">Filter</p>
        <div class="row" style="min-height: 310px;">
            <div class="col-md-6">

                <p style="text-align: center">
                    <input type="checkbox" v-model="group" @change="filterUpdate()" value="group"> Group
                </p>

                <div class="group" style="padding: 0" :class="group ? '' : 'group_block'">
                    <div class="group">
                        <p>
                            <input type="checkbox" v-model="country" @change="filterUpdate()"> Country
                        </p>
                        <select :disabled="!country" v-model="selectedCountry" @change="filterUpdate()">
                            <option v-for="item in countryList" :key="item">{{item}}</option>
                        </select>

                        <p>
                            <input type="checkbox" v-model="city" @change="filterUpdate()"> City
                        </p>
                        <select :disabled="!city"  v-model="selectedCity" @change="filterUpdate()">
                          <option v-for="item in cityList" :key="item">{{item}}</option>
                        </select>
                    </div>
                    <p style="text-align: center" v-if="type">
                        <input type="checkbox" v-model="s_group"  @change="filterUpdate()"> Specific Groups
                    </p>
                    <div class="group" :class="s_group ? '' : 'group_block'" v-if="type">
                        <ul class="group_id_list" @change="filterUpdate()">

                        <li v-for="item in groupIdList" :key="item.group_id">
                            <input :value="item.group_id" v-model="selected_groups" type="checkbox" > {{item.group_id}}
                        </li>

                        </ul>
                        <button class="btn btn-info" @click="selectAll(false)" style="margin-right: 3px">Unselect All</button>
                        <button class="btn btn-info" @click="selectAll(true)">Select All</button>
                    </div>

                </div>

            </div>
            <div class="col-md-6">
                <p style="text-align: center">
                    <input type="checkbox" v-model="student" @change="filterUpdate()"> Student
                </p>

                <div class="group" :class="student ? '' : 'group_block'">
                    <p>
                        <input v-model="age" type="checkbox" @change="filterUpdate()"> Age
                    </p>
                    <p>
                        Min <input type="number" @change="filterUpdate()"  :min="limit_min" :max="max_age" v-model="min_age" :disabled="!age" class="error" style="width: 50px">
                        Max <input type="number"  @change="filterUpdate()" :max="limit_max" :min="min_age" v-model="max_age" :disabled="!age" class="error" style="width: 50px">
                    </p>
                    <p>
                        <input type="checkbox" v-model="sex" @change="filterUpdate()"> Gender
                    </p>

                    <select v-model="selected_sex" :disabled="!sex" @change="filterUpdate()">
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>

                </div>

            </div>

        </div>
      <div class="btngroup text-right m-3">
        <button class="btn btn-outline-primary" @click="close()">Back</button>
        <button class="btn btn-success offset-1" @click="filter()">Filter</button>
      </div>
    </modal>
</template>

<script>
    export default {
      data: function () {
        return {
          s_group: false,
          country: false,
          city: false,
          group: false,
          age: false,
          sex: false,
          min_age: '',
          max_age: '',
          student: false,
          selected_sex: 'male',
          selected_groups: [],
          countryList: [],
          cityList: [],
          groupIdList: [],
          limit_min: 0,
          limit_max: 0,
          filterHeader: [],
          selectedCountry: '',
          selectedCity: '',
          type: false,
        };
      },
      mounted(){

        this.$root.$on('loadFilterDate', (Filter) => {

          this.type = Filter[2] === "single";

          if(Filter[0].filters !== undefined) {
            this.countryList = Filter[0].filters[0].values;
            this.cityList = Filter[0].filters[1].values;
            if(this.type)
              this.groupIdList = Filter[0].group_ids;
          }
          if(Filter[1].filters !== undefined){
            this.limit_min = Filter[1].filters[1].values[0];
            this.limit_max = Filter[1].filters[1].values[1];
          }
        });
      }
      , methods:{
            close(){
                this.$modal.hide('filter');
            },

            filter(){
              this.$modal.hide('filter');
              if(this.type)
                this.$root.$emit('loadFilterHeaderSingle', this.filterHeader);
              else
                this.$root.$emit('loadFilterHeaderGroup', this.filterHeader);
            },
            filterUpdate(){
              this.filterHeader = {};
              if(this.group) {
                this.filterHeader['group'] = null;

                /*Add Country*/
                if(this.country) {
                 if(this.filterHeader['group'] === null)
                   this.filterHeader['group'] = [];
                 this.filterHeader['group'].push({"key":"country", "min_value": this.selectedCountry});
                }else if(this.filterHeader['group'] !== null){
                  /*Remove country*/
                  this.filterHeader['group'].filter(item => {
                    delete item.country
                  });
                }

                /*Add City*/
                if(this.city) {
                  if(this.filterHeader['group'] === null)
                    this.filterHeader['group'] = [];
                  this.filterHeader['group'].push({"key":"city", "min_value": this.selectedCity});
                }else if(this.filterHeader['group'] !== null){
                  //remove city
                  this.filterHeader['group'].filter(item => {
                    delete item.city
                  });
                }



                /*Add Group Id*/
                if(this.s_group) {
                  if(this.filterHeader['group'] === null)
                    this.filterHeader['group'] = [];
                  this.selected_groups.forEach((value) => {
                    this.filterHeader['group'].push({"key": "group_id", "min_value": value});
                  });


                }else if(this.filterHeader['group'] !== null){
                  //remove city
                  this.filterHeader['group'].filter(item => {
                    delete item.groups
                  });
                }



              }
              else {
                delete this.filterHeader.group;
              }

              if(this.student){
                this.filterHeader['student'] = null;

                /*Add Age*/
                if(this.age) {

                  if(this.filterHeader['student'] === null)
                    this.filterHeader['student'] = [];
                  this.filterHeader['student'].push({"key": "age", "min_value": this.min_age, "max_value": this.max_age});

                }else if(this.filterHeader['student'] !== null){
                  //remove age
                  this.filterHeader['student'].filter(item => {
                      delete item.age
                  });
                }

                /*Add Age*/
                if(this.sex) {

                  if(this.filterHeader['student'] === null)
                    this.filterHeader['student'] = [];
                  this.filterHeader['student'].push({"key" : "sex", "min_value" : this.selected_sex});

                }else if(this.filterHeader['student'] !== null){
                  //remove city
                  this.filterHeader['student'].filter(item => {
                    delete item.sex
                  });
                }
              }else{
                delete this.filterHeader.student;
              }
            },
            selectAll(value) {
            var selected = [];

            if (value) {
              this.groupIdList.forEach(function (item) {
                selected.push(item.group_id);
              });
            }

            this.selected_groups = selected;
            this.filterUpdate();
          }

        }

    }
</script>

<style scoped lang="scss">
    .group{
        border: 1px solid gray;
        margin: 10px;
        padding: 10px;
        position: relative;
      .group_id_list{
        list-style: none;
        margin: 8px 0px;
        padding: 0px;
        max-height: 120px;
        overflow-y: auto;
        li{
          padding: 7px 0;
          margin: 0;
        }
      }
    }
    .group_block::after{
      content: "";
      position: absolute;
      width: 100%;
      height: 100%;
      display: block;
      background: #a5a5a547;
      top: 0;
      left: 0;
      z-index: 9999;
    }

    .vm--modal {
      left: 0 !important;
      width: 100% !important;
      overflow-y: auto !important;
      max-height: 600px !important;
    }

</style>
