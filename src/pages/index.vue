<template>
  <div class="pt-96">
    <div class="min-h-52 mx-auto w-96 bg-white p-5 shadow">
      <h1 class="text-center text-xl">Kronos Template</h1>
      <div class="flex w-full justify-around pt-5">
        <Dropdown
          @change="getTime"
          class="w-full"
          v-model="selectedZoneGroup"
          :options="zoneList"
          optionLabel="label"
          optionGroupLabel="label"
          optionGroupChildren="items"
        >
          <template #optiongroup="slotProps">
            <div class="text-sm">{{ slotProps.option.label }}</div>
          </template>

          <template #option="slotProps">
            <div class="max-w-xs whitespace-normal text-sm">
              {{ slotProps.option.label }}
            </div>
          </template>
        </Dropdown>
      </div>
      <div v-for="(day, index) in prayerTime">
        <span :key="index">{{ index }} - {{ formatTime(day) }} </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import useKy from "@/compositions/useKy";
import { DateTime } from "luxon";
import { ref } from "vue";
import Dropdown from "primevue/dropdown";
const date = DateTime.now().toISODate();

let zoneList = ref([]);
let selectedZone = ref("");
let selectedZoneGroup = ref("");
let prayerTime = ref({});

const ky = useKy();

const formatTime = (time) => {
  const formattedTime = DateTime.fromFormat(time, "t").toFormat("t").toString();
  return formattedTime;
};

const getTime = async (value) => {
  const data = await ky
    .get("time", {
      searchParams: {
        date,
        zone: value.value.value,
      },
    })
    .json();

  delete data.date;

  prayerTime.value = data;
};
const getZones = async () => {
  const zones = await ky.get(`selectionoptions`).json();

  let formattedData = [];

  for (const [stateKey, stateValue] of Object.entries(zones)) {
    let row = {
      label: stateKey,
      code: stateKey,
      items: [],
    };
    for (const [zoneKey, zoneValue] of Object.entries(stateValue)) {
      row.items.push({
        label: `${zoneKey} - ${zoneValue}`,
        value: zoneKey,
      });
    }

    formattedData.push(row);
  }

  zoneList.value = formattedData;
};

getZones();

// url.search = new URLSearchParams({
// date,
// })

// const data = await ky.get();
</script>
