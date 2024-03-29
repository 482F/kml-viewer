<template>
  <div class="search">
    <v-text-field
      outlined
      dense
      placeholder="検索"
      v-model="searchText"
      clearable
      @drop="onDrop"
      @dragover.prevent
    >
      <template v-slot:prepend>
        <v-menu
          v-model="helpMenu"
          :close-on-click="false"
          offset-y
          :nudge-bottom="10"
        >
          <template v-slot:activator="{ on }">
            <v-icon v-on="on"> mdi-help-circle </v-icon>
          </template>
          <div class="search-help">
            <v-icon class="close-button">mdi-close</v-icon>
            <table>
              <tr v-for="help of helps" :key="help.code">
                <td>
                  <code @click.stop="searchText += ' ' + help.code">
                    {{ help.code }}
                  </code>
                </td>
                <td>{{ help.description }}</td>
              </tr>
            </table>
          </div>
        </v-menu>
      </template>
    </v-text-field>
  </div>
</template>

<script>
const helps = [
  {
    code: 'description:温泉',
    description: 'description に「温泉」が含まれる',
  },
  {
    code: 'description:"WALL HOUSE"',
    description: 'description に「WALL HOUSE」が含まれる',
  },
  {
    code: 'description:寺|神社|教会',
    description: 'description に「寺」、「神社」、「教会」のいずれかが含まれる',
  },
  {
    code: 'description:-博物館',
    description: 'description に「博物館」が含まれない',
  },
  {
    code: 'description:^$|無し',
    description:
      'description に「無し」が含まれる、もしくは description が空欄である',
  },
  {
    code: 'description: -^$',
    description: 'description に値が入っている',
  },
  {
    code: 'lat>35',
    description: 'lat が 35 を超えている',
  },
  {
    code: 'lng<139.5',
    description: 'lng が 139.5 未満',
  },
]

export default {
  name: 'search',
  data() {
    return {
      searchText: '',
      searchObjectJSON: '{}',
      helpMenu: false,
    }
  },
  props: {
    draggingColumn: {
      type: String,
      default: undefined,
    },
    searcher: {
      type: Function,
      required: true,
    },
  },
  computed: {
    helps: () => helps,
  },
  methods: {
    onDrop() {
      if (!this.draggingColumn) {
        return
      }
      this.searchText += ` ${this.draggingColumn}:`
    },
  },
  watch: {
    searchText() {
      const matches = [
        ...(this.searchText || '').matchAll(
          /([^:<>\s]+)([:<>])(".*?"|[^\s]*?)( |$)/g
        ),
      ]
      const searchObjects = matches.map((match) => {
        const key = match[1]
        const operand = match[2]
        const value = match[3].replace(/ $/, '').replaceAll(/^"|"$/g, '')
        return {
          key,
          operand,
          value: '<>'.match(operand) ? Number(value) : value,
        }
      })

      const newSearchObjectJSON = JSON.stringify(searchObjects)
      if (this.searchObjectJSON === newSearchObjectJSON) {
        return
      }
      this.searchObjectJSON = newSearchObjectJSON

      const searchers = searchObjects.map((obj) => (datum) => {
        if (datum[obj.key] === undefined) {
          return true
        }

        if (obj.operand === ':') {
          for (const text of obj.value.split('|')) {
            const [pattern, converter] = (() => {
              if (text[0] === '-') {
                return [text.slice(1), (bool) => !bool]
              } else {
                return [text, (bool) => bool]
              }
            })()
            const target = datum[obj.key]
            if (converter(target.match(pattern))) {
              return true
            }
          }
        }
        const sign = obj.operand === '<' ? 1 : -1
        const num = Number(datum[obj.key])
        if (num * sign < obj.value * sign) {
          return true
        }

        return false
      })

      const searcher = (datum) => {
        for (const searcher of searchers) {
          if (!searcher(datum)) {
            return false
          }
        }
        return true
      }

      this.$emit('update:searcher', searcher)
    },
  },
}
</script>

<style lang="scss" scoped>
.search {
  ::v-deep .v-text-field__details {
    display: none;
  }
}
</style>

<style lang="scss">
.search-help {
  background-color: white;
  padding: 8px;
  position: relative;
  user-select: none;
  .close-button {
    position: absolute !important;
    right: 8px;
    top: 8px;
  }
  td {
    padding: 0 8px;
    code {
      cursor: pointer;
    }
  }
}
</style>
