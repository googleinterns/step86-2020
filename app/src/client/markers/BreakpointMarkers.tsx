import React from "react";
import ReactDOM from "react-dom";

import { BreakpointMeta, Breakpoint } from "../../common/types/debugger";
import { ActiveBreakpointMarker, CompletedBreakpointMarker, NewBreakpointMarker } from "./BreakpointMarker";

interface BreakpointMarkersProps {
    /** All breakpoints that have been set by the current user, and are not yet completed */
    activeBreakpoints: BreakpointMeta[];
    /** All breakpoints that have been set by tht current user, and completed. */
    completedBreakpoints: Breakpoint[];

    /** Function to set a new breakpoint */
    createBreakpoint: (fileName: string, lineNumber: number) => void;
}

/** Injects breakpoint markers for all source-code-lines on current page.
 *  These include markers for the following statuses:
 *   - No breakpoint on line => marker to set new breakpoint
 *   - Active breakpoint on line => marker to indicate pending status
 *   - Completed breakpoint on line => marker to indicate completed status.
 */
export class BreakpointMarkers extends React.Component<BreakpointMarkersProps> {
    /** Each line number has a DOM node to mount its marker to.
     *  These are kept in memory so we don't have to constantly make (expensive) querySelector operations.
     */
    mountNodes =  new Map<number, Node>();

    /** Infers the current source file name based on github UI elements.
     *  TODO: make this compatible with other sites.
     */
    getFileName(): string {
        return document.querySelector(".final-path").innerHTML;
    }

    /** Get list of DOM nodes for each row of source code in the currently active file.
     *  These are used to mount breakpoint markers.
     *  TODO: make this compatible with non-github too.
     */
    getRowNodes(): Node[] {
      // Notice the map to node.parentNode. This lets us target the <tr/> container rather than the <td/> line number.
      // This is because (on github at least) clicking the <td/> directly causes a navigation event.
      // Mounting on the <tr/> and positioning properly is a workaround.
      //@ts-ignore
      return [...document.querySelectorAll(".js-line-number")].map(node => node.parentNode);
    }

    /** While we recieve an array of active/completed breakpoints, we need to know whether such a breakpoint
     * exists for a given line number. (Else, we show a 'new' button).
     * This indexes breakpoints by line number.
     */
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

        /** Get the appropriate breakpoint market (new/active/completed) for each line. */
        return rowNodes.map((node, index) => {
            const lineNumber = index + 1;
            // DOM node where marker will be portaled to.
            const mountNode = this.getOrCreateBPMarkerMount(node, lineNumber);

            if (activeBreakpoints.has(lineNumber)) {
                return ReactDOM.createPortal(<ActiveBreakpointMarker breakpointMeta={activeBreakpoints.get(lineNumber)}/>, mountNode);
            }

            if (completedBreakpoints.has(lineNumber)) {
                return ReactDOM.createPortal(<CompletedBreakpointMarker breakpoint={completedBreakpoints.get(lineNumber)}/>, mountNode);
            }
            /** Note that this means we can't create new breakpoints on a line with existing breakpoints.
             * TODO: address this somehow. May want to add something similar to cloud console with dropdown.
             * In the short term, could just add ability to delete then re-create.
             */
            return ReactDOM.createPortal(<NewBreakpointMarker onClick={() => this.props.createBreakpoint(this.getFileName(), lineNumber)}/>, mountNode);
        });

    }

    /** We are mounting breakpoint markers at the beginning of each line of code.
     *  As github represents each line as a <tr/> this is a bit difficult, as React will only mount to the *end* of 
     * a given container. Also, since it is a <tr/>, absolute positioning to move markers to the front won't work.
     * 
     * This logic injects a new mount point at the beginning of a given github code row. After that, it will return that
     * mount point instead of re-creating it.
     */
    getOrCreateBPMarkerMount(rowNode, lineNumber):Node {
        // Only create a new mount if it doesn't already exist.
        if(!this.mountNodes.has(lineNumber)) {
          const mountNode = document.createElement("div");
          this.mountNodes.set(lineNumber, mountNode);
          rowNode.prepend(mountNode);
        }
        return this.mountNodes.get(lineNumber);
      }
}