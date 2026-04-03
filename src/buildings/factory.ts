import { Building } from "./building";

export class Factory extends Building {
  constructor(x: number, y: number) {
    super(x, y, "#a8d0db", 5);
  }
}
