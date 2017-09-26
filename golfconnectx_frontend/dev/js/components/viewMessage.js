import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {getMessageDetails, removeMessage, sendNewMessageDetails} from '../actions/messagesAction';
import {isExistObj} from '../utils/functions';
let paramId;
class ViewMessage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state={
      messageDetails: {},
      msgNotEmpty : ""      
    };
  }


  componentWillMount(){
    let urlPath = _.split(location.pathname, '_');
    paramId =  (_.size(urlPath)>0)?(_.toInteger(urlPath[1])):(0);
        this.props.getMessageDetails(this.props.activeUser.token, paramId).then(()=>{
                  this.setState({messageDetails:this.props.messageDetails});
        }).catch((error)=>{
            if(error == "Error: Request failed with status code 401"){
         this.context.router.push('/');
        }
     });
   }

  removeMessage(){
      this.props.removeMessage(this.props.activeUser.token, paramId).then(()=>{
        this.context.router.push("/messages");
      }).catch((error)=>{
   });
  }

  sendNewMessageDetails(e){
    if(e.target.name == "nonResponsive"){
this.setState({
          msgNotEmpty : ""
      });
    let message=document.getElementById('message').value;

    this.props.sendNewMessageDetails(this.props.activeUser.token, paramId, message).then(()=>{
      document.getElementById('message').value='';
      ///this.context.router.push("/messages");
    }).catch((error)=>{
 });
  }
  if(e.target.name == "responsive"){
      let message=document.getElementById('messageResponsive').value;
       this.props.sendNewMessageDetails(this.props.activeUser.token, paramId, message).then(()=>{
        document.getElementById('messageResponsive').value='';
      }).catch((error)=>{
     });
  }
  }


  navigateMainPage(){
      this.context.router.push("/messages");
      if(screen.width<600){
        $(".MobileNav").hide();

      }
  }

  navigateNewMessage(){
      this.context.router.push("/newMessage");
  }
      
      msgNotEmpty(e){
          this.setState({
              msgNotEmpty : e.target.value
          });
      }

  render() {
    return (
        <div className="viewMessage ">
           <div className="msgcontainer">
                <div className="msgHeading">
                    MESSAGES
                 </div>
               <div className="btns col-sm-12 zeroPad">
                   <div className="col-sm-6 alglft zeroPad">

                       <div className="bckbtn"><button onClick={this.navigateMainPage.bind(this)} className="btnback">Back</button></div>
                   </div>
                   <div className="col-sm-6 algrgt zeroPad">
                     <button className="btnDel" onClick={this.removeMessage.bind(this)}>Delete</button>
                     <div className="modal fade delte" id="deleteModal" role="dialog">
                            <div className="modal-dialog modal-sm">
                               <div className="modal-content">
                                   <div className="modal-body">Are you sure you want to delete?</div>
                                  <div className="modal-footer">
                                    <button type="button" className="cnfrmbtn checkng" id="btncnfrm">Confirm</button>
                                    <button type="button" className="cancelbtn checkng" data-dismiss="modal">Cancel</button>
                                 </div>
                                </div>
                            </div>

                      </div>
                   </div>
              </div>
               <div className="groupmsgs col-sm-12 zeroPad">
                   <div className="msgs col-sm-12 zeroPad">
                   {isExistObj(this.state.messageDetails) && isExistObj(this.state.messageDetails.messages) && _.size(this.state.messageDetails)>0 && _.size(this.state.messageDetails.messages)>0 && this.state.messageDetails.messages.map((item, index)=>{
                      return(<div key={index} className="stevemsg">
                          <div className="stevedetails">
                              <img src={'http://' + item.created_by.profile_image_url} className="person-img"/>
                              <span className="lastseen">
                                  {isExistObj(this.props.activeUser) && item.created_by.id==this.props.activeUser.id?<h3>Me</h3>:<h3>{item.created_by.first_name}</h3>}
                                  <h4>{item.created_on}</h4>
                              </span>
                          </div>
                          <p>{item.message}</p>
                      </div>)
                   })}


               </div>
               <div className="stevedetails">
                              {isExistObj(this.props.activeUser) && <img src={'http://' + this.props.activeUser.profile_image_url} className="person-img"/>}
                              <span className="lastseen">
                                  <h3>Me</h3>

                              </span>
                          </div>
               <div className="nxtrply col-sm-12 zeroPad">
                   <div className="nickrply col-sm-12 zeroPad">
                       <div className="rplybox col-sm-12">
                           <textarea id="message"  name="message" ref="replyMessage" onChange={this.msgNotEmpty.bind(this)} maxLength="1000" className="txtarea" name="txtArea"></textarea>
                           <div className="brdrline">

                          <span className="rytside">
                            <button onClick={this.navigateMainPage.bind(this)} className="butnCancel">Cancel</button>
                            <button name="nonResponsive" disabled={!this.state.msgNotEmpty} onClick={this.sendNewMessageDetails.bind(this)} className="btn butnSnd" >Send</button>
                          </span>
                        </div>
                       </div>
                   </div>
               </div>
                   </div>
           </div>
           <div className="mobileMsgRspnsv">
            <div className="headerMsg col-sm-12 zeroPad">
            {/*  <span className="glyphicon glyphicon-chevron-left col-sm-1" onClick={this.navigateMainPage.bind(this)}/>*/}
              <h3 className="col-sm-11 msgbg">MESSAGES</h3>
            </div>
            <div className="">
            <div>
              <span className="glyphicon glyphicon-chevron-left col-sm-1" onClick={this.navigateMainPage.bind(this)}/><span className="display-inline">{this.props.params.name}</span>
            </div>
              <div>
                <ul>
                {_.size(this.state.messageDetails)>0 && _.size(this.state.messageDetails.messages)>0 && this.state.messageDetails.messages.map((item, index)=>{
                  return(<li key={index}>
                    <div className="person_chat">
                      <span className="personImage"><img src={'http://' + item.created_by.profile_image_url} className="person-img"/></span>
                      <span className="personSay">{item.message}</span>
                      <span className="lastseen"><h4>{item.created_on}</h4></span>
                    </div>
                  </li>)
                })}
                </ul>
              </div>
            </div>
            <div className="sendingMsg">
              <div className="bgType">
                <textarea type="text" id="messageResponsive" name="message" placeholder="Type message here.." className="msg_Typing" maxLength="1000" />
                <button name="responsive" onClick={this.sendNewMessageDetails.bind(this)} className="msg_send">Send</button>
               </div>
                   </div>
           </div>
        </div>
         );
   }
}

ViewMessage.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
    return {
       activeUser: (state.activeUser!=null)?(state.activeUser):(JSON.parse(sessionStorage.getItem('userDetails'))),
       messageDetails: state.messageDetails
    };
}
function matchDispatchToProps(dispatch){
    return bindActionCreators({getMessageDetails, removeMessage, sendNewMessageDetails}, dispatch);
}
export default connect(mapStateToProps,matchDispatchToProps) (ViewMessage);
