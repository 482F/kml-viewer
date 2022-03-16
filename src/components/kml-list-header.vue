<template>
  <v-list-item class="kml-list-header">
    <template v-for="(column, i) of columns">
      <resizer
        :key="column.name"
        :class="{ 'is-name': i === 0 }"
        :directions="['right']"
        @change="(value) => (column.width = value)"
      >
        <div
          class="cell"
          @click="updateSortMethod(column)"
          :content="column.name"
          :style="{ '--width': column.width + 'px' }"
        >
          <div class="name">
            {{ column.name }}
          </div>
          <v-icon class="icon" v-if="sortMethod.key === column.name">
            {{ sortMethod.order === 1 ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
          </v-icon>
        </div>
      </resizer>
    </template>
  </v-list-item>
</template>

<script>
import Resizer from './resizer.vue'

export default {
  name: 'kml-list-header',
  data() {},
  components: {
    Resizer,
  },
  props: {
    columns: {
      type: Array,
      required: true,
    },
    sortMethod: {
      type: Object,
      required: true,
    },
  },
  methods: {
    updateSortMethod(column) {
      const key = column.name
      const order = this.sortMethod.key === key ? this.sortMethod.order * -1 : 1
      this.$emit('update:sort-method', { key, order })
    },
  },
}
</script>

<style lang="scss" scoped>
.kml-list-header {
  user-select: none;
  .cell {
    cursor: pointer;
    padding: 0 8px;
    height: 48px;
    transition: background-color 0.2s;
    width: var(--width);
    display: flex;
    align-items: center;
    justify-content: space-between;
    &:hover {
      background-color: lightgray;
    }
    .name {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }
}
</style>

<style lang="scss" scoped>
.is-name {
  position: sticky;
  left: 0;
}
</style>
