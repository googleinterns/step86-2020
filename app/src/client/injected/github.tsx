import React from "react";
import { InjectedApp, Injector } from "./injected-app";
import { BreakpointMarkers } from "../markers/BreakpointMarkers";

class GithubBreakpointMarkers extends BreakpointMarkers {
  getLineNumberSelector(): string {
    return ".js-line-number";
  }
}

class GithubInjectedApp extends InjectedApp<GithubBreakpointMarkers> {
  getBreakpointMarkers() {
    return GithubBreakpointMarkers as new() => GithubBreakpointMarkers;
  }
}

new Injector().inject(GithubInjectedApp as new() => GithubInjectedApp);