import { Container } from "pixi.js";
import { TutorialPointer, Pointer } from "./tutorial-pointer";
import { Compass, TutorialCompass } from "./tutorial-compass";
import { worldLayer } from "../main";
import { Message, TutorialMessage } from "./tutorial-message";

export class Tutorials {
  tutorialOverlay = new TutorialPointer();
  compassOverlay = new TutorialCompass();
  messagesOverlay = new TutorialMessage();

  pointers: Pointer[] = [];
  compasses: Compass[] = [];
  messages: Message[] = [];

  public init(stage: Container) {
    stage.addChild(this.tutorialOverlay);
    stage.addChild(this.compassOverlay);
    stage.addChild(this.messagesOverlay);
  }

  public addNewPointerByCoordinates(condition: Function, x: number, y: number) {
    this.pointers.push({
      condition,
      debounce: 0,
      timeout: 0,
      x,
      y,
    });
  }

  public addNewPointerByTarget(condition: Function, findTarget: Function) {
    this.pointers.push({
      condition,
      debounce: 0,
      timeout: 0,
      findTarget,
    });
  }

  public addNewCompass(condition: Function, findTarget: Function) {
    this.compasses.push({
      condition,
      findTarget,
    });
  }

  public addNewMessage(
    condition: Function,
    x: number,
    y: number,
    text: string,
    fontSize: number,
  ) {
    this.messages.push({
      condition,
      x,
      y,
      text,
      fontSize,
    });
  }

  public updateTutorials() {
    this.updatePointers();
    this.updateCompasses();
    this.updateMessages();
  }

  public updatePointers() {
    const activePointers = this.pointers.filter((p) => p.condition());

    if (activePointers.length === 0) {
      this.tutorialOverlay.update(undefined, undefined);
      return;
    }

    for (const pointer of activePointers) {
      let x = pointer.x;
      let y = pointer.y;

      if (pointer.findTarget) {
        const target = pointer.findTarget();

        if (!target) {
          continue;
        }

        x = target.x;
        y = target.y;
      }

      if (
        x === undefined ||
        y === undefined ||
        pointer.timeout >= 1000000 ||
        pointer.debounce <= 25
      ) {
        if (pointer.debounce <= 25) {
          pointer.debounce++;
        }
        this.tutorialOverlay.update();
        continue;
      }

      pointer.timeout++;
      this.tutorialOverlay.update(x, y);
    }
  }

  public updateCompasses() {
    const activeCompasses = this.compasses.filter((p) => p.condition());

    if (activeCompasses.length === 0) {
      this.compassOverlay.update(undefined, undefined);
      return;
    }

    for (const compass of activeCompasses) {
      let x = 0;
      let y = 0;

      if (compass.findTarget) {
        const target = compass.findTarget();

        if (!target) {
          return;
        }

        x = target.x;
        y = target.y;
      }

      if (x === undefined || y === undefined) {
        return;
      }

      const global = worldLayer.toGlobal({
        x: x,
        y: y,
      });

      this.compassOverlay.update(global.x, global.y);
    }
  }

  public updateMessages() {
    const activeMessages = this.messages.filter((p) => p.condition());

    if (activeMessages.length === 0) {
      this.messagesOverlay.update(undefined, undefined, undefined);
      return;
    }

    for (const message of activeMessages) {
      this.messagesOverlay.update(
        message.x,
        message.y,
        message.text,
        message.fontSize,
      );
    }
  }
}
