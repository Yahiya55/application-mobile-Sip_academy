// reducers/authReducer.js
const initialState = {
  userMode: "general", // Changez cette valeur par "invite" ou "connected" pour tester
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        userMode: "connected",
      };
    case "LOGOUT":
      return {
        ...state,
        userMode: "general",
      };
    default:
      return state;
  }
}
