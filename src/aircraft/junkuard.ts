import { Graphics, Sprite } from "pixi.js";
import { Building, BuildingConfig } from "@aircraft/building";
import {
  generateTextureFromOrigin,
  makeBasicCircle,
  makeRoundShadow,
} from "@utils/basic-graphic";
import { getRandomDelay } from "@utils/delay";

type Particle = {
  gfx: Graphics;
  angle: number;
  speed: number;
  scale: number;
  delay: number;
};

export class Junkuard extends Building {
  static readonly config: BuildingConfig = {
    storageCenter: { x: 0, y: 0 },
    storageRadius: 52,

    boundsCenter: { x: 0, y: 0 },
    boundsRadius: 60,

    baseGraphicalSize: 60,

    minLinkLength: 120,
    maxLinkLength: 200,
  };

  static constructionRecipe = [
    { resourceName: "Organic", amount: 5 },
    { resourceName: "Water", amount: 2 },
  ];

  // contentContainer
  // ├── particles
  // ├── baseGraphics

  particles: Particle[] = [];
  amountOfParticles: number = 4;

  constructor(x: number, y: number) {
    super(x, y, 20, "Junkuard");
    this.draw();
  }

  draw() {
    makeRoundShadow(
      Junkuard.config.baseGraphicalSize,
      "#000000",
      this.shadowContainer,
    );

    this.createBaseTexture();

    const base = new Sprite(Junkuard.baseTexture);
    this.contentContainer.addChild(base);

    this.createParticles();
  }

  private createBaseTexture() {
    if (Junkuard.baseTexture) return;

    const baseGraphics = new Graphics();

    makeBasicCircle(
      baseGraphics,
      Junkuard.config.baseGraphicalSize,
      "#cac8a5",
      true,
    );

    Junkuard.baseTexture = generateTextureFromOrigin(baseGraphics);
  }

  private createParticles() {
    for (let i = 0; i < this.amountOfParticles; i++) {
      const particle = new Graphics().circle(0, 0, 20).fill("#000000");

      this.particles.push({
        gfx: particle,
        angle: Math.random() * Math.PI * 2,
        speed: 1.3,
        scale: 1,
        delay: getRandomDelay(32, 64),
      });
      this.contentContainer.addChildAt(particle, 0);
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
    particle.delay = getRandomDelay(32, 64);

    particle.gfx.scale.set(1);
  }
}
