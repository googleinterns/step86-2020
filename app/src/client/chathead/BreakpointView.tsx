import React from "react";

/** Used to display a breakpoint that has not yet hit. */
export const PendingBreakpointView = ({ breakpointMeta }) => (
  <div>
    <BreakpointHeader
      id={breakpointMeta.id}
      location={breakpointMeta.location}
    />
    <div>Loading...</div>
  </div>
);

/** Used to display data for a breakpoint that has already hit. */
export const CompletedBreakpointView = ({ breakpoint }) => (
  <div>
    <BreakpointHeader id={breakpoint.id} location={breakpoint.location} />
    {/* Adding the "null, 2" params enables pretty-printing*/}
    <pre>{JSON.stringify(breakpoint, null, 2)}</pre>
  </div>
);

const BreakpointHeader = ({ id, location }) => (
  <header>
    <span>{location.path}</span>
    <span>{location.line}</span>
  </header>
);