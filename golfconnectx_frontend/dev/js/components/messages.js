import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Spinner from 'react-spinner';
import {getMessages, deleteConversation} from '../actions/messagesAction';
import _ from "lodash";
class Messages extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state={
        messages: [],  ajaxCallInProgress:false , buttonDisabled : true
    };
  }
GetMessages(){
  this.props.getMessages(this.props.activeUser.token).then(()=>{
                  this.setState({messages:this.props.messages});
        }).catch((error)=>{

     });
}
  onDeleteMessage(){
          let deleteMessage=[];
          $("#chkMessage input:checkbox:checked").each(function() {
                deleteMessage.push(_.toInteger(this.id));
                $('.cntrl_indicator').attr('checked',false);
          });
          this.props.deleteConversation(this.props.activeUser.token, deleteMessage).then(()=>{

                     $('#deleteModal').modal('hide');
                     this.GetMessages();
                  }).catch((error)=>{
          });
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
   onNavigateToMessageDetail(id){
       this.context.router.push('/viewMessage_' + id)
     }
     /*****/
      deleteToggle(){
          var checkBoxes = $('.cntrl_indicator');
          checkBoxes.change(function () {
          $('#deleteButton').prop('disabled', checkBoxes.filter(':checked').length < 1);
        });
      }

     /*****/
  render() {
    return (
        <div className="Messages">
        <div className="msgcontainer">
            <div className="msgHeading">
                MESSAGES
            </div>
            <div className="col-sm-12 pdng mrgn">
            <div className="col-sm-6 alglft pdng">
            <button className="btnMsg" onClick={this.onNewMessageClick.bind(this)}>+ New Message</button>
            </div>
            <div className="col-sm-6 algrgt pdng">
            {_.size(this.state.messages)>0 ?<button className="btn btnDel" id="deleteButton" data-toggle="modal" data-target="#deleteModal" >Delete</button>:<div></div>}
                <div className="modal fade delte" id="deleteModal" role="dialog" data-backdrop="static">
                            <div className="modal-dialog modal-sm">
                               <div className="modal-content">
                                   <div className="modal-body">Are you sure you want to delete?</div>
                                  <div className="modal-footer">
                                    <button type="button" className="cnfrmbtn checkng" id="btncnfrm" onClick={this.onDeleteMessage.bind(this)}>Confirm</button>
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
                                    <div className="col-sm-11 msgViewBody pdng"  onClick={this.onNavigateToMessageDetail.bind(this, item.id)}>
                                      <div className="msgView col-sm-4 pdlft0px">
                                        <div className="col-sm-12 pdlft0px">
                                          <div className="col-sm-4 ">
                                            {item.participants[0]!=undefined && item.participants[0]!=null?<img src={'http://'+item.participants[0].profile_image_url} className="profileimg"></img>:<img src="" className="profileimg"></img>}
                                          </div>
                                          <div className="col-sm-7 mt3pc pdng">
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
