import {USER_LOGIN, USER_LOGOUT, USER_SIGNUP, RESTORE_TOKEN, USER_UPDATE} from "../actions/auth";

const initialState = {
    token: null,
    isLoading: true,
    userData: null
}

export default (state = initialState, action) => {
    switch(action.type){
        case USER_SIGNUP:
            // console.log("in reducers..", action.userData);
            return{
                ...state,
                token: action.token,
                isLoading: false,
                userData: action.userData
            };
        case USER_LOGIN:
            console.log("in reducers..", action.userData);
            return {
                ...state,
                token: action.token,
                isLoading: false,
                userData: action.userData,
            };
        case USER_UPDATE:
            return {
                ...state,
                token: action.token,
                isLoading: false,
                userData: action.userData
            }
        case RESTORE_TOKEN:
            return{
                ...state,
                token: action.token,
                isLoading: false,
                userData: action.userData
            }
        case USER_LOGOUT:
            return initialState;
        default:
            return state;
    }
};
