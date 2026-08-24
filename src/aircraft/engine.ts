import { FederatedPointerEvent, Graphics, Sprite } from "pixi.js";
import { showJoystick } from "@joystick/joystick";
import { Building } from "@aircraft/building";
import {
  generateTextureFromOrigin,
  makeBasicCircle,
  makeRoundShadow,
} from "@utils/basic-graphic";
import { getRandomDelay } from "@utils/delay";
import { getRadialPoint, getRandomCoordinate } from "@utils/basic-geometry";

type Particle = {
  gfx: Graphics;
  angle: number;
  speed: number;
  scale: number;
  delay: number;
  isActive: boolean;
};

export class Engine extends Building {
  propellerGraphics: Graphics = new Graphics();
  propellerParams = {
    amount: 3,
    size: 7,
    rotationSpeed: 0.035,
  };

  decoPropellerParams = {
    amount: 3,
    tracesWidth: 1.6,
    traceRadiuses: [
      this.baseRadius - 14,
      this.baseRadius - 10,
      this.baseRadius - 5,
    ],
  };

  particles: Particle[] = [];
  amountOfParticles: number = 4;

  constructor(x: number, y: number) {
    super(x, y, 1, "Engine");
    this.draw();
  }

  onClick(event: FederatedPointerEvent) {
    super.onClick(event);
    showJoystick();
  }

  draw() {
    makeRoundShadow(this.baseRadius, "#000000", this.shadowContainer);

    this.createPropellerBlades();

    this.createBaseTexture();

    const base = new Sprite(Engine.baseTexture);
    this.contentContainer.addChild(base);

    for (let i = 0; i < this.amountOfParticles; i++) {
      const particle = new Graphics().circle(0, 0, 5).fill("#000000");

      this.particles.push({
        gfx: particle,
        angle: Math.random() * Math.PI * 2,
        speed: 1.7,
        scale: 0,
        delay: getRandomDelay(1, 64),
        isActive: false,
      });
      this.contentContainer.addChildAt(particle, 0);
    }
  }

  private createPropellerBlades() {
    for (let i = 0; i < this.propellerParams.amount; i++) {
      const { x: x1, y: y1 } = getRadialPoint(
        i * 8,
        this.propellerParams.amount * 8,
        this.baseRadius,
      );

      const { x: x2, y: y2 } = getRadialPoint(
        i * 8 - 1,
        this.propellerParams.amount * 8,
        this.baseRadius + this.propellerParams.size,
      );

      this.propellerGraphics
        .moveTo(x1, y1)
        .lineTo(x2, y2)
        .stroke({ width: 14, color: "#000000", cap: "round" });
      this.propellerGraphics
        .moveTo(x1, y1)
        .lineTo(x2, y2)
        .stroke({ width: 10, color: "#a7a7a7", cap: "round" });
    }
    this.contentContainer.addChild(this.propellerGraphics);
  }

  private createBaseTexture() {
    if (Engine.baseTexture) return;

    const baseGraphics = new Graphics();

    makeBasicCircle(baseGraphics, this.baseRadius, "#c9c9c9", true);

    this.makeDecorativePropellerBlades(baseGraphics);

    Engine.baseTexture = generateTextureFromOrigin(baseGraphics);
  }

  private makeDecorativePropellerBlades(baseGraphics: Graphics) {
    baseGraphics.circle(0, 0, 3).fill("#a7a7a7");

    for (let i = 0; i < this.decoPropellerParams.amount; i++) {
      const { x: x1, y: y1 } = getRadialPoint(
        i,
        this.decoPropellerParams.amount,
        this.baseRadius - 15,
      );

      const { x: x2, y: y2 } = getRadialPoint(
        i,
        this.decoPropellerParams.amount,
        this.baseRadius - 4,
      );

      baseGraphics.moveTo(x1, y1).lineTo(x2, y2);

      baseGraphics.stroke({ width: 6, color: "#a7a7a7" });

      const { angle } = getRadialPoint(i, this.decoPropellerParams.amount, 1);

      for (let j = 0; j < this.decoPropellerParams.traceRadiuses.length; j++) {
        const startX =
          Math.cos(angle - this.decoPropellerParams.tracesWidth) *
          this.decoPropellerParams.traceRadiuses[j];
        const startY =
          Math.sin(angle - this.decoPropellerParams.tracesWidth) *
          this.decoPropellerParams.traceRadiuses[j];

        baseGraphics.moveTo(startX, startY);
        baseGraphics.arc(
          0,
          0,
          this.decoPropellerParams.traceRadiuses[j],
          angle - this.decoPropellerParams.tracesWidth,
          angle,
        );

        baseGraphics.stroke({ width: j + 1, color: "#a7a7a7" });
      }
    }
  }

  animation(delta: number, movingAngle?: number) {
    this.propellerGraphics.rotation +=
      this.propellerParams.rotationSpeed * delta;

    const isMoving = movingAngle !== undefined;
    const backAngle = isMoving ? movingAngle : 0;

    for (const particle of this.particles) {
      if (particle.scale <= 0.1) {
        if (isMoving) {
          this.resetParticle(particle);
        }
        continue;
      }

      if (!particle.isActive) {
        if (isMoving) {
          particle.delay -= delta;

          if (particle.delay <= 0) {
            const spread = 0.4;
            particle.angle = backAngle + (Math.random() - 0.5) * spread;
            particle.isActive = true;
          }
        }
        continue;
      }

      particle.gfx.x += Math.cos(particle.angle) * particle.speed * delta;
      particle.gfx.y += Math.sin(particle.angle) * particle.speed * delta;

      particle.scale -= 0.02 * delta;
      particle.gfx.scale.set(particle.scale);
    }
  }

  private resetParticle(particle: Particle) {
    particle.gfx.x = getRandomCoordinate(this.baseRadius, 7);
    particle.gfx.y = getRandomCoordinate(this.baseRadius, 7);

    particle.scale = 1;
    particle.delay = getRandomDelay(1, 64);
    particle.isActive = false;

    particle.gfx.scale.set(1);
  }
}
