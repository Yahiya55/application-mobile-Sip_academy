// actions/authActions.js

// Action pour définir le token
export const setToken = (token) => ({
  type: "SET_TOKEN",
  payload: token, // Contient le token
});

// Action pour supprimer le token
export const clearToken = () => ({
  type: "CLEAR_TOKEN",
});
