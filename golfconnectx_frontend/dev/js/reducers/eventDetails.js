import * as types from '../constants/actiontypes';
import _ from 'lodash';

export default function(state=null,action){
    switch(action.type){
        case types.UPDATE_ATTENDEES_COUNT:{
           let _newState = Object.assign([], state.CurrentEvents);
           let _currnetEvent = _.find(_newState, ['id', _.toNumber(action.eventID)]);
           _currnetEvent.attendee_stats.attending = action.count;
           let index = _.findIndex(_newState, ['id', _.toNumber(action.eventID)]);
           _newState.splice(index, 1, _currnetEvent);
           return Object.assign({}, state, {CurrentEvents: _newState});
        }

        case types.GET_EVENTLIST:
            return Object.assign({}, state, {CurrentEvents: action.apiResult});
            break;



        case types.GET_EVENTLISTPAST:
            return Object.assign({}, state, {PastEvents: action.apiResult});
            break;
        case types.CALENDAR_EVENTS:
            return Object.assign({}, state, {CalendarEvents: action.apiResult});
            break;
        case types.CALENDAR_DATES:
            return Object.assign({}, state, {CalendarDates: action.apiResult});
            break;
        case types.PUBLIC_CALENDAR_EVENTS:
             return Object.assign({}, state, {PublicCalendarDates: action.apiResult});
             break;
        case types.CALENDAR_DAY_EVENTS:
            return Object.assign({}, state, {onDayEventDetails: action.apiResult});
            break;
        case types.PUBLIC_CALENDAR_DAY_EVENTS:
            return Object.assign({}, state, {PubliconDayEventDetails: action.apiResult});
            break;
             case types.GET_PUBLIC_EVENTLIST:
            return Object.assign({}, state, {PublicEvents: action.apiResult});
            break;

             case types.EVENT_STATES:
            return Object.assign({}, state, {stateList: action.apiResult});
            break;
    }
    return state;
}
