import { Building } from "@aircraft/building";
import { Task } from "@dashboard/task";
import { Worker } from "@workers/worker";

const isTest = import.meta.env.MODE === "test";

export class Navigator {
  speed: number = 2;

  path: Building[] = [];
  state: string;

  constructor(public currentPlatform: Building) {
    this.state = "idle";
  }

  public move(worker: Worker, delta: number) {
    if (this.path.length > 0) {
      const targetCenter = this.path[0].getBaseCenterInWorld();

      let x = worker.x;
      let y = worker.y;

      if (isTest) {
        x = targetCenter.x;
        y = targetCenter.y;
        this.onReachTargetBuilding();
      } else {
        const dx = targetCenter.x - x;
        const dy = targetCenter.y - y;

        const angle = Math.atan2(dy, dx);
        worker.rotation = angle + Math.PI / 2;

        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > 3) {
          const vx = dx / distance;
          const vy = dy / distance;

          x += vx * this.speed * delta;
          y += vy * this.speed * delta;
        } else {
          this.onReachTargetBuilding();
        }
      }

      worker.position.set(x, y);
    } else {
      this.state = "stay";
    }
  }

  private onReachTargetBuilding() {
    this.currentPlatform = this.path[0];

    this.path.shift();

    if (this.path.length === 0) {
      this.state = "stay";
    }
  }

  public doesHaveActiveTargetBuilding() {
    return this.path.length > 0;
  }

  public pickPathToBuilding(task: Task) {
    this.path = task.getRouteForTarget(this.currentPlatform);

    this.pathMovingPrepearing();
  }

  public pickPathToResource(task: Task) {
    const [path, resource] = task.getRouteForResource(
      this.currentPlatform,
      true,
    );

    this.path = path;

    this.pathMovingPrepearing();

    return resource;
  }

  private pathMovingPrepearing() {
    this.path.shift();

    this.state = "moving";
  }
}
