import type { Building } from "@aircraft/building";
import { createResource } from "@resources/_resources";

export class CraftingProcessor {
  constructor(private readonly building: Building) {}

  public tryToDoProduction() {
    if (!this.canProduce()) {
      return false;
    }

    const craft = this.building.craft!;

    for (const ingredient of craft.ingredients) {
      for (let i = 0; i < ingredient.count; i++) {
        this.building.resourceStorage.takeReservedResourceByName(
          ingredient.resourceName,
        );
      }
    }

    const result = craft.result !== undefined ? craft.result : "";
    const newResource = createResource(result);
    const wasAdded = this.building.tryToAddResource(newResource, undefined);

    return wasAdded;
  }

  public getRequiredResourceCounts() {
    const requiredResources = new Map<string, number>();

    if (!this.building.craft) return requiredResources;

    for (const ingredient of this.building.craft.ingredients) {
      requiredResources.set(
        ingredient.resourceName,
        (requiredResources.get(ingredient.resourceName) ?? 0) +
          ingredient.count,
      );
    }

    return requiredResources;
  }

  public canProduce() {
    return (
      this.building.craft !== undefined &&
      this.building.priorityForTasks >= 0 &&
      this.checkIsEnoughResourcesForCraft() &&
      this.hasSpaceForProductionResult()
    );
  }

  private checkIsEnoughResourcesForCraft() {
    if (this.building.craft) {
      return [...this.getRequiredResourceCounts()].every(
        ([resourceName, requiredCount]) =>
          this.building.resourceStorage.getResourceCount(resourceName) >=
          requiredCount,
      );
    }

    return false;
  }

  private hasSpaceForProductionResult() {
    if (!this.building.craft) return false;

    const consumedResources = this.building.craft.ingredients.reduce(
      (total, ingredient) => total + ingredient.count,
      0,
    );

    return (
      this.building.resourceStorage.recources.length - consumedResources + 1 <=
      this.building.inventorySize
    );
  }
}
