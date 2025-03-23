// components/ClientReduxProvider.js
"use client";

import React from "react";
import { Provider } from "react-redux";
import { store } from "@/lib/store"; // Import the store directly

export default function ClientReduxProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}
