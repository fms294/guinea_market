import { CHANGE_LANGUAGE } from '../actions/localization';

const initialState = {
    language : 'fr'
};

export default (state = initialState, action) =>{
    switch (action.type){
        case CHANGE_LANGUAGE:
            return{
                ...state,
                language: action.language
            }
        default:
            return state;
    }
};
