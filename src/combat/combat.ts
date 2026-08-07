import { Container } from "pixi.js";

export type CombatTeam = "player" | "enemy" | "neutral";

export interface CombatTarget {
  x: number;
  y: number;
  root: Container;
  team: CombatTeam;
  health: number;
  maxHealth: number;
  readonly isAlive: boolean;
  takeDamage(amount: number): void;
}

const targets = new Set<CombatTarget>();

export function registerCombatTarget(target: CombatTarget) {
  targets.add(target);

  return () => targets.delete(target);
}

export function findClosestHostileTarget(
  x: number,
  y: number,
  range: number,
  team: CombatTeam,
) {
  let closest: CombatTarget | undefined;
  let closestDistance = range;

  for (const target of targets) {
    if (!target.isAlive || target.team === team || target.team === "neutral") {
      continue;
    }

    const distance = Math.hypot(target.x - x, target.y - y);
    if (distance <= closestDistance) {
      closest = target;
      closestDistance = distance;
    }
  }

  return closest;
}

export function clearCombatTargets() {
  targets.clear();
}
