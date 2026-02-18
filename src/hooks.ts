import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";

// Define TypedUseSelectorHook locally to avoid import error
type TypedUseSelectorHook<TState> = (
  selector: (state: TState) => any,
  equalityFn?: (left: any, right: any) => boolean,
) => any;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
