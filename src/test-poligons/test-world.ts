import { Container, Graphics, Text } from "pixi.js";

type Point = { x: number; y: number };

type IslandDefinition = {
  x: number;
  y: number;
  radius: number;
  seed: number;
  landColor: string;
  detailColor: string;
  trees: number;
  rocks: number;
  isDestination?: boolean;
};

type AnimatedBeacon = {
  rings: Graphics[];
  phase: number;
};

function createRandom(seed: number) {
  let state = seed;

  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
}

function makeIslandPoints(radius: number, random: () => number) {
  const pointCount = 16;
  const points: Point[] = [];

  for (let i = 0; i < pointCount; i++) {
    const angle = (i / pointCount) * Math.PI * 2;
    const unevenRadius = radius * (0.82 + random() * 0.25);
    points.push({
      x: Math.cos(angle) * unevenRadius,
      y: Math.sin(angle) * unevenRadius,
    });
  }

  return points;
}

function drawPolygon(graphic: Graphics, points: Point[], offset = 0) {
  graphic.moveTo(points[0].x, points[0].y + offset);

  for (let i = 1; i < points.length; i++) {
    graphic.lineTo(points[i].x, points[i].y + offset);
  }

  graphic.lineTo(points[0].x, points[0].y + offset);
}

function drawTree(container: Container, x: number, y: number, scale: number) {
  const tree = new Graphics()
    .circle(0, 4 * scale, 5 * scale)
    .fill("#315b48")
    .circle(-4 * scale, 0, 7 * scale)
    .fill("#477b5c")
    .circle(4 * scale, -1 * scale, 8 * scale)
    .fill("#5f946b")
    .circle(0, -5 * scale, 7 * scale)
    .fill("#78aa72")
    .circle(2 * scale, -7 * scale, 2 * scale)
    .fill({ color: "#dbe8ad", alpha: 0.75 });

  tree.position.set(x, y);
  container.addChild(tree);
}

function drawRock(container: Container, x: number, y: number, scale: number) {
  const rock = new Graphics()
    .moveTo(-7 * scale, 4 * scale)
    .lineTo(-4 * scale, -5 * scale)
    .lineTo(3 * scale, -8 * scale)
    .lineTo(8 * scale, -1 * scale)
    .lineTo(5 * scale, 6 * scale)
    .lineTo(-7 * scale, 4 * scale)
    .fill("#788a83")
    .stroke({ width: 2, color: "#40514b" });

  rock.position.set(x, y);
  container.addChild(rock);
}

function randomPointOnIsland(
  radius: number,
  random: () => number,
  centerClearance = 0,
) {
  const angle = random() * Math.PI * 2;
  const availableRadius = Math.max(radius * 0.68 - centerClearance, 1);
  const distance = centerClearance + Math.sqrt(random()) * availableRadius;

  return {
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance,
  };
}

function drawDestinationBeacon(container: Container) {
  const beacon = new Container();
  const rings: Graphics[] = [];

  for (let i = 0; i < 3; i++) {
    const ring = new Graphics()
      .circle(0, 0, 26 + i * 15)
      .stroke({ width: 5, color: "#42d978", alpha: 0.65 });
    rings.push(ring);
    beacon.addChild(ring);
  }

  const marker = new Graphics()
    .circle(0, 0, 18)
    .fill("#edfff1")
    .stroke({ width: 5, color: "#173f2a" })
    .moveTo(0, -18)
    .lineTo(0, -68)
    .stroke({ width: 6, color: "#173f2a", cap: "round" })
    .moveTo(3, -65)
    .lineTo(35, -53)
    .lineTo(3, -40)
    .lineTo(3, -65)
    .fill("#42d978")
    .stroke({ width: 4, color: "#173f2a" });

  const label = new Text({
    text: "DESTINATION",
    style: {
      fill: "#173f2a",
      fontFamily: "Arial, sans-serif",
      fontSize: 18,
      fontWeight: "700",
      letterSpacing: 3,
    },
  });
  label.anchor.set(0.5);
  label.y = 45;

  beacon.addChild(marker, label);
  container.addChild(beacon);

  return rings;
}

