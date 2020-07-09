import React from "react";
import styled from "styled-components";

import { BreakpointMeta, Breakpoint } from "../../common/types/debugger";

interface NewBreakpointMarkerProps {
    onClick: () => void;
}

export const NewBreakpointMarker = ({onClick}) => {

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

