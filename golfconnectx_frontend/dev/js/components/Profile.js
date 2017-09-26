import React, {PropTypes, Component} from 'react';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'lodash';
import Spinner from 'react-spinner';
import {React_Boostrap_Carousel} from 'react-boostrap-carousel';
import {isValidImage} from "../utils/Validation";
var serialize = require('form-serialize');
import {likePost} from '../actions/groupListAction';

import {getCurrentEvent, deletePost, deleteComment} from '../actions/eventDetailsAction';
import {createEvents, editEvents} from '../actions/createEventAction';
import {
    getMyCourses,
    getMyPosts,
    userProfileDetails,
    getFriends,
    searchFriends,
    searchGroups,
    editCourseNotes,
    addNewScore,
    profilegroupList,
    getNewScore,
    eventDetails,
    deleteScores,
    deleteScoresImage
} from '../actions/profileActions';
import {getCourseObject} from '../actions/courseListAction';
import {isExistObj} from '../utils/functions';
import EventListDetail from './child-components/eventListDetail';
import UpcomingEventDetails from './child-components/upcomingEventDetails';
import CreateEvent from './child-components/createEvent';
import GroupsList from './child-components/groupsList';
import {SERVICE_URLS} from '../constants/serviceUrl';
import DatePicker from 'react-datepicker';
import moment from 'moment';

let paramId;

class MyProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentEventList: [],
      getGroupList: [],
      profileCoursesList: [],
      postsList: [],
      courseDetails: {},
      Notes: [],
      upComingeventDetail: {},
      isCreateOrEdit: "Upcoming",
      profileDetails: {},
      myFriendsList: [],
      ajaxCallInProgress: false,
      errScore: "",
      getScores: {},
      img: "",
      selectedImage: "",
      selectedScoreId: null,
      slectedImagesList: [],
      imageId: '',
      tempScoreId: "", scoreNotes:'', imgArray:{}
    };
    this.onFieldChange = this
      .onFieldChange
      .bind(this);
  }
  onFieldChange(e) {}

  onSaveNotes(id) {
    let innerDescValue = document
      .getElementById("txtnotes")
      .innerHTML
      .replace(new RegExp('\r?\n', 'g'), '<br />');
    let notes = $('#txtnotes').val();
    this
      .props
      .editCourseNotes(innerDescValue, this.props.selectedCourse.course.id, id, this.props.activeUser.token)
      .then(() => {
        this.setState({Notes: this.props.myProfile.notes});

        this.getnewScores();
        this
          .props
          .getCourseObject(this.props.selectedCourse.course.id, this.props.activeUser.token)
          .then((id) => {
            this.setState({courseDetails: this.props.selectedCourse, scoreNotes:innerDescValue});
          })
          .catch((error) => {});
        $('#notesModal').modal('hide');
      })
      .catch((error) => {});
  }
  addNewScores(id) {

        let score = document.getElementById('txtScoreInput');
        let played_on = document.getElementById('txtDate');
        if (this.refs.lastScore.value == "" || this.refs.lastScore.value > 200 || this.refs.lastScore.value < 18) {
            this
                .refs
                .lastScore
                .focus();
        } else {
            $('#saveScore').prop('disabled', true);
            this
                .props
                .addNewScore(this.props.activeUser.token, this.props.selectedCourse.course.id, score.value, played_on.value)
                .then(() => {
                    document
                        .getElementById('txtScoreInput')
                        .value = '';
                    document
                        .getElementById('txtDate')
                        .value = '';
                    $('#myModal1').modal('hide');
                    $('#saveScore').prop('disabled', false);
                    this.getnewScores();
                })
                .catch((error) => {});
        }
    }
    componentWillMount() {
        this.setState({ajaxCallInProgress: true});
        $(".scoreImgSpinner").hide();
        let urlPath = _.split(location.pathname, '_');
        paramId = (_.size(urlPath) > 0)
            ? (_.toInteger(urlPath[1]))
            : (0);

        this
            .props
            .userProfileDetails(this.props.activeUser.token)
            .then(() => {
                this.setState({profileDetails: this.props.myProfile.MyProfile, ajaxCallInProgress: false});
                /// To Get the Courses List
                this
                    .props
                    .getMyCourses(this.props.activeUser.token, this.props.myProfile.MyProfile.profile.id)
                    .then(() => {
                        this.setState({profileCoursesList: this.props.myProfile.MyProfileCourseList, ajaxCallInProgress: false});
                    $(".scoreImgSpinner").hide();
                    })
                    .catch((error) => {
                        if (error == "Error: Request failed with status code 401") {
                            this
                                .context
                                .router
                                .push('/');
                        }
                        this.setState({ajaxCallInProgress: false});
                    $(".scoreImgSpinner").hide();
                    });

                if (_.toInteger(paramId) == 4) {
                    this
                        .props
                        .eventDetails(this.props.activeUser.token, this.props.myProfile.MyProfile.profile.id)
                        .then(() => {
                            this.setState({currentEventList: this.props.eventList.CurrentEvents});
                            if (screen.width > 600) {
                                this.getEvent(this.props.eventList.CurrentEvents[0].id);
                            }
                        })
                        .catch((error) => {});
                }

            })
            .catch((error) => {
                if (error == "Error: Request failed with status code 401") {
                    this
                        .context
                        .router
                        .push('/');
                }
                this.setState({ajaxCallInProgress: false});
            });

        /// To Get the events details if the myUpcoming events selected

    }

    componentDidMount() {
         $(".scoreImgSpinner").hide();
        $('.menu')
            .parent()
            .removeClass('active');
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.myProfile.MyProfileCourseList != nextProps.myProfile.MyProfileCourseList) {
            this.setState({profileCoursesList: nextProps.myProfile.MyProfileCourseList});
        }

        if (this.props.myProfile.MyPostsList != nextProps.myProfile.MyPostsList) {
            this.setState({postsList: nextProps.myProfile.MyPostsList});
        }

        if (this.props.myProfile.notes != nextProps.myProfile.notes) {
            this.setState({Notes: nextProps.myProfile.notes});
        }
        if (this.props.myProfile.getScores != nextProps.myProfile.getScores) {
            this.setState({getScores: nextProps.myProfile.getScores});
        }

        if (this.props.eventList.CurrentEvents != nextProps.eventList.CurrentEvents) {
            this.setState({currentEventList: nextProps.eventList.CurrentEvents});
        }

        if (this.props.myProfile.MyGroups != nextProps.myProfile.MyGroups) {
            this.setState({getGroupList: nextProps.myProfile.MyGroups});
        }

        if (this.props.myProfile.MyProfileCourseList != nextProps.myProfile.MyProfileCourseList && _.size(this.state.courseDetails) == 0 && _.size(nextProps.myProfile.MyProfileCourseList) > 0) {
            this.showCourseDetails(nextProps.myProfile.MyProfileCourseList[0].id);
        }

        if (this.props.selectedCourse != nextProps.selectedCourse) {
            this.setState({courseDetails: nextProps.selectedCourse});
        }

    }

    handleChange(date, dateType) {
        let _localState = this.state.upComingeventDetail;
        if (date == 'start_date') {
            _localState.start_date_format = dateType;
            this.setState({upComingeventDetail: _localState});
        } else {
            _localState.end_date_format = dateType;
            this.setState({upComingeventDetail: _localState});
        }
    }

    modifyParam(index) {
        this.setState({ajaxCallInProgress: true});
        this
            .context
            .router
            .push('/profile_' + index);
        paramId = index;
        if (index == 0) {
            this
                .props
                .getMyCourses(this.props.activeUser.token, this.state.profileDetails.profile.id)
                .then(() => {
                    this.setState({profileCoursesList: this.props.myProfile.MyProfileCourseList, ajaxCallInProgress: false});
                $(".scoreImgSpinner").hide();

                })
                .catch((error) => {
                    this.setState({ajaxCallInProgress: false});
                $(".scoreImgSpinner").hide();
                });

            if (_.size(this.state.courseDetails) == 0 && _.size(this.props.myProfile.MyProfileCourseList) > 0) {
                this.showCourseDetails(this.props.myProfile.MyProfileCourseList[0].id);
            }
        } else if (index == 1) {
            this
                .props
                .getMyPosts(this.props.activeUser.token, this.state.profileDetails.profile.id)
                .then(() => {
                    this.setState({postsList: this.props.myProfile.MyPostsList, ajaxCallInProgress: false});
                })
                .catch((error) => {
                    this.setState({ajaxCallInProgress: false});
                });
        } else if (index == 2) {
            this
                .props
                .profilegroupList(this.props.activeUser.token, this.state.profileDetails.profile.id)
                .then(() => {
                    this.setState({getGroupList: this.props.myProfile.MyGroups, ajaxCallInProgress: false});
                })
                .catch((error) => {
                    this.setState({ajaxCallInProgress: false});
                });
        } else if (index == 3) {
            this
                .props
                .getFriends(this.props.activeUser.token, this.state.profileDetails.profile.id)
                .then(() => {
                    this.setState({myFriendsList: this.props.myProfile.MyFriends, ajaxCallInProgress: false});
                })
                .catch((error) => {
                    this.setState({ajaxCallInProgress: false});
                });
        } else if (index == 4) {
            this
                .props
                .eventDetails(this.props.activeUser.token, this.state.profileDetails.profile.id)
                .then(() => {
                    this.setState({currentEventList: this.props.eventList.CurrentEvents, ajaxCallInProgress: false});
                    if (screen.width > 600) {
                        this.getEvent(this.props.eventList.CurrentEvents[0].id);
                    }
                })
                .catch((error) => {
                    this.setState({ajaxCallInProgress: false});
                });
        }
    }

    onFriendsSearch(e) {
        if (e.which == 13) {
            this
                .props
                .searchFriends(this.props.activeUser.token, e.target.value, "Self")
                .then(() => {
                    this.setState({myFriendsList: this.props.myProfile.MyFriends});
                    this
                        .context
                        .router
                        .push('/profile_3');
                })
                .catch((error) => {});
        }
    }

    onGroupsSearch(e) {

        if (e.which == 13) {
            this
                .props
                .searchGroups(this.props.activeUser.token, e.target.value, "Self")
                .then(() => {
                    this.setState({getGroupList: this.props.myProfile.MyGroups});
                    this
                        .context
                        .router
                        .push('/profile_2');
                })
                .catch((error) => {});
        }
    }

    onGroupClick(groupId) {
        this
            .context
            .router
            .push('/groupMembers_' + groupId);
    }

    getEvent(eventId) {
        this
            .props
            .getCurrentEvent(eventId, this.props.activeUser.token)
            .then(() => {
                this.setState({upComingeventDetail: this.props.selectedEvent});
            })
            .catch((error) => {});
    }

    onSaveClick(formData) {

        if (this.state.isCreateOrEdit == "Create") {
            this
                .props
                .createEvents(formData, this.props.activeUser.token)
                .then(() => {
                    this
                        .props
                        .eventDetails(this.props.activeUser.token, this.state.profileDetails.profile.id)
                        .then(() => {
                            this.setState({currentEventList: this.props.eventList.CurrentEvents, isCreateOrEdit: "Upcoming"});
                            this.getEvent(this.props.eventList.CurrentEvents[0].id);
                        })
                        .catch((error) => {});
                })
                .catch((error) => {});
        } else {
            this
                .props
                .editEvents(formData, this.state.upComingeventDetail.id, this.props.activeUser.token)
                .then(() => {
                    this
                        .props
                        .eventDetails(this.props.activeUser.token, this.state.profileDetails.profile.id)
                        .then(() => {
                            this.setState({currentEventList: this.props.eventList.CurrentEvents, isCreateOrEdit: "Upcoming"});
                            this.getEvent(this.props.eventList.CurrentEvents[0].id);
                        })
                        .catch((error) => {});
                })
                .catch((error) => {});
        }
    }

    onButtonClick(val) {
        this.setState({isCreateOrEdit: val});
        if (screen.width < 992) {
            $(".eventScroll").hide();
            $(".display").removeClass();

        }
    }

    onEventClick(eventsList, eventId) {
        this.getEvent(eventId);
        this.setState({isCreateOrEdit: "Upcoming"});
        this
            .context
            .router
            .push('/profile_4');
        if (screen.width < 992) {
            $(".eventScroll").hide();
            $(".display1").removeClass();

        }
    }

    onRequestInviteClick() {}
    getnewScores() {

        this
            .props
            .getNewScore(this.props.activeUser.token, this.props.selectedCourse.course.id)
            .then(() => {
                this.setState({getScores: this.props.myProfile.getScores, ajaxCallInProgress: false});
$(".scoreImgSpinner").hide();
            })
            .catch((error) => {
                this.setState({ajaxCallInProgress: false});
            });
    }
    showCourseDetails(id) {

        this
            .props
            .getCourseObject(id, this.props.activeUser.token)
            .then((id) => {
                this.setState({courseDetails: this.props.selectedCourse});
            $(".scoreImgSpinner").hide();
            })
            .catch((error) => {});
        this
            .props
            .getNewScore(this.props.activeUser.token, id)
            .then(() => {
                this.setState({getScores: this.props.myProfile.getScores, ajaxCallInProgress: false});
 $(".scoreImgSpinner").hide();
            })
            .catch((error) => {
                this.setState({ajaxCallInProgress: false});
             $(".scoreImgSpinner").hide();
            });
        if (screen.width < 992) {
            $(".leftsideimgs").hide();
            $(".rightsideimgs").show();
            ///  $(".detailsPart ").hide();
        }
    }
    errMsg(e) {
        if (e.target.value == "" || e.target.value < 18 || e.target.value > 200) {
            this.setState({errScore: (
                    <span className="color-red">Please enter score between 18-200
                    </span>
                )});
        } else {
            this.setState({errScore: ""});
        }
    }

    isValidRange(value) {
        if (value <= -40 || value <= 40) {
            return false;
        } else {
            return true;
        }
    }

    onNumberChnage(e) {
        e.preventDefault();
    }

    noAlpha(e) {
        if (e.target.name == "lastScore") {
            const re = /-?[0-9]+/g;
            if ((!re.test(e.key)) || (e.target.value.length >= 3)) {
                ///(e.target.value.length >= 3 /this.isValidRange(_.trim(e.target.value))
                e.preventDefault();
            }
        }
    }

    getFileExtension(name) {
        var found = name.lastIndexOf('.') + 1;
        return (parseInt(found) > 0
            ? name.substr(found)
            : "");
    }

    onImageUpload(scoreId) {
        /*$("#"+scoreId+"_scoreImgSpinner").show();
        $("#"+scoreId+"_scoreImageDiv").hide();*/
        let arrayOne = {};
        var that = this;
        var imagesArray = new FormData();
        $.each($('#file')[0].files, function (i, file) {
            imagesArray.append('images', file);
            
        });
        
       
        $("#"+scoreId+"_scoreImgSpinner").show();
        $("#"+scoreId+"_scoreImageDiv").hide();
        let fileExtention = this.getFileExtension(document.getElementById('file').files[0].name);
        
        if (isValidImage(fileExtention)) {

            $.ajax({
                url: SERVICE_URLS.URL_USED + 'api/profile/courses/' + that.state.courseDetails.course.id + '/gallery/' + scoreId,
                data: imagesArray,
                processData: false,
                contentType: false,
                type: 'POST',
                headers: {
                    'Authorization': 'Token ' + this.props.activeUser.token
                },
                success: function (data) {
                    document
                        .getElementById('file')
                        .value = null;
                    that.setState({selectedScoreId: null});
                    that.getnewScores();
                   $("#"+scoreId+"_scoreImgSpinner").hide();
        $("#"+scoreId+"_scoreImageDiv").show();
                },
                error: function () {
                    that.setState({selectedScoreId: null});
                     $("#"+scoreId+"_scoreImgSpinner").hide();
        $("#"+scoreId+"_scoreImageDiv").show();
                }
            });
        } else {

            toastr.error('Upload Valid Image');
             $("#"+scoreId+"_scoreImgSpinner").hide();
        $("#"+scoreId+"_scoreImageDiv").show();
        }
    
    }

    openImage(childItem, id) {
        let imageArray = _
            .find(this.props.myProfile.getScores, ['id', id])
            .images;
        let _selectedImage;

        if ((_.size(imageArray) > 0) && (_.some(imageArray, ['id', childItem]))) {
            _selectedImage = _.find(imageArray, ['id', childItem]);
            this.state.imageId = _selectedImage.id;
            this.setState({
                selectedImage: ("http://" + _selectedImage.src)
            });

            this.setState({slectedImagesList: imageArray});
        }
    }

    openViewAllDialog(id) {
        this.setState({tempScoreId: id});

        let imageArray = _
            .find(this.props.myProfile.getScores, ['id', id])
            .images;
        let _selectedImage;
        if ((_.size(imageArray) > 0)) {
            _selectedImage = imageArray[0];
            this.state.imageId = _selectedImage.id;
            this.setState({
                selectedImage: ("http://" + _selectedImage.src)
            });
            this.setState({slectedImagesList: imageArray});
        }
        $('#viewAllImages').modal('show');
    }

    openDialog(childitem, id) {
        this.setState({tempScoreId: id});
        let imageArray = _
            .find(this.props.myProfile.getScores, ['id', id])
            .images;
        let _selectedImage;
        if ((_.size(imageArray) > 0) && (_.some(imageArray, ['id', childitem]))) {
            _selectedImage = _.find(imageArray, ['id', childitem]);
            this.setState({
                selectedImage: ("http://" + _selectedImage.src)
            });
            this.setState({slectedImagesList: imageArray});
        }

        $('#selectImage').modal('show');
        this.setState({imageId: _selectedImage.id});
    }

    openUploadImageDialog(id) {
        this.setState({selectedScoreId: id});
        $('#ImageModal').modal('show');
    }
    closeImageModal() {
        this.refs.file.value = '';
        $('#ImageModal').modal('hide');
    }
    deletePost(id) {
        this
            .props
            .deletePost(id, this.props.activeUser.token)
            .then(() => {
                this
                    .props
                    .getMyPosts(this.props.activeUser.token, this.state.profileDetails.profile.id)
                    .then(() => {
                        this.setState({postsList: this.props.myProfile.MyPostsList, ajaxCallInProgress: false});
                    })
                    .catch((error) => {
                        this.setState({ajaxCallInProgress: false});
                    });
            })
            .catch((error) => {});
    }
    notesModal(id,notes) {
        this.setState({selectedScoreId: id});
        this.state.scoreNotes=notes;
        
        $('#notesModal').modal('show');
    }
    deleteComments(id, commentId) {
        this
            .props
            .deleteComment(id, commentId, this.props.activeUser.token)
            .then(() => {
                this
                    .props
                    .getMyPosts(this.props.activeUser.token, this.state.profileDetails.profile.id)
                    .then(() => {
                        this.setState({postsList: this.props.myProfile.MyPostsList, ajaxCallInProgress: false});
                    })
                    .catch((error) => {
                        this.setState({ajaxCallInProgress: false});
                    });
            })
            .catch((error) => {});
    }
    deleteScore(id) {
    $("#ScoredeleteModal").modal('hide');
        this
            .props
            .deleteScores(this.props.activeUser.token, this.props.selectedCourse.course.id, this.state.selectedScoreId)
            .then(() => {
                this.getnewScores();
             $("#"+id+"_scoreImgSpinner").hide();
        $("#"+id+"_scoreImageDiv").show();
                console.log("score", this.state.courseDetails.course_user_details);
            
        //  $("#ScoredeleteModal").modal('hide');
            })
            .catch((error) => {});

    }

    deleteScoreImg(scoreId) {
        $('#selectImageDeleteYes').prop('disabled', true);
        let id = this.state.imageId;
        this
            .props
            .deleteScoresImage(this.props.activeUser.token, this.props.selectedCourse.course.id, this.state.selectedScoreId, id)
            .then(() => {
                this.getnewScores();
                $("#ImagedeleteModal").modal('hide');
                $('#selectImage').modal('hide');
                $('#selectImageDeleteYes').prop('disabled', false);
            })
            .catch((error) => {});
    }

    closeModal() {
        $("#ImagedeleteModal").modal('hide');
    }
    vdeleteScoreImg(scoreId) {
        $('#viewAllDeleteYes').prop('disabled', true);
        let id = this.state.imageId;
        this
            .props
            .deleteScoresImage(this.props.activeUser.token, this.props.selectedCourse.course.id, this.state.tempScoreId, id)
            .then(() => {
                this.getnewScores();
                $("#vImagedeleteModal").modal('hide');
                $('#viewAllImages').modal('hide');
                $('#viewAllDeleteYes').prop('disabled', false);

            })
            .catch((error) => {});
    }

    vcloseModal() {
        $("#vImagedeleteModal").modal('hide');
    }

    closeScoreModal() {
        $("#ScoredeleteModal").modal('hide');
        this.setState({errScore: ""});
        document.getElementById('txtScoreInput').value='';
        document.getElementById('txtDate').value='';
    }
    openDeleteScoreDiaglog(scoreId) {
        this.state.selectedScoreId = scoreId;

    }
    gotoCourse() {
        this
            .context
            .router
            .push("/courses_" + this.state.courseDetails.course.id);
        location.reload();
    }
    onLikeClick(id) {

        this
            .props
            .likePost(this.props.activeUser.token, id)
            .then(() => {
                this
                    .props
                    .getMyPosts(this.props.activeUser.token, this.state.profileDetails.profile.id)
                    .then(() => {
                        this.setState({postsList: this.props.myProfile.MyPostsList, ajaxCallInProgress: false});
                    })
                    .catch((error) => {
                        this.setState({ajaxCallInProgress: false});
                    });
            })
            .catch((error) => {});
    }
    render() {
        return (
            <div className="bgccc">
                <div className="myProfile_Posts">
                    <div className="img-cntnt col-sm-12 zeroPad">
                        <div className="profileimg mb2pc">
                            <div className="cover-img col-sm-12 zeroPad">
                                <img src="/assets/img/ProfileImage.png" className="coverimg col-sm-12 zeroPad"></img>
                            </div>
                            <div className="img-feed col-sm-12">
                                <h3 className="col-sm-12">My Clubhouse</h3>
                            </div>
                        </div>
                    </div>

                    <div className="profileContent">
                        {((_.size(this.state.profileDetails) > 0) && isExistObj(this.state.profileDetails.profile))
                            ? (
                                <div className="detailsPart col-sm-12 zeroPad">
                                    <div className="namePart col-sm-12">
                                        <div className="col-sm-2 pdryt12px">

                                            <img
                                                src={'http://' + this.state.profileDetails.profile.profile_image_url}
                                                className="nameImg"/>
                                        </div>

                                        {isExistObj(this.state.profileDetails.profile) && (
                                            <div className="col-sm-3 pdng display-profile">
                                                <div className="personDetails pdng col-sm-12">
                                                    <div className="fntbld personName">{this.state.profileDetails.profile.first_name}</div>
                                                    <div className="personJoined">Joined:{this.state.profileDetails.profile.joined} 
                                                        ago</div>
                                                </div>
                                            </div>
                                        )}
                                        {isExistObj(this.state.profileDetails.skills) && (
                                            <div className="margtp display-profile pdng col-sm-3">
                                                <div className="col-sm-12 pdng">
                                                    <div className="pdng fntbld col-sm-6">Skill Level</div>
                                                    <div className="pdng fntlyt col-sm-6">{this.state.profileDetails.skills.skill_level}</div>
                                                </div>
                                                <div className="col-sm-12 pdng">
                                                    <div className="pdng fntbld col-sm-6">Type of Golfer</div>
                                                    <div className="pdng fntlyt col-sm-6">{this.state.profileDetails.skills.golfer_type}</div>
                                                </div>
                                            </div>
                                        )}
                                        <div className="margtp display-profile pdng col-sm-3">
                                            <div className="col-sm-12 pdng">
                                                <div className="pdng fntbld col-sm-6">Profile Type</div>
                                                {isExistObj(this.state.profileDetails.profile) && <div className="pdng fntlyt col-sm-6">{this.state.profileDetails.profile.is_private
                                                        ? 'Private'
                                                        : 'Public'}</div>}
                                            </div>
                                            <div className="col-sm-12 pdng">
                                                <div className="pdng fntbld col-sm-6">Handicap</div>
                                                {isExistObj(this.state.profileDetails.skills) && <div className="pdng fntlyt col-sm-6">{(this.state.profileDetails.skills.handicap == 0)
                                                        ? 0
                                                        : this.state.profileDetails.skills.handicap}</div>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                            : (
                                <div>
                                    <label></label>
                                </div>
                            )}

                        <div className="tabsForEvents col-sm-12 zeroPad bgwhite">
                            <Tabs selectedIndex={_.toInteger(paramId)}>
                                <TabList className="EventsTabHeader">
                                    <Tab
                                        onClick={this
                                        .modifyParam
                                        .bind(this, 0)}>Courses</Tab>
                                    <Tab
                                        onClick={this
                                        .modifyParam
                                        .bind(this, 1)}>Posts</Tab>
                                    <Tab
                                        onClick={this
                                        .modifyParam
                                        .bind(this, 2)}>Groups</Tab>
                                    <Tab
                                        onClick={this
                                        .modifyParam
                                        .bind(this, 3)}>Friends</Tab>
                                    <Tab
                                        onClick={this
                                        .modifyParam
                                        .bind(this, 4)}>Events</Tab>
                                </TabList>
                                <TabPanel>
                                    {(this.state.ajaxCallInProgress)
                                        ? (
                                            <div className="col-sm-12 bgwhite"><Spinner/></div>
                                        )
                                        : ((_.size(this.state.profileCoursesList) > 0)
                                            ? (
                                                <div className="images visitedDetails col-sm-12">
                                                    <div className="leftsideimgs col-sm-12 col-md-3 profilescroll">
                                                        {this
                                                            .state
                                                            .profileCoursesList
                                                            .map((item, i) => {
                                                                return (
                                                                    <ul key={i}>
                                                                        <li
                                                                            className={isExistObj(this.props.selectedCourse) && isExistObj(this.props.selectedCourse.course) && this.props.selectedCourse.course.id == item.id
                                                                            ? "course_selected"
                                                                            : "leftimg1"}
                                                                            onClick={this
                                                                            .showCourseDetails
                                                                            .bind(this, item.id)}>
                                                                            <div className="nameoverimg">
                                                                                {item.is_premium
                                                                                    ? <img src={"http://" + item.cover_image} className="img1"></img>
                                                                                    : <img src="/assets/img/nonPremBanner.jpg" className="img1"></img>}
                                                                                <div className="following">
                                                                                    <span className="OrangeDot">
                                                                                        <img src="/assets/img/icons/eclipse.png"/></span>Following</div>
                                                                                <center>
                                                                                    <span className="center">{item.name}</span>
                                                                                </center>
                                                                            </div>
                                                                            <p className="left col-sm-6">{item.city},{item.state}</p>
                                                                            <p className="ryt col-sm-6">{item.following_since}</p>
                                                                        </li>
                                                                    </ul>
                                                                )
                                                            })}
                                                    </div>

                                                    {(isExistObj(this.state.courseDetails) && isExistObj(this.state.courseDetails.course_user_details) && isExistObj(this.props.myProfile) && _.size(this.props.myProfile.MyProfileCourseList) > 0)
                                                        ? (
                                                            <div className="rightsideimgs display1 col-md-9">
                                                                <div className="rytsideimg1">
                                                                    <div className="nameoverimg">
                                                                        {isExistObj(this.state.courseDetails.course) && this.state.courseDetails.course.is_premium
                                                                            ? <img
                                                                                    src={"http://" + this.props.selectedCourse.course.cover_image}
                                                                                    className="img4"></img>
                                                                            : <img src="/assets/img/nonPremBanner.jpg" className="img4"></img>}

                                                                        {(this.state.courseDetails.course_user_details.is_following)
                                                                            ? (
                                                                                <div className="following">
                                                                                    <span className="OrangeDot">
                                                                                        <img src="/assets/img/icons/eclipse.png"/></span>Following</div>
                                                                            )
                                                                            : (
                                                                                <div></div>
                                                                            )}
                                                                        {_.size(this.props.myProfile.getScores) > 0
                                                                            ? (
                                                                                <div className="top-ryt">
                                                                                    <span className="topryt">Played</span>
                                                                                </div>
                                                                            )
                                                                            : (
                                                                                <div></div>
                                                                            )}
                                                                        {isExistObj(this.state.courseDetails.course) && <div className="cursor-pointer">
                                                                            <center>
                                                                                <span
                                                                                    className="center"
                                                                                    onClick={this
                                                                                    .gotoCourse
                                                                                    .bind(this)}>{this.state.courseDetails.course.name}</span>
                                                                            </center>
                                                                        </div>}
                                                                        <button data-toggle="modal" data-target="#myModal1" className="btnScore"><img src="/assets/img/Add Score@3x.png" className="addScoreImg"/></button>
                                                                    </div>
                                                                    <div className="scores col-sm-12">
                                                                        {/*<div className="score1 col-sm-6">
                            <ul className="scre"><li className="name">My Best Score</li>
                                <li className="date">{this.state.courseDetails.course_user_details.top_score_date}</li>
                            </ul>
                                <p className="score">{this.state.courseDetails.course_user_details.top_score}</p>
                        </div>*/}
                                                                        {/*<div className="score2 col-sm-6 cursor-pointer" >
                            <ul className="scre"><li className="name">My Last Score</li>
                                <li className="date">{this.state.courseDetails.course_user_details.latest_score_date}</li></ul>
                            <p className="score">{this.state.courseDetails.course_user_details.latest_score!=null?this.state.courseDetails.course_user_details.latest_score:'Click to add new score'}</p>
                            <span>{this.state.courseDetails.course_user_details.latest_score!=null?'Click to add new score':''}</span>
                        </div>*/}
                            <form id="AddScore">
                                <div className="modal fade" id="myModal1" role="dialog"  data-backdrop="static">
                                    <div className="modal-dialog tp13pc">
                                        <div className="modal-content brdrRad0px ">
                                            <div className="modal-header modalHder">
                                            <button type="button" className="close" onClick={this.closeScoreModal.bind(this)} data-dismiss="modal">&times;</button>
                                            <h4 className="modal-title">Add Score</h4>
                                        </div>
                                        <div className="modal-body">
                                    <div className="form-group">
                                        <label>Last Score:</label>
                                        <input
                                            type="text"
                                            className="form-control addScore"
                                            id="txtScoreInput"
                                            name="lastScore"
                                            ref="lastScore"
                                            onKeyPress={this
                                            .noAlpha
                                            .bind(this)}
                                            onBlur={this
                                            .errMsg
                                            .bind(this)}/> {this.state.errScore}
                                        <br/>
                                        <label>Date:</label>
                                        {/* <input type="date" className="form-control" id="txtDate" ref="scoreDate" />*/}
                                    <DatePicker
                                        id="txtDate"
                                        className="form-control"
                                        ref="scoreDate"
                                        name="scoreDate"
                                        selected={moment(this.state.upComingeventDetail.end_date_format)}
                                        onChange={this
                                        .handleChange
                                        .bind(this, 'end_date')}
                                        maxDate={moment()}
                                                placeholderText="mm/dd/yyyy" onKeyPress={this.noAlpha.bind(this)}/>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button
                                            type="button"
                                            id="saveScore"
                                        className="scoreSave-butn"
                                        onClick={this
                                        .addNewScores
                                        .bind(this)}>Save</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

        </div>

                        {isExistObj(this.props.myProfile) && isExistObj(this.props.myProfile.getScores)
                          ? this
                            .props
                            .myProfile
                            .getScores
                            .map((item, index) => {
                              return (
                                <div className="col-sm-12 mb2pc" key={index}>
                                  <div className="col-sm-12 zeroPad">
                                    <span className="col-sm-6 txtLft zeroPad">{item.played_on}</span>
                                    <span className="col-sm-6 txtRyt zeroPad">score:{item.score}</span>
                                  </div>
                                  <div className="notes mt1pc mb1pc">
                                    {isExistObj(this.props.activeUser) && item.user.id == this.props.activeUser.id
                                      ? <span
                                          className="glyphicon glyphicon-trash trashBlack"
                                          onClick={this
                                          .openDeleteScoreDiaglog
                                          .bind(this, item.id)}
                                          data-target="#ScoredeleteModal"
                                          data-toggle="modal"
                                          data-backdrop="static"></span>
                                      : ''}
                                    <div className="modal fade" id="ScoredeleteModal" role="dialog">
                                      <div className="modal-dialog modal-sm">
                                        <div className="modal-content">
                                          <div className="modal-header modalHder">
                                            <h4>Delete Score</h4>
                                          </div>
                                                  <div className="modal-body">
                                                    <p>Are you sure you want to delete this score?</p>
                                                  </div>
                                                  <div className="modal-footer">
                                                    {/*<button type="button" className="checkng" onClick={this.closeScoreModal.bind(this)}>No</button>*/}
                                                    {/*<button type="button" className="checkng" onClick={this.deleteScore.bind(this, item.id)}>Yes</button>*/}
                                                    <input
                                                      type="button"
                                                      className="checkng"
                                                      onClick={this
                                                      .closeScoreModal
                                                      .bind(this)}
                                                      value="No"/>
                                                    <input
                                                      type="button"
                                                      id="deleteScore"
                                                      className="checkng"
                                                      onClick={this
                                                      .deleteScore
                                                      .bind(this, item.id)}
                                                      value="Yes"/>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>

                                            <p>Notes<span
                                              className="glyphicon glyphicon-pencil"
                                              onClick={this
                                          .notesModal
                                          .bind(this, item.id,item.notes)}></span>
                                            </p>
                                            <p
                                              dangerouslySetInnerHTML={{
                                              __html: item.notes
                                            }}
                                              className="xx word-break"
                                              maxLength="250"></p>
                                          </div>
                                          <div>
                                            <div className="col-sm-12 zeroPad">
                                              {/*<input type="button" className="uploadVisitImage" value="Upload Image" onClick={this.openUploadImageDialog.bind(this, item.id)}/>*/}

                                              <div id="ImageModal" className="modal fade" role="dialog">
                                                <div className="modal-dialog">
                                                  <div className="modal-content">
                                                    <div className="modal-header modalHder">
                                                      <button type="button" className="close" data-dismiss="modal">&times;</button>
                                                      <h4 className="modal-title">Choose your images</h4>
                                                    </div>
                                                    <div className="modal-body">
                                                      <form
                                                        id="imageUploadForm"
                                                        name="imageUploadForm"
                                                        ref="imageUploadForm"
                                                        encType="multipart/form-data">
                                                        <input
                                                          ref="file"
                                                          id="file"
                                                          type="file"
                                                          name="file"
                                                          className="uploadVisitImage"
                                                          multiple
                                                          accept="image/*"/>
                                                      </form>
                                                    </div>
                                                    <div className="modal-footer">
                                                      <button
                                                        onClick={this
                                                        .onImageUpload
                                                        .bind(this, this.state.selectedScoreId)}
                                                        type="button"
                                                        className="upld_butns"
                                                        data-dismiss="modal">Upload</button>
                                                      <button
                                                        type="button"
                                                        className="upld_butns"
                                                        onClick={this
                                                        .closeImageModal
                                                        .bind(this)}>Close</button>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>

                                              <div className="col-sm-12 txtRyt zeroPad cursor-pointer">
                                                {(_.size(item.images) > 0)
                                                  ? (
                                                    <span
                                                      className="curPntr"
                                                      onClick={this
                                                      .openViewAllDialog
                                                      .bind(this, item.id)}>View All &gt;</span>
                                                  )
                                                  : (
                                                    <span></span>
                                                  )}
                                              </div>
                                            </div>
                                            <div
                                              className="modal fade"
                                              id="viewAllImages"
                                              role="dialog"
                                              data-backdrop="static">
                                              <div className="modal-dialog tp13pc">
                                                <div className="modal-content brdrRad0px">
                                                  <div className="modal-header">

                                                    <button className="close color-black " data-dismiss="modal">Close</button>
                                                  </div>
                                                  <div className="modal-body">
                                                    <div className="round_close">

                                                      <div className="opened_Image txtcenter">
                                                        <span className="thumbnail m0px galleryImg">
                                                          <img
                                                            src={this.state.selectedImage}
                                                            alt="selectedImage"
                                                            className="sliderImges"/>
                                                          <div className="edit">
                                                            <span
                                                              className="cursor-pointer"
                                                              data-toggle="modal"
                                                              data-target="#vImagedeleteModal">
                                                              <i className="glyphicon glyphicon-remove left-80px "></i>
                                                            </span>
                                                          </div>
                                                          <div
                                                            className="modal fade"
                                                            id="vImagedeleteModal"
                                                            role="dialog"
                                                            data-backdrop="static">
                                                            <div className="modal-dialog modal-sm">
                                                              <div className="modal-content">
                                                                <div className="modal-header modalHder">
                                                                    <button type="button" className="close" onClick={this.vcloseModal.bind(this)}>&times;</button>
                                                                  <h4>Delete Selected Image</h4>
                                                                </div>
                                                                <div className="modal-body">
                                                                  <p>Are you sure you want to delete this photo?</p>
                                                                </div>
                                                                <div className="modal-footer">
                                                                  <button
                                                                    type="button"
                                                                    className="checkng"
                                                                    onClick={this
                                                                    .vcloseModal
                                                                    .bind(this)}>No</button>
                                                                  <input
                                                                    id="viewAllDeleteYes"
                                                                    type="button"
                                                                    className="checkng"
                                                                    onClick={this
                                                                    .vdeleteScoreImg
                                                                    .bind(this, this.state.tempScoreId)}
                                                                    value="Yes"/>
                                                                </div>
                                                              </div>
                                                            </div>
                                                          </div>
                                                        </span>
                                                      </div>
                                                    </div>
                                                  </div>
                                                  <div className="modal-footer">
                                                    <div id="content" className="modalinlineAlign col-sm-12">

                                                      {(_.size(this.state.slectedImagesList) > 0 && this.state.slectedImagesList.map((childItem, index) => {
                                                        return (<img
                                                          src={"http://" + childItem.thumbnail}
                                                          alt={"http://" + childItem.src}
                                                          className="modalinlnImgs"
                                                          onClick={this
                                                          .openImage
                                                          .bind(this, childItem.id, this.state.tempScoreId)}/>)
                                                      }))}
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                                    <div id={item.id+"_scoreImgSpinner"} className="scoreImgSpinner"><Spinner /></div>
                                            <div id={item.id+"_scoreImageDiv"} className="inlineAlign col-sm-12 scoreImageDiv">
                                              <img
                                                src="assets/img/Add Photo@3x.png"
                                                className="inlnImgs"
                                                onClick={this
                                                .openUploadImageDialog
                                                .bind(this, item.id)}/> {(isExistObj(item) && isExistObj(item.images) && _.size(item.images) > 0 && item.images.map((childItem, index) => {
                                                return (<img
                                                  src={"http://" + childItem.thumbnail}
                                                  alt="upload_one"
                                                  className="inlnImgs"
                                                  onClick={this
                                                  .openDialog
                                                  .bind(this, childItem.id, item.id)}/>)
                                              }))}
                                            </div>
                                          </div>
                                          <div
                                            className="modal fade"
                                            id="selectImage"
                                            role="dialog"
                                            data-backdrop="static">
                                            <div className="modal-dialog tp13pc">
                                              <div className="modal-content brdrRad0px">
                                                <div className="modal-body">
                                                  <div className="modal-header">

                                                    <button className="close color-black " data-dismiss="modal">Close</button>
                                                  </div>
                                                  <div className="round_close">

                                                    <div className="opened_Image txtcenter">
                                                      <span className="thumbnail m0px galleryImg">
                                                        <img
                                                          src={this.state.selectedImage}
                                                          alt="selectedImage"
                                                          className="sliderImges"/>
                                                        <div className="edit">
                                                          <span
                                                            className="cursor-pointer"
                                                            data-toggle="modal"
                                                            data-target="#ImagedeleteModal">
                                                            <i className="glyphicon glyphicon-remove left-80px top56px"></i>
                                                          </span>
                                                        </div>

                                                        <div
                                                          className="modal fade"
                                                          id="ImagedeleteModal"
                                                          role="dialog"
                                                          data-backdrop="static">
                                                          <div className="modal-dialog modal-sm">
                                                            <div className="modal-content">
                                                              <div className="modal-header modalHder">
                                                                  <button type="button" className="close" onClick={this.closeModal.bind(this)}>&times;</button>
                                                                <h4>Delete Selected Image</h4>
                                                              </div>
                                                              <div className="modal-body">
                                                                <p>Are you sure you want to delete this photo?</p>
                                                              </div>
                                                              <div className="modal-footer">
                                                                <button
                                                                  type="button"
                                                                  className="checkng"
                                                                  onClick={this
                                                                  .closeModal
                                                                  .bind(this)}>No</button>
                                                                <button
                                                                  id="selectImageDeleteYes"
                                                                  type="button"
                                                                  className="checkng"
                                                                  onClick={this
                                                                  .deleteScoreImg
                                                                  .bind(this, this.state.tempScoreId)}>Yes</button>
                                                              </div>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </span>
                                                    </div>
                                                  </div>
                                                </div>
                                                <div className="modal-footer">
                                                  <div id="content" className="modalinlineAlign col-sm-12">
                                                    {(_.size(this.state.slectedImagesList) > 0 && this.state.slectedImagesList.map((childItem, index) => {
                                                      return (<img
                                                        src={"http://" + childItem.thumbnail}
                                                        alt={"http://" + childItem.src}
                                                        className="modalinlnImgs"
                                                        onClick={this
                                                        .openImage
                                                        .bind(this, childItem.id, this.state.tempScoreId)}/>)
                                                    }))}
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>

                                          <div className="modal fade" id="notesModal" role="dialog">
                                            <div className="modal-dialog modal-sm">

                      <div className="modal-content">
                        <div className="modal-header modalHder">
                          <button type="button" className="close" data-dismiss="modal">&times;</button>
                          <h4 className="modal-title">Edit Notes</h4>
                        </div>
                        <div className="modal-body">

                    <p className="wd100pc hgt130px" maxLength="250" id="txtnotes" contentEditable={true}             onChange={this.onFieldChange}  dangerouslySetInnerHTML={{__html: this.state.scoreNotes?this.state.scoreNotes:''
                          }}></p>
                        </div>
                        <div className="modal-footer">
                          <button
                            type="button"
                            className="submitButton"
                            onClick={this
                            .onSaveNotes
                            .bind(this, this.state.selectedScoreId)}>Submit</button>
                        </div>
                      </div>

                                            </div>
                                          </div>
                                        </div>
                                      )
                                    })
                                  : <label></label>}

                              </div>
                            )
                            : (
                              <div></div>
                            )}
                        </div>
                      )
                      : (
                        <div>
                          <label></label>
                        </div>
                      ))}
                </TabPanel>
                <TabPanel>
                  {(this.state.ajaxCallInProgress)
                    ? (
                      <div className="col-sm-12 bgwhite "><Spinner/></div>
                    )
                    : (
                      <div className="col-sm-12 bgwhite hAuto">
                        <div className=" col-sm-12 nopad">
                          <h3 className='text-display'>Post</h3>
                          <div className="pdright">
                            {_.size(this.state.postsList) > 0 && isExistObj(this.state.profileDetails) && isExistObj(this.state.profileDetails.profile) && _.size(this.state.postsList) > 0
                              ? this
                                .state
                                .postsList
                                .map((item, i) => {
                                  return (
                                    <div key={i}>
                                      <div className="post1 col-sm-12">
                                        <div className="subpost col-sm-12">
                                          <img
                                            src={'http://' + this.state.profileDetails.profile.profile_image_url}
                                            className="post-img"></img>
                                          <div className="post-name">
                                            <h3 className="fntbld ">{this.props.activeUser.name}</h3>
                                            {/*<h4>{item.created}</h4>*/}
                                            {item.object_name != null
                                              ? item.object_type == "Group"
                                                ? <b>Posted on  {item.object_type}  
                                                     <Link to={"groupMembers_" + item.object_id}>
                                                      <span className="txtUnderline">
                                                        {item.object_name}
                                                      </span>
                                                    </Link> 
                                                    on {item.created}
                                                  </b>
                                                : item.object_type == "Course"
                                                  ? <b>Posted on {item.object_type} 
                                                      <Link to={"forumCourse_" + item.object_id}>
                                                        <span className="txtUnderline">
                                                          {item.object_name}
                                                        </span>
                                                      </Link>
                                                      on {item.created}
                                                    </b>
                                                  : <b>Posted on {item.object_type} 
                                                      <Link to={"/events_" + item.object_id}>
                                                        <span className="txtUnderline">
                                                          {item.object_name}
                                                        </span>
                                                      </Link>
                                                      on {item.created}</b>
                                              : ''}
                                            <p>{item.created_since}</p>
                                          </div>
                                        </div>
                                        <div className="subpost-cntnt col-sm-12">
                                          {isExistObj(this.props.activeUser) && this.props.activeUser.id == item.author.id
                                            ? <span
                                                className="glyphicon glyphicon-trash fr cursor-pointer mt1pc"
                                                data-toggle="modal"
                                                data-target="#modalFileDlt"></span>
                                            : ''}
                                          <div
                                            className="modal fade"
                                            id="modalFileDlt"
                                            role="dialog"
                                            data-backdrop="static">
                                            <div className="modal-dialog">
                                              <div className="modal-content modalMargin">
                                                  <div className=" modal-header modalHder"><h4>Delete Post</h4></div>
                                                <div className="modal-body">Are you sure you want to delete?</div>
                                                <div className="modal-footer">
                                                  <button
                                                    type="button"
                                                    className="cnfrmbtn checkng"
                                                    data-dismiss="modal"
                                                    onClick={this
                                                    .deletePost
                                                    .bind(this, item.id)}>Yes</button>
                                                  <button type="button" className="cancelbtn checkng" data-dismiss="modal">No</button>
                                                </div>
                                              </div>
                                            </div>
                                          </div>

                                          <span>{item.title}</span>
                                          <br/>

                                        </div>
                                        {isExistObj(item) && isExistObj(item.comments) && _.size(item.comments) > 0 && item
                                          .comments
                                          .map((childItem, i) => {
                                            return (
                                              <div key={i}>
                                                <div className="cmnt col-sm-12 txtRyt">
                                                  {/* <span className="like"><img src="/assets/img/icons/like.png"/>Like</span>*/}
                                                  <span className="glyphicon glyphicon-heart fr LikePost">
                                                    <span
                                                      className={(item.has_like)
                                                      ? "like color-green cursor-pointer ml10px"
                                                      : "like cursor-pointer ml10px"}
                                                      onClick={this
                                                      .onLikeClick
                                                      .bind(this, item.id)}>Like</span>
                                                  </span>
                                                  {/*<span className="comment"><img src="/assets/img/icons/comment.png"/>Comment</span>*/}
                                                </div>
                                                <div className="Rosie-rply col-sm-12">
                                                  <div className="col-sm-1">
                                                    <img src={"http://" + childItem.author.profile_image_url} className="Rosie-img"></img>
                                                  </div>
                                                  <div className="Rosie-name col-sm-11">
                                                    <div className="col-sm-12">
                                                      {isExistObj(this.props.activeUser) && this.props.activeUser.id == childItem.author.id
                                                        ? <span
                                                            className="glyphicon glyphicon-trash fr cursor-pointer mt1pc"
                                                            onClick={this
                                                            .deleteComments
                                                            .bind(this, item.id, childItem.id)}></span>
                                                        : ''}
                                                      <h3 className="col-sm-2 m0px">{childItem.author.first_name} </h3>
                                                      <p className="col-sm-9">{childItem.body}</p>
                                                    </div>
                                                    <div className="col-sm-12">
                                                      <h4 className="col-sm-12">{childItem.created}</h4>
                                                    </div>
                                                  </div>

                                                </div>
                                              </div>
                                            )
                                          })}

                                      </div>

                                    </div>
                                  )
                                })
                              : <div>
                                <label>No posts yet</label>
                              </div>}
                          </div>
                        </div>
                      </div>
                    )}
                </TabPanel>
                <TabPanel>
                  {(this.state.ajaxCallInProgress)
                    ? (
                      <div className="col-sm-12 bgwhite"><Spinner/></div>
                    )
                    : (
                      <div className="profilegrpDetails col-sm-12">

                        <div className="row m0px heightAndScrollForGroup">

                          <div className="search-icon col-sm-12 text-display">
                            <span className="postrelative left3pc"><img src="/assets/img/icons/Search_Icon.png"/></span>
                            <input
                              onKeyPress={this
                              .onGroupsSearch
                              .bind(this)}
                              type="text"
                              placeholder="Search for a group"
                              className="profGroupSearch"></input>
                          </div>
                          {(_.size(this.state.getGroupList) > 0)
                            ? (
                              <div className="row">
                                <div>
                                  <div className="row">
                                    <div className="col-md-12 wd98pc ml4pc">
                                                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                        <React_Boostrap_Carousel
                                          className="carousel-fade"
                                          indicators={(_.size(this.state.getGroupList) > 0 && _.size(this.state.getGroupList[0]) >= 7)
                                          ? true
                                          : false}>
                                          {_.size(this.state.getGroupList) > 0 && this
                                            .state
                                            .getGroupList
                                            .map((parent, index) => {
                                              return (
                                                <div className="col-sm-12 col-xs-12 pdpcgroups" key={index}>
                                                                                                    <div className="img-group col-xs-4 col-md-3 col-lg-3">{(index == 0)
                                                      ? (
                                                        <Link to="/addgroup">
                                                          <div className="col-sm-12 txtcenter">
                                                            <img src={"/assets/img/plus_icon-01.png"} alt="" className="panelimg bgccc"/>
                                                          </div>
                                                          <div className="col-sm-12 txtcenter">
                                                            <span className=" txtcenter">Add Group</span>
                                                          </div>
                                                        </Link>
                                                      )
                                                      : ('')}</div>
                                                  {isExistObj(parent) && _.size(parent) > 0 && parent.map((groupListDetails, childIndex) => {
                                                    return (
                                                      <div key={childIndex}>
                                                        <div
                                                          onClick={this
                                                          .onGroupClick
                                                          .bind(this, groupListDetails.id)}>
                                                          <div className="col-md-3 col-xs-4 col-sm-4  cursor-pointer">
                                                            <div className="col-sm-12 txtcenter">
                                                              <img src={'http://' + groupListDetails.cover_image} className="panelimg"/>
                                                            </div>
                                                            <div className="col-sm-12 txtcenter">
                                                              <span className=" txtcenter ">{_.truncate(_.trim(groupListDetails.name), {
                                                                  'length': 24,
                                                                  'separator': ' '
                                                                })}</span>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    );
                                                  })}</div>
                                              )
                                            })}

                                        </React_Boostrap_Carousel>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                            : (
                              <Link to="/addgroup" className="col-md-3">
                                <div className="col-sm-12">
                                  <img src={"/assets/img/plus_icon-01.png"} alt="" className="panelimg bgccc"/></div>
                                <span className="col-sm-12 pdlft7pc ">Add Group</span>
                              </Link>
                            )}

                        </div>
                      </div>
                    )}
                </TabPanel>
                <TabPanel>
                  {(this.state.ajaxCallInProgress)
                    ? (
                      <div className="col-sm-12 bgwhite"><Spinner/></div>
                    )
                    : (
                      <div className="profilefrndDetails col-sm-12">
                        <div className="search-icon col-sm-12">
                          <span className="posrelative left3pc"><img src="/assets/img/icons/Search_Icon.png"/></span>
                          <input
                            onKeyPress={this
                            .onFriendsSearch
                            .bind(this)}
                            type="text"
                            placeholder="Search for a friend"
                            className="profFrndSearch"></input>
                        </div>
                        <div className="friendlist col-sm-12">
                          <div className="col-sm-12">
                            {_.size(this.state.myFriendsList) > 0
                              ? (
                                <div>
                                  {this
                                    .state
                                    .myFriendsList
                                    .map((item, i) => {
                                      return <Link to={'/profileDetail_' + item.id}>
                                        <div key={i} className="col-sm-6">
                                          <span className="frndlist1"><img src={'http://' + item.profile_image_url}/>
                                            <div className="frnd-name">
                                              <h3>{item.first_name}</h3>
                                              <p>{item.email}</p>
                                              <p>
                                                <label>Joined: {item.joined} 
                                                  ago</label>
                                              </p>
                                            </div>
                                          </span>
                                        </div>
                                      </Link>
                                    })}</div>
                              )
                              : (
                                <div>
                                  <label>No Friends Found</label>
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    )}
                </TabPanel>
                <TabPanel>
                  {(this.state.ajaxCallInProgress)
                    ? (
                      <div className="col-sm-12 bgwhite"><Spinner/></div>
                    )
                    : (
                      <div className="col-sm-12 bgwhite pdtop">
                        <div className="col-sm-3 eventScroll">
                          <button
                            onClick={this
                            .onButtonClick
                            .bind(this, "Create")}
                            className="btnEvent">+ Create Event</button>
                          {_.size(this.state.currentEventList) > 0 && this
                            .state
                            .currentEventList
                            .map((eventDetail, index) => {
                              return (
                                <div key={index}><EventListDetail
                                  eventsList={this.state.currentEventList}
                                  eventDetail={eventDetail}
                                  onEventClick={this
                                  .onEventClick
                                  .bind(this)}/></div>
                              );
                            })}
                        </div>
                        {(this.state.isCreateOrEdit == "Create" || this.state.isCreateOrEdit == "Edit")
                          ? (<CreateEvent
                            onSaveClick={this
                            .onSaveClick
                            .bind(this)}
                            isCreateOrEdit={this.state.isCreateOrEdit}
                            upComingeventDetail={this.state.upComingeventDetail}/>)
                          : ((this.state.upComingeventDetail != undefined && _.size(this.state.upComingeventDetail) > 0)
                            ? (<UpcomingEventDetails
                              onButtonClick={this
                              .onButtonClick
                              .bind(this)}
                              onRequestInviteClick={this
                              .onRequestInviteClick
                              .bind(this)}
                              upComingeventDetail={this.state.upComingeventDetail}
                              activeUser={this.props.activeUser}
                              isFromAllEvents={false}
                              isPastEvent={false}/>)
                            : (
                              <div></div>
                            ))}
                      </div>
                    )}
                </TabPanel>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    );

  }
}
MyProfile.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state) {
  return {
    activeUser: (state.activeUser != null)
      ? (state.activeUser)
      : (JSON.parse(sessionStorage.getItem('userDetails'))),
    eventList: (state.eventReducer != undefined && state.eventReducer != null)
      ? state.eventReducer
      : [],
    myProfile: (state.myProfile != undefined && state.myProfile != null)
      ? state.myProfile
      : [],
    selectedCourse: state.selectedCourse,
    selectedEvent: state.selectedEvent,
    selectedGroup: state.selectedGroup
  };
}
function matchDispatchToProps(dispatch) {
  return bindActionCreators({
    eventDetails,
    getMyCourses,
    getMyPosts,
    getCourseObject,
    createEvents,
    getCurrentEvent,
    userProfileDetails,
    getFriends,
    searchFriends,
    searchGroups,
    editEvents,
    editCourseNotes,
    addNewScore,
    profilegroupList,
    getNewScore,
    deletePost,
    deleteComment,
    deleteScores,
    deleteScoresImage,
    likePost
  }, dispatch);
}
export default connect(mapStateToProps, matchDispatchToProps)(MyProfile);
