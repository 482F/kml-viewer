<template>
  <v-icon>
    {{ icon }}
  </v-icon>
</template>

<script>
export default {
  name: 'a-icon',
  props: {
    icon: {
      type: String,
      required: true,
    },
  },
}
</script>

