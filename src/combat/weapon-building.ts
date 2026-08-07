import { Container, Graphics } from "pixi.js";
import { Building } from "@buildings/building";
import { BuildingKind } from "@buildings/_buildings";
import {
  CombatTarget,
  findClosestHostileTarget,
} from "@combat/combat";

type WeaponStats = {
  damage: number;
  range: number;
  cooldown: number;
  projectileSpeed: number;
  projectileRadius: number;
  projectileColor: string;
};

type Projectile = {
  graphic: Graphics;
  target: CombatTarget;
  damage: number;
  speed: number;
  lifetime: number;
};

function normalizeAngle(angle: number) {
  return Math.atan2(Math.sin(angle), Math.cos(angle));
}

export abstract class WeaponBuilding extends Building {
  protected readonly turret = new Container();
  protected readonly projectileLayer = new Container();
  protected readonly muzzleFlash = new Graphics();

  private readonly projectiles: Projectile[] = [];
  private target?: CombatTarget;
  private cooldownRemaining = 0;
  private scanDirection = 1;

  protected constructor(
    x: number,
    y: number,
    buildingType: BuildingKind,
    protected readonly weaponStats: WeaponStats,
  ) {
    super(x, y, 0, buildingType);
    this.maxHealth = 140;
    this.health = this.maxHealth;
    this.root.addChild(this.projectileLayer);
  }

  protected updateWeapon(delta: number) {
    this.updateProjectiles(delta);
    this.cooldownRemaining -= delta;
    this.muzzleFlash.alpha = Math.max(0, this.muzzleFlash.alpha - delta * 0.12);

    if (
      !this.target?.isAlive ||
      Math.hypot(this.target.x - this.x, this.target.y - this.y) >
        this.weaponStats.range
    ) {
      this.target = findClosestHostileTarget(
        this.x,
        this.y,
        this.weaponStats.range,
        this.team,
      );
    }

    if (!this.target) {
      this.turret.rotation += this.scanDirection * delta * 0.004;
      if (Math.abs(this.turret.rotation) > Math.PI * 0.85) {
        this.scanDirection *= -1;
      }
      return;
    }

    const desiredAngle = Math.atan2(
      this.target.y - this.y,
      this.target.x - this.x,
    );
    const angleDifference = normalizeAngle(desiredAngle - this.turret.rotation);
    this.turret.rotation += angleDifference * Math.min(1, delta * 0.12);

    if (this.cooldownRemaining <= 0 && Math.abs(angleDifference) < 0.16) {
      this.fire(this.target);
      this.cooldownRemaining = this.weaponStats.cooldown;
    }
  }

  protected fire(target: CombatTarget) {
    if (this.weaponStats.projectileSpeed <= 0) {
      target.takeDamage(this.weaponStats.damage);
      this.showMuzzleFlash();
      return;
    }

    const angle = this.turret.rotation;
    const startDistance = this.baseSize * 0.72;
    const projectileGraphic = new Graphics()
      .circle(0, 0, this.weaponStats.projectileRadius)
      .fill(this.weaponStats.projectileColor)
      .stroke({ width: 1.5, color: "#1d2528" });
    projectileGraphic.position.set(
      Math.cos(angle) * startDistance,
      Math.sin(angle) * startDistance,
    );
    this.projectileLayer.addChild(projectileGraphic);
    this.projectiles.push({
      graphic: projectileGraphic,
      target,
      damage: this.weaponStats.damage,
      speed: this.weaponStats.projectileSpeed,
      lifetime: this.weaponStats.range / this.weaponStats.projectileSpeed + 20,
    });
    this.showMuzzleFlash();
  }

  private showMuzzleFlash() {
    const angle = this.turret.rotation;
    const distance = this.baseSize * 0.82;
    this.muzzleFlash.clear();
    this.muzzleFlash
      .star(
        Math.cos(angle) * distance,
        Math.sin(angle) * distance,
        6,
        4,
        11,
        angle,
      )
      .fill("#ffd85a");
    this.muzzleFlash.alpha = 1;
  }

  private updateProjectiles(delta: number) {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const projectile = this.projectiles[i];
      projectile.lifetime -= delta;

      if (!projectile.target.isAlive || projectile.lifetime <= 0) {
        this.removeProjectile(i);
        continue;
      }

      const targetX = projectile.target.x - this.x;
      const targetY = projectile.target.y - this.y;
      const dx = targetX - projectile.graphic.x;
      const dy = targetY - projectile.graphic.y;
      const distance = Math.hypot(dx, dy);
      const travel = projectile.speed * delta;

      if (distance <= travel + 4) {
        projectile.target.takeDamage(projectile.damage);
        this.removeProjectile(i);
        continue;
      }

      projectile.graphic.x += (dx / distance) * travel;
      projectile.graphic.y += (dy / distance) * travel;
    }
  }

  private removeProjectile(index: number) {
    const [projectile] = this.projectiles.splice(index, 1);
    projectile.graphic.destroy();
  }
}
