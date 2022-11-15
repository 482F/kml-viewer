<template>
  <span>
    <v-tooltip bottom :disabled="!tooltip">
      <template v-slot:activator="{ on, attrs }">
        <a-button
          v-on="on"
          v-bind="attrs"
          icon
          :outlined="false"
          @click="$emit('click')"
        >
          <a-icon :icon="icon" />
        </a-button>
      </template>
      {{ tooltip }}
    </v-tooltip>
  </span>
</template>

<script>
import AButton from '@atoms/a-button.vue'
import AIcon from '@atoms/a-icon.vue'

export default {
  name: 'a-icon-button',
  components: {
    AButton,
    AIcon,
  },
  props: {
    icon: {
      type: String,
      required: true,
    },
    tooltip: {
      type: String,
      default: '',
    },
  },
}
</script>
