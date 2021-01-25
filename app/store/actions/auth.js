import AsyncStorage from "@react-native-community/async-storage";
import Constants from "expo-constants";
const { manifest } = Constants;

export const USER_LOGIN = "USER_LOGIN";
export const USER_SIGNUP = "USER_SIGNUP";
export const USER_LOGOUT = "USER_LOGOUT";
export const RESTORE_TOKEN = "RESTORE_TOKEN";

const uri = `http://${manifest.debuggerHost
    .split(`:`)
    .shift()
    .concat(`:3000`)}`;

export const signup = (username, email, password) => {
    return async (dispatch) => {
        try{
            const response = await fetch(`${uri}/users/signup`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type' : "application/json"
                    },
                    body: JSON.stringify({
                        username: username,
                        email: email,
                        password,
                    }),
                });
            console.log("response",response);
            if(!response.ok){
                const resData = await response.json();
                if (resData.name === 'MongoError' && resData.code === 11000) {
                    throw new Error('User already Exists');
                } else {
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

export const login = (email, password) => {
    return async (dispatch) => {
        try{
            const response = await fetch(`${uri}/users/login`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type' : "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        password,
                    }),
                });
            console.log("response.. login",response)
            if (!response.ok) {
                const resData = await response.json();
                if (resData.e === 'Invalid username or password') {
                    throw new Error(resData.e);
                }
                throw new Error('Login Failed');
            }
            const resData =  await response.json();
            const {userData} = resDataHandler(resData);
            dispatch({type: USER_LOGIN, token: resData.token, userData: userData});
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
        userEmail: resData.user.email
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
