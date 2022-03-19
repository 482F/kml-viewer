<template>
  <div class="kml-viewer">
    <v-list class="list">
      <kml-list-header
        class="header"
        :columns.sync="columns"
        :sort-method.sync="sortMethod"
      />
      <kml-list-item
        v-for="(row, i) of sortedRows"
        :key="i"
        :columns="columns"
        :datum="row"
        :image-srcs="createImageSrcs(row.description)"
      />
    </v-list>
  </div>
</template>

<script>
import KmlListHeader from './kml-list-header.vue'
import KmlListItem from './kml-list-item.vue'

export default {
  name: 'kml-viewer',
  components: {
    KmlListHeader,
    KmlListItem,
  },
  data() {
    return {
      rows: [],
      columns: [],
      sortMethod: {
        key: 'index',
        order: 1,
      },
    }
  },
  props: {
    rawKml: {
      type: String,
      default: '',
    },
  },
  computed: {
    sortedRows() {
      return this.rows.slice().sort((a, b) => {
        const key = this.sortMethod.key
        const order = this.sortMethod.order
        const aVal = Number(a[key]) || a[key]
        const bVal = Number(b[key]) || b[key]
        if (bVal < aVal) {
          return 1 * order
        } else if (aVal < bVal) {
          return -1 * order
        } else {
          return 0
        }
      })
    },
  },
  methods: {
    createImageSrcs(content) {
      return [...(content || '').matchAll(/https?:\/\/[^\s]+jpg/g)].map(
        (m) => m[0]
      )
    },
    parseKml(rawKml) {
      const doc = new DOMParser().parseFromString(
        rawKml,
        'application/xhtml+xml'
      )

      const trimS = (str) => (str ?? '').replaceAll(/^[\s\n]+|[\s\n]+$/g, '')

      const placemarks = [...doc.querySelectorAll('Placemark')]
      const rows = placemarks.map((placemark, i) => {
        const q = (query) => placemark.querySelector(query)
        const qa = (query) => placemark.querySelectorAll(query)

        const [name, description, styleUrl] = [
          'name',
          'description',
          'styleUrl',
        ].map((key) => q(key)?.textContent)

        const [lng, lat] = trimS(q('Point > coordinates')?.textContent).split(
          ','
        )

        const extendedData = [...qa('ExtendedData > Data')]
          .map((datum) => {
            const name = datum.getAttribute('name')
            const content = trimS(datum.textContent)
            return { [name]: content }
          })
          .reduce((all, part) => ({ ...all, ...part }), {})

        return {
          index: (i + 1).toString(),
          name,
          description,
          styleUrl,
          lat,
          lng,
          ...extendedData,
        }
      })

      const columns = Array.from(
        new Set(rows.map((datum) => Object.keys(datum)).flat())
      ).map((name) => ({
        name,
        width: 100,
        show: true,
      }))

      rows.forEach((row) => {
        for (const column of columns) {
          row[column.name] = (row[column.name] ?? '')
            .replaceAll(',', '，')
            .replaceAll('<br>', '\n')
        }
      })

      this.rows = rows
      this.columns = columns
    },
    toCsv() {
      return (
        this.columns.map((column) => column.name).join(',') +
        '\n' +
        this.rows
          .map((row) =>
            this.columns
              .map((column) =>
                (row[column.name] ?? '')
                  .replaceAll(',', '，')
                  .replaceAll(/\n|<br>/g, '。')
              )
              .join(',')
          )
          .join('\n')
      )
    },
  },
  watch: {
    rawKml(newRawKml) {
      this.parseKml(newRawKml)
    },
  },
}
</script>

<style lang="scss" scoped>
.kml-viewer {
  overflow: scroll;
  &::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }
  > .list {
    width: fit-content;
    min-width: 100%;
    padding: 0;
    .header {
      padding: 0;
      padding-top: 24px;
      background-color: white;
      position: sticky;
      top: 0;
      z-index: 1;
    }
  }
}
</style>
