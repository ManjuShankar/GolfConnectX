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
                      <div className="headingdiv">
                      <div className="topbar">
                        {isExistObj(this.props.activeUser) && <span className="tagline">Hi {this.props.activeUser.name}!</span>}
                        <br/>
                        <span className="desc">Managing your golf life just got easier</span>
                      </div>
                      <div onClick={this.navigateMyEvents.bind(this)} className="btnEvent">
                        <img src={imgPath+"Events_Nav_Icon copy.png"} />
                      </div>
                    </div>
                    <div className="bgPic col-sm-12 zeroPad">
                    <div className="BgadminDashboard"></div>
                    </div>
                    <div className="col-sm-12 tileimg">
                      <Link to="/profile_0"><img className="card-img-top imagetile col-sm-3 padding5px" src={imgPath+"MY CLUBHOUSE 300(comp).png"} alt="Card image cap"/></Link>
                      <Link to="/courses_"><img className="card-img-top imagetile col-sm-3 padding5px" src={imgPath+"COURSES copy.png"} alt="Card image cap"/></Link>
                      <Link to="/friends"> <img className="card-img-top imagetile col-sm-3 col-sm-offset-3 padding5px" src={imgPath+"Friend_Tile.png"} alt="Card image cap"/></Link>
                      <Link to="/groups"><img className="card-img-top imagetile col-sm-3 padding5px" src={imgPath+"GROUPS.png"} alt="Card image cap"/></Link>
                      <Link to="/forumsPage"><img className="card-img-top imagetile col-sm-3 padding5px" src={imgPath+"FORUMS.png"} alt="Card image cap"/></Link>
                      <Link to="/feed"><img className="card-img-top imagetile col-sm-3 padding5px" src={imgPath+"FEED.png"} alt="Card image cap"/></Link>
                    </div>
                    <div className="col-sm-12">
                      <img src={imgPath+"Banner_Ad.png"} className="Adimg" />
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
