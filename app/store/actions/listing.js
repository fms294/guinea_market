import Constants from "expo-constants";
const { manifest } = Constants;

import ListingItem from "../../model/ListingItem";

export const FETCH_ITEM = "FETCH_ITEM";

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
            console.log("resData... in action add item", resData);
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
                //console.log("items...", resData[index]._id);
                listingData.push(
                    new ListingItem(
                        resData[index]._id,
                        resData[index].title,
                        resData[index].description,
                        resData[index].price,
                        resData[index].category,
                        resData[index].owner,
                        resData[index].region,
                        resData[index].phone,
                        resData[index].images
                    ));
            })
            dispatch({type: FETCH_ITEM, listing_data: listingData});
        }catch (err) {
            throw new Error(err);
        }
    }
}
