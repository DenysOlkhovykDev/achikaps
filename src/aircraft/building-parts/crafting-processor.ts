import type { Building } from "@aircraft/building";
import { createResource } from "@resources/_resources";

export class CraftingProcessor {
  constructor(private readonly building: Building) {}

  public tryToDoProduction() {
    if (!this.canProduce()) {
      return false;
    }

    const craftRecipe = this.building.craftRecipe!;

    for (const ingredient of craftRecipe.ingredients) {
      for (let i = 0; i < ingredient.amount; i++) {
        this.building.resourceStorage.takeReservedResourceByName(
          ingredient.resourceName,
        );
      }
    }

    const result = craftRecipe.result !== undefined ? craftRecipe.result : "";
    const newResource = createResource(result);
    const wasAdded = this.building.tryToAddResource(newResource, undefined);

    return wasAdded;
  }

  public getRequiredResourceCounts() {
    const requiredResources = new Map<string, number>();

    if (!this.building.craftRecipe) return requiredResources;

    for (const ingredient of this.building.craftRecipe.ingredients) {
      requiredResources.set(
        ingredient.resourceName,
        (requiredResources.get(ingredient.resourceName) ?? 0) +
          ingredient.amount,
      );
    }

    return requiredResources;
  }

  public canProduce() {
    return (
      this.building.craftRecipe !== undefined &&
      this.building.priorityForTasks >= 0 &&
      this.checkIsEnoughResourcesForCraft() &&
      this.hasSpaceForProductionResult()
    );
  }

  private checkIsEnoughResourcesForCraft() {
    if (this.building.craftRecipe) {
      return [...this.getRequiredResourceCounts()].every(
        ([resourceName, requiredCount]) =>
          this.building.resourceStorage.getResourceCount(resourceName) >=
          requiredCount,
      );
    }

    return false;
  }

  private hasSpaceForProductionResult() {
    if (!this.building.craftRecipe) return false;

    const consumedResources = this.building.craftRecipe.ingredients.reduce(
      (total, ingredient) => total + ingredient.amount,
      0,
    );

    return (
      this.building.resourceStorage.recources.length - consumedResources + 1 <=
      this.building.inventorySize
    );
  }
}
