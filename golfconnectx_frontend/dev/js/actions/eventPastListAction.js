import {SERVICE_URLS} from '../constants/serviceUrl';
import * as types from '../constants/actiontypes';

import axios from 'axios';
import toastr from 'toastr';

let eventPastList=()=>{
    const url1=SERVICE_URLS.EVENTLIST_API;
    const url2=SERVICE_URLS.EVENTLISTPAST_API;
    var config = {
    headers: {'Authorization':'Token '+'19fcd1664f2384768348ea6b5d98d40b65836e6e'}
};
    const apieventPastRequest= axios.all([
        return axios.get(url1,config),
        return axios.get(url2,config)
    ]).then(
        axios.spread(function(response1,response2){
        }));

    return(dispatch)=>{
        return apieventPastRequest.then(({data})=>{
            dispatch({type:types.GET_EVENTLISTPAST,apiResult:data});
        }).catch((error)=>{
          toastr.error(error);
            throw(error);
        });
    }
};
export {eventPastList};
