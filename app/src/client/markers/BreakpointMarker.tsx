import React from "react";
import styled from "styled-components";

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

}

interface CompletedBreakpointMarkerProps {
    breakpoint: Breakpoint;
}

export const CompletedBreakpointMarker = ({breakpoint}) => {

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
`;

const NewBreakpointMarkerWrapper = styled(GeneralBreakpointMarkerWrapper)`
    background: transparent;
    &:hover {
        background: #ccc;
    }
`;