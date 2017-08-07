import {SERVICE_URLS} from '../constants/serviceUrl';
import * as types from '../constants/actiontypes';

import axios from 'axios';
import toastr from 'toastr';

let privateAccount=()=>{
    const url=SERVICE_URLS.PRIVATEACCOUNT_API;
    var config = {
    headers: {'Authorization':'Token '+' 2dc47b54de25dc1b536ef5efbbdd66915708e548'}
};
    const apiprivateAccountRequest=axios.get(url,config);

    return(dispatch)=>{
        return apiprivateAccountRequest.then(({data})=>{
            dispatch({type:types.GET_PRIVATE,apiResult:data});
        }).catch((error)=>{
          toastr.error(error);
            throw(error);
        });
    }
};


export {privateAccount};
