<template>
  <div class="cell" :style="{ '--width': width + 'px' }">
    <v-menu open-on-hover offset-y :disabled="!isOverflowed">
      <template v-slot:activator="{ on }">
        <div ref="inner" v-on="on" class="inner">
          {{ content }}
        </div>
      </template>
      <div class="kml-list-cell-tooltip">
        <div v-for="(line, i) of content.split('\n')" :key="i">
          {{ line }}
        </div>
      </div>
    </v-menu>
  </div>
</template>

<script>
import throttle from 'lodash/throttle'

export default {
  name: 'kml-list-cell',
  data() {
    return {
      isOverflowed: false,
    }
  },
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
  mounted() {
    new ResizeObserver(
      throttle(async () => {
        let timeouted = false
        setTimeout(() => (timeouted = true), 1000)
        while (!this.$refs.inner && !timeouted) {
          await new Promise((resolve) => setTimeout(resolve, 10))
        }

        if (!this.$refs.inner) {
          return
        }
        this.isOverflowed =
          this.$refs.inner.clientWidth !== this.$refs.inner.scrollWidth
      }, 100)
    ).observe(this.$refs.inner)
  },
}
</script>

<style lang="scss" scoped>
.cell {
  --width: 100px;
  padding-left: 8px;
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
