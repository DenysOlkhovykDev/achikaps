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
      x: this.building.x + this.building.config.boundsCenter.x,
      y: this.building.y + this.building.config.boundsCenter.y,
    };
  }

  public getBoundsRadius() {
    return this.building.config.boundsRadius;
  }

  public getStorageRadius() {
    return this.building.config.storageRadius;
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
    this.building.shadowContainer.position.set(
      this.building.config.boundsCenter.x,
      this.building.config.boundsCenter.y,
    );
    this.building.selectShadowContainer.position.set(
      this.building.config.boundsCenter.x,
      this.building.config.boundsCenter.y,
    );

    this.building.resourceStorage.resourcesContainer.position.set(
      this.building.config.storageCenter.x,
      this.building.config.storageCenter.y,
    );

    this.building.recipeSign.root.position.set(
      this.building.config.boundsCenter.x,
      this.building.config.boundsCenter.y -
        this.building.config.boundsRadius -
        15,
    );

    this.building.buildingContainer.rotation = this.orientation;
  }
}
