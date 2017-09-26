import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Link} from 'react-router';
import Spinner from 'react-spinner';
import {IMG_CONSTANT} from '../constants/application.constants';
import {getNotificationsCount} from '../actions/headerAction';
import {isExistObj} from '../utils/functions';

let imgPath=IMG_CONSTANT.IMAGE_PATH;
class Homepage extends Component{
    constructor(props,context){
        super(props,context);
        this.state={notificationCount: 0, ajaxCallInProgress:false}
    }

    navigateMyEvents(){
        this.context.router.push('/profile_4');
    }
    componentWillMount(){
       
        this.setState({ajaxCallInProgress:true});
       if(this.state.ajaxCallInProgress=true){

        this.setState({ajaxCallInProgress:false});
       }
    }
   
componentDidMount() {
      
      $('.menu').parent().removeClass('active');
      $('#home').parent().addClass('active');
   }
    render(){
        return(
                <div className="homepage zeroPad">
                    {(this.state.ajaxCallInProgress)?(<div className="col-sm-12 bgwhite"><Spinner /></div>):(
                      <div>
                      <div className="headingdiv col-sm-12 col-xs-12 col-md-12">
                      <div className="topbar">
                        {isExistObj(this.props.activeUser) && <span className="tagline">Hi {this.props.activeUser.name}!</span>}
                        <br/>
                        <span className="desc">Managing your golf life just got easier</span>
                      </div>
                      <div onClick={this.navigateMyEvents.bind(this)} className="btnEvent">
                        <img src={imgPath+"Events_Nav_Icon copy.png"} />
                      </div>
                    </div>
                    <div className="bgPic col-sm-12 col-md-12 col-xs-12 zeroPad">
                    {/*  <img src={imgPath+"bg_image.png"} className="bgimage pdng" />*/}
                    <div className="BgadminDashboard container pdlft0px"></div>
                    </div>
                    <div className="col-xs-12 tileimg">
                      {/*my changes on 30th jun*/}
                        {/*<div className="clubhouse_img pd15px col-xs-5 col-md-4 col-lg-4"><img className="wd155px col-sm-12" src={imgPath+"MY CLUBHOUSE 300(comp).png"} alt="Card image cap" /></div>
                        <div className="courses_img pd15px col-xs-5 col-md-4 col-lg-4"><img className="wd155px col-sm-12" src={imgPath+"COURSES copy.png"} alt="Card image cap" /></div>
                        <div className="friends_img pd15px col-xs-5 col-md-4 col-lg-4"><img className="wd155px col-sm-12" src={imgPath+"Friend_Tile.png"} alt="Card image cap" /></div>
                        <div className="groups_img pd15px col-xs-5 col-md-4 col-lg-4"><img className="wd155px col-sm-12" src={imgPath+"GROUPS.png"} alt="Card image cap" /></div>
                        <div className="forums_img pd15px col-xs-5 col-md-4 col-lg-4"><img className="wd155px col-sm-12" src={imgPath+"FORUMS.png"} alt="Card image cap" /></div>
                        <div className="feed_img pd15px col-xs-5 col-md-4 col-lg-4"><img className="wd155px col-sm-12" src={imgPath+"FEED.png"} alt="Card image cap" /></div>*/}

                    {/*ended*/}
                      <div className="col-xs-12 col-sm-12  col-md-12 homeDiv">
                        <Link to="/profile_0" className="col-xs-4 col-sm-4 col-lg-4 txtRytResp   "><img className="card-img-top imagetile col-sm-3 col-xs-12 padding5px" src={imgPath+"MY CLUBHOUSE 300(comp).png"} alt="Card image cap"/></Link>
                        <Link to="/courses_" className="col-xs-4 col-sm-4 col-lg-4 txtLftResp"><img className="card-img-top imagetile col-sm-3 col-xs-12 padding5px" src={imgPath+"COURSES copy.png"} alt="Card image cap"/></Link>
                        <Link to="/friends" className="col-xs-4 col-sm-4 col-lg-4 txtRytResp   "> <img className="card-img-top imagetile col-sm-3 col-xs-12 col-sm-offset-3 padding5px" src={imgPath+"Friend_Tile.png"} alt="Card image cap"/></Link>
                        <Link to="/groups" className="col-xs-4 col-sm-4 col-lg-4 txtLftResp "><img className="card-img-top imagetile col-sm-3 col-xs-12 padding5px" src={imgPath+"GROUPS.png"} alt="Card image cap"/></Link>
                        <Link to="/forumsPage" className="col-xs-4 col-sm-4 col-lg-4 txtRytResp    "><img className="card-img-top imagetile col-sm-3 col-xs-12 padding5px" src={imgPath+"FORUMS.png"} alt="Card image cap"/></Link>
                        <Link to="/feed" className="col-xs-4 col-sm-4 col-lg-4  txtLftResp"><img className="card-img-top imagetile col-sm-3 col-xs-12 padding5px" src={imgPath+"FEED.png"} alt="Card image cap"/></Link>
                      </div>
                      <div className="col-sm-12 home_BottomImg">
                      <img src={imgPath+"golfconnectx_ad.png"} className="Adimg" />
                    </div>
                    </div>
                    
                    </div>)}
                </div>
        );
    }
}

Homepage.contextTypes = {
  router: React.PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        activeUser: (state.activeUser!=null)?(state.activeUser):(JSON.parse(sessionStorage.getItem('userDetails'))),
    };
}
function matchDispatchToProps(dispatch){
    return bindActionCreators({ getNotificationsCount}, dispatch);
}
export default connect(mapStateToProps, matchDispatchToProps)(Homepage);
