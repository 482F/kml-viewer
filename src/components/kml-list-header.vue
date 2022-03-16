<template>
  <v-list-item class="kml-list-header">
    <div class="left">
      <template v-for="(column, i) of columns">
        <resizer
          v-show="column.show"
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
              {{
                sortMethod.order === 1 ? 'mdi-chevron-up' : 'mdi-chevron-down'
              }}
            </v-icon>
            <v-icon
              class="icon show-on-hover"
              v-else
              @click="column.show = false"
            >
              mdi-close
            </v-icon>
          </div>
        </resizer>
      </template>
    </div>
    <div class="right">
      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn class="icon-button" icon v-on="on">
            <v-icon>mdi-menu</v-icon>
          </v-btn>
        </template>
        <div class="kml-list-header-menu">
          <v-list>
            <v-list-item
              v-for="column of columns"
              :key="column"
              v-show="!column.show"
              @click="column.show = true"
              :ripple="false"
            >
              {{ column.name }}
            </v-list-item>
          </v-list>
        </div>
      </v-menu>
    </div>
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
  display: flex;
  justify-content: space-between;
  .right,
  .left {
    display: flex;
    width: fit-content;
  }
  .right {
    flex-grow: 1;
    height: 48px;
    justify-content: flex-end;
    align-items: center;
    position: sticky;
    right: 0;
    > * {
      background-color: white;
    }
  }
  .cell {
    cursor: pointer;
    background-color: white;
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
  .icon-button {
    position: sticky;
    right: 0;
  }
}
</style>

<style lang="scss" scoped>
.kml-list-header {
  .is-name {
    position: sticky;
    left: 0;
  }
  .cell {
    &:not(:hover) {
      .show-on-hover {
        display: none;
      }
    }
  }
}
</style>

<style lang="scss">
.kml-list-header-menu {
  background-color: white;
}
</style>
