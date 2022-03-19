<template>
  <v-list-item class="kml-list-header">
    <template v-for="(column, i) of columns">
      <resizer
        :key="column.name"
        :class="{ 'is-name': i === 0 }"
        :directions="['right']"
        @change="(value) => (column.width = value)"
      >
        <kml-list-cell :width="column.width" :content="column.name" />
      </resizer>
    </template>
  </v-list-item>
</template>

<script>
import KmlListCell from './kml-list-cell.vue'
import Resizer from './resizer.vue'

export default {
  name: 'kml-list-header',
  data() {
    return {
      w1: 0,
      w2: 0,
    }
  },
  components: {
    KmlListCell,
    Resizer,
  },
  props: {
    columns: {
      type: Array,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.kml-list-header {
  user-select: none;
}
</style>

<style lang="scss" scoped>
.is-name {
  position: sticky;
  left: 0;
}
</style>
