// src/redux/hooks.js
import { useDispatch, useSelector } from "react-redux";

// Custom hook để sử dụng `useDispatch`
export const useAppDispatch = () => useDispatch();

// Custom hook để sử dụng `useSelector`
export const useAppSelector = useSelector;
