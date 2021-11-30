import { Point } from "@amagroup.io/amag-corelib";
const MAP_API_KEY = "AIzaSyBmzhL0YQYCgC2ljr1gaJM7T9frvXPCF_A";

function componentToHex(c: any) {
  const hex = c.toString(16);
  return hex.length == 1 ? `0${hex}` : hex;
}

export interface MapStreetPath {
  Points: Point[];
  Color?: string;
  Weight?: number | 0;
  FillColor?: string;
}

export interface StaticMapProps {
  height: number | 0;
  width: number | 0;
  scale: number | 1;
  lat: number;
  lng: number;
  zoom: number;
  mapType?: string;
  markers?: string;
  paths?: MapStreetPath[];
  showMarker?: boolean;
  hideLabels?: boolean;
}

export interface Center {
  lat: number;
  lng: number;
}

export interface MapOptionsType {
  center: Center;
  zoom: number;
  mapType: string;
  scale: number;
  mapSize: number;
}

export function RgbToHex(rgb: any) {
  const rgbArray = rgb.replace("rgb(", "").replace(")", "").split(",");
  return `0x${componentToHex(rgbArray[0])}${componentToHex(rgbArray[1])}${componentToHex(rgbArray[2])}`;
}

export const MapOptions: MapOptionsType = {
  center: { lat: 0, lng: 0 },
  zoom: 20,
  mapType: "satellite",
  scale: 2,
  mapSize: 640,
};

export function StaticMapSrc(props: StaticMapProps): string {
  const height = props.height || 640;
  const width = props.width || 640;
  const scale = props.scale || 1;
  const markers = props.markers || "";
  const hideLabels = props.hideLabels || false;

  function getPaths() {
    const paths = props.paths || [];

    const weight = 5;

    const pathsStringArray = paths.map((p) => {
      p.FillColor = (p.FillColor || p.Color || "#000000").replace("#", "0x");
      p.Color = (p.Color || "#000000").replace("#", "0x");

      const latLngString = (p.Points || []).map((l) => {
        return `|${l.Lat},${l.Lng}`;
      });

      return `&path=color:${p.Color}|weight:${p.Weight || weight}|fillcolor:${p.FillColor}${latLngString.join("")}`;
    });

    return pathsStringArray.join("");
  }

  function getMarkers() {
    return !props.showMarker
      ? ""
      : props.markers ||
          `&markers=scale:${scale}|icon:https://demo.app.amagroup.io/content/icons/cameradrm.png|color:red%7Clabel:S%7C${props.lat}, ${props.lng}`;
  }

  return `https://maps.googleapis.com/maps/api/staticmap?center=${props.lat},${props.lng}&zoom=${
    props.zoom || 20
  }&scale=${scale}&size=${width}x${height}&maptype=${props.mapType || "map"}&key=${MAP_API_KEY}${
    hideLabels
      ? "&style=feature:all|element:labels|visibility:off&style=feature:road|element:labels|visibility:off"
      : ""
  }${getPaths()}${getMarkers()}`;
}

export default function StaticMapImage(props: any) {
  const height = props.height || 640;
  const width = props.width || 640;

  return <img width={width} height={height} {...(props.style || {})} alt="" src={StaticMapSrc(props)} />;
}
