<template>
  <div>
    {{ rawKml }}
  </div>
</template>

<script>
export default {
  name: 'kml-viewer',
  props: {
    rawKml: {
      type: String,
      default: '',
    },
  },
}
</script>
