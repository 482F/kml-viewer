<template>
  <div class="f-main">
    <div
      class="input"
      :class="{ 'is-drag-over': isDragOver }"
      @click="$refs.input.click()"
      @dragenter.prevent="isDragOver = true"
      @dragover.prevent
      @drop.stop.prevent="onDrop"
      @dragleave.prevent="isDragOver = false"
    >
      <div>kml ファイルを添付</div>
      <input ref="input" class="input-element" type="file" @input="onInput" />
    </div>
    {{ file }}
    <kml-viewer :raw-kml="rawKml" />
  </div>
</template>

<script>
import KmlViewer from './kml-viewer.vue'

export default {
  name: 'main-component',
  components: {
    KmlViewer,
  },
  data: () => ({
    isDragOver: false,
    rawKml: '',
    file: null,
  }),
  methods: {
    onDrop(e) {
      const file = [...e.dataTransfer.files][0]
      this.inputFile(file)
    },
    onInput(e) {
      const file = [...e.target.files][0]
      e.target.value = null
      this.inputFile(file)
    },
    async inputFile(file) {
      if (!file) {
        this.rawKml = ''
      }
      this.rawKml = await file.text()
      this.isDragOver = false
    },
  },
}
</script>

<style lang="scss" scoped>
.f-main {
  padding: 4rem;
  display: flex;
  flex-direction: column;
  .input {
    height: 48px;
    width: 100%;
    border-style: solid;
    border-width: 1px;
    border-radius: 4px;
    border-color: lightgray;
    display: flex;
    justify-content: center;
    align-items: center;
    user-select: none;
    cursor: pointer;
    &.is-drag-over {
      background-color: #F8FCFF;
      border-style: dashed;
      border-width: 2px;
      border-color: #78A0FF;
    }
    .input-element {
      display: none;
    }
  }
}
</style>
