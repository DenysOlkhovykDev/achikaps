import { Container, Graphics } from "pixi.js";

export class BackgroundDisplay extends Container {
  shadowContainer: Container = new Container();
  selectShadowContainer: Container = new Container();

  constructor() {
    super();

    this.addChild(this.shadowContainer);
    this.addChild(this.selectShadowContainer);
  }

  public createSelectShadow(radius: number) {
    this.createRoundShadow(radius, "#00ff00", this.selectShadowContainer);
  }

  public removeSelectShadow() {
    this.selectShadowContainer.removeChildren();
  }

  public createBasicShadow(radius: number) {
    this.createRoundShadow(radius, "#000000", this.shadowContainer);
  }

  private createRoundShadow(
    radius: number,
    color: string,
    shadowContainer: Container,
  ) {
    const shadow = new Graphics();

    shadow.circle(0, 0, radius + 2).stroke({ width: 1, color: color });

    shadow.alpha = 0.6;

    const shadow2 = new Graphics();

    shadow2.circle(0, 0, radius + 3).stroke({ width: 1, color: color });

    shadow2.alpha = 0.3;

    const shadow3 = new Graphics();

    shadow3.circle(0, 0, radius + 4).stroke({ width: 1, color: color });

    shadow3.alpha = 0.1;

    shadowContainer.addChildAt(shadow, 0);
    shadowContainer.addChildAt(shadow2, 0);
    shadowContainer.addChildAt(shadow3, 0);
  }
}
