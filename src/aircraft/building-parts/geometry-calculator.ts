import { Building } from "@aircraft/building";

export class GeometryCalulator {
  orientation: number = 0;

  constructor(private readonly building: Building) {}

  public getBaseCenterInWorld() {
    return {
      x: this.building.x,
      y: this.building.y,
    };
  }

  public getBoundsCenterInWorld() {
    return {
      x: this.building.x + this.building.buildingConfig.boundsCenter.x,
      y: this.building.y + this.building.buildingConfig.boundsCenter.y,
    };
  }

  public getBoundsRadius() {
    return this.building.buildingConfig.boundsRadius;
  }

  public getStorageRadius() {
    return this.building.buildingConfig.storageRadius;
  }

  public orientByBuildDirection(from: Building) {
    const fromCenter = from.geometry.getBaseCenterInWorld();
    const toCenter = this.getBaseCenterInWorld();

    const dx = toCenter.x - fromCenter.x;
    const dy = toCenter.y - fromCenter.y;

    if (dx === 0 && dy === 0) return;

    this.orientation = Math.atan2(dy, dx);
    this.applyGeometryTransform();
  }

  public applyGeometryTransform() {
    this.building.backgroundDisplay.position.set(
      this.building.buildingConfig.boundsCenter.x,
      this.building.buildingConfig.boundsCenter.y,
    );

    this.building.resourceStorage.position.set(
      this.building.buildingConfig.storageCenter.x,
      this.building.buildingConfig.storageCenter.y,
    );

    this.building.recipeSign.position.set(
      this.building.buildingConfig.boundsCenter.x,
      this.building.buildingConfig.boundsCenter.y -
        this.building.buildingConfig.boundsRadius -
        15,
    );

    this.building.buildingContainer.rotation = this.orientation;
  }
}
