import { Graphics, Texture, Container } from "pixi.js";

export abstract class Resource {
  root: Container;

  reservationMark: Graphics = new Graphics();

  private _isReserved = false;
  private _isReservedForTransport = false;
  private _isReservedForConstruction = false;

  static baseTexture: Texture;

  constructor(public resourceType: string) {
    this.root = new Container();
    this.root.x = 0;
    this.root.y = 0;
    this.isReserved = false;
    this.isReservedForTransport = false;
    this.isReservedForConstruction = false;

    this.draw();

    this.root.addChild(this.reservationMark);
  }

  get isReserved(): boolean {
    return this._isReserved;
  }

  set isReserved(value: boolean) {
    this._isReserved = value;
    this.updateReservation();
  }

  get isReservedForTransport(): boolean {
    return this._isReservedForTransport;
  }

  set isReservedForTransport(value: boolean) {
    this._isReservedForTransport = value;
    this.updateReservation();
  }

  get isReservedForConstruction(): boolean {
    return this._isReservedForConstruction;
  }

  set isReservedForConstruction(value: boolean) {
    this._isReservedForConstruction = value;
    this.updateReservation();
  }

  protected abstract draw(): void;

  protected updateReservation() {
    if (import.meta.env.VITE_IS_DEBUG !== "true") {
      return;
    }

    this.reservationMark.clear();

    if (this.isReserved) {
      this.reservationMark.circle(0, 0, 10).fill("#ff0000");
    }
    if (this.isReservedForTransport) {
      this.reservationMark.circle(0, 0, 8).fill("#00ff00");
    }
    if (this.isReservedForConstruction) {
      this.reservationMark.circle(0, 0, 6).fill("#0000ff");
    }

    // console.log(
    //   this.constructor.name,
    //   this.isReserved,
    //   this.isReservedForTransport,
    //   this.isReservedForConstruction,
    // );
  }
}
