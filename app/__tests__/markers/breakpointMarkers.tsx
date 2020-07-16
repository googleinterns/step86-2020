import React from "react";
import { shallow, mount, render, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { NewBreakpointMarker, ActiveBreakpointMarker, CompletedBreakpointMarker } from "../../src/client/markers/BreakpointMarker";
import { BreakpointMarkers } from "../../src/client/markers/BreakpointMarkers";
import { BreakpointMeta, Breakpoint } from "../../src/common/types/debugger";

configure({ adapter: new Adapter() });

describe("NewBreakpointMarker", () => {
  it("responds to clicks", () => {
    const spy = jest.fn();
    const wrapper = shallow(<NewBreakpointMarker onClick={spy}/>);
    wrapper.simulate("click");
    expect(spy).toHaveBeenCalled();
  });
});

describe("BreakpointMarkers", () => {
  let getRowNodesSpy, createMountSpy, mountMarkerSpy;

  beforeAll(() => {
    // Mock getRowNodes to simulate getting line number dom elements, since querySelector is unavailable.
    getRowNodesSpy = jest.spyOn(BreakpointMarkers.prototype, "getRowNodes").mockImplementation(() => ["row1", "row2", "row3"]);
    // Mock createMount to simulate injecting a mount for a particular row node, since we can't track DOM injects.
    createMountSpy = jest.spyOn(BreakpointMarkers.prototype, "createMount").mockImplementation((rowNode, lineNumber) => rowNode);
    // Mock mounting a marker to a particular dom node, so that we can track it.
    mountMarkerSpy = jest.spyOn(BreakpointMarkers.prototype, "mountMarker").mockImplementation((marker, mountNode) => marker);
  });

  // Before each "it" test, clear the spies so we can measure # calls accurately.
  beforeEach(() => {
    getRowNodesSpy.mockClear();
    createMountSpy.mockClear();
    mountMarkerSpy.mockClear();
  });

  // After all "it" tests, restore original functions so we don't contaminate other tests.
  afterAll(() => {
    getRowNodesSpy.mockRestore();
    createMountSpy.mockRestore();
    mountMarkerSpy.mockRestore();
  })

  it("indexes breakpoints by line number", () => {
    const bp1 = {location: {line: 1}};
    const bp2 = {location: {line: 3}};
    const mockBreakpoints = [bp1, bp2];
  
    const index = BreakpointMarkers.prototype.indexByLineNumber(mockBreakpoints as BreakpointMeta[]);
    expect(index.size).toBe(2);
    expect(index.get(1)).toBe(bp1);
    expect(index.get(3)).toBe(bp2);

  });

  it("creates mount for each line in file.", () => {
    const wrapper = shallow(
      <BreakpointMarkers
        activeBreakpoints={[]}
        completedBreakpoints={[]}
        createBreakpoint={() => {}}
      />
    );

    // Make sure a mount node was created for each line.
    expect(createMountSpy).toHaveBeenCalledTimes(3);
    expect(createMountSpy).toHaveBeenNthCalledWith(1, "row1", 1);
    expect(createMountSpy).toHaveBeenNthCalledWith(2, "row2", 2);
    expect(createMountSpy).toHaveBeenNthCalledWith(3, "row3", 3);
  });

  it("creates new-breakpoint marker for each line", () => {
    const wrapper = shallow(
      <BreakpointMarkers
        activeBreakpoints={[]}
        completedBreakpoints={[]}
        createBreakpoint={() => {}}
      />
    );

    expect(wrapper.find(NewBreakpointMarker).length).toBe(3);
  });

  it("creates right number of active-breakpoint markers.", () => {
    const bp1 = {location: {line: 1}} as BreakpointMeta;
    const bp2 = {location: {line: 2}} as BreakpointMeta;
  
    const wrapper = shallow(
      <BreakpointMarkers
        activeBreakpoints={[bp1, bp2]}
        completedBreakpoints={[]}
        createBreakpoint={() => {}}
      />
    );

    expect(wrapper.find(ActiveBreakpointMarker).length).toBe(2);
  });

  it("creates right number of completed-breakpoint markers.", () => {
    const bp1 = {location: {line: 1}} as Breakpoint;
    const bp2 = {location: {line: 2}} as Breakpoint;
  
    const wrapper = shallow(
      <BreakpointMarkers
        activeBreakpoints={[]}
        completedBreakpoints={[bp1, bp2]}
        createBreakpoint={() => {}}
      />
    );

    expect(wrapper.find(CompletedBreakpointMarker).length).toBe(2);
  });

  it("creates right number of active, completed, and new breakpoint markers.", () => {
    const activeBp = {location: {line: 1}} as Breakpoint;
    const completedBp = {location: {line: 2}} as Breakpoint;
  
    const wrapper = shallow(
      <BreakpointMarkers
        activeBreakpoints={[activeBp]}
        completedBreakpoints={[completedBp]}
        createBreakpoint={() => {}}
      />
    );

    // Active and complete BP as required
    expect(wrapper.find(ActiveBreakpointMarker).length).toBe(1);
    expect(wrapper.find(CompletedBreakpointMarker).length).toBe(1);
    // New BP on empty line
    expect(wrapper.find(NewBreakpointMarker).length).toBe(1);
  });

  it("mounts each marker to the right node based on line number", (done) => {
    // This lets us track the marker "mounted" for each row.
    const rowToMarker = new Map();
    // We overwrite the "beforeAll" spy because we need this row -> marker tracking.
    const mountMarkerSpy = jest.spyOn(BreakpointMarkers.prototype, "mountMarker").mockImplementation((marker, mountNode) => {
      rowToMarker.set(mountNode, marker);
      return null;
    });

    const activeBp = {location: {line: 2}} as Breakpoint;
    const completedBp = {location: {line: 3}} as Breakpoint;
  
    const wrapper = shallow(
      <BreakpointMarkers
        activeBreakpoints={[activeBp]}
        completedBreakpoints={[completedBp]}
        createBreakpoint={() => {}}
      />
    );

    // Use setImmediate to allow the mountMarkerSpy to hit and update rowToMarker.
    setImmediate(() => {
      // Because no breakpoint on line 1
      expect(rowToMarker.get("row1").type).toBe(NewBreakpointMarker);
      // Because breakpoints on these lines.
      expect(rowToMarker.get("row2").type).toBe(ActiveBreakpointMarker);
      expect(rowToMarker.get("row3").type).toBe(CompletedBreakpointMarker);
      done();
    });
  });
});
