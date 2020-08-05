import React from "react";
import { shallow, mount, render, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { FailedBreakpoint, BreakpointMeta, Breakpoint } from "../../src/common/types/debugger";
import { getBreakpointErrorMessage, FailedCompletedBreakpointView, CompletedBreakpointView, StackFrame, SuccessfulCompletedBreakpointData, FailedCompletedBreakpointData } from "../../src/client/chathead/BreakpointView";
import { LocationView, PendingBreakpointView, SuccessfulCompletedBreakpointView, VariablesView} from "../../src/client/chathead/BreakpointView";
import { AccordionSummary, CircularProgress, Accordion, AccordionDetails } from "@material-ui/core";


configure({ adapter: new Adapter() });


describe("getBreakpointErrorMessage", () => {
  it("performs string substitution", () => {
    const mockBreakpoint: Partial<FailedBreakpoint> = {
      status: {
        isError: true,
        description: {
          format: "Hello $0 and $1.",
          parameters: ["foo", "bar"]
        }
      }
    }
    const message = getBreakpointErrorMessage(mockBreakpoint as FailedBreakpoint);
    expect(message).toBe("Hello foo and bar.");
  });
});

describe("LocationView", () => {
  const mockBreakpoint: Partial<BreakpointMeta> = {
    location: {
      path: "foo.java",
      line: 24
    }
  }
  const wrapper = shallow(<LocationView breakpoint={mockBreakpoint}/>);
  expect(wrapper.text()).toBe("foo.java:24");
});

describe("PendingBreakpointView", () => {
  it("is accordion", () => {
    const mockBreakpoint: Partial<BreakpointMeta> = {
      location: {
        path: "foo.java",
        line: 24
      }
    }
  
    const wrapper = mount(<PendingBreakpointView breakpointMeta={mockBreakpoint}/>);
    expect(wrapper.find(Accordion).exists()).toBe(true);
  });

  it("shows location", () => {
    const mockBreakpoint: Partial<BreakpointMeta> = {
      location: {
        path: "foo.java",
        line: 24
      }
    }
  
    const wrapper = mount(<PendingBreakpointView breakpointMeta={mockBreakpoint}/>);
    expect(wrapper.find(LocationView).exists()).toBe(true);
  });

  it("shows loading status", () => {
    const mockBreakpoint: Partial<BreakpointMeta> = {
      location: {
        path: "foo.java",
        line: 24
      }
    }
  
    const wrapper = mount(<PendingBreakpointView breakpointMeta={mockBreakpoint}/>);
    expect(wrapper.find(CircularProgress).exists()).toBe(true);
  });
});


describe("SuccessfulCompletedBreakpointView", () => {
  it("is accordion", () => {
    const mockBreakpoint: Partial<BreakpointMeta> = {
      location: {
        path: "foo.java",
        line: 24
      },
      stackFrames: [{locals: []}]
    }
  
    const wrapper = mount(<SuccessfulCompletedBreakpointView breakpoint={mockBreakpoint}/>);
    expect(wrapper.find(Accordion).exists()).toBe(true);
  });

  it("shows location", () => {
    const mockBreakpoint: Partial<BreakpointMeta> = {
      location: {
        path: "foo.java",
        line: 24
      },
      stackFrames: [{locals: []}]
    }
  
    const wrapper = mount(<SuccessfulCompletedBreakpointView breakpoint={mockBreakpoint}/>);
    expect(wrapper.find(LocationView).exists()).toBe(true);
  });

  it("shows BP data", () => {
    const mockBreakpoint: Partial<BreakpointMeta> = {
      location: {
        path: "foo.java",
        line: 24
      },
      stackFrames: [{locals: []}, {locals: []}]
    }
  
    const wrapper = shallow(<SuccessfulCompletedBreakpointView breakpoint={mockBreakpoint}/>);
    expect(
      wrapper.find(AccordionDetails)
             .dive()
             .find(SuccessfulCompletedBreakpointData).exists()
    ).toBe(true)
  });
});

describe("SuccessfulCompletedBreakpointData", () => {
  it("shows N stackframes", () => {
    const mockBreakpoint: Partial<BreakpointMeta> = {
      location: {
        path: "foo.java",
        line: 24
      },
      stackFrames: [{locals: []}, {locals: []}]
    }
  
    const wrapper = shallow(<SuccessfulCompletedBreakpointData breakpoint={mockBreakpoint}/>);
    expect(
      wrapper.find(StackFrame).length
    ).toBe(2);
  });
})

describe("FailedCompletedBreakpointView", () => {
  it("is accordion", () => {
    const mockBreakpoint: Partial<FailedBreakpoint> = {
      location: {
        path: "foo.java",
        line: 24
      },
      status: {
        isError: true,
        description: {
          format: "Hello $0 and $1.",
          parameters: ["foo", "bar"]
        }
      }
    }
  
    const wrapper = mount(<FailedCompletedBreakpointView breakpoint={mockBreakpoint}/>);
    expect(wrapper.find(Accordion).exists()).toBe(true);
  });

  it("shows location", () => {
    const mockBreakpoint: Partial<FailedBreakpoint> = {
      location: {
        path: "foo.java",
        line: 24
      },
      status: {
        isError: true,
        description: {
          format: "Hello $0 and $1.",
          parameters: ["foo", "bar"]
        }
      }
    }
  
    const wrapper = mount(<FailedCompletedBreakpointView breakpoint={mockBreakpoint}/>);
    expect(wrapper.find(LocationView).exists()).toBe(true);
  });

  it("shows error data", () => {
    const mockBreakpoint: Partial<FailedBreakpoint> = {
      location: {
        path: "foo.java",
        line: 24
      },
      status: {
        isError: true,
        description: {
          format: "Hello $0 and $1.",
          parameters: ["foo", "bar"]
        }
      }
    }
  
    const wrapper = shallow(<FailedCompletedBreakpointView breakpoint={mockBreakpoint}/>);
    expect(wrapper.find(FailedCompletedBreakpointData).exists()).toBe(true);
  });
});

describe("FailedCompletedBreakpointData", () => {
  it("shows error message", () => {
    const mockBreakpoint: Partial<FailedBreakpoint> = {
      location: {
        path: "foo.java",
        line: 24
      },
      status: {
        isError: true,
        description: {
          format: "Hello $0 and $1.",
          parameters: ["foo", "bar"]
        }
      }
    }
  
    const wrapper = shallow(<FailedCompletedBreakpointData breakpoint={mockBreakpoint}/>);
    expect(wrapper.html()).toContain("MuiAlert-standardError");
    expect(wrapper.text()).toContain("Hello foo and bar.");
  });
});

describe("CompletedBreakpointView", () => {
  it("displays a successful breakpoint view if no status is provided.", () => {
    const mockBreakpoint: Partial<Breakpoint> = {
      
    };

    const wrapper = shallow(<CompletedBreakpointView breakpoint={mockBreakpoint}/>);
    expect(wrapper.find(SuccessfulCompletedBreakpointView).exists()).toBe(true);
  });

  it("displays a successful breakpoint view if status isError is false.", () => {
    const mockBreakpoint: Partial<Breakpoint> = {
      status: {isError: false}
    };

    const wrapper = shallow(<CompletedBreakpointView breakpoint={mockBreakpoint}/>);
    expect(wrapper.find(SuccessfulCompletedBreakpointView).exists()).toBe(true);
  });

  it("displays a failed breakpoint view if status isError.", () => {
    const mockBreakpoint: Partial<FailedBreakpoint> = {
      status: {
        isError: true,
        description: {
          format: "",
          parameters: []
        }
      },
      location: {
        path: "foo.java",
        line: 24
      }
    };

    const wrapper = mount(<FailedCompletedBreakpointView breakpoint={mockBreakpoint}/>);
    expect(wrapper.find(FailedCompletedBreakpointView).exists()).toBe(true);
  });
});