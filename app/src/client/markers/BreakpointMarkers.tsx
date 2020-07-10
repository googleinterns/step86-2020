import React from "react";
import ReactDOM from "react-dom";

import { BreakpointMeta, Breakpoint } from "../../common/types/debugger";
import { ActiveBreakpointMarker, CompletedBreakpointMarker, NewBreakpointMarker } from "./BreakpointMarker";

interface BreakpointMarkersProps {
    activeBreakpoints: BreakpointMeta[];
    completedBreakpoints: Breakpoint[];

    createBreakpoint: (fileName: string, lineNumber: number) => void;
}

export class BreakpointMarkers extends React.Component<BreakpointMarkersProps> {
    mountNodes =  new Map<number, Node>();

    getFileName(): string {
        return document.querySelector(".final-path").innerHTML;
    }

    getRowNodes(): Node[] {
        //@ts-ignore
        return [...document.querySelectorAll(".js-line-number")].map(node => node.parentNode);
    }

    indexByLineNumber<T extends BreakpointMeta>(breakpoints: T[]): Map<number, T> {
      const indexedBreakpoints = new Map<number, T>();
      for (const bp of breakpoints) {
        indexedBreakpoints.set(bp.location.line, bp);
      }
      return indexedBreakpoints;
    }

    render() {
        const rowNodes = this.getRowNodes();
        const activeBreakpoints = this.indexByLineNumber(this.props.activeBreakpoints);
        const completedBreakpoints = this.indexByLineNumber(this.props.completedBreakpoints);

        return rowNodes.map((node, index) => {
            const lineNumber = index + 1;
            const mountNode = this.getOrCreateBPMarkerMount(node, lineNumber);

            if (activeBreakpoints.has(lineNumber)) {
                return ReactDOM.createPortal(<ActiveBreakpointMarker breakpointMeta={activeBreakpoints.get(lineNumber)}/>, mountNode);
            }

            if (completedBreakpoints.has(lineNumber)) {
                return ReactDOM.createPortal(<CompletedBreakpointMarker breakpoint={completedBreakpoints.get(lineNumber)}/>, mountNode);
            }

            return ReactDOM.createPortal(<NewBreakpointMarker onClick={() => this.props.createBreakpoint(this.getFileName(), lineNumber)}/>, mountNode);
        });

    }

    getOrCreateBPMarkerMount(rowNode, lineNumber):Node {
        if(!this.mountNodes.has(lineNumber)) {
          const mountNode = document.createElement("div");
          this.mountNodes.set(lineNumber, mountNode);
          rowNode.prepend(mountNode);
        }
        return this.mountNodes.get(lineNumber);
      }
}