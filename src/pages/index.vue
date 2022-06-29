<script setup lang="ts">
import useKy from "@/compositions/useKy";
import { DateTime } from "luxon";
import { computed, ref, watch } from "vue";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/vue";
import type { ZoneOptionResponse, PrayerTimeResponse } from "@/types/API";
import IconLocation from "@/components/IconLocation.vue";
import TimeBox from "../components/TimeBox.vue";
import _ from "lodash-es";

const date = DateTime.now().toISODate();

let selectedZone = ref("");
let zoneList = ref<ZoneOptionResponse.Response | Record<string, never>>({});
let dayData = ref<PrayerTimeResponse.Response | Record<string, never>>({});

const prayerTime = computed(() => {
  let data: Omit<PrayerTimeResponse.Response, "date"> = {} as Omit<
    PrayerTimeResponse.Response,
    "date"
  >;

  type ObjectKey = keyof typeof data;

  for (const [key, value] of Object.entries(dayData.value)) {
    if (key !== "date") data[key as ObjectKey] = value;
  }

  return data;
});

const ky = useKy();

// Fetch new time on zone change
watch(selectedZone, () => {
  const zone: string = selectedZone.value.split("/")[1];

  getTime(zone);
});

function getStateText() {
  if (!selectedZone.value) return null;

  const state = selectedZone.value.split("/")[0];

  return state;
}

function getZoneText() {
  if (!selectedZone.value) return null;

  const zone: string[] = selectedZone.value.split("/");

  return zoneList.value[zone[0]][zone[1]];
}

const getTimingFor = () => {
  console.log(dayData.value);

  if (!_.isEmpty(dayData.value))
    return DateTime.fromISO(dayData.value.date).toLocaleString();
  else return null;
};

const formatTime = (time: string) => {
  const formattedTime = DateTime.fromFormat(time, "t")
    .toFormat("hh:mm a")
    .toString();
  return formattedTime;
};

const getTime = async (zone: string) => {
  const data = await ky
    .get("time", {
      searchParams: {
        date,
        zone,
      },
    })
    .json<PrayerTimeResponse.Response>();

  dayData.value = data;
};
async function getZones() {
  const zones = await ky
    .get(`selectionoptions`)
    .json<ZoneOptionResponse.Response>();

  zoneList.value = zones;
}

getZones();
</script>

<template>
  <div class="">
    <div
      class="pt-14 text-center font-domine text-4xl text-white"
      style="text-shadow: 0px 5px 5px rgba(255, 255, 255, 0.1)"
    >
      12 hours 30 minutes
    </div>
    <div
      class="text-center font-vollkorn text-3xl font-bold text-primary"
      style="text-shadow: 0px 5px 5px rgba(64, 60, 185, 0.25)"
    >
      Until Isha
    </div>
    <Listbox v-model="selectedZone" class="mx-auto w-60 text-center">
      <div class="relative mt-1">
        <ListboxButton
          class="mt-9 flex w-full items-center justify-center gap-x-1 rounded bg-primary-darker p-3 text-center font-vollkorn text-lg font-bold leading-none text-white focus:outline-none focus-visible:border-primary-darker focus-visible:ring-2 focus-visible:ring-primary-darker focus-visible:ring-opacity-75 focus-visible:ring-offset-2"
          style="box-shadow: 0px 5px 5px rgba(64, 60, 185, 0.25)"
        >
          <IconLocation class="h-5 w-5 text-white" />
          {{ getStateText() || "Choose location" }}
        </ListboxButton>
        <ListboxOptions
          class="absolute mt-1 max-h-96 overflow-auto rounded bg-white focus:outline-none"
        >
          <template v-for="(zones, index) in zoneList" :key="index">
            <div
              class="px-5 py-1 text-left font-vollkorn text-lg font-bold text-primary-darker"
            >
              {{ index }}
            </div>
            <ListboxOption
              v-for="(zone, zoneIndex) in zones"
              :key="`${index}/${zoneIndex}`"
              :value="`${index}/${zoneIndex}`"
              class="px-5 py-1 text-left font-domine text-sm lining-nums proportional-nums text-primary-darker hover:bg-primary-darker hover:text-white"
              >{{ zoneIndex }}-{{ zone }}</ListboxOption
            >
          </template>
        </ListboxOptions>
      </div>
    </Listbox>

    <div
      class="mt-3 px-10 text-center font-vollkorn text-base font-bold lining-nums proportional-nums text-primary"
      style="text-shadow: 0px 5px 5px rgba(64, 60, 185, 0.25)"
    >
      {{ getZoneText() }}
    </div>

    <div class="mt-12 flex flex-col gap-y-3 px-1">
      <TimeBox
        v-for="(value, key) in prayerTime"
        :key="key"
        :title="key"
        :time="value"
      />
    </div>

    <div
      class="mt-2 flex flex-row-reverse px-1 font-vollkorn lining-nums proportional-nums text-white"
    >
      {{ getTimingFor() || "" }}
    </div>
  </div>
</template>
