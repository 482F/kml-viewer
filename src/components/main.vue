<template>
  <div class="f-main">
    <v-file-input @change="fileInput" label="kml を添付" outlined dense />
    <kml-viewer :raw-kml="rawKml" />
  </div>
</template>

<script>
import KmlViewer from './kml-viewer.vue'

export default {
  name: 'main',
  components: {
    KmlViewer,
  },
  data: () => ({
    rawKml: '',
  }),
  methods: {
    async fileInput(file) {
      if (!file) {
        this.rawKml = ''
      }
      this.rawKml = await file.text()
    },
  },
}
</script>

<style lang="scss" scoped>
.f-main {
  padding: 4rem;
  display: flex;
  flex-direction: column;
}
</style>
