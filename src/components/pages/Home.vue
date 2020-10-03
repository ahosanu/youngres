<template>
    <div class="content">
        <p class="title">Please, select the type of analysis you want to perform:</p>
        <div>
            <div class="custom-control custom-radio">
                <input type="radio" id="customRadio1" name="customRadio" v-model="selectedAnalysis" value="single" class="custom-control-input">
                <label class="custom-control-label" :class="selectedAnalysis == 'single' ? 'checked' : '' "  for="customRadio1">Micro-analysis (Single group)</label>
            </div>
            <div class="custom-control custom-radio">
                <input type="radio" id="customRadio2" name="customRadio" v-model="selectedAnalysis" value="group" class="custom-control-input">
                <label class="custom-control-label" :class="selectedAnalysis == 'group' ? 'checked' : '' " for="customRadio2">Macro-analysis (Two groups)</label>
            </div>
        </div>
        <div class="row">
            <div class="col-4">
            </div>
            <div class="col-4 text-center">
            </div>
            <div class="col-4 text-right">
                <button class="btn btn-primary" :disabled="selectedAnalysis === null" @click="next">Next</button>
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        data: function() {
          return {
              selectedAnalysis: null,
          };
        },
        methods: {

            next(){
                this.$router.push('/main/'+this.selectedAnalysis+'/VideoGameSelection');
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
    .content{
        margin: 50px 0;
        .title{
          font-size: 21px;
          font-weight: 600;
          text-transform: capitalize;
        }

      .custom-control{
            margin-top: 16px;
        }
      .checked{
        color: #e35219;
      }
      label{
        font-weight: 600;
        font-size: 17px;
      }
    }
</style>
