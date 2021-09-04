import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { Button,Input,LoginWrapper,LoginBox } from "./style.js";
import { actionCreators }  from "./store";



class Login extends Component{

    render(){
        const { loginStatus } = this.props;

        if( !loginStatus )
        {
            return (<LoginWrapper>
                        <LoginBox>
                            {/* 操作DOM， account里面.account里面  把password存在this.password里 */}
                            <Input placeholder='账号' ref={(input)=>{this.account = input}}/>
                            <Input placeholder='密码' type='password' ref={(input)=>{this.password = input}}/>
                            <Button onClick={()=>this.props.login(this.account,this.password)} defaultValue='提交'/>
                        </LoginBox>
                    </LoginWrapper>)
        }
        else{
            return <Redirect to='/' />
        }
    }
}

const mapState = (state)=>({
    loginStatus : state.login.get('login'),
});

const mapDispatch = (dispatch) =>({
    login(acc,pwd){
        dispatch(actionCreators.login(acc.value,pwd.value));
    }
});

export default connect(mapState,mapDispatch)(Login);