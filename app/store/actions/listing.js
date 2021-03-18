import moment from "moment";
import enMoment from "moment/locale/en-ca";
import { uri } from "../../config/app_uri";
import {Platform} from "react-native";

import ListingItem from "../../model/ListingItem";
import axios from "axios";

export const FETCH_ITEM = "FETCH_ITEM";
export const FETCH_USER_ITEM = "FETCH_USER_ITEM";
export const FETCH_PROFILE_ITEM = "FETCH_PROFILE_ITEM";

//Adding item to the DB
export const add_item = (finalData) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        //console.log("images..", finalData.images)
        const formData = new FormData();
        formData.append("contact_phone", finalData.contact_phone);
        formData.append("description", finalData.description);
        formData.append("main_category", finalData.main_category);
        formData.append("price", finalData.price);
        formData.append("prefecture", finalData.prefecture);
        formData.append("sub_category", finalData.sub_category);
        formData.append("title", finalData.title);
        finalData.images.map((item) => {
            formData.append("images", {uri: item.imageData.uri, type: `image/${item.imageData.type}`, name: new Date().getTime().toString()+".jpg"});
        })
        console.log("formData...", formData);
        try{
            console.log("resData... in action add item", `${uri}/listing/add`);
            // const response = await fetch(`${uri}/listing/add`,
            //     {
            //         method: "POST",
            //         headers: {
            //             'Accept': 'application/json',
            //             "Content-Type" : "multipart/form-data;",
            //             Authorization: "Bearer " + token,
            //         },
            //         body: formData
            //     });
            // console.log("resData... in action add item", await response.json());
            const resp = await axios.post(`${uri}/listing/add`, formData, {
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "multipart/form-data;",
                        Authorization: "Bearer " + token,
                    }
            })
            console.log("resp", resp.data);

            // if(!response.ok){
            //     const resData = await response.json();
            //     throw new Error(resData.e);
            // }
            // const resData = await response.json();
            // console.log("resData... in action add item", resData);
        }catch (err) {
            console.log("Hello...",err, err.message);
            throw new Error(err);
        }
    }
}

//Update items
export const update_item = (finalData, id) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const formData = new FormData();
        formData.append("contact_phone", finalData.contact_phone);
        formData.append("description", finalData.description);
        formData.append("main_category", finalData.main_category);
        formData.append("price", finalData.price);
        formData.append("prefecture", finalData.prefecture);
        formData.append("sub_category", finalData.sub_category);
        formData.append("title", finalData.title);
        console.log("formdata...",finalData.images);
        finalData.images.map((item) => {
            console.log(item);
            if(item.url === undefined) {
                console.log("true", item.url);
                formData.append("images", "NA");
                formData.append("image", {uri: item.imageData.uri, type: `image/${item.imageData.type}`, name: new Date().getTime().toString()+".jpg"});
            } else {
                console.log("false", item.url);
            }
        });
        try{
            console.log("resData... in action add item....", id);
            // const response = await fetch(`${uri}/listing/update/${id}`,
            //     {
            //         method: "PATCH",
            //         headers: {
            //             "Content-Type" : "multipart/form-data;",
            //             Authorization: "Bearer " + token,
            //         },
            //         body: formData
            //     });
            const resp = await axios.patch(`${uri}/listing/update/${id}`, formData, {
                headers:{
                    "Content-Type" : "multipart/form-data;",
                    "Accept": "application/json",
                    Authorization: "Bearer " + token,
                }
            })
            console.log("resp", resp.data);
            // if(!response.ok){
            //     const resData = await response.json();
            //     throw new Error(resData.e);
            // }
            // // console.log("resData... in action add item", response);
            // const resData = await response.json();
            // console.log("resData... in action add item", resData);
        }catch (err) {
            console.log(err);
            throw new Error("catch in update.."+err);
        }
    }
}

