import React from 'react';
import axios from 'axios';

import 'antd/dist/antd.css';
import { Input, List, Button, Spin} from 'antd';

import { AimOutlined } from '@ant-design/icons';

class Weather extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            inputValue: '',
            list:[{'name': <AimOutlined />, 'descriptions': 'use current location', 'lat':'','lon':'' }],
            isResponded: false,  // list是否响应
            
            current : {},
            location : {},
            forecast :{},
            isloaded : false,
            isloading : false,
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleRequest = this.handleRequest.bind(this);
        this.handleClickRequest = this.handleClickRequest.bind(this);
        this.useCurrentLocation = this.useCurrentLocation.bind(this);
        this.handleInputBlur = this.handleInputBlur.bind(this);
        this.GPSquery = this.GPSquery.bind(this);
    }

    //Input每次输入单词，调取API，axios 更新List
    handleInputChange(e){
        if(e.target.value === '')
            this.setState({isResponded : false});

        this.setState({ inputValue : e.target.value});

        axios.get( 'https://www.weatherapi.com/weather/search.ashx?' ,{
            params:{
                q : e.target.value
            }
        })
        .then( (res)=>{
            //相应体是不是空判别
            if(res.data.length !== 0 )
                this.setState({ isResponded: true });
            else
                this.setState({ isResponded: false });

            this.setState({ list:[ {'name': <AimOutlined />, 'descriptions': '  use current location','lat':'','lon':''} ] });
            res.data.map((item)=>{
                return this.setState({list:[...this.state.list,item]});
            })
            // console.log(this.state.list);
        })
        .catch((err)=>{
            this.setState({isResponded : false}); //隐藏List 框框
        })
    }
    
    //Input回车处理
    handleRequest(e)
    {
        if(e.charCode === 13){
            // axios.get('./apis/respond_test.json')
            axios.get('http://api.weatherapi.com/v1/forecast.json?',{
                params:{
                    key:'757a8898541844c2916101944210607',
                    q: this.state.inputValue,
                    days: 5,
                    aqi: 'no',
                    alerts : 'no'
                }
            })
            .then((res)=>{
                // console.log(res);
                this.setState({ current:res.data.current});
                this.setState({ location:res.data.location});
                this.setState({ forecast:res.data.forecast});
                this.setState({ isResponded:false});
                this.setState({ isloaded:true});
                this.setState({ isloading:false});
            })
            .catch((err)=>{
                alert(err);
            });
        }
    }

    //处理点击list中的li
    handleClickRequest(gps_location){
        console.log(gps_location);
        if(gps_location === ',' || gps_location === null || gps_location === undefined ){
            this.useCurrentLocation();
        }else
        {
            axios.get('http://api.weatherapi.com/v1/forecast.json?' ,{
                params:{
                    key:'757a8898541844c2916101944210607',
                    q : gps_location,
                    days : 5,
                    aqi : 'no',
                    alerts : 'no',
                }
            })
            .then((res)=>{
                this.setState({ current:res.data.current});
                this.setState({ location:res.data.location});
                this.setState({ forecast:res.data.forecast});
                this.setState({ isloaded:true});
                this.setState({ isResponded : false});
                this.setState({ isloading:false});
            })
            .catch((err)=>{console.log(err)});
        }

    }

    //点击GPSbutton
    GPSquery(e){
        axios.get('http://api.weatherapi.com/v1/forecast.json?' ,{
            params:{
                key:'757a8898541844c2916101944210607',
                q : e.latitude+","+e.longitude,
                days : 5,
                aqi : 'no',
                alerts : 'no',
            }
        })
        .catch((err)=>{
            alert(err);
        })
        .then((res)=>{
            this.setState({ current:res.data.current});
            this.setState({ location:res.data.location});
            this.setState({ forecast:res.data.forecast});
            this.setState({ isloaded:true});
            this.setState({ isResponded : false});
        });
    }

    //获取GPS坐标
    useCurrentLocation(){
        this.setState({isloading: true});
        this.setState({isResponded : false});
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition((res)=>{ 
                this.GPSquery(res.coords) });
        }else{
           alert("您的浏览器不支持地理定位");
        }
    }

    handleInputBlur(){
        this.setState({ isResponded : false });
    }

    render(){
        return (
        <>
        <Input  placeholder = 'Enter your location'
                value={this.state.inputValue}
                onChange={this.handleInputChange}  
                onKeyPress={this.handleRequest} 
                onBlur = {this.handleInputBlur} />
        <Button className='GPS_location'
                onClick={this.useCurrentLocation}><AimOutlined/></Button>        
        {
            this.state.isResponded
            ?   (<>
                <List   bordered
                        className = 'result_list'
                        dataSource={ this.state.list }
                        renderItem={ item =>(
                            <List.Item  style= {{ cursor:'pointer' }}
                                        onClick={ ()=>{ this.handleClickRequest(item.lat+','+item.lon)} }>{item.name}{item.descriptions}
                            </List.Item>)} />
                </>)
            : null
        }     
        {
            (this.state.isloaded) ? (
            <>
            <h1 className='location_h1'> <b>{this.state.location.name}</b> Weather Forecast in <i>{this.state.location.region} {this.state.location.country} </i> </h1>
            <div className='weather_container'>
                <div className='weather_header_icon'><img src={this.state.current.condition.icon} alt='weather_icon'/></div>
                <div className='weather_header_detail'>
                    <div><p>Wind : {this.state.current.wind_mph} mph</p></div>
                    <div><p>Pressure : {this.state.current.pressure_mb} mb</p></div>
                </div>
                <div><h2>{this.state.current.condition.text}</h2></div>
                <div><h1><b>{this.state.current.temp_c}</b> °C</h1></div>
                <div className='forecast_box'>
                    {
                        this.state.forecast.forecastday.map((item)=>{
                            return (<div className='single_forecast_day'>
                                <div>{item.date}</div>
                                <div><img src={item.day.condition.icon} alt='forecast_weather_icon' /></div>
                                <div>{item.day.avgtemp_c} °C</div>
                            </div>);
                        })
                    }
                </div>
            </div>
            </>): ( (this.state.isloading) ? (<Spin/>):(<div></div>) )
        }
        </>)
    }
    
}

export default Weather;