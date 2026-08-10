import { Building } from "@buildings/building";
import { aStar, dijkstra, buildPath } from "@utils/algorithms";
import { Resource } from "@resources/resource";

import { buildings } from "@buildings/_buildings";

export const JobType = {
  delivering: "delivering",
  building: "building",
  production: "production",
  defend: "defend",
} as const;

export type JobType = (typeof JobType)[keyof typeof JobType];

export class Task {
  inProgress: boolean = false;
  reservedResource?: Resource;
  reservedAt?: Building;

  constructor(
    public target: Building,
    public jobType: JobType,
    public priority: number,
    public resource?: string,
  ) {}

  public getEffectivePriority() {
    return this.priority - this.target.recources.length;
  }

  public getRouteForTarget(current: Building): Building[] {
    return aStar(current, this.target);
  }

  public getRouteForResource(
    start: Building,
    reserve: boolean,
  ): [Building[], Resource | undefined, number | undefined] {
    const { distances, previous } = dijkstra(start);
    const { distances: distancesToTarget } = dijkstra(this.target);

    let bestBuilding: Building | undefined = undefined;
    let bestDistance = Infinity;
    let bestResource: Resource | undefined = undefined;

    for (const building of buildings) {
      if (building === this.target) continue;

      const resource = this.findNeededResource(building);

      if (resource) {
        const distanceToResource = distances.get(building);
        const distanceFromResourceToTarget = distancesToTarget.get(building);

        if (
          distanceToResource === undefined ||
          distanceFromResourceToTarget === undefined ||
          !Number.isFinite(distanceToResource) ||
          !Number.isFinite(distanceFromResourceToTarget)
        ) {
          continue;
        }

        const totalDistance =
          distanceToResource + distanceFromResourceToTarget;

        if (totalDistance < bestDistance) {
          bestDistance = totalDistance;
          bestBuilding = building;
          bestResource = resource;
        }
      }
    }

    if (!bestBuilding || !bestResource) return [[], undefined, undefined];

    if (reserve) {
      bestResource.isReserved = true;
      bestResource.isReservedForTransport = true;
      this.reservedResource = bestResource;
      this.reservedAt = bestBuilding;
      bestBuilding.refreshTasks();
    }

    return [buildPath(previous, bestBuilding), bestResource, bestDistance];
  }

  public releaseResourceReservation() {
    const reservedAt = this.reservedAt;

    if (this.reservedResource) {
      this.reservedResource.isReserved = false;
      this.reservedResource.isReservedForTransport = false;
      this.reservedResource = undefined;
    }

    this.reservedAt = undefined;
    reservedAt?.refreshTasks();
  }

  private findNeededResource(building: Building): Resource | undefined {
    for (const resource of building.recources) {
      if (resource.resourceType === this.resource && !resource.isReserved) {
        return resource;
      }
    }

    return undefined;
  }
}
