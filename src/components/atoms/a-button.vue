<template>
  <v-btn
    :outlined="outlined"
    :icon="icon"
    small
    @click="$emit('click')"
    @mouseenter="$emit('mouseenter')"
    @mouseleave="$emit('mouseleave')"
  >
    {{ label }}
    <slot />
  </v-btn>
</template>

<script>
export default {
  name: 'a-button',
  props: {
    label: {
      type: String,
      default: '',
    },
    icon: {
      type: Boolean,
      default: false,
    },
    outlined: {
      type: Boolean,
      default: true,
    },
  },
}
</script>
