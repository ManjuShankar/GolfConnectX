import {SERVICE_URLS} from '../constants/serviceUrl';
import * as types from '../constants/actiontypes';

import axios from 'axios';
import toastr from 'toastr';
let AccountUser=(data)=>{
    const url=SERVICE_URLS.SAVEPROFILE_API;
    let first_name=data[0].value;
    let last_name=data[1].value;
    let email=data[2].value;
    let phone=data[3].value;
    let currentPassword=data[4].value;
    let newPassword=data[5].value;
    let confirmPassword=data[6].value;

    var config = {
    headers: {'Authorization':'Token '+'2dc47b54de25dc1b536ef5efbbdd66915708e548'}
};
    const apiAccountRequest=axios.post(url,{
                            first_name,
                            last_name,
                            email,
                            phone,
                            currentPassword,
                            newPassword,
                            confirmPassword},config);
    return(dispatch)=>{
        return apiAccountRequest.then(({data})=>
                                     {
            dispatch({type:types.SAVE_USERDETAILS,apiResult:data});
        }).catch((error)=>{
          toastr.error(error);
            throw(error);
        });
    }
};
export {AccountUser};
