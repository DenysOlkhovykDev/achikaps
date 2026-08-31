import { compasses } from "../ui/compass/manager";
import { tutorials } from "../ui/tutorial/manager";
import { UiElementsScenario } from "./test-situation";

export function createUiElementsByScenario(scenario: UiElementsScenario) {
  for (const tutorial of scenario.tutorials || []) {
    tutorials.addTutorial(
      tutorial.text,
      tutorial.condition,
      tutorial.x,
      tutorial.y,
      tutorial.findTarget,
    );
  }

  for (const compass of scenario.compasses || []) {
    compasses.addCompass(compass.x, compass.y, compass.condition);
  }
}
