import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {getNotifications} from '../actions/notificationAction';

import {IMG_CONSTANT} from '../constants/application.constants';
import Spinner from 'react-spinner';

let imgPath=IMG_CONSTANT.BASE_PATH;
class Notifications extends Component{
    constructor(props,context)
    {
        super(props, context);
        this.state={
          notifications: [],
          ajaxCallInProgress:false
        };
    }


    componentWillMount(){
      this.setState({ajaxCallInProgress:true});
          this.props.getNotifications(this.props.activeUser.token).then(()=>{
                    this.setState({notifications:this.props.notifications});
                    this.setState({ajaxCallInProgress:false});
          }).catch((error)=>{
            if(error == "Error: Request failed with status code 401"){
            this.context.router.push('/');
             }
            this.setState({ajaxCallInProgress:false});
       });
     }

     onNavigateToNotificationDetail(id){
       this.context.router.push('/viewNotification_' + id)
     }
     onCheckedClick(){

     }
 componentDidMount() {

          $('.menu').parent().removeClass('active');

    }
    render(){
        return(
<div className="Notification">
          <div className="notifcontainer">
              <div className="content">
                  <div className="notifyhead">NOTIFICATIONS</div>


              </div>

          <div className="row">
          <div className="col-sm-12">
                {(this.state.ajaxCallInProgress)?(<div className="mt25pc"><Spinner /></div>):(<div className="listnotify">
                <ul className="list-group">
                {_.size(this.state.notifications)>0  ? this.state.notifications.map((item, i) => {
                return (<li onClick={this.onNavigateToNotificationDetail.bind(this, item.id)}  key={i} className="list-group-item col-sm-12 brdr bg zeroPad cursor-pointer">
                  <div className="col-sm-12 pdtop1pc pdlft1pc pdryt0px">
                  <div className="col-sm-1 wd20px pdng">
                    </div>
                      <div className="col-sm-3 pdng">
                      {(!item.read)?(<img src={imgPath+"greenDot.png"} className="profileimg1"></img>):(<span></span>)}
                      <img src={imgPath+"GolfHome.png"} className="profileimg"></img>
                      <span className="fromName " >{item.object_type}</span>
                  </div>
                  <div className="msg col-sm-8 pdng">
                  <div className="col-sm-12 pdng">
                   <div className="col-sm-7 pdng">
                     <span className="msgbody">{item.message}</span>
                   </div>
                   <div className="col-sm-3 fr pdng">
                    <span className="msgtime">{item.created_on}</span>
                  </div>
                  </div>
                  </div>
                </div>
              </li>)
                }):<div><label>No notifications found</label></div>}


             </ul>
          </div>)}
        </div>
      </div>
    </div>
</div>);
  }
}


Notifications.contextTypes = {
  router: React.PropTypes.object
};


function mapStateToProps(state) {
    return {
       activeUser: (state.activeUser!=null)?(state.activeUser):(JSON.parse(sessionStorage.getItem('userDetails'))),
       notifications: state.notifications
    };
}
function matchDispatchToProps(dispatch){
    return bindActionCreators({getNotifications}, dispatch);
}
export default connect(mapStateToProps,matchDispatchToProps) (Notifications);
