import { fromJS } from "immutable";
// import { connectAdvanced } from "react-redux";
import * as constants from "./constants.js";


const defaultState = fromJS({
    login: false,
    userID: '',
    userName: '',
    userImgUrl: '',
    userEmail:'',
    userAddress:''
});

export default ( state = defaultState, action)=>{
    switch (action.type) {  
        case constants.USER_LOGIN:
            return state.set('login' , action.e);
        case constants.USER_LOGOUT:
            return state.set('login' , action.value);
        case constants.LOAD_USER_INFO:
            return state.merge({
                userID: fromJS(action.id),
                userName:fromJS(action.name),
                userImgUrl:fromJS(action.imageURL),
            });
        default:
            return state;
    }
}

