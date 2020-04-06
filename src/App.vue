<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
export default {
  name: 'App',
  beforeCreate(){
    this.$store.commit('querySongList')
  },
  methods:{
    ...mapMutations([
      'querySongList'
    ])
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  /* margin-top: 0px; */
}
</style>
