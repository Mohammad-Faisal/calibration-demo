export class CanvasUtility {
  static getCoordinatesOfClickedPoint = (e: React.MouseEvent, imageScale: number) => {
    const bounds = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const { left } = bounds;
    const { scrollTop } = document.getElementsByTagName("html")[0];
    const { top } = bounds;

    let x: number;
    let y: number;

    x = e.pageX - left;
    y = e.pageY - scrollTop - top;

    const px = Math.round(x / imageScale);
    const py = Math.round(y / imageScale);

    return { px, py };
  };
}
