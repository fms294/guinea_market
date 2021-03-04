import axios from "axios";
import AsyncStorage from "@react-native-community/async-storage";
import { uri } from "../config/app_uri";

export const forgetPassword = (phone) => {
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

export const updatePassword = (id,password) => {
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

export const sendMessage = (message) => {
    return new Promise((resolve, reject) => {
        let user = {};
        AsyncStorage.getItem("userData")
            .then((res) => {
                if (res !== null) {
                    user = JSON.parse(res);
                    return(
                        axios.post(`${uri}/message/send`,message,
                            {
                                headers:{
                                    Accept: 'application/json',
                                    'Content-Type': 'application/json',
                                    Authorization: 'Bearer ' + user.token
                                }
                            }).then(res => resolve(res))
                            .catch(error => reject(error))
                    );
                }
            }).catch((err) => {
                console.log("Error in apiCall", err);
        })
    });
};

export const sentMessage = () => {
    return new Promise((resolve, reject) => {
        let user = {};
        AsyncStorage.getItem("userData")
            .then((res) => {
                if (res !== null) {
                    user = JSON.parse(res);
                    return(
                        axios.get(`${uri}/message/sent`,
                            {
                                headers:{
                                    Accept: 'application/json',
                                    'Content-Type': 'application/json',
                                    Authorization: 'Bearer ' + user.token
                                }
                            }).then(res => resolve(res))
                            .catch(error => reject(error))
                    );
                }
            }).catch((err) => {
            console.log("Error in apiCall", err);
        })
    });
};

export const receiveMessage = () => {
    return new Promise((resolve, reject) => {
        let user = {};
        AsyncStorage.getItem("userData")
            .then((res) => {
                if (res !== null) {
                    user = JSON.parse(res);
                    return(
                        axios.get(`${uri}/message/receive`,
                            {
                                headers:{
                                    Accept: 'application/json',
                                    'Content-Type': 'application/json',
                                    Authorization: 'Bearer ' + user.token
                                }
                            }).then(res => resolve(res))
                            .catch(error => reject(error))
                    );
                }
            }).catch((err) => {
            console.log("Error in apiCall", err);
        })
    });
};

export const conversation = (id) => {
    return new Promise((resolve, reject) => {
        let user = {};
        AsyncStorage.getItem("userData")
            .then((res) => {
                if (res !== null) {
                    user = JSON.parse(res);
                    return(
                        axios.get(`${uri}/message/conversation/${id}`,
                            {
                                headers:{
                                    Accept: 'application/json',
                                    'Content-Type': 'application/json',
                                    Authorization: 'Bearer ' + user.token
                                }
                            }).then(res => resolve(res))
                            .catch(error => reject(error))
                    );
                }
            }).catch((err) => {
            console.log("Error in apiCall", err);
        })
    });
};

export const fetchOtherUser = (userId) => {
    return new Promise((resolve, reject) => {
        let user = {};
        AsyncStorage.getItem("userData")
            .then((res) => {
                if(res !== null) {
                    user = JSON.parse(res);
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
            }).catch((err) => {
            console.log("Error in apiCall", err);
        })
    })
};
