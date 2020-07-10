import React from "react";
import styled, {keyframes} from "styled-components";

import { BreakpointMeta, Breakpoint } from "../../common/types/debugger";

interface NewBreakpointMarkerProps {
    onClick: () => void;
}

export const NewBreakpointMarker = ({onClick}) => {
    return <NewBreakpointMarkerWrapper onClick={onClick}/>
}

interface ActiveBreakpointMarkerProps {
    breakpointMeta: BreakpointMeta;
}

export const ActiveBreakpointMarker = ({breakpointMeta}) => {
    return <ActiveBreakpointMarkerWrapper/>
}

interface CompletedBreakpointMarkerProps {
    breakpoint: Breakpoint;
}

export const CompletedBreakpointMarker = ({breakpoint}) => {
    return <CompletedBreakpointMarkerWrapper/>
}

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

const NewBreakpointMarkerWrapper = styled(GeneralBreakpointMarkerWrapper)`
    background: #ccc;
    opacity: 0;
    &:hover {
        background: #ccc;
        opacity: 1;
    }
`;

const ActiveBreakpointMarkerPulsate = keyframes`
  from {
      transform: scale(1);
  }
  to {
      transform: scale(1.1);
  }
`

const ActiveBreakpointMarkerWrapper = styled(GeneralBreakpointMarkerWrapper)`
    background: gold;
    animation: ${ActiveBreakpointMarkerPulsate} 0.4s alternate infinite;
`;

const CompletedBreakpointMarkerWrapper = styled(GeneralBreakpointMarkerWrapper)`
    background: cornflowerblue;
`;