import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Spinner from 'react-spinner';
import {getMessages, deleteConversation} from '../actions/messagesAction';
import _ from "lodash";
import {isExistObj} from '../utils/functions';

class Messages extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state={
        messages: Object.assign([], props.messages),  ajaxCallInProgress:false , buttonDisabled : true,deleteButton:false
    };
  }
GetMessages(){
  this.props.getMessages(this.props.activeUser.token).then(()=>{
                  this.setState({messages:this.props.messages});
        }).catch((error)=>{

     });
}
  onDeleteMessage(e){
    if(e.target.name == "nonResponsive_delete"){
          let deleteMessage=[];
          $("#chkMessage input:checkbox:checked").each(function() {
                deleteMessage.push(_.toInteger(this.id));
                $('.cntrl_indicator').attr('checked',false);
          });
          this.props.deleteConversation(this.props.activeUser.token, deleteMessage).then(()=>{
                     $('.cntrl_indicator').prop('checked',false);
                     $('#deleteModal').modal('hide');
                     this.GetMessages();
                  }).catch((error)=>{
          });
                }
                if(e.target.name == "responsive_delete"){
          let deleteMessageRsp=[];
          $("#chkMessageRespo input:checkbox:checked").each(function() {
                deleteMessageRsp.push(_.toInteger(this.id));
                $('.cntrl_indicator').attr('checked',false);
                //this.setState({deleteButton:false});
          });
          this.props.deleteConversation(this.props.activeUser.token, deleteMessageRsp).then(()=>{

                     $('#deleteModalResp').modal('hide');
                     this.GetMessages();
                     this.setState({deleteButton:false});
                  }).catch((error)=>{
          });
                }
    }

  componentWillMount(){
    this.setState({ajaxCallInProgress:true});
        this.props.getMessages(this.props.activeUser.token).then(()=>{
                  this.setState({messages:this.props.messages, ajaxCallInProgress:false});
                 $("#deleteButton").prop({disabled:true});
        }).catch((error)=>{
          if(error == "Error: Request failed with status code 401"){
           this.context.router.push('/');
          }
          this.setState({ajaxCallInProgress:false});
     });
   }

 componentDidMount() {
      $('.menu').parent().removeClass('active');

   }
   onNewMessageClick(){
        this.context.router.push("/newMessage");
   }
   onNavigateToMessageDetail(id, name ){
       this.context.router.push('/viewMessage_' + id+"_"+name)
       if(screen.width<769){
       $(".MobileNav").hide();
      
     }
     }
     /*****/
     deleteToggle(){
         let that = this;
         let checkBoxes = $('.cntrl_indicator');
         checkBoxes.change(function () {
         $('#deleteButton').prop('disabled', checkBoxes.filter(':checked').length < 1);
         if(checkBoxes.filter(':checked').length < 1){
          that.setState ({
                   deleteButton : false
         });
         }
       else{
         that.setState ({
                   deleteButton : true
         });
       }
         
       });
     }

      componentWillReceiveProps(nextProps){
        if(nextProps.messages!=null && this.props.messages!=nextProps.messages){
          this.setState({messages: nextProps.messages});
        }
      }

  render() {
    return (
        <div className="Messages">
        <div className="msgcontainer msg_screenPage">
            <div className="msgHeading">
                MESSAGES
            </div>
            <div className="col-sm-12 pdng mrgn">
            <div className="col-sm-6 alglft pdng">
            <button className="btnMsg" onClick={this.onNewMessageClick.bind(this)}>+ New Message</button>
            </div>
            <div className="col-sm-6 algrgt pdng deleteButtonResp">
            {_.size(this.state.messages)>0 ?<button className="btn btnDel" id="deleteButton" data-toggle="modal" data-target="#deleteModal" >Delete</button>:<div></div>}
                <div className="modal fade delte" id="deleteModal" role="dialog" data-backdrop="static">
                            <div className="modal-dialog modal-sm">
                               <div className="modal-content">
                                   <div className="modal-body">Are you sure you want to delete?</div>
                                  <div className="modal-footer">
                                    <button type="button" className="cnfrmbtn checkng" id="btncnfrm" name="nonResponsive_delete" onClick={this.onDeleteMessage.bind(this)}>Confirm</button>
                                    <button type="button" className="cancelbtn checkng" data-dismiss="modal">Cancel</button>
                                 </div>
                                </div>
                            </div>
                      </div>
                  </div>
            </div>
            {(this.state.ajaxCallInProgress)?(<div className="mt25pc"><Spinner /></div>):(<div className="row">
              <div className="col-sm-12 ">
                  <form id="chkMessage">
                    <ul className="list-group">
                      {_.size(this.state.messages)>0 && this.state.messages.map((item, index)=>{

                        return(
                                <li key={index} className="list-group-item col-sm-12 brdr zeroPad">
                                    <div className="col-xs-1 pdng msgchckbx">
                                      <input type="checkbox" ref="msgCheckbox" className="customchck cntrl_indicator" id={item.id} onChange={this.deleteToggle.bind(this)} />
                                    </div>
                                    <div className="col-sm-11 msgViewBody pdng"  onClick={this.onNavigateToMessageDetail.bind(this, item.id, item.name)}>
                                      <div className="msgView col-sm-4 pdlft0px">
                                        <div className="col-sm-12 pdlft0px">
                                          {isExistObj(item) && (<div className="col-sm-4 ">
                                            <img src={'http://'+item.message_icon} className="profileimg" />
                                          </div>)}
                                          <div className="col-sm-7 ">
                                            <span className="fromName">{item.name}</span>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="msg col-sm-8 mt1pcc pdryt0px">
                                        <div className="col-sm-12 ">
                                          <div className="col-sm-8 margn0px msgbody">
                                            <span>
                                            {_.truncate(_.trim(item.first_message), {
                                              'length': 40,
                                              'separator': ' '
                                            })}
                                           </span>
                                          </div>
                                          <div className="fr margn0px col-sm-4 pdryt0px">
                                            <span className="msgtime">{item.created_on}</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                </li>)
                              })}
                        </ul>
                    </form>
              </div>
          </div>)}
        </div>
        <div className="mobileMsgRspnsv col-sm-12 zeroPad">
                <div className="headerMsg col-sm-12 zeroPad">
                  <h3 className="col-sm-11 msgbg">MESSAGES</h3>
                </div>
                <div className="col-sm-12 inbxhead">
                  <div className="col-sm-8 txt-center inbox_font">Inbox</div>
                  <div className="col-sm-4 new-butn">
                    <button className="btnMsg" onClick={this.onNewMessageClick.bind(this)}>+ New Message</button>
                  </div>
                </div>
                {/*<div className="col-sm-12 searchbg">
                  <span className="inputcol col-sm-9">
                    <input type="text" className="msgSearch" placeholder="Search Messages" />
                  </span>
                  <span className="searchcol col-sm-3">
                    <button className="glyphicon glyphicon-search msgSearch-butn" />
                  </span>
                </div>*/}
              {(this.state.ajaxCallInProgress)?(<div className="mt25pc"><Spinner /></div>):(<div className="row">
              <div className="col-sm-12 ">
                  <form id="chkMessageRespo">
                    <ul className="list-group">
                      {_.size(this.state.messages)>0 && this.state.messages.map((item, index)=>{

                        return(
                                <li key={index} className="list-group-item col-sm-12 brdr zeroPad">
                                    <div className="col-xs-1 pdng msgchckbx">
                                      <input type="checkbox" ref="msgCheckbox" className="customchck cntrl_indicator" id={item.id} onChange={this.deleteToggle.bind(this)} />
                                    </div>
                                    <div className="col-sm-11 msgViewBody pdng"  onClick={this.onNavigateToMessageDetail.bind(this, item.id, item.name)}>
                                      <div className="msgView col-sm-4 messagesAlign">
                                        <div className="col-sm-12 messagesAlign">
                                          <div className="col-sm-4 pdlftryt0px">
                                            {item.participants[0]!=null && item.participants[0]!=undefined?<img src={'http://'+item.participants[0].profile_image_url} className="profileimg"></img>:<img src="" className="profileimg"></img>}
                                          </div>
                                          <div className="col-sm-7 pdng mt1pcc wd100pc">
                                            <div className="col-sm-12 zeroPad line-hgt_24px">
                                              <span className="fromName">{item.name}</span>
                                            </div>
                                            <div className="col-sm-12 msg">
                                              <span className="msgbody">
                                                {_.truncate(_.trim(item.first_message), {
                                                  'length': 40,
                                                  'separator': ' '
                                                })}
                                              </span>
                                            </div>
                                          </div>
                                          <div className="fr margn0px col-sm-4 wd40pc">
                                            <span className="msgtime">{item.created_on}</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                </li>)
                              })}
                        </ul>
                    </form>
              </div>
          </div>)}
<div className="col-sm-6 algrgt pdng deleteButtonResp">
            {this.state.deleteButton ?(<button className="btn btnDel" id="deleteButton" data-toggle="modal" data-target=" #deleteModalResp" >Delete</button>):(<div></div>)}
                <div className="modal fade delte" id="deleteModalResp" role="dialog" data-backdrop="static">
                            <div className="modal-dialog modal-sm">
                               <div className="modal-content">
                                   <div className="modal-body">Are you sure you want to delete?</div>
                                  <div className="modal-footer">
                                    <button type="button" className="cnfrmbtn checkng" name="responsive_delete" id="btncnfrm" onClick={this.onDeleteMessage.bind(this)}>Confirm</button>
                                    <button type="button" className="cancelbtn checkng" data-dismiss="modal">Cancel</button>
                                 </div>
                                </div>
                            </div>
                      </div>
                  </div>
</div>
        </div>
         );
   }
}

Messages.contextTypes = {
  router: React.PropTypes.object
};


function mapStateToProps(state) {
    return {
       activeUser: (state.activeUser!=null)?(state.activeUser):(JSON.parse(sessionStorage.getItem('userDetails'))),
       messages: state.messages
    };
}
function matchDispatchToProps(dispatch){
    return bindActionCreators({getMessages, deleteConversation}, dispatch);
}
export default connect(mapStateToProps,matchDispatchToProps) (Messages);
