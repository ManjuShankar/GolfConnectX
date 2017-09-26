import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {isValidEmail} from '../../utils/Validation';
import {FriendRequest} from '../../actions/friendsAction.js';
import {InviteModalAction, searchMembers} from '../../actions/InviteModalAction.js';


class InviteModal extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      newState: "",
      modalView : true,
      members : [],
      emailList : "",
      isValidEmailReciepients: '',
      buttonDisabled : true,
      errMsg : false,
      preventCopyPaste: false
    };
  }
  componentWillMount() {
        this.setState({
            members : this.props.membersForFriends,
            paramId : (this.props.paramId != null && this.props.paramId != undefined)?(this.props.paramId):(-1)
        });
  }

  componentWillReceiveProps(nextProps){
      if(this.props.membersForFriends!=nextProps.membersForFriends){
        this.setState({members: nextProps.membersForFriends})
      }
  }

  componentDidMount(){
     $('#membersModal').modal('show');
     ///document.getElementById('useremails').value = '';
  }

  closeClick(status) {
    this.props.closeModal(status);
    $('.membersList').attr('checked', false);
    $('#membersModal').modal('hide');
  }
  onMemberSearch(){
  }

  SendRequest(){
         let users = [];
         let useremails = [];
         let is_friend = this.refs.is_friend.checked;

        if(this.refs.is_friend.checked == true) {
            is_friend = true;
        }
        else {
            is_friend = false;
        }

       this.state.emailList = this.refs.emailList.value;
       let emailsSplit = this
      .state
      .emailList
      .split(',');
      useremails.push(emailsSplit);


    $('#membersModal').modal('hide');

    $("#addOrRemoveMemebrs input:checkbox:checked").each(function () {
      users.push(_.toInteger(this.id));
    });

  this
      .props
      .InviteModalAction(this.props.activeUser.token, users, emailsSplit,this.props.isFrom,this.props.paramId,is_friend)
      .then(() => {
        $('.membersList').attr('checked', false);
      
      toastr.success(this.props.invite_type+" invitation sent successfully");
      })
      .catch((error) => {

      });
       this.props.closeModal(!this.state.modalView);

  }

onMemberSearch(e){
if (e.which == 13) {
      this
        .props
        .searchMembers(this.props.activeUser.token, e.target.value,this.props.isFrom,this.props.paramId)
        .then(() => {
           this.setState({members: this.props.searchForInvites.Members});
        })
        .catch((error) => {});
    }

}


   isValidList(userList) {
    if (userList != "") {
      let result = userList.split(',');
      let errors = [];
      let activeEmail = [];
      if (_.size(result) > 0) {
          result.map((user, index) => {
            let _isValid = isValidEmail(user);
            let _isInavlidObj = {'valid': _isValid};
            errors.push(_isInavlidObj);
          });
      } else {
        return 'false';
      }
      if(_.size(result)>100){
        return 'threshold'
      }
      else if(_.some(errors, ['valid', false])){
        return 'true';
      }
      else{
        return 'false';
      }
    } else {
      return 'false';
    }
  }

   validateUsersList(e) {
    let isValid = this.isValidList(_.trim(e.target.value));
    if(isValid == 'true'){
      this.setState({buttonDisabled : true});
      this.setState({isValidEmailReciepients: 'Please Enter valid email-id'});
    }else if(isValid == 'threshold'){
      this.state.preventCopyPaste = true;
      this.setState({isValidEmailReciepients: 'Email id\'s limit exceeds'});
      e.preventDefault();
    }
    else{
        this.state.preventCopyPaste = false;
        this.setState({buttonDisabled : false});
        this.setState({isValidEmailReciepients: ''});
    }
  }

toggle(){
    let users = [];
  $("#addOrRemoveMemebrs input:checkbox:checked").each(function () {
      users.push(_.toInteger(this.id));
    });
    if(_.size(users)<1){
        this.setState({
              buttonDisabled : true
        });
    }
    else{
           this.setState({
              buttonDisabled : false
        });
    }
}

onlocalSearchMembers(e){
  
   $.extend($.expr[":"], {
	"containsIN": function(elem, i, match, array) {
	return (elem.textContent || elem.innerText || "").toLowerCase().indexOf((match[3] || "").toLowerCase()) >= 0;
	}
});	
	var searchval = e.target.value;
    //console.log($(".memberName:containsIN("+searchval+")").parents('.memList').attr("id"));
	$(".memberName:containsIN("+searchval+")").parents('.memList').show();
	$(".memberName:not(:containsIN("+searchval+"))").parents('.memList').hide();
    //this.setState({members:search_result});
}
    


