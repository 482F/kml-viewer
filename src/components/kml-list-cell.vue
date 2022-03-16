<template>
  <div class="cell" :style="{ '--width': width + 'px' }">
    <v-menu open-on-hover offset-y>
      <template v-slot:activator="{ on }">
        <div v-on="on" class="inner">
          {{ content }}
        </div>
      </template>
      <div class="kml-list-cell-tooltip">
        <div v-for="(line, i) of content.split('\n')" :key="i">
          {{ line }}
        </div>
          {{[...content.matchAll(/https?:\/\/[^\s]+jpg/g)]}}
      </div>
    </v-menu>
  </div>
</template>

<script>
export default {
  name: 'kml-list-cell',
  props: {
    content: {
      type: String,
      default: '',
    },
    width: {
      type: Number,
      default: 100,
    },
  },
}
</script>

<style lang="scss" scoped>
.cell {
  --width: 100px;
  background-color: white;
  flex-shrink: 0;
  width: var(--width);
  height: 48px;
  display: flex;
  align-items: center;
  .inner {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
}
</style>

<style lang="scss">
.kml-list-cell-tooltip {
  padding: 1rem;
  background-color: white;
}
</style>
