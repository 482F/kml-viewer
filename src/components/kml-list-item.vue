<template>
  <div v-intersect="onIntersect">
    <v-list-item
      v-if="isIntersect"
      class="kml-list-item"
      :style="{ '--image-height': imageHeight + 'px' }"
    >
      <kml-list-cell
        v-for="({ name, width }, i) of columns"
        :class="{ 'is-name': i === 0 }"
        :key="name"
        :width="width"
        :content="datum[name]"
      />
      <div class="images">
        <div
          class="image-container"
          v-for="src of imageSrcs"
          :key="src"
          @click="open(src)"
        >
          <img class="image" :src="src" :height="imageHeight" />
        </div>
      </div>
    </v-list-item>
  </div>
</template>

<script>
import KmlListCell from './kml-list-cell.vue'

const imageHeight = 100

export default {
  name: 'kml-list-item',
  components: {
    KmlListCell,
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
    open(url) {
      window.open(url)
    },
    onIntersect(entries) {
      this.isIntersect = entries
    },
  },
}
</script>

<style lang="scss" scoped>
.kml-list-item {
  border-style: solid none none none;
  border-width: 1px;
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
        pointer-events: none;
      }
      &:hover {
        z-index: 1;
        .image {
          transform: scale(8);
        }
      }
    }
  }
}
</style>