disableCopyPaste(e){
  if(this.state.preventCopyPaste){
    e.preventDefault();
  }
}


  render() {
    return (
      <div className="inviteModal">
        <div
            id="membersModal"
            className="modal fade modalSizeAdjust"
            role="dialog"
            data-backdrop="static">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header headerModal">
                  <button
                    type="button"
                    className="close btncloseModal wd0pc"
                    onClick={this
                    .closeClick
                    .bind(this,!this.state.modalView)}>&times;</button>
                  <h4 className="modal-title">{this.props.nameProp}</h4>
                </div>
                <div className="modal-body paddingZero">
                  <div className="col-sm-12 rightAlign">
                    <div>
                      <span className="glyphicon glyphicon-search memSearchIcon"></span>
                      <input
                        className="searchDiv pdleft20px placement"
                        placeholder="Seach for members" onChange={this.onlocalSearchMembers.bind(this)}
                        onKeyPress={this
                        .onMemberSearch
                        .bind(this)}/></div>
                  </div>

                  <form id="addOrRemoveMemebrs">
                    <div className="memberDiv">
                      {_.size(this.state.members) > 0
                        ? this
                          .state
                          .members
                          .map((item, i) => {
                            return (
                              <div key={i} className="memList" id="abc">
                                <div className="col-sm-2 mt1pc">
                                  <label className="switch">
                                    <input id={item.id} type="checkbox" onChange={this.toggle.bind(this)} className="membersList" ref="user" />
                                    <div className="slider round popup"></div>
                                  </label>
                                </div>
                                <div className="col-sm-10 zeroPad dummy">
                                  <div className="col-sm-12 zeroPad">
                                    <div className="col-sm-2 ">
                                      <img src={'http://' + item.profile_image_url} className="memberImg"/>
                                    </div>
                                    <div className="col-sm-9 zeroPad mt15pcc">
                                      <div className="memberName ml15px">{item.first_name} {item.last_name
                                          ? item.last_name
                                          : ''}</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                          })
                        : <label>No Members to show yet</label>}
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <span className="inviteEmailContent"> Not listed above? Invite by Email Address.</span>
                  <div className="col-sm-12">
                  <textarea onKeyUp={this.validateUsersList.bind(this)}
                    ref="emailList" onCopy={this.disableCopyPaste.bind(this)} onPaste={this.disableCopyPaste.bind(this)}
                    placeholder="abc1@sample.com,abc2@sample.com,abc3@sample.com"
                    id="useremails"
                    name="useremails"
                    className="mulEmails"></textarea>
                  </div>
                  <div>
                    <div className="col-sm-12"><input type="checkbox"   ref="is_friend" disabled={(this.props.isFrom == "1")?true:false} className="fleft" defaultChecked={(this.props.isFrom == "1")?true:false}/>
                      <label className="fleft col-sm-5 whiteSpace">
                        Add Members to your Friends list</label>
                    </div>
                    {_.size(this.state.isValidEmailReciepients)>0 && (
                      <label className="color-red"> {this.state.isValidEmailReciepients}</label>
                    )}

                  </div>
                  <div className="col-sm-4 fr">
                      {/*<button
                         type="button"
                         className="invitebtnSave"
                         onClick={this
                         .SendRequest
                         .bind(this)}
                         disabled={this.state.buttonDisabled}>Send</button>*/}
                        <input type="button" className="invitebtnSave btn" onClick={this
                        .SendRequest
                        .bind(this)}  
                         disabled={this.state.buttonDisabled}
                         value="Send" />
                    </div>
                </div>
              </div>

            </div>
          </div>

      </div>); //End Return

  }

}
function mapStateToProps(state) {
  return {
    activeUser: (state.activeUser != null)
      ? (state.activeUser)
      : (JSON.parse(sessionStorage.getItem('userDetails'))),
      searchForInvites : state.searchForInvites
  };
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators({
    FriendRequest,
    searchMembers,
    InviteModalAction,
    searchMembers,


  }, dispatch);
}
export default connect(mapStateToProps,matchDispatchToProps) (InviteModal);
