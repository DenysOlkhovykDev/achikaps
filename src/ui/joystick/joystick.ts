import { Container, Graphics, FederatedPointerEvent } from "pixi.js";

class Joystick extends Container {
  private base: Graphics;
  private thumb: Graphics;
  private hitbox: Graphics;

  private radius = 60;
  private thumbRadius = 25;

  private dragging = false;

  public inputX = 0;
  public inputY = 0;

  constructor() {
    super();

    this.eventMode = "static";

    this.position.set(500, 930);

    this.hitbox = new Graphics()
      .circle(0, 0, this.radius + this.thumbRadius * 4)
      .fill({ color: "#ffffff", alpha: 0 });

    this.base = new Graphics()
      .circle(0, 0, this.radius)
      .fill({ color: "#ffffff", alpha: 0 })
      .stroke({ width: 3, color: "#000000" });

    this.thumb = new Graphics()
      .circle(0, 0, this.thumbRadius)
      .fill({ color: "#444444", alpha: 0.8 })
      .stroke({ width: 3, color: "#000000" });

    this.addChild(this.base, this.thumb, this.hitbox);

    this.on("pointerdown", this.onDown);
    this.on("pointermove", this.onMove);
    this.on("pointerup", this.onUp);
    this.on("pointerupoutside", this.onUp);
    this.on("pointerleave", this.onUp);

    this.hide();
  }

  private onDown = (event: FederatedPointerEvent) => {
    this.dragging = true;

    event.stopPropagation();
  };

  private onMove = (event: FederatedPointerEvent) => {
    if (!this.dragging) return;

    const pos = event.getLocalPosition(this);

    let dx = pos.x;
    let dy = pos.y;

    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > this.radius) {
      const angle = Math.atan2(dy, dx);

      dx = Math.cos(angle) * this.radius;
      dy = Math.sin(angle) * this.radius;
    }

    this.thumb.position.set(dx, dy);

    this.inputX = dx / this.radius;
    this.inputY = dy / this.radius;

    const absX = Math.abs(this.inputX);
    const absY = Math.abs(this.inputY);

    if (absX > absY * 2) {
      this.inputY = 0;
    }

    if (absY > absX * 2) {
      this.inputX = 0;
    }

    event.stopPropagation();
  };

  private onUp = () => {
    this.dragging = false;

    this.thumb.position.set(0, 0);

    this.inputX = 0;
    this.inputY = 0;
  };

  show() {
    this.visible = true;
  }

  hide() {
    this.visible = false;

    this.dragging = false;

    this.inputX = 0;
    this.inputY = 0;

    this.thumb.position.set(0, 0);
  }
}

export const joystick = new Joystick();
