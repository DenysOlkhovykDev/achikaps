class SpeedManager {
  private speedModifier = 1;

  public getSpeed() {
    return this.speedModifier;
  }

  public double() {
    this.speedModifier = 2;
  }

  public standart() {
    this.speedModifier = 1;
  }

  public toggle() {
    if (this.speedModifier === 1) {
      this.speedModifier = 2;
    } else {
      this.speedModifier = 1;
    }
  }
}

export const speedManager = new SpeedManager();
