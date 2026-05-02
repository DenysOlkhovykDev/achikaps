import { Graphics } from "pixi.js";
import { Building } from "@buildings/building";

type Particle = {
  gfx: Graphics;
  angle: number;
  speed: number;
  scale: number;
  delay: number;
};

export class Junkuard extends Building {
  numberOfParticles: number = 4;

  particles: Particle[] = [];

  constructor(x: number, y: number) {
    super(x, y, 20);
    this.draw();
  }

  draw() {
    this.makeBasicCircle(this.baseSize, "#cac8a5", true);

    this.makeRoundShadow(this.baseSize, "#000000", this.shadowContainer);

    this.visual.addChild(this.mainGraphic);

    for (let i = 0; i < this.numberOfParticles; i++) {
      const particle = new Graphics().circle(0, 0, 20).fill("#000000");

      this.particles.push({
        gfx: particle,
        angle: Math.random() * Math.PI * 2,
        speed: 1.3,
        scale: 1,
        delay: this.getRandomDelay(),
      });
      this.visual.addChildAt(particle, 0);
    }
  }

  animation(delta: number) {
    for (const particle of this.particles) {
      if (particle.delay <= 0) {
        particle.gfx.x += Math.cos(particle.angle) * particle.speed * delta;
        particle.gfx.y += Math.sin(particle.angle) * particle.speed * delta;

        particle.scale -= 0.012 * delta;
        particle.gfx.scale.set(particle.scale);

        if (particle.scale <= 0.2) {
          this.resetParticle(particle);
        }
      } else {
        particle.delay -= delta;
      }
    }
  }

  private resetParticle(particle: Particle) {
    particle.gfx.x = 0;
    particle.gfx.y = 0;

    particle.angle = Math.random() * Math.PI * 2;
    particle.scale = 1;
    particle.delay = this.getRandomDelay();

    particle.gfx.scale.set(1);
  }

  private getRandomDelay() {
    return 32 + Math.random() * 64;
  }
}
