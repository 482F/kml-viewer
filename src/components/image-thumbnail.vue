<template>
  <v-menu
    open-on-hover
    content-class="kml-list-item-image-menu"
    v-resize="onResize"
  >
    <template v-slot:activator="{ on }">
      <img
        ref="thumbnail"
        v-on="on"
        class="image"
        :src="src"
        :height="thumbnailHeight"
      />
    </template>
    <img :src="src" v-bind="modalImageSize" />
  </v-menu>
</template>

<script>
import { wait } from '482-js-utils'

export default {
  name: 'image-thumbnail',
  data() {
    return {
      naturalSize: { height: 0, width: 0 },
      windowSize: { height: 0, width: 0 },
    }
  },
  props: {
    thumbnailHeight: {
      type: Number,
      default: 100,
    },
    src: {
      type: String,
      required: true,
    },
  },
  computed: {
    modalImageSize() {
      const widthRatio = (this.windowSize.width * 0.9) / this.naturalSize.width
      const heightRatio =
        (this.windowSize.height * 0.9) / this.naturalSize.height
      const ratio = Math.min(widthRatio, heightRatio)
      return {
        height: this.naturalSize.height * ratio,
        width: this.naturalSize.width * ratio,
      }
    },
  },
  methods: {
    onResize() {
      this.windowSize = { height: window.innerHeight, width: window.innerWidth }
    },
  },
  async mounted() {
    await wait(() => this.$refs.thumbnail?.naturalHeight, 100, 5000)
    const thumbnail = this.$refs.thumbnail
    if (!thumbnail) {
      return
    }
    this.naturalSize = {
      height: thumbnail.naturalHeight,
      width: thumbnail.naturalWidth,
    }
  },
}
</script>

<style lang="scss">
.kml-list-item-image-menu {
  height: 90vh;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%);
  pointer-events: none;
  box-shadow: none;
  display: flex;
  justify-content: center;
  align-items: center;
  > image {
    height: 90vh;
  }
}
</style>
