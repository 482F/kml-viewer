<template>
  <v-list-item>
    <kml-list-cell
      v-for="{ name, width } of columns"
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
