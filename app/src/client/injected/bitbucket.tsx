import React from "react";
import { InjectedApp, Injector } from "./injected-app";
import { BreakpointMarkers } from "../markers/BreakpointMarkers";

class BitbucketBreakpointMarkers extends BreakpointMarkers {
  getLineNumberSelector(): string {
    return ".line-number.line-locator.bitbucket-gutter-marker";
  }
}

class BitbucketInjectedApp extends InjectedApp<BitbucketBreakpointMarkers> {
  getBreakpointMarkers() {
    return BitbucketBreakpointMarkers as new() => BitbucketBreakpointMarkers;
  }
}

window.addEventListener("load", () => {
  setTimeout(() => {
    new Injector().inject(BitbucketInjectedApp as new() => BitbucketInjectedApp);
  }, 1000);
});