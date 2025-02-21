import { adminMenus, analystMenus, creativeMenus } from "./menus";

// export const TIKTOK_BASE_API_URL = "http://192.168.1.90:2225"; //local server
export const TIKTOK_BASE_API_URL = "http://192.53.125.57:2225"; // remote server
// export const YOUTUBE_BASE_API_URL = "http://192.168.1.90:2230"; // local server
export const YOUTUBE_BASE_API_URL = "http://165.22.247.113:2230"; // remote server

// export const COLORS = [
//   "#527BA8",
//   "#EE8C1F",
//   "#DD5657",
//   "#7AB7B2",
//   "#60A04E",
//   "#ECC640",
//   "#AD7BA2",
//   "#FB9CA6",
//   "#9B755F",
//   "#B9AFAB",
// ];
export const COLORS = ["red", "green", "blue", "brown", "cyan"];

export const CYBERTRON_COLORS = [
  "#2d60e8",
  "#2c77e0",
  "#2b8dd8",
  "#2aa1d1",
  "#29b5ca",
  "#28c8c3",
  "#27dcbc",
  "#26efb5",
];

export const GLASBEY_COLORS = [
  "#ff0000",
  "#0000ff",
  "#ffdc0b",
  "#00c8b4",
  "#ff00ff",
  "#800000",
  "#008000",
  "#000080",
  "#808000",
  "#008080",
  "#800080",
  "#c0c0c0",
  "#808080",
  "#994c00",
  "#4c9900",
  "#00994c",
  "#004c99",
  "#4c0099",
  "#99004c",
  "#cc6600",
  "#66cc00",
  "#00cc66",
];

export const MAP_THEME = {
  light: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json",
  dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
};

export const MENUS = {
  adminMenus,
  creativeMenus,
  analystMenus,
};
