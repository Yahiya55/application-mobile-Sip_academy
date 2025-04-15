import { createStore, combineReducers } from "redux";
import authReducer from "./reducers/authReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  // Ajoutez d'autres reducers ici si nécessaire
});

const store = createStore(rootReducer);

export default store;
