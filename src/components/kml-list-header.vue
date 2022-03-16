<template>
  <v-list-item>
    <kml-list-cell
      v-for="{ name, width } of columns"
      :key="name"
      :width="width"
      :content="name"
    />
  </v-list-item>
</template>

<script>
import KmlListCell from './kml-list-cell.vue'

export default {
  name: 'kml-list-header',
  components: {
    KmlListCell,
  },
  props: {
    columns: {
      type: Array,
      required: true,
    },
  },
}
</script>
