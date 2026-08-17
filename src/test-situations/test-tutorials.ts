import { Tutorials } from "../tutorial-overlay/_tutorials";
import { TutorialsScenario } from "./test-situation";

export function createTutorialsByScenario(
  scenario: TutorialsScenario,
  tutorials: Tutorials,
) {
  for (const pointer of scenario.pointers || []) {
    if (pointer.x && pointer.y) {
      tutorials.addNewPointerByCoordinates(
        pointer.condition,
        pointer.x,
        pointer.y,
      );
    } else if (pointer.findTarget) {
      tutorials.addNewPointerByTarget(pointer.condition, pointer.findTarget);
    }
  }

  for (const compass of scenario.compasses || []) {
    if (compass.findTarget) {
      tutorials.addNewCompass(compass.condition, compass.findTarget);
    }
  }

  for (const message of scenario.messages || []) {
    tutorials.addNewMessage(
      message.condition,
      message.x,
      message.y,
      message.text,
      message.fontSize,
    );
  }
}
