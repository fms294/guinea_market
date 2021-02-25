import {FETCH_ITEM, FETCH_PROFILE_ITEM, FETCH_USER_ITEM} from "../actions/listing";

const initialState = {
    listing_data: [],
    listing_userData: [],
    listing_profileData: [],
    user_profileData : {}
};

export default (state= initialState, action) => {
    switch (action.type) {
        case FETCH_ITEM:
            //console.log("in reducer", action.listing_data);
            return {
                ...state,
                listing_data: action.listing_data
            }
        case FETCH_USER_ITEM:
            return {
                ...state,
                listing_userData: action.listing_userData
            }
        case FETCH_PROFILE_ITEM:
            return{
                ...state,
                listing_profileData: action.listing_profileData,
                user_profileData: action.user_profileData
            }
        default:
            return state;
    }
};

