/** _ variables are for use inside namespaced store modules*/

// COMMON STORE ACTIONS
export const REQUEST_ = "REQUEST";
export const SUCCESS_ = "SUCCESS";
export const ERROR_ = "ERROR";
export const LOGOUT_ = "LOGOUT";
export const CREATE_ = "CREATE";
export const DELETE_ = "DELETE";

// PUBLIC ACTIONS 
export const AUTH_REQUEST = `auth/${REQUEST_}`;
export const AUTH_SUCCESS = `auth/${SUCCESS_}`;
export const AUTH_ERROR = `auth/${ERROR_}`;
export const AUTH_LOGOUT = `auth/${LOGOUT_}`;

// user
export const USER_REQUEST = `user/${REQUEST_}`;
export const USER_SUCCESS = `user/${SUCCESS_}`;
export const USER_ERROR = `user/${ERROR_}`;

// classoccurrence
export const CLASSOCCURRENCE_REQUEST = `classoccurrence/${REQUEST_}`;
export const CLASSOCCURRENCE_CREATE = `classoccurrence/${CREATE_}`;
