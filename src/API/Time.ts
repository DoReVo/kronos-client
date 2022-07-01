import { DateTime } from "luxon";
import useKy from "@/compositions/useKy";
import type { PrayerTimeResponse, ZoneOptionResponse } from "@/types/API";

const ky = useKy();

export async function fetchDailyTime(
  zone: string,
  date: string = DateTime.now().toISODate()
) {
  const data = await ky
    .get("time", {
      searchParams: {
        date,
        zone,
      },
    })
    .json<PrayerTimeResponse.Response>();

  return data;
}

export async function fetchZones() {
  const data = await ky
    .get(`selectionoptions`)
    .json<ZoneOptionResponse.Response>();

  return data;
}
