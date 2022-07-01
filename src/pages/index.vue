<script setup lang="ts">
import useKy from "@/compositions/useKy";
import { DateTime } from "luxon";
import { computed, onMounted, ref, watch } from "vue";
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
import Spinner from "../components/Spinner.vue";

const now = ref<DateTime>(DateTime.now());
let tick;

let isLoadingNewTime = ref(false);
let selectedZone = ref("");
let closestKey = ref();
let closestTime = ref<DateTime>();
let zoneList = ref<ZoneOptionResponse.Response | Record<string, never>>({});
let dayData = ref<PrayerTimeResponse.Response | Record<string, never>>({
  date: "",
  imsak: "",
  fajr: "",
  syuruk: "",
  dhuhr: "",
  asr: "",
  maghrib: "",
  isha: "",
});

onMounted(() => {
  tick = setInterval(() => {
    now.value = now.value.plus({ millisecond: 100 });
  }, 100);
});

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

const countDown = computed(() => {
  if (!closestTime.value) return null;

  const diff = closestTime.value
    .diff(now.value)
    .shiftTo("hour", "minute")
    .toObject();

  const hour = diff.hours;
  const min = diff.minutes;

  let text: string;
  if (hour && hour > 0) text = `${hour} hour`;

  if (hour && hour > 0 && min && min > 0)
    text = `${text} ${min.toFixed(0)} minute`;
  else if (min && min > 0) text = `${min.toFixed(0)} minute`;

  return text;
});

const ky = useKy();

// Fetch new time on zone change
watch(selectedZone, async () => {
  try {
    isLoadingNewTime.value = true;
    const zone: string = selectedZone.value.split("/")[1];

    await getTime(zone);

    const timesAndtime: [string, DateTime][] = [];

    for (const [key, time] of Object.entries(prayerTime.value)) {
      const t = DateTime.fromFormat(time, "t");
      timesAndtime.push([key, t]);
    }

    let sortedTimes = timesAndtime.sort(
      (a, b) =>
        Math.abs(now.value.toMillis() - a[1].toMillis()) -
        Math.abs(now.value.toMillis() - b[1].toMillis())
    );

    for (const time of sortedTimes) {
      if (time[1] < now.value) {
        continue;
      } else {
        closestKey.value = time[0];
        closestTime.value = time[1];
        break;
      }
    }
  } catch (error) {
    console.log(error);
  } finally {
    isLoadingNewTime.value = false;
  }
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
  if (!_.isEmpty(dayData.value) && dayData.value.date)
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
        date: now.value.toISODate(),
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
  <div class="min-h-screen">
    <div
      class="pt-14 text-center font-domine text-4xl text-white"
      style="text-shadow: 0px 5px 5px rgba(255, 255, 255, 0.1)"
    >
      {{ countDown }}
    </div>
    <div
      class="text-center font-vollkorn text-3xl font-bold capitalize text-primary"
      style="text-shadow: 0px 5px 5px rgba(64, 60, 185, 0.25)"
      v-show="countDown"
    >
      Until {{ closestKey }}
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
        <transition
          enter-active-class="transition duration-150	ease-out"
          enter-from-class="-translate-y-10 opacity-0"
          enter-to-class="translate-y-0 opacity-100"
          leave-active-class="transition duration-100 ease-out"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <ListboxOptions
            class="absolute mt-1 max-h-96 overflow-auto rounded border-b-2 border-primary-darker bg-card-background focus:outline-none"
          >
            <template v-for="(zones, index) in zoneList" :key="index">
              <div
                class="px-5 py-1 text-left font-vollkorn text-lg font-bold text-primary"
              >
                {{ index }}
              </div>
              <ListboxOption
                v-slot="{ selected, active }"
                v-for="(zone, zoneIndex) in zones"
                :key="`${index}/${zoneIndex}`"
                :value="`${index}/${zoneIndex}`"
              >
                <div
                  class="px-5 py-1 text-left font-domine text-sm lining-nums proportional-nums text-white hover:bg-primary hover:text-white"
                  :class="{
                    'bg-primary-darker': selected,
                    'bg-primary': active,
                  }"
                >
                  {{ zoneIndex }}-{{ zone }}
                </div>
              </ListboxOption>
            </template>
          </ListboxOptions>
        </transition>
      </div>
    </Listbox>

    <div
      class="mx-auto mt-3 h-14 max-w-xl px-10 text-center font-vollkorn text-base font-bold lining-nums proportional-nums text-primary"
      style="text-shadow: 0px 5px 5px rgba(64, 60, 185, 0.25)"
    >
      {{ getZoneText() }}
    </div>

    <div
      class="mt-12 flex min-h-[520px] w-full flex-col items-center justify-start gap-y-3 px-2"
    >
      <Spinner
        class="w-h-10 mx-auto h-10 text-primary"
        v-if="isLoadingNewTime"
      ></Spinner>
      <TimeBox
        v-for="(value, key) in prayerTime"
        :key="key"
        :title="key"
        :time="value"
        class="shadow-sm"
        v-else
        :class="{
          'bg-primary': key === closestKey,
          'shadow-primary': key === closestKey,
        }"
      />
    </div>

    <div
      class="mx-auto mt-2 flex max-w-xl flex-row-reverse px-2 font-vollkorn lining-nums proportional-nums text-white"
    >
      {{ getTimingFor() || "" }}
    </div>
  </div>
</template>
