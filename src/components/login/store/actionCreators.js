import axios from "axios";
import * as constants from './constants';
// import { fromJS } from 'immutable';


const userLogin = (e)=>({
    type : constants.USER_LOGIN,
    e,
});

const loadUserInfo = (id,name,imageURL) =>({
    type : constants.LOAD_USER_INFO,
    id: id,
    name: name,
    imageURL: imageURL,
})

export const userLogout = () => ({
    type : constants.USER_LOGOUT,
    value : false
});

export const login = (account,password) => {
    return (dispatch)=>{
        // axios.get('/api/login.json?account='+account+'&password='+password)
        axios.get('/api/user.json')
        .then( (res)=>{
            const result = res.data.data;
            if(result.login){
                console.log(result);
                dispatch(userLogin(result.login));
                dispatch(loadUserInfo(result.id,result.name,result.image.url));
            }else{
                alert('登陆失败');
            }
        } )
    }
};

