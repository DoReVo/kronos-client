import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { createPinia } from "pinia";
import App from "./App.vue";
// eslint-disable-next-line import/no-unresolved
import { setupLayouts } from "virtual:generated-layouts";
// eslint-disable-next-line import/no-unresolved
import VirtualPages from "~pages";

// Tailwind stuff inside here
import "./main.css";

const RoutesWithLayouts = setupLayouts(VirtualPages);

const router = createRouter({
  history: createWebHistory(),
  routes: RoutesWithLayouts,
});

const app = createApp(App);

app.use(router);
app.use(createPinia());

app.mount("#app");
