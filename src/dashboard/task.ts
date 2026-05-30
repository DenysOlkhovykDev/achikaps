import { Building } from "@buildings/building";
import { aStar, dijkstra, buildPath } from "@utils/algorithms";

import { buildings } from "@buildings/_buildings";

export const JobType = {
  delivering: "delivering",
  building: "building",
  production: "production",
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

  public getRouteForTarget(current: Building): Building[] {
    return aStar(current, this.target);
  }

  public getRouteForResource(
    start: Building,
    reserve: boolean,
  ): [Building[], number | undefined, number | undefined] {
    const { distances, previous } = dijkstra(start);

    let bestBuilding: Building | undefined = undefined;
    let bestDistance = Infinity;
    let resourceIndex: number | undefined = undefined;

    for (const building of buildings) {
      if (building === this.target) continue;

      const index = this.hasNeededResource(building);

      if (index !== undefined) {
        const distance = distances.get(building)!;

        if (distance < bestDistance) {
          bestDistance = distance;
          bestBuilding = building;
          resourceIndex = index;
        }
      }
    }

    if (!bestBuilding) return [[], undefined, undefined];

    if (reserve) {
      bestBuilding.recources[resourceIndex!].isReserved = true;
    }

    return [buildPath(previous, bestBuilding), resourceIndex, bestDistance];
  }

  private hasNeededResource(building: Building): number | undefined {
    for (let i = 0; i < building.recources.length; i++) {
      const element = building.recources[i];

      if (element.resourceType === this.resource && !element.isReserved) {
        return i;
      }
    }

    return undefined;
  }
}
