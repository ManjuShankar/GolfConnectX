import React from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {createNewMessage, getUsers} from '../actions/messagesAction';
var serialize = require('form-serialize');
var ReactTags = require('react-tag-autocomplete');

class NewMessage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state={
      tags: [],
      suggestions: [],
      errMsg: "",
      msgTxt: "",
      buttonDisable1:true

    };
  }

  componentWillMount(){
      this.props.getUsers(this.props.activeUser.token).then((data)=>{
          this.setState({suggestions: data});
      }).catch((error)=>{

      });
  }

  handleDelete(i) {
   let tags = this.state.tags.slice(0);
   tags.splice(i, 1);
   this.setState({ tags: tags });
 }

 handleAddition(tag) {
   let tags = this.state.tags.concat(tag);
   this.setState({ tags: tags });
 }

  navigateToMessages(){
      this.context.router.push('/messages');
  }

  sendNewMessage(){
    let form = document.querySelector('#addMessageForm');
    let formData = serialize(form, { hash: true });
    let participants;
    if(_.size(this.state.tags)>0)
    {
        $('#newMsg').prop('disabled', true);
        this.state.tags.map((item, index)=>{
          if(participants==undefined){
            participants = item.email;
          }
          else {
            participants = participants + "," + item.email;
          }
      });
    }
      _.set(formData, 'participants', participants);
      this.props.createNewMessage(this.props.activeUser.token, formData).then(()=>{
      this.context.router.push('/messages');

    }).catch((error)=>{
      
    });
  }
  /*****/
  onRequired(e){
    if(e.target.name == "message"){
      if(e.target.value == ""){
        this.setState({
          errM:(<span className="err-msg">Please enter something . . .</span>),
          msgTxt:"",
          buttonDisable1 : true
        });
      }
      else{
        this.setState({
          errM:"",
          msgTxt:e.target.value,
          buttonDisable1 : false
        });
      }
    }
  }
  /*****/
  render() {
    return (
        <div className="newMessage">
        <div className="headerMsg min-display">
        <span className="glyphicon glyphicon-remove col-sm-1 txtwhite" onClick={this.navigateToMessages.bind(this)}></span>New Message
        </div>
        <form action="/" className="card" id="addMessageForm" method="post">
            <div className="msgcontainer">
                <div className="msgHeading">
                    MESSAGES
                 </div>
            </div>
            <div className="compose col-sm-12">

                <div className="sendto">
                <span className="col-xs-1 txtRyt">
                  To:</span>
                  <span className="col-sm-10 zindex1">
                   <ReactTags
                    tags={this.state.tags}
                    suggestions={this.state.suggestions}
                    handleDelete={this.handleDelete.bind(this)}
                    handleAddition={this.handleAddition.bind(this)}
                    placeholder="Add Recipients" /></span>
                </div><div className="divLine col-sm-12"></div>
                <div className="msg col-sm-12">
                    <textarea name="message" maxLength="1000" id="message" ref="message" className="txtarea" onChange={this.onRequired.bind(this)} placeholder="Type here"></textarea>
                </div>
                {this.state.errM}
                <div className="brdrline col-sm-12"></div>
                <div className="col-sm-12">

                    <span className="rytside">
                        <input type="button" onClick={this.navigateToMessages.bind(this)} className="btn btnCncl" value="Cancel"/>
                        <input type="button" value="Send" id="newMsg" onClick={this.sendNewMessage.bind(this)} className="btn btnSnd btnSend" disabled={(!(_.size(this.state.tags)>0)) || !this.state.msgTxt } />
                    </span>
                </div>
            </div>
          </form>


        {/*<div className="mobileMsgRspnsv">
             <div className="send_to">
            <ReactTags
                    tags={this.state.tags}
                    suggestions={this.state.suggestions}
                    handleDelete={this.handleDelete.bind(this)}
                    handleAddition={this.handleAddition.bind(this)}
                    className="email_ID" placeholder="To"/>
          </div>
          <div className="recent_rply">Recent</div>
          <div className="sendingMsg">
            <div className="bgType">
              <input type="text" placeholder="Type message here.." className="msg_Typing" name="message" maxLength="1000" id="message" ref="message" onChange={this.onRequired.bind(this)} />
              <button className="btn msg_send" value="Send" id="newMsg" onClick={this.sendNewMessage.bind(this)} disabled={(!(_.size(this.state.tags)>0)) || !this.state.msgTxt } >Send</button>
            </div>
          </div>
        </div>*/}
      
        </div> );
   }
}

NewMessage.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
    return {
       activeUser: (state.activeUser!=null)?(state.activeUser):(JSON.parse(sessionStorage.getItem('userDetails'))),
    };
}
function matchDispatchToProps(dispatch){
    return bindActionCreators({createNewMessage, getUsers}, dispatch);
}
export default connect(mapStateToProps,matchDispatchToProps) (NewMessage);
