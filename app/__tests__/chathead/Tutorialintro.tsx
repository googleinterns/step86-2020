import React from 'react';
import { TutorialIntro } from "../../src/client/chathead/Tutorialintro";
 import ShallowRenderer from "react-test-renderer/shallow";


describe("Tutorial", () => {
    it("tests first content of tutorial", () => {

    const renderer = new ShallowRenderer();
    renderer.render(<TutorialIntro />);
    const result = renderer.getRenderOutput();

    expect(result.type).toBe("section");
    });
});
