import { Container, Graphics } from "pixi.js";

type Random = () => number;
type Species =
  | "SkyFish"
  | "AirOctopus"
  | "FlyingTurtle"
  | "CloudRay"
  | "LanternWhale"
  | "KiteCrab";

type CreatureVisual = {
  container: Container;
  animate: (phase: number, delta: number) => void;
};

type SpawnDefinition = {
  species: Species;
  x: number;
  y: number;
  count: number;
  spread: number;
  scale: [number, number];
};

function createRandom(seed: number): Random {
  let state = seed;

  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
}

function normalizeAngle(angle: number) {
  return Math.atan2(Math.sin(angle), Math.cos(angle));
}

class AirCreature {
  readonly root = new Container();
  private readonly shadow: Graphics;
  private readonly visual: Container;
  private phase: number;
  private heading: number;
  private targetHeading: number;
  private turnTimer: number;
  private readonly shadowBaseScale: number;

  constructor(
    readonly species: Species,
    x: number,
    y: number,
    private readonly homeX: number,
    private readonly homeY: number,
    private readonly roamRadius: number,
    private readonly speed: number,
    private readonly random: Random,
    scale: number,
    shadowSize: [number, number],
    private readonly visualDefinition: CreatureVisual,
  ) {
    this.phase = random() * Math.PI * 2;
    this.heading = random() * Math.PI * 2;
    this.targetHeading = this.heading;
    this.turnTimer = 60 + random() * 180;

    this.root.label = species;
    this.root.eventMode = "none";
    this.root.position.set(x, y);

    this.shadow = new Graphics()
      .ellipse(0, 0, shadowSize[0], shadowSize[1])
      .fill({ color: "#284646", alpha: 0.2 });
    this.shadow.position.set(9, 15);
    this.shadow.scale.set(scale);
    this.shadowBaseScale = scale;

    this.visual = visualDefinition.container;
    this.visual.scale.set(scale);
    this.root.addChild(this.shadow, this.visual);
  }

  update(delta: number) {
    const frameDelta = Math.min(Math.max(delta, 0), 3);
    this.phase += frameDelta * (0.045 + this.speed * 0.012);
    this.turnTimer -= frameDelta;

    const dxHome = this.homeX - this.root.x;
    const dyHome = this.homeY - this.root.y;
    const distanceFromHome = Math.hypot(dxHome, dyHome);

    if (distanceFromHome > this.roamRadius) {
      this.targetHeading =
        Math.atan2(dyHome, dxHome) + (this.random() - 0.5) * 0.45;
      this.turnTimer = 90;
    } else if (this.turnTimer <= 0) {
      this.targetHeading += (this.random() - 0.5) * 1.8;
      this.turnTimer = 80 + this.random() * 220;
    }

    const turn = normalizeAngle(this.targetHeading - this.heading);
    this.heading += turn * Math.min(1, frameDelta * 0.018);
    this.root.x += Math.cos(this.heading) * this.speed * frameDelta;
    this.root.y += Math.sin(this.heading) * this.speed * frameDelta;

    const bob = Math.sin(this.phase) * 4;
    this.visual.y = bob;
    this.visual.rotation = this.heading;
    this.shadow.alpha = 0.13 + (1 - (bob + 4) / 8) * 0.12;
    this.shadow.scale.y =
      this.shadowBaseScale * (0.8 + (1 - (bob + 4) / 8) * 0.25);
    this.visualDefinition.animate(this.phase, frameDelta);
  }
}

function createSkyFish(random: Random): CreatureVisual {
  const container = new Container();
  const tail = new Container();
  const upperFin = new Graphics()
    .moveTo(-4, -7)
    .lineTo(5, -18)
    .lineTo(11, -7)
    .closePath()
    .fill("#f0c267")
    .stroke({ width: 2, color: "#2b4548" });
  const lowerFin = new Graphics()
    .moveTo(-4, 7)
    .lineTo(5, 18)
    .lineTo(11, 7)
    .closePath()
    .fill("#e7a956")
    .stroke({ width: 2, color: "#2b4548" });
  const bodyColor = random() > 0.5 ? "#66c8cf" : "#77b8e5";
  const stripeColor = random() > 0.5 ? "#f3cf72" : "#e98876";

  const tailGraphic = new Graphics()
    .moveTo(0, 0)
    .lineTo(-20, -14)
    .lineTo(-16, 0)
    .lineTo(-20, 14)
    .closePath()
    .fill(stripeColor)
    .stroke({ width: 3, color: "#2b4548" });
  tail.addChild(tailGraphic);
  tail.position.set(-20, 0);

  const body = new Graphics()
    .ellipse(0, 0, 23, 12)
    .fill(bodyColor)
    .stroke({ width: 3, color: "#2b4548" })
    .moveTo(-5, -10)
    .lineTo(-1, 10)
    .stroke({ width: 5, color: stripeColor, alpha: 0.8 })
    .circle(13, -3, 3)
    .fill("#ffffff")
    .circle(14, -3, 1.5)
    .fill("#17272b");

  const whisker = new Graphics()
    .moveTo(20, 2)
    .bezierCurveTo(31, 5, 32, -3, 38, -1)
    .stroke({ width: 2, color: "#2b4548", cap: "round" });
  container.addChild(tail, upperFin, lowerFin, body, whisker);

  return {
    container,
    animate: (phase) => {
      tail.rotation = Math.sin(phase * 2.8) * 0.45;
      upperFin.rotation = Math.sin(phase * 2.2) * 0.18;
      lowerFin.rotation = -Math.sin(phase * 2.2) * 0.18;
    },
  };
}

