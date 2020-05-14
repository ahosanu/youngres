<template>
  <div>
    <router-view name="header"></router-view>
    <router-view name="header-login-info"></router-view>
    <router-view></router-view>
  </div>
</template>

<script>

export default {

  data: function(){
    return {
      login: false,
      userName: null,
      userID: null,
    };
  },
  methods: {
    loginBack(data){
      this.login = data.login;
      this.userName = data.userName;
      console.log(data);
    }
  },
  created(){
    this.$store.dispatch('tryToLogin');
  }
}
</script>

<style>

</style>
