import { Building } from "./building";

export class Mine extends Building {
  constructor(x: number, y: number) {
    super(x, y, "#d6d1a8", 5);
  }
}
