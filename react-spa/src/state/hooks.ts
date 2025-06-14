import {
  useDispatch as reduxDispatch,
  useSelector as reduxSelector,
} from "react-redux"
import type { TypedUseSelectorHook } from "react-redux"
import type { RootState, AppDispatch } from "./store"

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useDispatch: () => AppDispatch = reduxDispatch
export const useSelector: TypedUseSelectorHook<RootState> = reduxSelector
