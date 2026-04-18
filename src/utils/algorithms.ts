import { Building } from "@buildings/building";

import { buildings } from "@buildings/_buildings";

// IDK how it works
export function dijkstra(start: Building) {
  const distances = new Map<Building, number>();
  const previous = new Map<Building, Building>();
  const visited = new Set<Building>();

  for (const building of buildings) {
    distances.set(building, Infinity);
  }

  distances.set(start, 0);

  while (true) {
    let currentNode: Building | undefined;

    for (const [building, distance] of distances) {
      if (
        !visited.has(building) &&
        (currentNode === undefined || distance < distances.get(currentNode)!)
      ) {
        currentNode = building;
      }
    }

    if (!currentNode) break;

    visited.add(currentNode);

    for (const road of currentNode.links) {
      const neighbor = road.from === currentNode ? road.to : road.from;
      const newDistance =
        distances.get(currentNode)! +
        getDistanceBetweenBuildings(currentNode, neighbor);

      if (newDistance < distances.get(neighbor)!) {
        distances.set(neighbor, newDistance);
        previous.set(neighbor, currentNode);
      }
    }
  }

  return { distances, previous };
}

export function aStar(start: Building, goal: Building) {
  const openSet: Building[] = [start];

  const cameFrom = new Map<Building, Building>();

  const costFromStart = new Map<Building, number>();
  const estimatedTotalCost = new Map<Building, number>();

  for (const building of buildings) {
    costFromStart.set(building, Infinity);
    estimatedTotalCost.set(building, Infinity);
  }

  costFromStart.set(start, 0);
  estimatedTotalCost.set(start, getDistanceBetweenBuildings(start, goal));

  while (openSet.length) {
    const currentNode = openSet.reduce((a, b) =>
      estimatedTotalCost.get(a)! < estimatedTotalCost.get(b)! ? a : b,
    );

    if (currentNode === goal) {
      return buildPath(cameFrom, currentNode);
    }

    openSet.splice(openSet.indexOf(currentNode), 1);

    for (const road of currentNode.links) {
      const neighbor = road.from === currentNode ? road.to : road.from;
      const newCost =
        costFromStart.get(currentNode)! +
        getDistanceBetweenBuildings(currentNode, neighbor);

      if (newCost < costFromStart.get(neighbor)!) {
        cameFrom.set(neighbor, currentNode);
        costFromStart.set(neighbor, newCost);

        const priority = newCost + getDistanceBetweenBuildings(neighbor, goal);
        estimatedTotalCost.set(neighbor, priority);

        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        }
      }
    }
  }

  return [];
}

export function getDistanceBetweenBuildings(a: Building, b: Building): number {
  return Math.hypot(a.root.x - b.root.x, a.root.y - b.root.y);
}

export function buildPath(previous: Map<Building, Building>, target: Building) {
  const path: Building[] = [target];

  let current = target;

  while (previous.has(current)) {
    current = previous.get(current)!;
    path.push(current);
  }

  return path.reverse();
}