function createAirOctopus(random: Random): CreatureVisual {
  const container = new Container();
  const tentacles = new Graphics();
  const bellColor = random() > 0.5 ? "#c985d7" : "#e58db0";
  const bell = new Graphics()
    .ellipse(0, 0, 19, 16)
    .fill(bellColor)
    .stroke({ width: 3, color: "#513154" })
    .circle(7, -4, 3)
    .fill("#ffffff")
    .circle(8, -4, 1.5)
    .fill("#3b2040")
    .circle(-3, -8, 4)
    .fill({ color: "#ffffff", alpha: 0.25 });
  container.addChild(tentacles, bell);

  return {
    container,
    animate: (phase) => {
      tentacles.clear();
      for (let i = 0; i < 6; i++) {
        const offset = (i - 2.5) * 5;
        const wave = Math.sin(phase * 1.7 + i * 0.8) * 7;
        tentacles
          .moveTo(-12, offset * 0.62)
          .bezierCurveTo(-23, offset + wave, -31, offset - wave, -43, offset)
          .stroke({
            width: 4,
            color: i % 2 === 0 ? "#9b5fb0" : "#ba70aa",
            cap: "round",
          });
      }
      bell.scale.x = 0.96 + Math.sin(phase * 1.4) * 0.06;
      bell.scale.y = 1.03 - Math.sin(phase * 1.4) * 0.05;
    },
  };
}

function createFlyingTurtle(random: Random): CreatureVisual {
  const container = new Container();
  const upperWing = new Container();
  const lowerWing = new Container();
  const shellColor = random() > 0.5 ? "#6da66f" : "#6e9d8f";

  const makeWing = (color: string) =>
    new Graphics()
      .moveTo(-6, 0)
      .bezierCurveTo(-17, -4, -20, -24, 4, -26)
      .bezierCurveTo(19, -17, 16, -5, 7, 0)
      .closePath()
      .fill(color)
      .stroke({ width: 3, color: "#304d45" });
  upperWing.addChild(makeWing("#a7c989"));
  lowerWing.addChild(makeWing("#91b982"));
  lowerWing.scale.y = -1;

  const shell = new Graphics()
    .ellipse(0, 0, 23, 17)
    .fill(shellColor)
    .stroke({ width: 4, color: "#304d45" })
    .moveTo(-14, -9)
    .lineTo(0, 12)
    .lineTo(14, -9)
    .moveTo(-18, 2)
    .lineTo(18, 2)
    .stroke({ width: 2, color: "#bdd49a", alpha: 0.75 });
  const head = new Graphics()
    .circle(25, 0, 9)
    .fill("#9cc68a")
    .stroke({ width: 3, color: "#304d45" })
    .circle(28, -3, 2)
    .fill("#162725");
  const tail = new Graphics()
    .moveTo(-22, -4)
    .lineTo(-33, 0)
    .lineTo(-22, 4)
    .closePath()
    .fill("#9cc68a")
    .stroke({ width: 2, color: "#304d45" });
  container.addChild(upperWing, lowerWing, tail, shell, head);

  return {
    container,
    animate: (phase) => {
      const flap = Math.sin(phase * 2.1) * 0.3;
      upperWing.rotation = flap;
      lowerWing.rotation = -flap;
      head.y = Math.sin(phase * 1.3) * 1.5;
    },
  };
}

