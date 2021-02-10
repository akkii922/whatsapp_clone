const msgListReducer = (state, action) => {
    let draftState = { ...state };
    switch (action.type) {
        case "MSG_LIST":
            draftState = action.payload;
            return draftState;
        case "NEW_MSG":
            draftState = { ...draftState, ...action.payload };
            return draftState;
        default:
            return state;
    }
}

export default msgListReducer;