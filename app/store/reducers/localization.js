import { CHANGE_LANGAUGE } from '../actions/localization';

const initialState = {
    language : 'fr'
};

export default (state = initialState, action) =>{
    switch (action.type){
        case CHANGE_LANGAUGE:
            return{
                ...state,
                language: action.language
            }
        default:
            return state;
    }
};