function drawIsland(definition: IslandDefinition) {
  const island = new Container();
  island.position.set(definition.x, definition.y);
  const random = createRandom(definition.seed);
  const shorePoints = makeIslandPoints(definition.radius, random);
  const landPoints = shorePoints.map((point) => ({
    x: point.x * 0.9,
    y: point.y * 0.9,
  }));

  const shadow = new Graphics();
  drawPolygon(shadow, shorePoints, 13);
  shadow.fill({ color: "#46656a", alpha: 0.3 });

  const shore = new Graphics();
  drawPolygon(shore, shorePoints);
  shore
    .fill("#e3d39e")
    .stroke({ width: 6, color: "#354b49", join: "round" });

  const land = new Graphics();
  drawPolygon(land, landPoints);
  land
    .fill(definition.landColor)
    .stroke({ width: 3, color: definition.detailColor, alpha: 0.75 });

  island.addChild(shadow, shore, land);

  const centerClearance = definition.isDestination
    ? Math.min(70, definition.radius * 0.35)
    : 0;

  for (let i = 0; i < definition.trees; i++) {
    const point = randomPointOnIsland(
      definition.radius,
      random,
      centerClearance,
    );
    drawTree(island, point.x, point.y, 0.7 + random() * 0.65);
  }

  for (let i = 0; i < definition.rocks; i++) {
    const point = randomPointOnIsland(
      definition.radius,
      random,
      centerClearance,
    );
    drawRock(island, point.x, point.y, 0.7 + random() * 0.7);
  }

  const beaconRings = definition.isDestination
    ? drawDestinationBeacon(island)
    : [];

  return { island, beaconRings };
}

function drawDistantWorld(layer: Container) {
  const random = createRandom(6421);
  const currents = new Graphics();

  for (let i = 0; i < 150; i++) {
    const x = random() * 5000 - 2500;
    const y = random() * 5000 - 2500;
    const radius = 1 + random() * 3;
    currents
      .circle(x, y, radius)
      .fill({ color: i % 5 === 0 ? "#ffffff" : "#9fc6c7", alpha: 0.28 });
  }

  for (let i = 0; i < 22; i++) {
    const x = random() * 4200 - 2100;
    const y = random() * 4200 - 2100;
    const length = 35 + random() * 85;
    currents
      .moveTo(x, y)
      .bezierCurveTo(x + length * 0.3, y - 10, x + length * 0.7, y + 10, x + length, y)
      .stroke({ width: 3, color: "#ffffff", alpha: 0.18, cap: "round" });
  }

  layer.addChild(currents);
}

export class WorldScenery {
  private beacon?: AnimatedBeacon;

  setBeacon(rings: Graphics[]) {
    this.beacon = { rings, phase: 0 };
  }

  update(delta: number) {
    if (!this.beacon) return;

    this.beacon.phase += delta * 0.035;
    for (let i = 0; i < this.beacon.rings.length; i++) {
      const ring = this.beacon.rings[i];
      const wave = (Math.sin(this.beacon.phase - i * 0.75) + 1) / 2;
      ring.scale.set(0.9 + wave * 0.2);
      ring.alpha = 0.25 + wave * 0.55;
    }
  }
}

export function createWorld(
  distantWorldLayer: Container,
  worldLayer: Container,
) {
  distantWorldLayer.eventMode = "none";
  worldLayer.eventMode = "none";
  drawDistantWorld(distantWorldLayer);

  const scenery = new WorldScenery();
  const islands: IslandDefinition[] = [
    {
      x: 0,
      y: 0,
      radius: 315,
      seed: 1201,
      landColor: "#8dbd82",
      detailColor: "#527b59",
      trees: 25,
      rocks: 12,
    },
    {
      x: 520,
      y: -210,
      radius: 145,
      seed: 937,
      landColor: "#a8c987",
      detailColor: "#6d8954",
      trees: 11,
      rocks: 5,
    },
    {
      x: -540,
      y: -250,
      radius: 175,
      seed: 421,
      landColor: "#80ad8d",
      detailColor: "#4b7162",
      trees: 14,
      rocks: 8,
    },
    {
      x: 290,
      y: 650,
      radius: 110,
      seed: 811,
      landColor: "#b7c982",
      detailColor: "#7b8550",
      trees: 5,
      rocks: 9,
    },
    {
      x: -850,
      y: 660,
      radius: 230,
      seed: 3323,
      landColor: "#88b9a0",
      detailColor: "#4d7568",
      trees: 18,
      rocks: 14,
    },
    {
      x: 1000,
      y: 100,
      radius: 180,
      seed: 1777,
      landColor: "#91cf88",
      detailColor: "#3d7d50",
      trees: 12,
      rocks: 7,
      isDestination: true,
    },
    {
      x: 1120,
      y: 820,
      radius: 265,
      seed: 2719,
      landColor: "#c2bd7d",
      detailColor: "#82794b",
      trees: 6,
      rocks: 24,
    },
    {
      x: -1350,
      y: -650,
      radius: 190,
      seed: 3907,
      landColor: "#79b79a",
      detailColor: "#3e765e",
      trees: 20,
      rocks: 6,
    },
  ];

  for (const definition of islands) {
    const { island, beaconRings } = drawIsland(definition);
    worldLayer.addChild(island);

    if (beaconRings.length > 0) {
      scenery.setBeacon(beaconRings);
    }
  }

  return scenery;
}
