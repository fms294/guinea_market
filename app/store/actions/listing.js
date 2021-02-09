import Constants from "expo-constants";
import { Platform } from "react-native";
const { manifest } = Constants;

import ListingItem from "../../model/ListingItem";

export const FETCH_ITEM = "FETCH_ITEM";
export const FETCH_USER_ITEM = "FETCH_USER_ITEM";
export const FETCH_OTHER_USER_ITEM = "FETCH_OTHER_USER_ITEM";

const uri = `http://${manifest.debuggerHost
    .split(`:`)
    .shift()
    .concat(`:3000`)}`;

//Adding item to the DB
export const add_item = (finalData) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        try{
            const response = await fetch(`${uri}/listing/add`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type" : "application/json",
                        Authorization: "Bearer " + token,
                    },
                    body: JSON.stringify(finalData)
                });
            if(!response.ok){
                const resData = await response.json();
                throw new Error(resData.e);
            }
            const resData =  await response.json();
            //console.log("resData... in action add item", resData);
        }catch (err) {
            throw new Error(err);
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
                //console.log("items...", resData[0]);
                const time = formatDate(resData[index].updatedAt);
                //console.log("time", time);
                listingData.push(
                    new ListingItem(
                        resData[index]._id,
                        resData[index].title,
                        resData[index].description,
                        resData[index].price,
                        resData[index].main_category,
                        resData[index].sub_category,
                        resData[index].owner,
                        resData[index].region,
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
                        resData[index].region,
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


//Format date according to human readable
const formatDate = (dateString) => {
    //"fr-GQ"
    //weekday, year, month, day, hour, minute, second
    if (Platform.OS === 'ios'){
        const options = { weekday:"short" ,year: "numeric", month: "short", day: "numeric" , hour: "numeric", minute: "numeric"};
        return new Date(dateString).toLocaleDateString(undefined, options);
    }
    else {
        let
            //dayOfWeek = ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"],
            monthName = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"],
            utc = new Date(dateString).getTime() + new Date(dateString).getTimezoneOffset() * 60000,
            US_time = utc + (3600000 * -4),
            US_date = new Date(US_time);

        // return monthName[US_date.getMonth()] + " " +
        //     US_date.getDate() + ", " + US_date.getFullYear() + ", " + US_date.toLocaleTimeString();
        return US_date.toDateString() + ", " + US_date.toLocaleTimeString("en-US", {hour12: false});
    }
}
