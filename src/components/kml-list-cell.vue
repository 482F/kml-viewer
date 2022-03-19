<template>
  <div class="cell" :style="{ '--width': width + 'px' }">
    <div class="inner">
      {{ content }}
    </div>
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
  flex-shrink: 0;
  width: var(--width);
  height: 48px;
  border-style: solid none none none;
  border-width: 1px;
  display: flex;
  align-items: center;
  > .inner {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
}
</style>
