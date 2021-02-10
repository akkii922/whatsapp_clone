const chatsReducer = (state, action) => {
    let draftState = [...state];
    switch (action.type) {
        case "CHATS":
            draftState = [...draftState, ...action.payload];
            return draftState;
        case "RESET_CHATS":
            draftState = action.payload;
            return draftState;
        default:
            return state;
    }
}

export default chatsReducer;