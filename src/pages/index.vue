<template>
  <div class="pt-40">
    <div class="min-h-52 mx-auto w-96 bg-white p-5 shadow">
      <h1 class="text-center font-itim text-xl font-bold">Prayer Time</h1>
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
            <div class="font-noto-serif text-sm">
              {{ slotProps.option.label }}
            </div>
          </template>

          <template #option="slotProps">
            <div class="max-w-xs whitespace-normal font-noto-serif text-sm">
              {{ slotProps.option.label }}
            </div>
          </template>
        </Dropdown>
      </div>
      <div class="mt-7 flex flex-col gap-1 font-itim">
        <div
          class="flex justify-between"
          :key="index"
          v-for="(day, index) in prayerTime"
        >
          <span class="uppercase" :key="index">{{ index }}</span>
          <span :key="index">{{ formatTime(day) }} </span>
        </div>
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
let selectedZoneGroup = ref("");
let prayerTime = ref<any>({});

const ky = useKy();

const formatTime = (time: string) => {
  const formattedTime = DateTime.fromFormat(time, "t").toFormat("t").toString();
  return formattedTime;
};

const getTime = async (value: any) => {
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
