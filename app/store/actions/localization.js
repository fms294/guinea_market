export const CHANGE_LANGAUGE = "CHANGE_LANGAUGE";

export const change_language = (str) => {
    return async (dispatch) =>  {
        try {
            dispatch({type: CHANGE_LANGAUGE, language: str});
        } catch (err) {
            throw new Error(err);
        }
    };
}