function createCloudRay(random: Random): CreatureVisual {
  const container = new Container();
  const body = new Container();
  const color = random() > 0.5 ? "#a9b6e8" : "#91c4d8";
  const ray = new Graphics()
    .moveTo(29, 0)
    .bezierCurveTo(10, -3, 6, -29, -22, -31)
    .bezierCurveTo(-13, -13, -11, -7, -23, 0)
    .bezierCurveTo(-11, 7, -13, 13, -22, 31)
    .bezierCurveTo(6, 29, 10, 3, 29, 0)
    .closePath()
    .fill(color)
    .stroke({ width: 3, color: "#36445d" })
    .circle(12, -5, 2)
    .circle(12, 5, 2)
    .fill("#263249");
  const markings = new Graphics()
    .circle(-3, -12, 4)
    .circle(-3, 12, 4)
    .fill({ color: "#ffffff", alpha: 0.35 });
  const tail = new Graphics()
    .moveTo(-20, 0)
    .bezierCurveTo(-38, 4, -49, -7, -65, 1)
    .stroke({ width: 3, color: "#36445d", cap: "round" });
  body.addChild(tail, ray, markings);
  container.addChild(body);

  return {
    container,
    animate: (phase) => {
      body.scale.y = 0.88 + Math.sin(phase * 1.6) * 0.13;
      markings.alpha = 0.45 + Math.sin(phase * 1.1) * 0.25;
    },
  };
}

function createLanternWhale(random: Random): CreatureVisual {
  const container = new Container();
  const tail = new Container();
  const glow = new Graphics();
  const bodyColor = random() > 0.5 ? "#7384bb" : "#708ca8";
  const tailGraphic = new Graphics()
    .moveTo(0, 0)
    .bezierCurveTo(-15, -8, -17, -23, -6, -27)
    .lineTo(7, -8)
    .lineTo(7, 8)
    .lineTo(-6, 27)
    .bezierCurveTo(-17, 23, -15, 8, 0, 0)
    .fill(bodyColor)
    .stroke({ width: 3, color: "#293852" });
  tail.addChild(tailGraphic);
  tail.position.set(-38, 0);

  const body = new Graphics()
    .ellipse(0, 0, 40, 21)
    .fill(bodyColor)
    .stroke({ width: 4, color: "#293852" })
    .ellipse(8, 7, 20, 9)
    .fill("#d6dda2")
    .circle(24, -6, 3)
    .fill("#ffffff")
    .circle(25, -6, 1.5)
    .fill("#18233a");
  glow
    .circle(10, 8, 11)
    .fill({ color: "#f5ef99", alpha: 0.28 });
  const fin = new Graphics()
    .moveTo(-2, 6)
    .bezierCurveTo(6, 23, 22, 26, 17, 8)
    .closePath()
    .fill("#596e9e")
    .stroke({ width: 2, color: "#293852" });
  const antenna = new Graphics()
    .moveTo(22, -17)
    .bezierCurveTo(34, -34, 48, -24, 44, -13)
    .stroke({ width: 2.5, color: "#293852" })
    .circle(44, -11, 5)
    .fill("#f5ef99")
    .stroke({ width: 2, color: "#665f2b" });
  container.addChild(tail, glow, body, fin, antenna);

  return {
    container,
    animate: (phase) => {
      tail.rotation = Math.sin(phase * 1.9) * 0.32;
      fin.rotation = Math.sin(phase * 1.5) * 0.13;
      glow.alpha = 0.25 + (Math.sin(phase * 1.2) + 1) * 0.25;
      antenna.alpha = 0.65 + Math.sin(phase * 1.2) * 0.3;
    },
  };
}

function createKiteCrab(random: Random): CreatureVisual {
  const container = new Container();
  const leftClaw = new Container();
  const rightClaw = new Container();
  const shellColor = random() > 0.5 ? "#ea8e62" : "#db7180";

  const kite = new Graphics()
    .moveTo(0, -28)
    .lineTo(22, 0)
    .lineTo(0, 22)
    .lineTo(-22, 0)
    .closePath()
    .fill({ color: "#f6d995", alpha: 0.82 })
    .stroke({ width: 3, color: "#674638" })
    .moveTo(0, -26)
    .lineTo(0, 19)
    .moveTo(-19, 0)
    .lineTo(19, 0)
    .stroke({ width: 2, color: "#a8704f", alpha: 0.8 });
  const shell = new Graphics()
    .ellipse(0, 6, 17, 13)
    .fill(shellColor)
    .stroke({ width: 3, color: "#65333a" })
    .circle(8, 0, 3)
    .circle(-8, 0, 3)
    .fill("#ffffff")
    .circle(8, 0, 1.5)
    .circle(-8, 0, 1.5)
    .fill("#2d1c23");
  const clawShape = () =>
    new Graphics()
      .moveTo(0, 0)
      .lineTo(18, -5)
      .stroke({ width: 5, color: "#77424a", cap: "round" })
      .circle(21, -6, 7)
      .fill(shellColor)
      .stroke({ width: 3, color: "#65333a" });
  leftClaw.addChild(clawShape());
  rightClaw.addChild(clawShape());
  leftClaw.position.set(10, 9);
  rightClaw.position.set(-10, 9);
  rightClaw.scale.x = -1;
  container.addChild(kite, leftClaw, rightClaw, shell);

  return {
    container,
    animate: (phase) => {
      kite.rotation = Math.sin(phase * 0.9) * 0.08;
      leftClaw.rotation = Math.sin(phase * 2) * 0.2;
      rightClaw.rotation = -Math.sin(phase * 2 + 0.7) * 0.2;
    },
  };
}

