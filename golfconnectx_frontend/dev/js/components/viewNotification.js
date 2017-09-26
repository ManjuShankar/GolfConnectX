import React, {Component} from 'react';
import { Link } from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'lodash';
import {getNotificationById, removeNotification, onAcceptOrDeclineClick} from '../actions/notificationAction';
import {isExistObj} from '../utils/functions';

let paramId;
class ViewNotification extends Component {
   constructor(props, context){
       super(props, context);
       this.state={
         notificationDetails: {}
       }
   }


   componentWillMount(){
     let urlPath = _.split(location.pathname, '_');
     paramId =  (_.size(urlPath)>0)?(_.toInteger(urlPath[1])):(0);
         this.props.getNotificationById(this.props.activeUser.token, paramId).then(()=>{
                   this.setState({notificationDetails:this.props.selectedNotification});
         }).catch((error)=>{
         if(error == "Error: Request failed with status code 401"){
             this.context.router.push('/');
        }
      });
    }

    onAcceptOrDeclineClick(submiturl, flag){
      $('#acceptordecline').attr('disabled','disabled');
      this.props.onAcceptOrDeclineClick(this.props.activeUser.token, submiturl, flag).then(()=>{
          this.context.router.push('/notifications');
        }).catch((error)=>{

      });
        if(screen.width<600)
      {
        $(".sidebar").show();
      }
    }

    onRemoveNotificationClick(id){
      $('#notificationDelete').attr('disabled','disabled');        
      this.props.removeNotification(this.props.activeUser.token, id).then(()=>{
        this.context.router.push('/notifications');
      }).catch((error)=>{
      });
      if(screen.width<600)
      {
        $(".sidebar").show();
      }
    }
    showSideMenu(){
      if(screen.width<600)
      {
       $(".sidebar").show();
     } 
    }

    render() {
      if(_.size(this.state.notificationDetails)>0 && isExistObj(this.state.notificationDetails.notification))
      {
      return (
          <div className="viewNotification">
              <div className="notifcntnt">
              <div className="notifcontainer">
                  <div className="notifyhead">NOTIFICATIONS</div>
                  <div className="btns">
                       <div className="alglft"><Link to="/notifications"><button className="btnback">Back</button></Link></div>
                       <div className="algrgt"><button id="notificationDelete" onClick={this.onRemoveNotificationClick.bind(this, this.state.notificationDetails.notification.id)} className="btnDel">Delete</button></div>
                  </div>
              </div>
              <div className="notifmsg col-sm-12">
                  <div className="notifheader">
                      <div className="img-heading">
                      <img src="/assets/img/GolfHome.png" className="golf-img"/>
                      <h3>{this.state.notificationDetails.notification.object_type}</h3>
                          </div>
                      <p className="ryt">{this.state.notificationDetails.notification.created_on}</p>
                  </div>
                  <div className="msg col-sm-12">
                      {this.state.notificationDetails.notification.message}
                  </div>
                  <div className="rspns col-sm-12">
                      <div className="col-sm-4"></div>
                      <div className="col-sm-4">
                          {(_.size(this.state.notificationDetails.nobject)>0  && this.state.notificationDetails.nobject.status=="P" && this.state.notificationDetails.nobject.submiturl!=undefined)?(<div className="col-sm-12">
                                <button id ="acceptordecline" onClick={this.onAcceptOrDeclineClick.bind(this, this.state.notificationDetails.nobject.submiturl, true)} className="acptBtn rspnd col-sm-5">Accept</button>
                                <div className="col-sm-2"></div>
                                <button id="acceptordecline" onClick={this.onAcceptOrDeclineClick.bind(this, this.state.notificationDetails.nobject.submiturl, false)} className="dclnBtn rspnd col-sm-5">Decline</button>
                          </div>):(<div></div>)}
                      </div>
                      <div className="col-sm-4"></div>
                  </div>
              </div>
            </div>
            <div className="mobileRspnsNotif col-sm-12 zeroPad">
              <div className="headerNotif col-sm-12 zeroPad">
                <Link to="/notifications"><span className="glyphicon glyphicon-remove col-sm-1 txtwhite" onClick={this.showSideMenu.bind(this)}></span></Link>
                <h3 className="col-sm-11 notbg">NOTIFICATIONS</h3>
              </div>
              <div>
                <div className="img-heading col-sm-12">
                  <span className="col-sm-2 pdryt3pc">
                    <img src="/assets/img/GolfHome.png" className="golf-img"/>
                  </span><span className="col-sm-8 notifObjectname">                
                  <h3 className="col-sm-12 m0px zeroPad">{this.state.notificationDetails.notification.object_type}</h3> </span>                                
                  <span className="col-sm-2 fr notifTym">{this.state.notificationDetails.notification.created_on}</span>
                </div>
              </div>
              <div className="viewMsg col-sm-12">
                {this.state.notificationDetails.notification.message}
              </div>
              <div className="notifRspns col-sm-12">
                {(_.size(this.state.notificationDetails.nobject)>0  && this.state.notificationDetails.nobject.status=="P" && this.state.notificationDetails.nobject.submiturl!=undefined)?(<div className="col-sm-12 txtcenter zeroPad">
                      <button onClick={this.onAcceptOrDeclineClick.bind(this, this.state.notificationDetails.nobject.submiturl, true)} className="acptBtn col-sm-5">Accept</button>
                      <button onClick={this.onAcceptOrDeclineClick.bind(this, this.state.notificationDetails.nobject.submiturl, false)} className="dclnBtn col-sm-5">Decline</button>
                </div>):(<div></div>)}
              </div>
              <div className="Del_footer col-sm-12">
                <input type="button" value="Delete Notification" onClick={this.onRemoveNotificationClick.bind(this, this.state.notificationDetails.notification.id)} className="deleteNotif col-sm-12" />
              </div>
            </div>
          </div>
              );
            }else {
              return(<div></div>);
            }
   }
}

ViewNotification.contextTypes = {
  router: React.PropTypes.object
};


function mapStateToProps(state) {
    return {
       activeUser: (state.activeUser!=null)?(state.activeUser):(JSON.parse(sessionStorage.getItem('userDetails'))),
       selectedNotification: state.selectedNotification
    };
}
function matchDispatchToProps(dispatch){
    return bindActionCreators({getNotificationById,removeNotification, onAcceptOrDeclineClick}, dispatch);
}
export default connect(mapStateToProps,matchDispatchToProps) (ViewNotification);
