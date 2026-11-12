export const XIDIAN_CAMPUS_MAP_URL = "https://gis.xidian.edu.cn/";
const SEARCH_URL = "https://gis.xidian.edu.cn/openmap/mapi/place/v3/search";
const REQUEST_TIMEOUT_MS = 8_000;
const GENERIC_MAP_QUERY = /校园地图|西电地图|学校地图|校区地图|地图/g;

export interface CampusMapPlace {
  name: string;
  campus: string;
  kind: string;
  address: string;
  longitude: number | null;
  latitude: number | null;
}

export function campusMapQuery(raw: string): string {
  return raw.replace(GENERIC_MAP_QUERY, " ").replace(/\s+/g, " ").trim();
}

export function projectMapPlaces(payload: unknown, limit: number): CampusMapPlace[] {
  const result = record(payload)?.result;
  if (!Array.isArray(result)) return [];
  return result.slice(0, limit).flatMap((item) => {
    const row = record(item);
    const name = text(row?.name);
    if (!row || !name) return [];
    const location = record(row.location);
    return [{
      name,
      campus: text(row.campus),
      kind: text(row.typeName),
      address: text(row.formattedAddr),
      longitude: finite(location?.x),
      latitude: finite(location?.y),
    }];
  });
}

export async function queryCampusMap(rawQuery: string, limit: number, signal?: AbortSignal): Promise<Record<string, unknown>> {
  const query = campusMapQuery(rawQuery);
  const places = query ? await searchPlaces(query, limit, signal) : { places: [] as CampusMapPlace[] };
  return {
    ok: true,
    dataset: "map",
    title: "校园地图",
    url: XIDIAN_CAMPUS_MAP_URL,
    view: "三维校园地图，可切换二维图和卫星图",
    query,
    campuses: [
      { name: "南校区", address: "陕西省西安市西沣路兴隆段266号" },
      { name: "北校区", address: "陕西省西安市太白南路2号" },
    ],
    places: places.places,
    count: places.places.length,
    ...(places.error ? { searchError: places.error } : {}),
    note: "官方校园 GIS，不用登录就能看南北校区的楼、路和已登记地点。公开地图搜不到课表里的教室号，室内楼层平面图需要登录，而且不是每层都有图。查空闲教室用 classrooms。",
  };
}

async function searchPlaces(query: string, limit: number, signal?: AbortSignal): Promise<{ places: CampusMapPlace[]; error?: string }> {
  if (signal?.aborted) return { places: [], error: "查询已取消。" };
  const url = new URL(SEARCH_URL);
  url.searchParams.set("q", query);
  url.searchParams.set("pageIndex", "1");
  url.searchParams.set("pageSize", String(Math.max(1, Math.min(limit, 8))));
  try {
    const response = await fetch(url, {
      signal: AbortSignal.any([AbortSignal.timeout(REQUEST_TIMEOUT_MS), ...(signal ? [signal] : [])]),
    });
    if (!response.ok) return { places: [], error: `校园地图搜索失败（HTTP ${response.status}）。` };
    return { places: projectMapPlaces(await response.json(), limit) };
  } catch (error) {
    if (signal?.aborted) return { places: [], error: "查询已取消。" };
    return { places: [], error: error instanceof Error ? error.message : "校园地图搜索失败。" };
  }
}

function record(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null;
}

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function finite(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}
