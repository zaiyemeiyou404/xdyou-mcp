import { test } from "node:test";
import * as assert from "node:assert/strict";
import { campusMapQuery, projectMapPlaces } from "./xdyou-map.js";

test("campus map search keeps buildings and drops a bare map request", () => {
  assert.equal(campusMapQuery("校园地图"), "");
  assert.equal(campusMapQuery("南校区图书馆"), "南校区图书馆");
  const places = projectMapPlaces({
    result: [
      { name: "图书馆", campus: "南校区", typeName: "建筑", formattedAddr: "南校区 图书馆", location: { x: 108.83, y: 34.12 } },
      { name: "", campus: "南校区" },
    ],
  }, 5);
  assert.deepEqual(places, [{
    name: "图书馆",
    campus: "南校区",
    kind: "建筑",
    address: "南校区 图书馆",
    longitude: 108.83,
    latitude: 34.12,
  }]);
});
