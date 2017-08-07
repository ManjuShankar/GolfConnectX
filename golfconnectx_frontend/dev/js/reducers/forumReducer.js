import * as types from '../constants/actiontypes';

export default function(state = null, action) {
    switch (action.type) {
      case types.GET_FORUM_CATEGORY:
             return Object.assign([], state, {Category: action.apiResult});
             break;



        case types.GET_FORUM_COURSES:
            return Object.assign([], state, {Courses: action.apiResult});
            break;

        case types.GET_FORUM_COURSES_APPEND:
            let localState = Object.assign([], state.Courses);
          
            let updatedList =  localState.concat(action.apiResult);
           
            return Object.assign([], state, {Courses: updatedList});
            ///return updatedList;

            case types.GET_FORUM_CONVERSATIONS:
                 return Object.assign({}, state, {Conversation: action.apiResult});
                break;
                case types.GET_FORUMLIST:
                
                return Object.assign({},state, {SearchList:action.apiResult});
                break;


                case types.GET_19HOLE_CATEGORY:
                 return Object.assign([], state, {get19Category: action.apiResult});
                break;
                 case types.GET_LOCAL_CATEGORY:
                 return Object.assign([], state, {getGetLocalCategory: action.apiResult});
                break;
                 case types.GET_EQUIPMENT_CATEGORY:
                 return Object.assign([], state, {getEquipmentCategory: action.apiResult});
                break;
               
                 case types. GET_GOLFTRAVEL_CATEGORY:
                 return Object.assign([], state, {getGolfTravelCategory: action.apiResult});
                break;
                
                case types. GET_INSTRUCTION_CATEGORY:
                 return Object.assign([], state, {getInstructionCategory: action.apiResult});
                break;
                 case types. GET_DISCUSSION_CATEGORY:
                 return Object.assign([], state, {getDiscussionCategory: action.apiResult});
                break;
                case types. GET_RULES_CATEGORY:
                 return Object.assign([], state, {getRulesCategory: action.apiResult});
                break;
                case types. GET_FITNESS_CATEGORY:
                 return Object.assign([], state, {getFitnessCategory: action.apiResult});
                break;
                case types.GET_LOCAL_SEARCH:
                 
            return Object.assign({},state, {SearchList:action.apiResult});
            break;
                case types.GET_SEARCH_LIST:
                 
            return Object.assign({},state, {WaterCoolerSearchList:action.apiResult});
            break;
                
    }
    return state;
}
