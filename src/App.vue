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
