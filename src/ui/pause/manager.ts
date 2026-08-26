class PauseManager {
  private paused = false;

  public isPaused() {
    return this.paused;
  }

  public pause() {
    this.paused = true;
  }

  public resume() {
    this.paused = false;
  }

  public toggle() {
    this.paused = !this.paused;
  }
}

export const pauseManager = new PauseManager();
