import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {getGolfConnectXmembers, onSendRequest, GetFriends, FriendRequest, searchMembers} from '../actions/friendsAction';
import {createNewMessage} from '../actions/messagesAction';
import {isValidEmail} from '../utils/Validation';
import Spinner from 'react-spinner';
import InviteModal from './child-components/InviteModal';
class FriendsPage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      friends: [],
      ajaxCallInProgress: false,
      members: [],
      emailList: "",
      isValidEmailReciepients: false,
      modalView: false, msgEmail:'',msgNotEmpty: ""
    };

  }

  componentWillMount() {
    this.setState({ajaxCallInProgress: true});
    this
      .props
      .GetFriends(this.props.activeUser.token)
      .then(() => {
        this.setState({friends: this.props.friends.Friends});
        this.setState({ajaxCallInProgress: false});
      })
      .catch((error) => {
        
        if (error == "Error: Request failed with status code 401") {
          this
            .context
            .router
            .push('/');
        }
      });
  }
  componentDidMount() {
    $('.menu')
      .parent()
      .removeClass('active');
  }

  onSendClick(id) {
    let message = document.getElementById('txtArea');
    this
      .props
      .onSendRequest(this.props.activeUser.token, id, message)
      .then(() => {
        document
          .getElementById('txtArea')
          .value = '';
        $('#myModal').modal('hide');
      })
      .catch((error) => {
        
      });
  }

  navigateToDetailsPage(id) {
    this
      .context
      .router
      .push('/profileDetail_' + id);
  }

  getPeople() {
    this.props.getGolfConnectXmembers(this.props.activeUser.token).then(() => {
          this.setState({members: this.props.friends.Members});
          this.setState({ajaxCallInProgress: false});
        }).catch((error) => {
          
          if (error == "Error: Request failed with status code 401") {
            this.context.router.push('/');
          }
        });
        this.setState({modalView: !this.state.modalView});
  }

  SendRequest() {
    let users = [];
    let useremails = [];
    this.state.emailList = this.refs.emailList.value;
    let emailsSplit = this
      .state
      .emailList
      .split(',');
    useremails.push(emailsSplit);

    $("#addOrRemoveMemebrs input:checkbox:checked").each(function () {
      users.push(_.toInteger(this.id));
    });

    this
      .props
      .FriendRequest(this.props.activeUser.token, users, emailsSplit)
      .then(() => {
        $('.membersList').attr('checked', false);
        $('#friendsModal').modal('hide');
      })
      .catch((error) => {
        
      });
  }

  onMemberSearch(e) {
    if (e.which == 13) {
      this
        .props
        .searchMembers(this.props.activeUser.token, e.target.value)
        .then(() => {
          this.setState({members: this.props.friends.Members});
        })
        .catch((error) => {});
    }
  }


  closeClick(status) {
    this.setState({modalView: status});
  }

  isValidList(userList) {
    if (userList != "") {
      let result = userList.split(',');
      let errors = [];
      if (_.size(result) > 0) {
        if (_.size(result) > 20) {
          return true;
        } else {
          result.map((user, index) => {
            let _isValid = isValidEmail(user);
            let _isInavlidObj = {
              'valid': _isValid
            };
            errors.push(_isInavlidObj);
          })
        }
      } else {
        return false;
      }
      return (_.some(errors, ['valid', false]));
    } else {
      return false;
    }
  }

  validateUsersList(e) {
    let isValid = this.isValidList(_.trim(e.target.value));
    this.setState({isValidEmailReciepients: isValid});
  }

  onSendMessageClick(){
   
    let formData={};
    let participants = this.state.msgEmail;
    _.set(formData, 'message', _.trim(document.getElementById('messageTxtArea').value));
    _.set(formData, 'participants', this.state.msgEmail);
      this.props.createNewMessage(this.props.activeUser.token, formData).then(()=>{
        document.getElementById('messageTxtArea').value='';
        $("#sendMessageModal").modal('hide');
      }).catch((error)=>{
      });
  }
  messageModal(email){
    $("#sendMessageModal").modal('show');
this.setState({msgEmail:email});
  }
   msgNotEmpty(e){
          this.setState({
              msgNotEmpty : e.target.value
          });
      }

  render() {
    return (
      <div className="frndsGridPage">
        <div className="col-sm-12">
          <h3 className="txt-center col-xs-2">Friends</h3>
          <div className="col-xs-10 txtRyt">
            <button
              className="btnAddFrnd"
              data-toggle="modal"
              onClick={this
              .getPeople
              .bind(this)}><img src="/assets/img/icons/FriendIcon.png" className="frndImg"/> Add Friends</button>
          </div>
          {(this.state.modalView)
            ? (
              <div>
                <InviteModal
                 nameProp="Add Friends"
              invite_type="Friend"
                  membersForFriends={this.state.members}
                  closeModal={this
                  .closeClick
                  .bind(this)}
                  isFrom="1"/>
              </div>
            )
            : (
              <div></div>
            )}

        </div>
        {(this.state.ajaxCallInProgress)
          ? (
            <div className="mt25pc"><Spinner/></div>
          )
          : (
            <div className="frndsgrid">
              <div className="grid">
                <div className="col-md-12 r1">
                  {_.size(this.state.friends) > 0
                    ? this
                      .state
                      .friends
                      .map((item, i) => {
                        return (
                          <div key={i}>
                            <div className="col-md-3  col-lg-3 col-sm-4 col-xs-12 mb3pc">
                              <div className="r1c1 meo">
                                <span
                                  onClick={this
                                  .navigateToDetailsPage
                                  .bind(this, item.id)}
                                  className="img1"><img src={'http://' + item.profile_image_url} className="aldo"/></span>
                                <div className="name col-sm-12">
                                  <span
                                    className="namexx col-sm-6"
                                    onClick={this
                                    .navigateToDetailsPage
                                    .bind(this, item.id)}>{item.first_name}</span>
                                  <a data-toggle="modal" onClick={this.messageModal.bind(this,item.email)} className="btn btn-info btn-lg">
                                    <span className="glyphicon glyphicon-envelope envlp col-sm-6"></span>
                                  </a>
                                  <div className="modal fade" id="sendMessageModal" role="dialog" data-backdrop="static">
                                  <div className="modal-dialog">
                                     <div className="modal-content">
                                         <div className="modal-header">
                                           <button className="close" data-dismiss="modal">&times; </button>
                                           <h3 className="m0px">Message</h3>
                                         </div>
                                        <div className="modal-body"><textarea onChange={this.msgNotEmpty.bind(this)} id="messageTxtArea" maxLength="1000" className="txtarea form-control" placeholder="write something.." name="messageTxtArea"></textarea></div>
                                        <div className="modal-footer">
                                          <button disabled={!this.state.msgNotEmpty} onClick={this.onSendMessageClick.bind(this)} type="button" className="btn btnSend" id="btnSend">Send</button>
                                          <button type="button" className="Cancel-butn" data-dismiss="modal">Cancel</button>
                                       </div>
                                      </div>
                                  </div>
                                  </div>

                                </div>
                                <div className="modal fade" id="myModal" role="dialog">
                                  <div className="modal-dialog modal-sm">
                                    <div className="modal-content">
                                      <div className="modal-header">INVITE</div>
                                      <div className="modal-body">
                                        <textarea
                                          id="txtArea"
                                          className="txtarea"
                                          placeholder="write something.."
                                          name="txtArea"></textarea>
                                      </div>
                                      <div className="modal-footer">
                                        <input
                                          onClick={this
                                          .onSendClick
                                          .bind(this, item.id)}
                                          type="button"
                                          className="btn btn-primary"
                                          id="btnSend"
                                          value="Send"/>
                                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })
                    : <div>No friends to show</div>}
                </div>

              </div>
            </div>
          )}

      </div>
    );
  }
}

FriendsPage.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {
    activeUser: (state.activeUser != null)
      ? (state.activeUser)
      : (JSON.parse(sessionStorage.getItem('userDetails'))),
      friends: state.friends
  };
}
function matchDispatchToProps(dispatch) {
  return bindActionCreators({
    getGolfConnectXmembers,
    onSendRequest,
    GetFriends,
    FriendRequest,
    searchMembers,
    createNewMessage
  }, dispatch);
}
export default connect(mapStateToProps, matchDispatchToProps)(FriendsPage);
