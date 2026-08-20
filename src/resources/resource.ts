import { Graphics, Texture, Container } from "pixi.js";

export abstract class Resource {
  root: Container;

  DEBUGReservationMark: Graphics = new Graphics();

  private _isReserved = false;

  static baseTexture: Texture;

  constructor(public resourceType: string) {
    this.root = new Container();
    this.root.x = 0;
    this.root.y = 0;
    this.isReserved = false;

    this.draw();

    this.root.addChild(this.DEBUGReservationMark);
  }

  get isReserved(): boolean {
    return this._isReserved;
  }

  set isReserved(value: boolean) {
    this._isReserved = value;
    this.updateReservation();
  }

  protected abstract draw(): void;

  protected updateReservation() {
    if (import.meta.env.VITE_IS_DEBUG !== "true") {
      return;
    }

    this.DEBUGReservationMark.clear();

    if (this.isReserved) {
      this.DEBUGReservationMark.moveTo(-5, -5)
        .lineTo(5, 5)
        .moveTo(5, -5)
        .lineTo(-5, 5)
        .stroke({ width: 2, color: "#ff0000", cap: "round" });
    }
  }
}
