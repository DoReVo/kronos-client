<template>
  <div
    class="flex items-center justify-between rounded bg-card-background p-4 font-domine text-2xl text-white"
    style="box-shadow: 0px 5px 5px rgba(69, 76, 94, 0.2)"
  >
    <div>{{ props.title?.toUpperCase() }}</div>
    <div>{{ props.time }}</div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  title: String,
  time: String,
});
</script>

<style scoped></style>
