<template>
  <div class="kml-list-item" v-intersect="onIntersect">
    <v-list-item
      v-if="isIntersect"
      :style="{ '--image-height': imageHeight + 'px' }"
    >
      <kml-list-cell
        v-for="({ name, width, show }, i) of columns"
        v-show="show"
        :class="{ 'is-name': i === 0 }"
        :key="name"
        :width="width"
        :content="datum[name]"
      />
      <v-btn icon @click="openMap">
        <v-icon> mdi-earth</v-icon>
      </v-btn>
      <div class="images">
        <div
          class="image-container"
          v-for="src of imageSrcs"
          :key="src"
          @click="open(src)"
        >
          <image-thumbnail :src="src" :thumbnail-height="imageHeight" />
        </div>
      </div>
    </v-list-item>
  </div>
</template>

<script>
import KmlListCell from './kml-list-cell.vue'
import ImageThumbnail from './image-thumbnail.vue'

const imageHeight = 100

export default {
  name: 'kml-list-item',
  components: {
    KmlListCell,
    ImageThumbnail,
  },
  data() {
    return {
      isIntersect: false,
    }
  },
  props: {
    columns: {
      type: Array,
      required: true,
    },
    datum: {
      type: Object,
      required: true,
    },
    imageSrcs: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    imageHeight: () => imageHeight,
  },
  methods: {
    openMap() {
      this.open(
        `https://www.google.com/maps/search/${this.datum.lat}+${this.datum.lng}`
      )
    },
    open(url) {
      window.open(url)
    },
    onIntersect(entries, observer, isIntersecting) {
      this.isIntersect = isIntersecting
    },
  },
}
</script>

<style lang="scss" scoped>
.kml-list-item {
  border-style: solid none none none;
  border-width: 1px;
  height: 110px;
  display: flex;
  justify-content: center;
  > .v-list-item {
    padding: 0;
  }
  .is-name {
    position: sticky;
    left: 0;
  }
  .images {
    padding: 4px;
    display: flex;
    gap: 8px;
    .image-container {
      height: var(--image-height);
      cursor: pointer;
      .image {
        // pointer-events: none;
      }
      // &:hover {
      //   z-index: 1;
      //   .image {
      //     transform: scale(8);
      //   }
      // }
    }
  }
}
</style>
