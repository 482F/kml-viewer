<template>
  <v-app>
    <v-main>
      <main-component />
    </v-main>
  </v-app>
</template>

<script>
import MainComponent from './components/main.vue'

export default {
  name: 'App',
  components: {
    MainComponent,
  },
  data: () => ({
    //
  }),
}
</script>

<style lang="scss">
* {
  &::-webkit-scrollbar-track {
    background-color: #eee;
  }
  &::-webkit-scrollbar {
    width: 0px;
    height: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 30px;
  }
}
</style>
