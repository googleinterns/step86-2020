import React from "react";

/** Possible sizes for the chathead. */
export enum WindowSize {
  COLLAPSED, // Collapsed into a bubble
  REGULAR, // The usual view, a rectangle in top right.
  FULL_SCREEN // Full screened
}

export const WindowSizeContext = React.createContext<{size: WindowSize, setSize: (size: WindowSize) => void}>(undefined);