import { Container } from "pixi.js";
import { Resource } from "@resources/resource";
import { Task } from "@dashboard/task";
import { deleteTask } from "@dashboard/_dashboard";

type ResourceListener = (task: Task, resource: Resource) => void;

export class ResourceStorage {
  resourcesContainer: Container = new Container();
  resourceList: Map<string, number> = new Map<string, number>();
  recources: Resource[] = [];

  private resourceListeners: ResourceListener[] = [];

  constructor(
    private inventorySize: number,
    private placementRadius: number,
  ) {}

  getAvailableResourceCount(resourceName: string) {
    return this.recources.filter(
      (resource) =>
        resource.resourceType === resourceName &&
        !resource.isReservedForTransport &&
        !resource.isReservedForConstruction,
    ).length;
  }

  placeResource(resource: Resource) {
    const radius = this.placementRadius;
    const minDist = 15;

    let tries = 0;

    while (tries < 50) {
      const angle = Math.random() * Math.PI * 2;
      const distanceFromCenter = Math.sqrt(Math.random()) * radius;

      const x = Math.cos(angle) * distanceFromCenter;
      const y = Math.sin(angle) * distanceFromCenter;

      const isValid = this.recources.every((other) => {
        if (other === resource) return true;

        const dx = other.root.x - x;
        const dy = other.root.y - y;

        return Math.sqrt(dx * dx + dy * dy) > minDist;
      });

      if (isValid) {
        resource.root.x = x;
        resource.root.y = y;
        resource.root.rotation = Math.random() * Math.PI * 2;
        return;
      }

      tries++;
    }

    resource.root.x = 0;
    resource.root.y = 0;
    resource.root.rotation = Math.random() * Math.PI * 2;
  }

  onResourceAdded(fn: ResourceListener) {
    this.resourceListeners.push(fn);

    return () => {
      const index = this.resourceListeners.indexOf(fn);
      if (index !== -1) {
        this.resourceListeners.splice(index, 1);
      }
    };
  }

  tryToAddResource(resource: Resource, task?: Task, shouldRefreshTasks = true) {
    if (this.recources.length >= this.inventorySize) return false;

    resource.isReserved = task !== undefined;
    resource.isReservedForTransport = false;
    resource.isReservedForConstruction = false;
    this.recources.push(resource);
    this.resourcesContainer.addChild(resource.root);

    const resourceName = resource.resourceType;
    const current = this.resourceList.get(resourceName) ?? 0;

    this.resourceList.set(resourceName, current + 1);
    this.placeResource(resource);

    if (task) {
      deleteTask(task);
    }

    for (const fn of this.resourceListeners) {
      if (task) {
        fn(task, resource);
      }
    }

    return true;
  }

  takeResourceByIndex(resourceIndex: number, shouldRefreshTasks = true) {
    if (resourceIndex < 0 || resourceIndex >= this.recources.length) {
      return undefined;
    }

    const resourceName = this.recources[resourceIndex].resourceType;
    const current = this.resourceList.get(resourceName) ?? 0;

    if (current > 1) {
      this.resourceList.set(resourceName, current - 1);
    } else {
      this.resourceList.delete(resourceName);
    }

    const [resource] = this.recources.splice(resourceIndex, 1);

    this.resourcesContainer.removeChild(resource.root);
    resource.isReserved = false;
    resource.isReservedForTransport = false;
    resource.isReservedForConstruction = false;

    return resource;
  }

  takeResource(resource: Resource, shouldRefreshTasks = true) {
    const index = this.recources.indexOf(resource);

    return this.takeResourceByIndex(index, shouldRefreshTasks);
  }

  takeResourceByName(resourceName: string, shouldRefreshTasks = true) {
    const index = this.recources.findIndex(
      (resource) =>
        resource.resourceType === resourceName &&
        !resource.isReservedForTransport &&
        !resource.isReservedForConstruction,
    );

    if (index === -1) return false;

    this.takeResourceByIndex(index, shouldRefreshTasks);
    return true;
  }
}
