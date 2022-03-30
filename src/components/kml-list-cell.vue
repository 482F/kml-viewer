<template>
  <div class="cell" :style="{ '--width': width + 'px' }">
    <v-menu open-on-hover offset-y :disabled="!isOverflowed">
      <template v-slot:activator="{ on }">
        <div ref="inner" v-on="on" class="inner">
          {{ content }}
        </div>
      </template>
      <div class="kml-list-cell-tooltip">
        <span v-for="(datum, i) of separatedContent" :key="i">
          <span v-if="datum.type === 'text'">
            {{ datum.value }}
          </span>
          <a
            v-else-if="datum.type === 'link'"
            :href="datum.value"
            target="_blank"
          >
            {{ datum.value }}
          </a>
          <br v-else-if="datum.type === 'newline'" />
        </span>
      </div>
    </v-menu>
  </div>
</template>

<script>
import throttle from 'lodash/throttle'
import { wait } from '482-js-utils'

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
  computed: {
    separatedContent() {
      let addedIndex = 0
      const separatedContent = []

      const matches = [
        ...this.content.matchAll(
          /https?:\/\/[-_.!~*'()a-zA-Z0-9;/?:@&=+$,%#]+/g
        ),
      ]

      const pushText = (value) => {
        const lines = value.split(/\n|\\n/)
        lines.forEach((line, i) => {
          if (i !== 0) {
            separatedContent.push({ type: 'newline' })
          }
          separatedContent.push({
            value: line,
            type: 'text',
          })
        })
      }

      for (const match of matches) {
        const { 0: link, index } = match
        pushText(this.content.slice(addedIndex, index))
        const endOfLink = index + link.length
        separatedContent.push({
          value: this.content.slice(index, endOfLink),
          type: 'link',
        })
        addedIndex = endOfLink
      }
      pushText(this.content.slice(addedIndex, this.content.length))
      return separatedContent
    },
  },
  mounted() {
    new ResizeObserver(
      throttle(async () => {
        const inner = await wait(() => this.$refs.inner, 100, 1000)

        if (!inner) {
          return
        }
        this.isOverflowed = inner.clientWidth !== inner.scrollWidth
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
