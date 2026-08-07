import { Container, Graphics } from "pixi.js";
import { MotionState } from "./moving";

type WakeParticle = {
  graphic: Graphics;
  drift: number;
  speed: number;
};

export class MotionEffects extends Container {
  private readonly particles: WakeParticle[] = [];
  private readonly speedArc = new Graphics();

  constructor() {
    super();
    this.eventMode = "none";

    let seed = 1977;
    const random = () => {
      seed = (seed * 48271) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    for (let i = 0; i < 30; i++) {
      const length = 8 + random() * 24;
      const graphic = new Graphics()
        .roundRect(-length / 2, -1, length, 2, 1)
        .fill("#ffffff");

      graphic.position.set(random() * 1000, random() * 1000);
      graphic.alpha = 0;
      this.particles.push({
        graphic,
        drift: (random() - 0.5) * 0.45,
        speed: 0.65 + random() * 0.8,
      });
      this.addChild(graphic);
    }

    this.addChild(this.speedArc);
  }

  update(delta: number, motion: MotionState) {
    const frameDelta = Math.min(Math.max(delta, 0), 3);
    const targetAlpha = Math.max(0, (motion.speedRatio - 0.12) * 0.42);
    const flowAngle = (motion.movementAngle ?? -Math.PI / 2) + Math.PI;
    const flowX = Math.cos(flowAngle);
    const flowY = Math.sin(flowAngle);
    const sideX = -flowY;
    const sideY = flowX;

    for (const particle of this.particles) {
      const velocity = (3 + motion.speedRatio * 13) * particle.speed;
      particle.graphic.x +=
        (flowX * velocity + sideX * particle.drift) * frameDelta;
      particle.graphic.y +=
        (flowY * velocity + sideY * particle.drift) * frameDelta;
      particle.graphic.rotation = flowAngle;
      particle.graphic.alpha +=
        (targetAlpha - particle.graphic.alpha) * 0.08 * frameDelta;

      if (particle.graphic.x < -60) particle.graphic.x = 1060;
      if (particle.graphic.x > 1060) particle.graphic.x = -60;
      if (particle.graphic.y < -60) particle.graphic.y = 1060;
      if (particle.graphic.y > 1060) particle.graphic.y = -60;
    }

    this.drawSpeedArc(motion);
  }

  private drawSpeedArc(motion: MotionState) {
    this.speedArc.clear();

    if (motion.speedRatio < 0.08) return;

    const start = Math.PI * 0.68;
    const length = Math.PI * 0.64 * motion.speedRatio;
    this.speedArc
      .arc(500, 500, 475, start, start + length)
      .stroke({
        width: 3,
        color: "#ffffff",
        alpha: 0.12 + motion.speedRatio * 0.25,
        cap: "round",
      });
  }
}
