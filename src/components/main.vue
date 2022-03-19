<template>
  <div class="f-main">
    <div class="buttons">
      <button
        class="button"
        :class="{ 'is-drag-over': isDragOver }"
        @click="$refs.input.click()"
        @dragenter.prevent="isDragOver = true"
        @dragover.prevent
        @drop.stop.prevent="onDrop"
        @dragleave.prevent="isDragOver = false"
      >
        <div>{{ fileName || 'kml ファイルを添付' }}</div>
        <input ref="input" class="input-element" type="file" @input="onInput" />
      </button>
      <button v-if="rawKml" class="button" @click="downloadCsv">
        <div>csv をダウンロード</div>
      </button>
    </div>
    <kml-viewer ref="kmlViewer" class="kml-viewer" :raw-kml="rawKml" />
  </div>
</template>

<script>
import KmlViewer from './kml-viewer.vue'

export default {
  name: 'main-component',
  components: {
    KmlViewer,
  },
  data() {
    return {
      isDragOver: false,
      rawKml: '',
      fileName: '',
    }
  },
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
      this.fileName = file.name
      this.rawKml = await file.text()
      this.isDragOver = false
    },
    downloadCsv() {
      const csv = this.$refs.kmlViewer.toCsv()
      const url = URL.createObjectURL(new Blob([csv], { type: 'text/plain' }))
      const a = document.createElement('a')
      a.href = url
      a.download = this.fileName.replace(/(?<=\.)[^.]+$/, 'csv')
      a.click()
      a.remove()
    },
  },
}
</script>

<style lang="scss" scoped>
.f-main {
  padding: 2rem;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  .buttons {
    display: flex;
    gap: 8px;
    width: 100%;
    .button {
      height: 48px;
      width: 100%;
      min-width: 0;
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
        background-color: #f8fcff;
        border-style: dashed;
        border-width: 2px;
        border-color: #78a0ff;
      }
      .input-element {
        display: none;
      }
    }
    .kml-viewer {
      flex-grow: 1;
      min-height: 0;
    }
  }
}
</style>
