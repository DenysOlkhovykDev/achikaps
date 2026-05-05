import { FederatedPointerEvent } from "pixi.js";
import { Graphics } from "pixi.js";
import { Building } from "@buildings/building";
import { showJoystick } from "../main";

type Particle = {
  gfx: Graphics;
  angle: number;
  speed: number;
  scale: number;
  delay: number;
  isActive: boolean;
};

export class Engine extends Building {
  numberOfPropellerBlades: number = 3;
  propellerBladesSize: number = 7;
  rotationSpeed: number = 0.035;

  numberOfDecorativePropellerBlades: number = 3;
  tracesWidth: number = 1.6;
  traceRadiuses = [this.baseSize - 14, this.baseSize - 10, this.baseSize - 5];

  propellerBlades: Graphics = new Graphics();

  numberOfParticles: number = 4;
  particles: Particle[] = [];

  constructor(x: number, y: number) {
    super(x, y, 3);
    this.draw();
  }

  draw() {
    this.drawPropellerBlades();

    this.makeBasicCircle(this.baseSize, "#c9c9c9", true);

    this.makeRoundShadow(this.baseSize, "#000000", this.shadowContainer);

    this.drawDecorativePropellerBlades();

    this.visual.addChild(this.mainGraphic);

    for (let i = 0; i < this.numberOfParticles; i++) {
      const particle = new Graphics().circle(0, 0, 5).fill("#000000");

      this.particles.push({
        gfx: particle,
        angle: Math.random() * Math.PI * 2,
        speed: 1.7,
        scale: 0,
        delay: this.getRandomDelay(),
        isActive: false,
      });
      this.visual.addChildAt(particle, 0);
    }
  }

  onClick(event: FederatedPointerEvent) {
    super.onClick(event);
    showJoystick();
  }

  private drawPropellerBlades() {
    for (let i = 0; i < this.numberOfPropellerBlades; i++) {
      const { x: x1, y: y1 } = this.getRadialPoint(
        i * 8,
        this.numberOfPropellerBlades * 8,
        this.baseSize,
      );

      const { x: x2, y: y2 } = this.getRadialPoint(
        i * 8 - 1,
        this.numberOfPropellerBlades * 8,
        this.baseSize + this.propellerBladesSize,
      );

      this.propellerBlades
        .moveTo(x1, y1)
        .lineTo(x2, y2)
        .stroke({ width: 14, color: "#000000", cap: "round" });
      this.propellerBlades
        .moveTo(x1, y1)
        .lineTo(x2, y2)
        .stroke({ width: 10, color: "#a7a7a7", cap: "round" });
    }
    this.visual.addChild(this.propellerBlades);
  }

  private drawDecorativePropellerBlades() {
    this.mainGraphic.circle(0, 0, 3).fill("#a7a7a7");

    for (let i = 0; i < this.numberOfDecorativePropellerBlades; i++) {
      const { x: x1, y: y1 } = this.getRadialPoint(
        i,
        this.numberOfDecorativePropellerBlades,
        this.baseSize - 15,
      );

      const { x: x2, y: y2 } = this.getRadialPoint(
        i,
        this.numberOfDecorativePropellerBlades,
        this.baseSize - 4,
      );

      this.mainGraphic.moveTo(x1, y1).lineTo(x2, y2);

      this.mainGraphic.stroke({ width: 6, color: "#a7a7a7" });

      const { angle } = this.getRadialPoint(
        i,
        this.numberOfDecorativePropellerBlades,
        1,
      );

      for (let j = 0; j < this.traceRadiuses.length; j++) {
        const startX =
          Math.cos(angle - this.tracesWidth) * this.traceRadiuses[j];
        const startY =
          Math.sin(angle - this.tracesWidth) * this.traceRadiuses[j];

        this.mainGraphic.moveTo(startX, startY);
        this.mainGraphic.arc(
          0,
          0,
          this.traceRadiuses[j],
          angle - this.tracesWidth,
          angle,
        );

        this.mainGraphic.stroke({ width: j + 1, color: "#a7a7a7" });
      }
    }
  }

  animation(delta: number, movingAngle?: number) {
    this.propellerBlades.rotation += this.rotationSpeed * delta;

    const isMoving = movingAngle !== undefined;
    const backAngle = isMoving ? movingAngle + Math.PI : 0;

    for (const particle of this.particles) {
      // 1. Якщо померла
      if (particle.scale <= 0.1) {
        if (isMoving) {
          this.resetParticle(particle);
        }
        continue;
      }

      // 2. Delay
      if (!particle.isActive) {
        if (isMoving) {
          particle.delay -= delta;

          if (particle.delay <= 0) {
            // <-- ОТУТ фіксуємо актуальний напрямок
            const spread = 0.4;
            particle.angle = backAngle + (Math.random() - 0.5) * spread;
            particle.isActive = true;
          }
        }
        continue;
      }

      // 3. Рух (вже з правильним angle)
      particle.gfx.x += Math.cos(particle.angle) * particle.speed * delta;
      particle.gfx.y += Math.sin(particle.angle) * particle.speed * delta;

      particle.scale -= 0.02 * delta;
      particle.gfx.scale.set(particle.scale);
    }
  }

  private resetParticle(particle: Particle) {
    particle.gfx.x = this.getRandomCoordinate();
    particle.gfx.y = this.getRandomCoordinate();

    particle.scale = 1;
    particle.delay = this.getRandomDelay();
    particle.isActive = false;

    particle.gfx.scale.set(1);
  }

  private getRandomDelay() {
    return 1 + Math.random() * 64;
  }

  private getRandomCoordinate() {
    return -this.baseSize + 7 + Math.random() * (this.baseSize - 7);
  }
}
