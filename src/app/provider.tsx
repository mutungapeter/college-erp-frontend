"use client";

import { ReactNode, useRef } from "react";

import { Provider } from "react-redux";
import { AppStore, makeStore } from "../store/store";

interface ProviderProps {
  children: ReactNode;
}
export function ReduxProvider({ children }: ProviderProps) {
  const storeRef = useRef<AppStore | null>(null);
    if (!storeRef.current) {

      storeRef.current = makeStore()
    }
  return <Provider store={storeRef.current}> {children}</Provider>;
}
