import { Container, Graphics, Text } from "pixi.js";
import { createResource } from "@resources/_resources";

export interface RecipeIngredient {
  resourceName: string;
  amount: number;
}

export interface Recipe {
  ingredients: RecipeIngredient[];
  result?: string;
}

export interface RecipeSignOptions {
  layout?: "horizontal" | "vertical";
  availableResources?: string[];
  isAvailableResult?: boolean;
}

export class RecipeSign {
  root = new Container();

  private unavailableAlpha = 0.45;
  private spacing = 15;
  private padding = 10;

  constructor() {
    this.root.eventMode = "none";
  }

  isShown() {
    return this.root.children.length > 0;
  }

  show(recipe: Recipe, options: RecipeSignOptions = {}) {
    this.hide();

    if (options.layout === "vertical") {
      this.drawVertical(recipe.ingredients);
    } else {
      this.drawHorizontal(recipe, options);
    }
  }

  hide() {
    this.root.removeChildren();
  }

  private drawHorizontal(recipe: Recipe, options: RecipeSignOptions) {
    const elements: Container[] = [];
    const availableCounts = options.availableResources
      ? this.countResources(options.availableResources)
      : undefined;

    for (const ingredient of recipe.ingredients) {
      for (let i = 0; i < ingredient.amount; i++) {
        const resource = createResource(ingredient.resourceName).root;
        const availableCount = availableCounts
          ? (availableCounts.get(ingredient.resourceName) ?? 0)
          : ingredient.amount;

        if (availableCounts && availableCount > 0) {
          availableCounts.set(ingredient.resourceName, availableCount - 1);
        } else if (availableCounts) {
          resource.alpha = this.unavailableAlpha;
        }

        elements.push(resource);
      }
    }

    if (recipe.result) {
      elements.push(this.createArrow());

      const result = createResource(recipe.result).root;
      if (options.isAvailableResult === false) {
        result.alpha = this.unavailableAlpha;
      }
      elements.push(result);
    }

    if (elements.length === 0) return;

    const center = (elements.length - 1) / 2;
    const width = (elements.length - 1) * this.spacing + this.padding * 2;
    const height = 20;

    const background = new Graphics()
      .rect(-width / 2, -height / 2, width, height)
      .fill("#c9c6bb")
      .stroke({ width: 2, color: "#000000" });

    this.root.addChild(background);

    elements.forEach((element, index) => {
      element.position.set((index - center) * this.spacing, 0);
      this.root.addChild(element);
    });
  }

  private drawVertical(ingredients: RecipeIngredient[]) {
    if (ingredients.length === 0) return;

    const width = 30;
    const height = ingredients.length * this.spacing + 5;
    const background = new Graphics()
      .rect(0, 0, width, height)
      .fill("#c9c6bb")
      .stroke({ width: 2, color: "#000000" });

    this.root.addChild(background);

    ingredients.forEach((ingredient, index) => {
      const resource = createResource(ingredient.resourceName).root;
      resource.position.set(21, 10 + index * this.spacing);

      const amount = new Text({
        text: ingredient.amount,
        style: {
          fill: "#000000",
          fontSize: 14,
        },
        x: 4,
        y: 2 + index * this.spacing,
      });

      this.root.addChild(resource, amount);
    });
  }

  private countResources(resources: string[]) {
    const counts = new Map<string, number>();

    for (const resource of resources) {
      counts.set(resource, (counts.get(resource) ?? 0) + 1);
    }

    return counts;
  }

  private createArrow() {
    return new Graphics()
      .moveTo(-5, 0)
      .lineTo(5, 0)
      .moveTo(5, 0)
      .lineTo(0, -5)
      .moveTo(5, 0)
      .lineTo(0, 5)
      .stroke({ width: 2, color: "#000000", cap: "round" });
  }
}
