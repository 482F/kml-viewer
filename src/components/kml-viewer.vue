<template>
  <div class="kml-viewer">
    <v-list class="list">
      <kml-list-header
        class="header"
        :columns.sync="columns"
        :sort-method.sync="sortMethod"
      />
      <v-progress-linear v-show="processing" :value="progress * 100" />
      <kml-list-item
        v-for="(row, i) of rows"
        v-show="searcher(row)"
        :key="i"
        :columns="columns"
        :datum="row"
        :image-srcs="createImageSrcs(row.description)"
      />
    </v-list>
  </div>
</template>

<script>
import { openReverseGeocoder } from '@geolonia/open-reverse-geocoder'

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
      processing: false,
      progress: 0,
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
    searcher: {
      type: Function,
      default: () => true,
    },
  },
  methods: {
    createImageSrcs(content) {
      return [...(content || '').matchAll(/https?:\/\/[^\s:]+jpg/g)].map(
        (m) => m[0]
      )
    },
    async parseKml(rawKml) {
      this.processing = true
      try {
        const doc = new DOMParser().parseFromString(
          rawKml,
          'application/xhtml+xml'
        )

        const trimS = (str) => (str ?? '').replaceAll(/^[\s\n]+|[\s\n]+$/g, '')

        const folders = (() => {
          const folders = [...doc.querySelectorAll('Folder')]
          if (folders.length) {
            return folders.map((folder) => {
              const name = trimS(folder.querySelector('name').textContent)
              return {
                name,
                element: folder,
              }
            })
          } else {
            return [
              {
                name: null,
                element: doc,
              },
            ]
          }
        })()
        let i = 1
        const rows = []
        const length = [...doc.querySelectorAll('Placemark')].length

        for (const folder of folders) {
          const placemarks = [...folder.element.querySelectorAll('Placemark')]
          for (const placemark of placemarks) {
            const q = (query) => placemark.querySelector(query)
            const qa = (query) => placemark.querySelectorAll(query)

            const [name, description, styleUrl] = [
              'name',
              'description',
              'styleUrl',
            ].map((key) => q(key)?.textContent)

            const [lng, lat] = trimS(q('Point > coordinates')?.textContent)
              .split(',')
              .map(Number)

            const { prefecture, city } = await openReverseGeocoder([
              lng ?? 0,
              lat ?? 0,
            ]).catch((e) => {
              if (e.message === 'Error: Request failed with status code 404') {
                return { prefecture: '', city: '' }
              }
              throw e
            })

            const extendedData = [...qa('ExtendedData > Data')]
              .map((datum) => {
                const name = datum.getAttribute('name')
                const content = trimS(datum.textContent)
                return { [name]: content }
              })
              .reduce((all, part) => ({ ...all, ...part }), {})
            const row = {
              index: i++,
              name,
              description,
              styleUrl,
              prefecture,
              city,
              lat,
              lng,
              ...extendedData,
            }

            if (folder.name) {
              row.folderName = folder.name
            }
            rows.push(row)

            this.progress = i / length
          }
        }

        const columns = Array.from(
          new Set(rows.map((datum) => Object.keys(datum)).flat())
        ).map((name) => ({
          name,
          width: 100,
          show: true,
        }))

        rows.forEach((row) => {
          for (const column of columns) {
            row[column.name] = (row[column.name]?.toString?.() ?? '')
              .replaceAll(',', '，')
              .replaceAll('<br>', '\n')
          }
        })

        this.rows = rows
        this.columns = columns
      } catch (e) {
        console.error(e)
      }
      this.processing = false
    },
    toCsv() {
      return (
        this.columns.map((column) => column.name).join(',') +
        '\n' +
        this.rows
          .filter(this.searcher)
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
    sortMethod: {
      deep: true,
      handler() {
        this.rows.sort((a, b) => {
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
      background-color: white;
      position: sticky;
      top: 0;
      z-index: 1;
    }
  }
}
</style>
