import { StaticMapProps } from "./../StaticMapImage";
export class MapUtility {
  static getMapCoordinates = (mouseX: number, mouseY: number, mapOptions: StaticMapProps) => {
    const lat = mapOptions.lat;
    const lng = mapOptions.lng;
    const { zoom, width, height } = mapOptions;

    mouseX /= mapOptions.scale ?? 1;
    mouseY /= mapOptions.scale ?? 1;

    const x = mouseX - width / 2;
    const y = mouseY - height / 2;
    const s = Math.min(Math.max(Math.sin(lat * (Math.PI / 180)), -0.9999), 0.9999);
    const tiles = 1 << zoom;
    const centerPoint = {
      x: 128 + lng * (256 / 360),
      y: 128 + 0.5 * Math.log((1 + s) / (1 - s)) * -(256 / (2 * Math.PI)),
    };
    const mousePoint = {
      x: centerPoint.x * tiles + x,
      y: centerPoint.y * tiles + y,
    };
    const mouseLatLng = {
      Lat:
        (2 * Math.atan(Math.exp((mousePoint.y / tiles - 128) / -(256 / (2 * Math.PI)))) - Math.PI / 2) /
        (Math.PI / 180),
      Lng: (mousePoint.x / tiles - 128) / (256 / 360),
    };

    return mouseLatLng;
  };
}
