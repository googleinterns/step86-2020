import React from "react";
import styled, { keyframes } from "styled-components";

import { BreakpointMeta, Breakpoint } from "../../common/types/debugger";

interface NewBreakpointMarkerProps {
  onClick: () => void;
}

/** Displayed next to line number to set new breakpoint when clicked. */
export const NewBreakpointMarker = ({ onClick }: NewBreakpointMarkerProps) => {
  return <NewBreakpointMarkerWrapper onClick={onClick} />;
};

interface ActiveBreakpointMarkerProps {
  breakpointMeta: BreakpointMeta;
}

/** Displayed next to line number to show currently active (pending) breakpoints */
export const ActiveBreakpointMarker = ({
  breakpointMeta,
}: ActiveBreakpointMarkerProps) => {
  return <ActiveBreakpointMarkerWrapper />;
};

interface CompletedBreakpointMarkerProps {
  breakpoint: Breakpoint;
}

/** Displayed next to line number to show completed breakpoints */
export const CompletedBreakpointMarker = ({
  breakpoint,
}: CompletedBreakpointMarkerProps) => {
  return <CompletedBreakpointMarkerWrapper />;
};

/** UI that is shared by all types of breakpoint markers.
 *  Defines basic shape and positioning.
 */
const GeneralBreakpointMarkerWrapper = styled.div`
  width: 16px;
  height: 20px;
  margin-left: 4px;

  background-clip: content-box;
  border: 4px solid white;
  border-left: none;
  border-right: none;
  clip-path: polygon(0% 0%, 50% 0%, 100% 50%, 50% 100%, 0% 100%);
  box-shadow: inset 0px -6px 0px rgba(0, 0, 0, 0.1);
`;

/** Makes new breakpoint button invisible until hovered. */
const NewBreakpointMarkerWrapper = styled(GeneralBreakpointMarkerWrapper)`
  background: #ccc;
  opacity: 0;
  &:hover {
    background: #ccc;
    opacity: 1;
  }
`;

/** Animation to show loading state of active breakpoints */
const ActiveBreakpointMarkerPulsate = keyframes`
  from {
      transform: scale(1);
  }
  to {
      transform: scale(1.1);
  }
`;

/** Makes active breakpoints yellow (like a traffic light...halfway), and pulse. */
const ActiveBreakpointMarkerWrapper = styled(GeneralBreakpointMarkerWrapper)`
  background: gold;
  animation: ${ActiveBreakpointMarkerPulsate} 0.4s alternate infinite;
`;

/** Makes completed breakpoints appear blue and static. */
const CompletedBreakpointMarkerWrapper = styled(GeneralBreakpointMarkerWrapper)`
  background: cornflowerblue;
`;