function createVisual(species: Species, random: Random) {
  switch (species) {
    case "SkyFish":
      return createSkyFish(random);
    case "AirOctopus":
      return createAirOctopus(random);
    case "FlyingTurtle":
      return createFlyingTurtle(random);
    case "CloudRay":
      return createCloudRay(random);
    case "LanternWhale":
      return createLanternWhale(random);
    case "KiteCrab":
      return createKiteCrab(random);
  }
}

function getSpeciesMovement(species: Species) {
  switch (species) {
    case "SkyFish":
      return { speed: 0.48, roamRadius: 230, shadow: [21, 7] as [number, number] };
    case "AirOctopus":
      return { speed: 0.2, roamRadius: 180, shadow: [18, 9] as [number, number] };
    case "FlyingTurtle":
      return { speed: 0.3, roamRadius: 250, shadow: [25, 10] as [number, number] };
    case "CloudRay":
      return { speed: 0.4, roamRadius: 300, shadow: [29, 8] as [number, number] };
    case "LanternWhale":
      return { speed: 0.17, roamRadius: 340, shadow: [42, 12] as [number, number] };
    case "KiteCrab":
      return { speed: 0.25, roamRadius: 190, shadow: [19, 8] as [number, number] };
  }
}

export class FaunaSystem {
  readonly root = new Container();
  private readonly creatures: AirCreature[] = [];
  private readonly random = createRandom(8675309);

  constructor() {
    this.root.label = "Fauna";
    this.root.eventMode = "none";
    this.spawnWorldFauna();
  }

  update(delta: number) {
    for (const creature of this.creatures) {
      creature.update(delta);
    }
  }

  private spawnWorldFauna() {
    const spawns: SpawnDefinition[] = [
      { species: "SkyFish", x: -190, y: -120, count: 6, spread: 95, scale: [0.72, 1] },
      { species: "AirOctopus", x: 210, y: 90, count: 2, spread: 80, scale: [0.8, 1.05] },
      { species: "FlyingTurtle", x: -170, y: 190, count: 2, spread: 75, scale: [0.75, 0.95] },
      { species: "CloudRay", x: 170, y: -205, count: 2, spread: 70, scale: [0.72, 0.92] },
      { species: "KiteCrab", x: 30, y: 245, count: 2, spread: 65, scale: [0.7, 0.9] },
      { species: "LanternWhale", x: 470, y: 390, count: 1, spread: 10, scale: [0.82, 0.82] },
      { species: "SkyFish", x: 520, y: -210, count: 5, spread: 120, scale: [0.65, 0.9] },
      { species: "AirOctopus", x: -540, y: -250, count: 3, spread: 115, scale: [0.72, 1] },
      { species: "FlyingTurtle", x: -850, y: 660, count: 4, spread: 170, scale: [0.75, 1.05] },
      { species: "CloudRay", x: 1000, y: 100, count: 3, spread: 150, scale: [0.72, 1] },
      { species: "KiteCrab", x: 1120, y: 820, count: 4, spread: 170, scale: [0.72, 1.05] },
      { species: "LanternWhale", x: -1050, y: -510, count: 2, spread: 160, scale: [0.82, 1.08] },
    ];

    for (const spawn of spawns) {
      for (let i = 0; i < spawn.count; i++) {
        const angle = this.random() * Math.PI * 2;
        const distance = Math.sqrt(this.random()) * spawn.spread;
        const x = spawn.x + Math.cos(angle) * distance;
        const y = spawn.y + Math.sin(angle) * distance;
        const scale =
          spawn.scale[0] + this.random() * (spawn.scale[1] - spawn.scale[0]);
        const movement = getSpeciesMovement(spawn.species);
        const creature = new AirCreature(
          spawn.species,
          x,
          y,
          spawn.x,
          spawn.y,
          movement.roamRadius,
          movement.speed * (0.85 + this.random() * 0.3),
          this.random,
          scale,
          movement.shadow,
          createVisual(spawn.species, this.random),
        );
        this.creatures.push(creature);
        this.root.addChild(creature.root);
      }
    }
  }
}
