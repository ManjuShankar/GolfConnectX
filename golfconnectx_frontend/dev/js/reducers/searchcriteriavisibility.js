import * as types from '../constants/actiontypes';

export default function(state = null, action) {
    switch (action.type) {
        case types.SEARCH_CRTERIA_VISIBILITY:
            return action.payload;
            break;
    }
    return state;
}
