// reducers/authReducer.js

const initialState = {
  // Par défaut, nous démarrons en mode "general" (écrans d'authentification)
  userMode: "general",
  token: null, // Par défaut aucun token n'est présent
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        // Passage au mode connecté et stockage du token
        userMode: "connected",
        token: action.payload.token,
      };
    case "LOGOUT":
      return {
        ...state,
        // Retour au mode général et suppression du token
        userMode: "general",
        token: null,
      };
    default:
      return state;
  }
}
