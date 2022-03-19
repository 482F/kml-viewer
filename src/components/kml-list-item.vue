<template>
  <v-list-item class="kml-list-item">
    <kml-list-cell
      v-for="({ name, width }, i) of columns"
      :class="{ 'is-name': i === 0 }"
      :key="name"
      :width="width"
      :content="datum[name]"
    />
    <div class="images">
      <div class="image-container" v-for="src of imageSrcs" :key="src">
        <img class="image" @click="open(src)" :src="src" height="100" />
      </div>
    </div>
  </v-list-item>
</template>

<script>
import KmlListCell from './kml-list-cell.vue'

export default {
  name: 'kml-list-item',
  components: {
    KmlListCell,
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
  methods: {
    open(url) {
      window.open(url)
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
      .image:hover {
        position: absolute;
        transform: scale(8);
        z-index: 1;
        cursor: pointer;
      }
    }
  }
}
</style>
