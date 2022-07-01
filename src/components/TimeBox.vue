<template>
  <div
    class="flex w-full max-w-xl items-center justify-between rounded bg-card-background p-4 font-domine text-2xl text-white"
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
