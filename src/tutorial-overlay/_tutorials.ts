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
      x,
      y,
    });
  }

  public addNewPointerByTarget(condition: Function, findTarget: Function) {
    this.pointers.push({
      condition,
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
    const activePointer = this.pointers.find((p) => p.condition());

    if (!activePointer) {
      this.tutorialOverlay.update(undefined, undefined);
      return;
    }

    let x = activePointer.x;
    let y = activePointer.y;

    if (activePointer.findTarget) {
      const target = activePointer.findTarget();

      if (!target) {
        return;
      }

      x = target.x;
      y = target.y;
    }

    if (x === undefined || y === undefined) {
      return;
    }

    this.tutorialOverlay.update(x, y);
  }

  public updateCompasses() {
    const activeCompasses = this.compasses.find((p) => p.condition());

    if (!activeCompasses) {
      this.compassOverlay.update(undefined, undefined);
      return;
    }

    let x = 0;
    let y = 0;

    if (activeCompasses.findTarget) {
      const target = activeCompasses.findTarget();

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

  public updateMessages() {
    const activeMessages = this.messages.find((p) => p.condition());

    if (!activeMessages) {
      this.messagesOverlay.update(undefined, undefined, undefined);
      return;
    }

    this.messagesOverlay.update(
      activeMessages.x,
      activeMessages.y,
      activeMessages.text,
      activeMessages.fontSize,
    );
  }
}
