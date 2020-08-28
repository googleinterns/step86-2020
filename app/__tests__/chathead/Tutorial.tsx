import React from "react";
import { TutorialIntro } from "../../src/client/chathead/Tutorialintro";
import { Step1Tutorial } from "../../src/client/chathead/Step1Tutorial";
import ShallowRenderer from "react-test-renderer/shallow";
import { Step2Tutorial } from "../../src/client/chathead/Step2Tutorial";


describe("Tutorial", () => {
  it("tests intro content of tutorial", () => {
    const renderer = new ShallowRenderer();
    renderer.render(<TutorialIntro />);
    const result = renderer.getRenderOutput();

    expect(result.type).toBe("section");
  });

  it("tests first step content of tutorial", () => {
    const renderer = new ShallowRenderer();
    renderer.render(<Step1Tutorial />);
    const result = renderer.getRenderOutput();

    expect(result.type).toBe("section");
  });

  it("tests second content of tutorial", () => {
    const renderer = new ShallowRenderer();
    renderer.render(<Step2Tutorial />);
    const result = renderer.getRenderOutput();

    expect(result.type).toBe("section");
  });
});