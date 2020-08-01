import React from 'react';
import { Step2Tutorial } from "../../src/client/chathead/Step2Tutorial";
 import ShallowRenderer from "react-test-renderer/shallow";


describe("Tutorial", () => {
    it("tests first content of tutorial", () => {

    const renderer = new ShallowRenderer();
    renderer.render(<Step2Tutorial />);
    const result = renderer.getRenderOutput();

    expect(result.type).toBe("section");
    });
});
