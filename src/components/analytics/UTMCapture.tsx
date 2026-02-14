"use client";

import { useEffect } from "react";
import { captureUTMParams } from "@/lib/utm";

/** Captures UTM params from the URL on first page load. */
export function UTMCapture() {
  useEffect(() => {
    captureUTMParams();
  }, []);
  return null;
}
