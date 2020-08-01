import React from 'react';
import { Step1Tutorial } from "../../src/client/chathead/Step1Tutorial";
 import ShallowRenderer from "react-test-renderer/shallow";


describe("Tutorial", () => {
    it("tests first content of tutorial", () => {

    const renderer = new ShallowRenderer();
    renderer.render(<Step1Tutorial />);
    const result = renderer.getRenderOutput();

    expect(result.type).toBe("section");
    });
});

