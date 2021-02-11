import axios from "axios";
import AsyncStorage from "@react-native-community/async-storage";
import Constants from "expo-constants";
const { manifest } = Constants;

const uri = `http://${manifest.debuggerHost
    .split(`:`)
    .shift()
    .concat(`:3000`)}`;

export function forgetPassword(phone) {
    //console.log("ForgetPassword... api call", phone);
    return new Promise((resolve, reject) => {
        return (
            axios.post(`${uri}/users/forgetPass`,phone,
                {
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                })
                .then(res => {
                    //console.log(res)
                    resolve(res)
                })
                .catch((error) => {
                    reject(error);
                    console.log(error)
                })
        );
    })
};

export function updatePassword(id,password) {
    // console.log(`${uri}/users/updatePassword/${id}`, password);
    // console.log(id, password);
    return new Promise((resolve, reject) => {
        return (
            axios.patch(`${uri}/users/updatePassword/${id}`,password,
                {
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                })
                .then(res => {
                    //console.log(res)
                    resolve(res)
                })
                .catch((error) => {
                    reject(error);
                    console.log(error)
                })
        );
    })
};

export const filter = (query) => {
    return new Promise((resolve, reject) => {
        return(
            axios.get(`${uri}/listing/filter?${query}`,
                {
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                })
                .then((res) => {
                    resolve(res)
            })
                .catch((error) => {
                    reject(error);
                    console.log(error);
                })
        );
    })
}

export const fetchOtherUser = (userId) => {
    return new Promise((resolve, reject) => {
        let user = {};
        AsyncStorage.getItem("userData")
            .then((res) => {
                if(res !== null) {
                    user = JSON.parse(res)
                    return(
                        axios.get(`${uri}/users/owner/`+userId,
                            {
                                headers:{
                                    Accept: 'application/json',
                                    'Content-Type': 'application/json',
                                    Authorization: 'Bearer ' + user.token,
                                },
                            }).then(res => resolve(res))
                            .catch(error => reject(error))
                    );
                }
            })
    })
}
