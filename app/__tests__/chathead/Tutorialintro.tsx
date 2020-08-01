import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { TutorialIntro } from "../../src/client/chathead/Tutorialintro";
import { Step1Tutorial } from "../../src/client/chathead/Step1Tutorial";
import ShallowRenderer from "react-test-renderer/shallow";
import { Step2Tutorial } from "../../src/client/chathead/Step2Tutorial";
import {ScrollDialogClass} from "../../src/client/chathead/Tutorial";
import { shallow } from "enzyme";


describe("Tutorial", () => {
  it("tests first content of tutorial", () => {
    const renderer = new ShallowRenderer();
    renderer.render(<TutorialIntro />);
    const result = renderer.getRenderOutput();

    expect(result.type).toBe("section");
  });

  it("tests first content of tutorial", () => {
    const renderer = new ShallowRenderer();
    renderer.render(<Step1Tutorial />);
    const result = renderer.getRenderOutput();

    expect(result.type).toBe("section");
  });

  it("tests first content of tutorial", () => {
    const renderer = new ShallowRenderer();
    renderer.render(<Step2Tutorial />);
    const result = renderer.getRenderOutput();

    expect(result.type).toBe("section");
  });

  // it("",() => {
  //   const renderer = new ShallowRenderer();
  //   renderer.render(<ScrollDialogClass />);
  //   const result = renderer.getRenderOutput();

  //   expect(result).toBe("section");
  // });
  
});
