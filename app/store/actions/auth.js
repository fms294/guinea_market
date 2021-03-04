import AsyncStorage from "@react-native-community/async-storage";
import { uri } from "../../config/app_uri";

export const USER_LOGIN = "USER_LOGIN";
export const USER_SIGNUP = "USER_SIGNUP";
export const USER_LOGOUT = "USER_LOGOUT";
export const RESTORE_TOKEN = "RESTORE_TOKEN";
export const USER_UPDATE = "USER_UPDATE"

export const signup = (username, phone, password) => {
    return async (dispatch) => {
        console.log("in action...",username, phone, password, `${uri}/users/signup`);
        try{
            const response = await fetch(`${uri}/users/signup`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type' : "application/json"
                    },
                    body: JSON.stringify({
                        username: username,
                        phone,
                        password,
                        profile_img: ""
                    }),
                });
            if(!response.ok){
                const resData = await response.json();
                if (resData.name === 'MongoError' && resData.code === 11000) {
                    if(resData.keyPattern.phone === 1){
                        console.log("error 1");
                        throw new Error('User already Exists with this Phone Number');
                    }else {
                        throw new Error('User already Exists with this Email');
                    }
                } else {
                    console.log("Error...",resData);
                    throw new Error('Sign up failed');
                }
            }
            const resData = await response.json();
            const {userData} = resDataHandler(resData);
            dispatch({
                type: USER_SIGNUP,
                token: resData.token,
                userData: userData
            })
        }catch (err) {
            throw new Error(err);
        }
    }
}

export const login = (phone, password) => {
    return async (dispatch) => {
        try{
            const response = await fetch(`${uri}/users/login`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type' : "application/json"
                    },
                    body: JSON.stringify({
                        phone,
                        password,
                    }),
                });
            //console.log("response.. login",await response.json())
            if (!response.ok) {
                const resData = await response.json();
                throw new Error(resData.e);
            }
            const resData =  await response.json();
            const {userData} = resDataHandler(resData);
            dispatch({type: USER_LOGIN, token: resData.token, userData: userData});
        }catch(err) {
            throw new Error(err);
        }
    }
}

export const updateProfile = (username) => {
    return async (dispatch , getState) => {
        const token = getState().auth.token;
        try{
            const response = await fetch(`${uri}/users/updateProfile`,
                {
                    method: 'PATCH',
                    headers: {
                        "Content-Type" : "application/json",
                        Authorization: "Bearer " + token,
                    },
                    body: JSON.stringify({
                        username
                    })
                });
            if (!response.ok) {
                const resData = await response.json();
                throw new Error(resData.e);
            }
            const resData =  await response.json();
            const {userData} = resDataHandler(resData);
            dispatch({type: USER_UPDATE, token: resData.token, userData: userData});
        }catch(err) {
            throw new Error(err);
        }
    }
}

export const restoreToken = (token, userData) => {
    return {type: RESTORE_TOKEN, token: token, userData: userData};
}

export const logout = () => {
    AsyncStorage.removeItem("userData");
    return {type: USER_LOGOUT};
};

const resDataHandler = (resData) => {
    const userData = {
        userId: resData.user._id,
        username: resData.user.username,
        userPhone: resData.user.phone,
        userImage: resData.user.profile_img
    }

    saveDataToStorage(resData.token, userData);
    return {userData: userData};
}

const saveDataToStorage = (token, userData) => {
    AsyncStorage.setItem(
        'userData',
        JSON.stringify({
            token: token,
            userData: userData
        }),
    );
};
