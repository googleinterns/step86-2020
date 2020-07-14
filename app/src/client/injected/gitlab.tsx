import React from "react";
import { InjectedApp, Injector } from "./injected-app";
import { BreakpointMarkers } from "../markers/BreakpointMarkers";

class GitlabBreakpointMarkers extends BreakpointMarkers {
  getLineNumberSelector(): string {
    return ".diff-line-num i";
  }
}

class GitlabInjectedApp extends InjectedApp<GitlabBreakpointMarkers> {
  getBreakpointMarkers() {
    return GitlabBreakpointMarkers as new() => GitlabBreakpointMarkers;
  }
}

window.addEventListener("load", () => {
  setTimeout(() => {
    new Injector().inject(GitlabInjectedApp as new() => GitlabInjectedApp);
  }, 2000);
});