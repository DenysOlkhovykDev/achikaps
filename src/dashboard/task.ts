import { Building } from "@buildings/building";
import {
  aStar,
  dijkstra,
  buildPath,
  getPathDistance,
} from "@utils/algorithms";

import { buildings } from "@buildings/_buildings";
import { Resource } from "@resources/resource";
import { ResourceType } from "@resources/resource-types";

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
    public resource?: ResourceType,
  ) {}

  public getRouteForTarget(current: Building): Building[] {
    return aStar(current, this.target);
  }

  public getRouteForResource(
    start: Building,
    reserve: boolean,
  ): [Building[], Resource | undefined, number | undefined] {
    const { distances, previous } = dijkstra(start);

    let bestBuilding: Building | undefined = undefined;
    let bestResource: Resource | undefined = undefined;
    let bestDistance = Infinity;
    let bestTotalDistance = Infinity;

    for (const building of buildings) {
      if (building === this.target) continue;

      const resource = this.findNeededResource(building);

      if (resource !== undefined) {
        const distance = distances.get(building)!;
        const pathToTarget = aStar(building, this.target);

        if (pathToTarget.length === 0) {
          continue;
        }

        const totalDistance = distance + getPathDistance(pathToTarget);

        if (totalDistance < bestTotalDistance) {
          bestTotalDistance = totalDistance;
          bestDistance = distance;
          bestBuilding = building;
          bestResource = resource;
        }
      }
    }

    if (!bestBuilding) return [[], undefined, undefined];

    if (reserve && bestResource) {
      bestResource.isReserved = true;
    }

    return [buildPath(previous, bestBuilding), bestResource, bestDistance];
  }

  private findNeededResource(building: Building): Resource | undefined {
    return building.resources.find(
      (resource) =>
        resource.resourceType === this.resource && !resource.isReserved,
    );
  }
}
