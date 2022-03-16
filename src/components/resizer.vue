<template>
  <div class="resizer" :style="{ '--width': handleWidth + 'px' }">
    <div class="horizontal">
      <div
        class="resize-handle left"
        v-if="directions.includes('left')"
        @mousedown.left="(e) => resizeStart('left', e)"
      />
      <div class="vertical">
        <div
          class="resize-handle top"
          v-if="directions.includes('top')"
          @mousedown.left="(e) => resizeStart('top', e)"
        />
        <slot ref="slot" />
        <div
          class="resize-handle bottom"
          v-if="directions.includes('bottom')"
          @mousedown.left="(e) => resizeStart('bottom', e)"
        />
      </div>
      <div
        class="resize-handle right"
        v-if="directions.includes('right')"
        @mousedown.left="(e) => resizeStart('right', e)"
      />
    </div>
  </div>
</template>

<script>
import throttle from 'lodash/throttle'

export default {
  name: 'resizer',
  props: {
    directions: {
      type: Array,
      default: () => [],
    },
    maxWidth: {
      type: Number,
      default: Infinity,
    },
    minWidth: {
      type: Number,
      default: 4,
    },
    handleWidth: {
      type: Number,
      default: 8,
    },
  },
  methods: {
    resizeStart(direction, e) {
      const slotElement =
        this.$slots.default?.[0]?.elm ?? this.$slots.default?.[0]
      const initWidth = slotElement.clientWidth
      const start = e.clientX
      const resizing = throttle((e) => {
        const delta = e.clientX - start
        const newWidth = Math.max(
          Math.min(initWidth + delta, this.maxWidth),
          this.minWidth
        )
        slotElement.style.width = newWidth + 'px'
        this.$emit('input', newWidth)
        return newWidth
      }, 50)
      const resizeEnd = (e) => {
        document.removeEventListener('mousemove', resizing)
        document.removeEventListener('mouseup', resizeEnd)
        const newWidth = resizing(e)
        this.$emit('change', newWidth)
      }
      document.addEventListener('mousemove', resizing)
      document.addEventListener('mouseup', resizeEnd)
    },
  },
}
</script>

<style lang="scss" scoped>
.resizer {
  --width: -8px;
  .horizontal {
    display: flex;
  }
  .vertical {
    display: flex;
    flex-direction: column;
  }
  .resize-handle {
    z-index: 1;
    &.left {
      margin-right: calc(-1 * var(--width));
    }
    &.right {
      margin-left: calc(-1 * var(--width));
    }
    &.top {
      margin-bottom: calc(-1 * var(--width));
    }
    &.bottom {
      margin-right: calc(-1 * var(--width));
    }
    &.left,
    &.right {
      cursor: ew-resize;
      width: var(--width);
    }
    &.top,
    &.bottom {
      cursor: ns-resize;
      height: var(--width);
    }
  }
}
</style>
