<template>
  <v-list-item>
    <kml-list-cell
      v-for="({ name, width }, i) of columns"
      :class="{ 'is-name': i === 0 }"
      :key="name"
      :width="width"
      :content="datum[name]"
    />
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
  },
}
</script>

<style lang="scss" scoped>
.is-name {
  position: sticky;
  left: 0;
}
</style>
