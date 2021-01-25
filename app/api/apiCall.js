import axios from "axios";
import AsyncStorage from "@react-native-community/async-storage";
import Constants from "expo-constants";
const { manifest } = Constants;

const uri = `http://${manifest.debuggerHost
    .split(`:`)
    .shift()
    .concat(`:3000`)}`;

export function forgetPassword(email) {
    console.log("ForgetPassword...", email);
    return new Promise((resolve, reject) => {
        return (
            axios.post(`${uri}/users/forgetPass`,email,
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
