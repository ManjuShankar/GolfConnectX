import * as types from '../constants/actiontypes';

export default function(state = null, action) {
    switch (action.type) {
        case types.GET_MESSAGE_DETAILS:
            return action.apiResult;
            break;

        case types.POST_MESSAGE_DETAILS: {
        let newMessagesArray = state.messages;
        newMessagesArray.push(action.apiResult);
        return Object.assign({}, state, Object.assign({}, state.messages, newMessagesArray));
        break;
      }
    }
    return state;
}
