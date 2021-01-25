import { FETCH_ITEM } from "../actions/listing";

const initialState = {
    listing_data: null,
};

export default (state= initialState, action) => {
    switch (action.type) {
        case FETCH_ITEM:
            //console.log("in reducer", action.listing_data);
            return {
                ...state,
                listing_data: action.listing_data
            }
        default:
            return state;
    }
};

