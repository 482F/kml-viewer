<template>
  <v-list-item class="kml-list-header">
    <div class="inner">
      <div class="left">
        <draggable
          :list="columns"
          :animation="200"
          class="draggable"
          ghost-class="dragging"
          handle=".cell"
        >
          <transition-group class="transition-group" type="transition">
            <resizer
              v-for="(column, i) of columns"
              :key="column.name"
              v-show="column.show"
              :class="{ 'is-name': i === 0 }"
              direction="right"
              @input="(value) => (column.width = value)"
              @dragstart.native="dragStart"
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
                    sortMethod.order === 1
                      ? 'mdi-chevron-up'
                      : 'mdi-chevron-down'
                  }}
                </v-icon>
                <v-icon
                  class="icon show-on-hover"
                  v-else
                  @click.stop="column.show = false"
                >
                  mdi-close
                </v-icon>
              </div>
            </resizer>
          </transition-group>
        </draggable>
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
                :key="column.name"
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
    </div>
    <div ref="ghost" />
  </v-list-item>
</template>

<script>
import draggable from 'vuedraggable'

import Utils from '482-vue-utils'
const Resizer = Utils.Resizer

export default {
  name: 'kml-list-header',
  data() {
    return {}
  },
  components: {
    draggable,
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
    dragStart(e) {
      e.dataTransfer.setDragImage(this.$refs.ghost, 0, 0)
    },
  },
}
</script>

<style lang="scss" scoped>
.kml-list-header {
  .inner {
    width: 100%;
    user-select: none;
    display: flex;
    justify-content: space-between;
    .right,
    .left {
      display: flex;
      width: fit-content;
    }
    .left {
      flex-shrink: 0;
    }
    .right {
      height: 48px;
      justify-content: flex-end;
      align-items: center;
      position: sticky;
      right: 0;
      > * {
        background-color: white;
      }
    }
    .draggable {
      > .transition-group {
        display: flex;
        > .resizer {
          &.dragging {
            opacity: 0.8;
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
            &:not(:hover) {
              .show-on-hover {
                display: none;
              }
            }
            .name {
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow: hidden;
            }
          }
        }
        > .is-name {
          position: sticky;
          left: 0;
        }
      }
    }
    .icon-button {
      position: sticky;
      right: 0;
    }
  }
}
</style>

<style lang="scss">
.kml-list-header-menu {
  background-color: white;
}
</style>
