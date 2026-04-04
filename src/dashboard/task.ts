import { Building } from "@buildings/building";

import { Resource } from "@resources/resource";

import { buildings } from "@buildings/_buildings";

export const JobType = {
  delivery: "delivery",
  build: "build",
  produce: "produce",
  defend: "defend",
} as const;

export type JobType = (typeof JobType)[keyof typeof JobType];

export class Task {
  constructor(
    public target: Building,
    public jobType: JobType,
    public priority: number,
    public resource?: string,
  ) {}

  // rework
  public getRouteForTarget(current: Building): Building[] {
    const openSet: Building[] = [current];

    const cameFrom = new Map<Building, Building>();

    const gScore = new Map<Building, number>();
    const fScore = new Map<Building, number>();

    for (const b of buildings) {
      gScore.set(b, Infinity);
      fScore.set(b, Infinity);
    }

    gScore.set(current, 0);
    fScore.set(current, this.heuristic(current, this.target));

    while (openSet.length) {
      const current = openSet.reduce((a, b) =>
        fScore.get(a)! < fScore.get(b)! ? a : b,
      );

      if (current === this.target) {
        return this.reconstructPath(cameFrom, current);
      }

      openSet.splice(openSet.indexOf(current), 1);

      for (const next of current.links) {
        const tentativeG = gScore.get(current)! + this.distance(current, next);

        if (tentativeG < gScore.get(next)!) {
          cameFrom.set(next, current);
          gScore.set(next, tentativeG);

          const f = tentativeG + this.heuristic(next, this.target);

          fScore.set(next, f);

          if (!openSet.includes(next)) {
            openSet.push(next);
          }
        }
      }
    }

    return [];
  }

  // rework
  public getRouteForResource(start: Building): [Building[], number] {
    const cameFrom = new Map<Building, Building>();
    const dist = new Map<Building, number>();
    const visited = new Set<Building>();

    for (const b of buildings) {
      dist.set(b, Infinity);
    }

    dist.set(start, 0);

    while (true) {
      let current: Building | undefined = undefined;

      for (const [b, d] of dist) {
        if (
          !visited.has(b) &&
          (current === undefined || d < dist.get(current)!)
        ) {
          current = b;
        }
      }

      if (!current) break;

      if (current !== this.target) {
        const resourceIndex = this.hasNeededResource(current);
        if (resourceIndex !== undefined) {
          return [this.reconstructPath(cameFrom, current), resourceIndex];
        }
      }

      visited.add(current);

      for (const next of current.links) {
        const newDist = dist.get(current)! + this.distance(current, next);

        if (newDist < dist.get(next)!) {
          dist.set(next, newDist);
          cameFrom.set(next, current);
        }
      }
    }

    return [[], -1];
  }

  private hasNeededResource(building: Building): number | undefined {
    for (let i = 0; i < building.recources.length; i++) {
      const element = building.recources[i];

      if (element.constructor.name === this.resource && !element.isReserved) {
        element.isReserved = true;
        return i;
      }
    }

    return undefined;
  }

  private heuristic(a: Building, b: Building): number {
    return Math.hypot(a.root.x - b.root.x, a.root.y - b.root.y);
  }

  private distance(a: Building, b: Building): number {
    return Math.hypot(a.root.x - b.root.x, a.root.y - b.root.y);
  }

  private reconstructPath(
    cameFrom: Map<Building, Building>,
    current: Building,
  ): Building[] {
    const path: Building[] = [current];

    while (cameFrom.has(current)) {
      current = cameFrom.get(current)!;
      path.push(current);
    }

    return path.reverse();
  }
}
