import axios from "axios";
import AsyncStorage from "@react-native-community/async-storage";
import { uri } from "../config/app_uri";

export const registration_otp = (data) => {
    console.log("registration otp... api call", data);
    return new Promise((resolve, reject) => {
        return (
            axios.post(`${uri}/users/register_OTP`, data,
                {
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                })
                .then(res => {
                    console.log(res)
                    resolve(res)
                })
                .catch(error => {
                    console.log("reject...",error.message.substr(error.message.length - 3));
                    reject(error.message.substr(error.message.length - 3));
                })
        );
    })
};

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

export const changePassword = (phone) => {
    // console.log("Change Password... api call", phone);
    return new Promise((resolve, reject) => {
        return (
            axios.post(`${uri}/users/changePass`,phone,
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

export const updatePassword = (id, password) => {
    // console.log(`${uri}/users/updatePassword/${id}`, password);
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
        return(
            axios.get(`${uri}/users/owner/`+userId,
                {
                    headers:{
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        // Authorization: 'Bearer ' + user.token,
                    },
                }).then(res => resolve(res))
                .catch(error => reject(error))
        );
        // let user = {};
        // AsyncStorage.getItem("userData")
        //     .then((res) => {
        //         if(res !== null) {
        //             user = JSON.parse(res);
        //
        //         }
        //     }).catch((err) => {
        //     console.log("Error in apiCall", err);
        // })
    })
};

export const fetchOwner = () => {
    return new Promise((resolve, reject) => {
        let user = {};
        AsyncStorage.getItem("userData")
            .then((res) => {
                if(res !== null) {
                    user = JSON.parse(res);
                    return(
                        axios.get(`${uri}/users/owner`,
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

export const sendNotification = (body) => {
    return new Promise((resolve, reject) => {
        console.log("body", JSON.stringify(body));
        return axios.post(`https://exp.host/--/api/v2/push/send`, JSON.stringify(body),
            {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
            }).then(res => resolve(res))
            .catch(error => reject(error))
    });
};

export const deleteConversation = (id) => {
    console.log("api call id...", id);
    return new Promise((resolve, reject) => {
        let user = {};
        AsyncStorage.getItem("userData")
            .then((res) => {
                if (res !== null) {
                    user = JSON.parse(res);
                    return(
                        axios.delete(`${uri}/message/delete/${id}`,
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
