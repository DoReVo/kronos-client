<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "LandingPage",
  components: {},
});
</script>

<template>
  <div class="h-full max-h-full min-h-screen pt-40">
    <div class="mx-auto h-52 w-72 bg-white p-5 shadow">
      <h1 class="text-center text-xl">Prête Template</h1>
      <div class="flex w-full justify-around pt-5">
        <router-link to="credit" class="text-center text-blue-600"
          >Credits</router-link
        >
        <router-link to="signin" class="text-center text-blue-600"
          >Sign in</router-link
        >
      </div>
    </div>
  </div>
</template>