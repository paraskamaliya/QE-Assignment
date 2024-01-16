import { legacy_createStore } from "redux";
import AuthReducer from "./reducer";
export const store = legacy_createStore(AuthReducer)