//Fetch all items from DB
export const fetchFeed = () => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        //console.log("in action", token);
        try{
            const response = await fetch(`${uri}/listing/fetch`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + token,
                    }
                });
            if(!response.ok){
                const resData = await response.json();
                throw new Error(resData.e);
            }
            const resData = await response.json();
            let listingData = [];
            resData.map((item,index) => {
                // console.log("items...", resData[0]);
                // console.log("moment", moment.locale());
                const time = formatDate(resData[index].updatedAt);
                listingData.push(
                    new ListingItem(
                        resData[index]._id,
                        resData[index].title,
                        resData[index].description,
                        resData[index].price,
                        resData[index].main_category,
                        resData[index].sub_category,
                        resData[index].owner,
                        resData[index].prefecture,
                        resData[index].contact_phone,
                        resData[index].images,
                        time
                    ));
            })
            dispatch({type: FETCH_ITEM, listing_data: listingData});
        }catch (err) {
            throw new Error("Fetch Error "+err);
        }
    }
}

//Fetch user listings product
export const fetchUserFeed = () => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        try{
            const response = await fetch(`${uri}/listing/fetchUserListing`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + token,
                    }
                });
            if(!response.ok){
                const resData = await response.json();
                throw new Error(resData.e);
            }
            const resData = await response.json();
            let listingData = [];
            resData.map((item,index) => {
                //console.log("items...", resData[index]._id);
                const time = formatDate(resData[index].updatedAt);
                listingData.push(
                    new ListingItem(
                        resData[index]._id,
                        resData[index].title,
                        resData[index].description,
                        resData[index].price,
                        resData[index].main_category,
                        resData[index].sub_category,
                        resData[index].owner,
                        resData[index].prefecture,
                        resData[index].contact_phone,
                        resData[index].images,
                        time
                    ));
            })
            dispatch({type: FETCH_USER_ITEM, listing_userData : listingData})
        }catch (err) {
            throw new Error(err);
        }
    }
}

//Delete the user's Feed
export const deleteUserFeed = (feedId) => {
    return async (dispatch,getState) => {
        const token = getState().auth.token;
        try{
            const response = await fetch(`${uri}/listing/delete/` + feedId,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + token,
                    },
                },
            );
            //console.log("response delete", await response.json());
            if (!response.ok) {
                const resData = await response.json();
                console.log(resData);
                throw new Error('Delete Feed failed.');
            }
            const resData = await response.json();
            //console.log("Delete Action...",resData);
        }catch (err) {
            throw new Error(err);
        }
    }
}

//Fetch profile user listing
export const fetchProfileListing = (id) => {
    return async (dispatch, getState) => {
        // console.log("data...", id)
        const token = getState().auth.token;
        try{
            const response = await fetch(`${uri}/users/owner/${id}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + token,
                    }
                });
            if(!response.ok){
                const resData = await response.json();
                throw new Error(resData.e);
            }
            const resData = await response.json();
            // console.log("resData...",resData.user);
            let listingData = [];
            resData.feed.map((item,index) => {
                //console.log("items...", resData[index]._id);
                const time = formatDate(resData.feed[index].updatedAt);
                listingData.push(
                    new ListingItem(
                        resData.feed[index]._id,
                        resData.feed[index].title,
                        resData.feed[index].description,
                        resData.feed[index].price,
                        resData.feed[index].main_category,
                        resData.feed[index].sub_category,
                        resData.feed[index].owner,
                        resData.feed[index].prefecture,
                        resData.feed[index].contact_phone,
                        resData.feed[index].images,
                        time
                    ));
            })
            dispatch({type: FETCH_PROFILE_ITEM, listing_profileData : listingData, user_profileData: resData.user})
        }catch (err) {
            throw new Error(err);
        }
    }
}

//Format date according to human readable
const formatDate = (dateString) => {
    moment.updateLocale('en', enMoment);
    return moment(dateString).format('llll');
}
