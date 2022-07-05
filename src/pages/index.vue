<script setup lang="ts">
import { DateTime } from "luxon";
import { computed, onMounted, ref } from "vue";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/vue";
import type { ZoneOptionResponse, PrayerTimeResponse } from "@/types/API";
import IconLocation from "@/components/IconLocation.vue";
import TimeBox from "../components/TimeBox.vue";
import { isEmpty } from "lodash-es";
import Spinner from "../components/Spinner.vue";
import { useStorage } from "@vueuse/core";
import { useQuery } from "vue-query";
import { fetchDailyTime, fetchZones } from "@/API/Time";

const now = ref<DateTime>(DateTime.now());

let selectedZone = useStorage("defaultZone", "");
let defaultZoneList = useStorage<ZoneOptionResponse.Response>(
  "defaultZoneList",
  {} as ZoneOptionResponse.Response
);

let { data: zoneList } = useQuery<ZoneOptionResponse.Response>(
  "zones",
  async () => {
    const data = await fetchZones();
    defaultZoneList.value = data;
    return data;
  },
  {
    initialData: defaultZoneList,
  }
);

let { isLoading: isLoadingNewTime, data: dayData } =
  useQuery<PrayerTimeResponse.Response>(
    [selectedZone],
    async () => {
      if (!selectedZone.value)
        return {
          date: "",
          imsak: "",
          fajr: "",
          syuruk: "",
          dhuhr: "",
          asr: "",
          maghrib: "",
          isha: "",
        };
      const data = await fetchDailyTime(selectedZone.value.split("/")[1]);

      return data;
    },
    {
      refetchOnWindowFocus: true,
      placeholderData: {
        date: "",
        imsak: "",
        fajr: "",
        syuruk: "",
        dhuhr: "",
        asr: "",
        maghrib: "",
        isha: "",
      },
    }
  );

onMounted(async () => {
  setInterval(() => {
    now.value = DateTime.now();
  }, 1000);
});

const prayerTime = computed(() => {
  let data: Omit<PrayerTimeResponse.Response, "date"> = {} as Omit<
    PrayerTimeResponse.Response,
    "date"
  >;

  type ObjectKey = keyof typeof data;

  for (const [key, value] of Object.entries(dayData.value!)) {
    if (key !== "date") data[key as ObjectKey] = value;
  }

  return data;
});

const closestKey = computed(() => {
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

  let data;
  for (const time of sortedTimes) {
    if (time[1] < now.value) {
      continue;
    } else {
      data = time[0];
      break;
    }
  }
  return data;
});

const closestTime = computed(() => {
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

  let data;
  for (const time of sortedTimes) {
    if (time[1] < now.value) {
      continue;
    } else {
      data = time[1];
      break;
    }
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
  if (hour && hour > 0) {
    text = `${hour} hour`;
    if (min && min > 0) text = `${text} ${min.toFixed(0)} minute`;
  } else if (min && min > 0) text = `${min.toFixed(0)} minute`;

  return text!;
});

const getStateText = computed(() => {
  if (!selectedZone.value) return null;

  const state = selectedZone.value.split("/")[0];

  return state;
});

const getZoneText = computed(() => {
  if (!selectedZone.value || isEmpty(zoneList.value)) return null;

  const zone: string[] = selectedZone.value.split("/");

  return zoneList.value![zone[0]][zone[1]];
});

const getTimingFor = () => {
  if (!isEmpty(dayData) && dayData.value && dayData.value.date)
    return DateTime.fromISO(dayData.value.date).toLocaleString();
  else return null;
};
</script>

<template>
  <div class="min-h-screen pt-14">
    <div class="h-full min-h-[50px]">
      <div
        class="text-center font-domine text-4xl text-white"
        style="text-shadow: 0px 5px 5px rgba(255, 255, 255, 0.1)"
      >
        {{ countDown }}
      </div>
    </div>
    <div class="h-full min-h-[50px]">
      <div
        class="text-center font-vollkorn text-3xl font-bold capitalize text-primary"
        v-show="countDown"
        style="text-shadow: 0px 5px 5px rgba(64, 60, 185, 0.25)"
      >
        Until {{ closestKey }}
      </div>
    </div>
    <Listbox v-model="selectedZone" class="mx-auto w-60 text-center">
      <div class="relative mt-1">
        <ListboxButton
          class="flex w-full items-center justify-center gap-x-1 rounded bg-primary-darker p-3 text-center font-vollkorn text-lg font-bold leading-none text-white focus:outline-none focus-visible:border-primary-darker focus-visible:ring-2 focus-visible:ring-primary-darker focus-visible:ring-opacity-75 focus-visible:ring-offset-2"
          style="box-shadow: 0px 5px 5px rgba(64, 60, 185, 0.25)"
        >
          <IconLocation class="h-5 w-5 text-white" />
          {{ getStateText || "Choose location" }}
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
      class="mx-auto mt-3 h-full min-h-[60px] max-w-xl px-10 text-center font-vollkorn text-base font-bold lining-nums proportional-nums text-primary"
      style="text-shadow: 0px 5px 5px rgba(64, 60, 185, 0.25)"
    >
      {{ getZoneText }}
    </div>

    <div
      class="mt-12 flex min-h-[520px] w-full flex-col items-center justify-start gap-y-3 px-2"
    >
      <Spinner
        class="w-h-10 mx-auto h-10 text-primary"
        v-if="isLoadingNewTime"
      />
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
