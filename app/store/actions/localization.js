export const CHANGE_LANGUAGE = "CHANGE_LANGUAGE";

export const change_language = (str) => {
    return async (dispatch) =>  {
        try {
            dispatch({type: CHANGE_LANGUAGE, language: str});
        } catch (err) {
            throw new Error(err);
        }
    };
}
