<template>
  <img alt="Vue logo" src="./assets/logo.png" @click="show=!show">
  <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" v-if="show"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import HelloWorld from './components/HelloWorld.vue';
import { getCurrentUser } from './getCurrentUse';

export default defineComponent({
  name: 'App',
  components: {
    HelloWorld
  },
  data(){
    return {show:true}
  },
  methods:{
    async request() {
      getCurrentUser()
      getCurrentUser()
      await getCurrentUser()
      getCurrentUser()
      getCurrentUser()
    }
  }
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
