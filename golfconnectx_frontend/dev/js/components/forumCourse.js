import React from 'react';
import { Link } from 'react-router';
import{IMG_CONSTANT} from '../constants/application.constants';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'lodash';
import {getcourseList, getconversation, addComment, addNewPost, searchPosts} from '../actions/forumAction';
import {searchCourses, getCourseObject} from '../actions/courseListAction';
import Spinner from 'react-spinner';
import {deletePost, deleteComment} from '../actions/eventDetailsAction';
import {isExistObj} from '../utils/functions';
let next=null;
let paramId=0;
let imagePath=IMG_CONSTANT.IMAGE_PATH;
class ForumsCourse extends React.Component{
  constructor(props) {
    super(props);
   this.state={ getCourseslist:Object.assign([],props.forumCourse), courseDetails:{},
           forumCourseDetails:Object.assign([],props.forumCourse),postMsg : "",replyMsg:"",catErr:"",
           ajaxCallInProgress:false,
           pageNumber:1,
           lastScrollPos:0,
           prevSearchCriteria: "",
           firstTimeLoad:true,
               cId:''
          };
          this.handleScroll = this.handleScroll.bind(this);
    }

deletePost(id){
      this.props.deletePost(id, this.props.activeUser.token).then(()=>{
   this.props.getconversation(this.props.selectedCourse.course.id, this.props.activeUser.token ).then(()=>{

          this.setState({forumCourseDetails:this.props.forumCourse.Conversation});
        }).catch((error)=>{

        });
  }).catch((error)=>{

  });
    }
     deleteComments(id){
         let commentId=this.state.cId;
      this.props.deleteComment(id, commentId, this.props.activeUser.token).then(()=>{
    this.props.getconversation(this.props.selectedCourse.course.id, this.props.activeUser.token ).then(()=>{

          this.setState({forumCourseDetails:this.props.forumCourse.Conversation});
        }).catch((error)=>{

        });
  }).catch((error)=>{

  });
    }
    delModal(id){
        this.setState({cId:id});
        $("#"+id+"_commentsDelModal").modal('show');
    }
        
    getCourseListData(pageNumber=0){
        this.setState({ajaxCallInProgress:true});
    if(next!=null){
              let keyword =(document.getElementById('keyword')!=undefined && document.getElementById('keyword')!=null)?(_.trim(document.getElementById('keyword').value)):('');
                this.props.getcourseList(this.props.activeUser.token, pageNumber, keyword).then((data)=>{
                  next = data;
                  ///this.setState({getCourseslist:this.props.getCourseList});
                  this.setState({Courseslist:this.props.forumCourse.Courses});
                  this.setState({ajaxCallInProgress:false});
                }).catch((error)=>{
                if(error == "Error: Request failed with status code 401"){
                      this.context.router.push('/');
                }
          });
      }
     else if($("#keyword").val()!=""){
        this.props.getcourseList(this.props.activeUser.token, pageNumber, $("#keyword").val(), this.state.getCourseslist).then((data)=>{
          next = data;
          ///this.setState({getCourseslist:this.props.getCourseList});
          this.setState({Courseslist:this.props.forumCourse.Courses});
          this.setState({ajaxCallInProgress:false});
        }).catch((error)=>{
          if(error == "Error: Request failed with status code 401"){
          this.context.router.push('/');
        }
      });
    }
  }

    handleScroll(event) {
      let el = document.getElementById('golfCourseList');
      if(el.scrollHeight - el.scrollTop - el.clientHeight < 1){
          event.currentTarget.scrollTop=event.currentTarget.scrollHeight;
               this.state.lastScrollPos = event.currentTarget.scrollTop,
               this.state.pageNumber = this.state.pageNumber + 1;
               if(next!=null){
                 this.getCourseListData(this.state.pageNumber);
             }else{
               this.state.pageNumber=1;
             }
       }
   }

    componentDidMount() {
          $('.menu').parent().removeClass('active');
          window.addEventListener('scroll', this.handleScroll);
      }

      componentWillMount(){
        /*this.setState({ajaxCallInProgress:true});
          this.props.getcourseList(this.props.activeUser.token).then(()=>{
              this.setState({Courseslist:this.props.forumCourse.Courses});
              this.setState({ajaxCallInProgress:false});
              $("#catList").trigger('click');
              this.setState({ajaxCallInProgress:false});
         }).catch((error)=>{
           if(error == "Error: Request failed with status code 401"){
            this.context.router.push('/');
            this.setState({ajaxCallInProgress:false});
         }
       });*/
       ////this.setState({ajaxCallInProgress:true});
       this.getCourseListData();

         /*if( _.size(this.state.categoryDetails)==0 &&_.size(this.props.getCourseList)>0){
            if(this.props.params.id!=undefined){
              this.showCourseDetails(_.toInteger(this.props.params.id));
            }else{
                this.showCourseDetails(this.props.forumCourse.Courses[0].id);
            }
        }*/
    }
    componentWillReceiveProps(nextProps){
        /*if(this.props.getCourseList!=nextProps.getCourseList){
            this.setState({Courseslist:nextProps.forumCourse.Courses});
        }*/
        if(nextProps.forumCourse!=null && this.props.forumCourse!=nextProps.forumCourse && _.size(this.state.forumCourseDetails)==0 && _.size(nextProps.forumCourse.Courses)>0 && this.state.firstTimeLoad){
          let urlPath = _.split(location.pathname, '_');
          paramId =  (_.size(urlPath)>0)?(_.toInteger(urlPath[1])):(0);
          if(paramId!=0){
            let parameterId= _.toInteger(paramId);
            this.showCourseDetails(parameterId);
            this.state.firstTimeLoad=false;
          }else{
            this.showCourseDetails(nextProps.forumCourse.Courses[0].id);
            this.state.firstTimeLoad=false;
          }
        }
        /*if(this.props.getCourseList!=nextProps.getCourseList && _.size(this.state.courseDetails)==0 && _.size(nextProps.getCourseList)>0){
            this.showCourseDetails(nextProps.getCourseList[0].id);
        }*/

        if(this.props.selectedCourse!=nextProps.selectedCourse){
                this.setState({courseDetails:nextProps.selectedCourse});
        }
    }

    componentWillUnmount(){
          window.removeEventListener('scroll', this.handleScroll);
    }

    showCourseDetails(id){
       this.props.getCourseObject(id, this.props.activeUser.token).then((id)=>{
          this.setState({courseDetails:this.props.selectedCourse,catErr:""});
          this.props.getconversation(this.props.selectedCourse.course.id, this.props.activeUser.token ).then(()=>{
            this.setState({forumCourseDetails:this.props.forumCourse.Conversation});
        }).catch((error)=>{

        });
       }).catch((error)=>{
       });

     }
     onCourseSearch(e){
       if(e.which==13){
         if(this.state.prevSearchCriteria!=_.trim(e.target.value)){
         if(_.trim(e.target.value)!=""){
         this.state.pageNumber = 1;
         this.state.prevSearchCriteria = _.trim(e.target.value);
         this.props.searchCourses(this.props.activeUser.token, _.trim(e.target.value), _.toInteger(this.state.pageNumber)).then((data)=>{
               next = data;
               this.setState({Courseslist:this.props.getCourses});
         }).catch((error)=>{

         });
       }
       else{
         next='';
         this.getCourseListData();
       }
     }
   }

          /*if(e.which==13){
            this.props.searchCourses(this.props.activeUser.token, e.target.value).then(()=>{
                  this.setState({Courseslist:this.props.getCourses});
            }).catch((error)=>{

            });
          }*/
      }
      onPostSearch(e){
          if(e.which==13){
            this.props.searchPosts(this.props.activeUser.token, this.props.selectedCourse.course.id, e.target.value).then(()=>{
                  this.setState({forumCourseDetails:this.props.forumCourse.SearchList});
            }).catch((error)=>{

            });
          }
      }

      onforumclick(){
        this.context.router.push('/forumsPage');
        if(screen.width<769)
      {
        $(".MobileNav").show();
      
       }
      }
       addPost(){
       if(!this.state.courseDetails.course){
        this.refs.post_msg.value = "";
          this.setState({
                    postMsg : "",
                    catErr : (<span className="color-red">please select category to post comment </span>)
                });
           }
       else{
         this.setState({postMsg : ""});
         let title = document.getElementById('txtPostInput');
         this.props.addNewPost(this.props.selectedCourse.course.id,this.props.activeUser.token, title.value).then(()=>{
           this.props.getconversation(this.props.selectedCourse.course.id, this.props.activeUser.token ).then(()=>{
          this.setState({forumCourseDetails:this.props.forumCourse.Conversation,postMsg : ""});
        }).catch((error)=>{

        });
        document.getElementById('txtPostInput').value='';
      }).catch((error)=>{
      });
    }
    }
    Comment( id){

      let commentTextBox=(id + "text");
      let body = document.getElementById(commentTextBox).value;
      if(body == ""){
      $("#"+commentTextBox).focus();
    }
    else{
      this.props.addComment( id , this.props.activeUser.token, body).then(()=>{
        this.props.getconversation(this.props.selectedCourse.course.id, this.props.activeUser.token ).then(()=>{

          this.setState({forumCourseDetails:this.props.forumCourse.Conversation});
        }).catch((error)=>{

        });

        document.getElementById(commentTextBox).value='';
        $(".closeThis").collapse('hide');
      }).catch((error)=>{
      });
    }
  }
    cancelReply(id){
       
        let commentTextBox=(id + "rplyTopstPerson_one");
         document.getElementById(id + "text").value='';
     $("#"+commentTextBox).collapse('hide');
        
    }
    onRequired(e) {
        if(e.target.name == "post_msg"){
            if(e.target.value == ""){
                this.setState({postMsg: ""});
        }
        else{
        this.setState({postMsg: e.target.value});
      }
    }
 }


enterCapture(e){
     if(e.target.name == "post_msg"){
         if((e.target.value != "") && (e.keyCode == 13)){
            $("#postBtn").trigger("click");
         }
     }
 }
gotoCourse(){
  this.context.router.push("/courses_"+this.props.selectedCourse.course.id);
}

  rightViewToggle(){
    let width = window.innerWidth;
    if(width<992){
      $('.right-column').fadeIn();
      $('.left-column').hide();
    }
  }
  leftViewToggle(){
    let width = window.innerWidth;
    if(width<992){
      $('.left-column').fadeIn();
      $('.right-column').hide();
    }
  }

render() {



    return (<div>{(this.state.ajaxCallInProgress)?(<div className="mt20perc ml18pc"><Spinner /></div>):(<div className="forumCourse">
          <div className=" col-sm-12 pdryt0px pdlftryt0px">
            <div className="frumCrse forumCousreAlign col-sm-12 pdlftryt0px">

              <div className="headerContent col-sm-12 pdlftryt0px">
                <div className="courseHeader col-sm-12 pdlftryt0px">
                  <h3 className="header"><span className="glyphicon glyphicon-chevron-left arrowChevron cursor-pointer display" onClick={this.onforumclick.bind(this)}/>COURSES</h3>
                </div>
              </div>
               <div className="col-sm-12 pdlftryt0px coursesCntnt zeroPad">
                <div className="forumCntnt col-sm-12 pdlftryt0px" id="scroll">
                <div>
                  <div className="col-md-3 brdrRyt pdng left-column">
                    <div className="col-sm-12 pdlftryt0px courseSelRspns">
                      <span className="glyphicon glyphicon-remove float-left" onClick={this.onforumclick.bind(this)} /><span className="txtcenter">select course</span>
                    </div>
                    <div className="col-sm-12 pdng7pc">
                      <div className="searchBar col-sm-12">
                        <span className="glyphicon glyphicon-search searchIcon" /><input type="text" id="keyword" name="keyword" onKeyPress={this.onCourseSearch.bind(this)} className="searchInput" placeholder=" Search"/>
                      </div>
                      <div className="forumsCourseList col-sm-12 pdng" id="golfCourseList" onScroll={this.handleScroll}>
                        <ul className="crsesLst" >
                          {_.size(this.state.Courseslist)>0 && this.state.Courseslist.map((item, index)=>{
                              return(<div key={index} onClick={this.showCourseDetails.bind(this,item.id)}>
                               <li id="catList" className={(isExistObj(this.props.selectedCourse) && isExistObj(this.props.selectedCourse.course) && this.props.selectedCourse.course.id==item.id)?("selected_element fieldName"):("fieldName")}>
                               <div onClick={this.rightViewToggle.bind(this)}>{(item.is_premium)?(<span className="glyphicon glyphicon-star starImg"></span>):(<span className="glyphicon glyphicon-star txtTrans float-left"></span>)}<a>{item.name}</a>
                               </div>
                               </li>
                             </div> );
                              })}
                        </ul>
                      </div>
                    </div>
                  </div>
                  </div>
                  <div className="col-md-9 right-column pdlftryt0px">
                    <div className="col-sm-12 pdlftryt0px courseSelRspns">
                      <span className="glyphicon glyphicon-chevron-left float-left" onClick={this.leftViewToggle.bind(this)} /><span className="txtcenter">{(_.size(this.state.courseDetails)>0)?(<div onClick={this.gotoCourse.bind(this)}>{this.state.courseDetails.course.name}</div>):''}</span>
                    </div>
                    <div className="col-sm-12 pdng3pc">
                      <div className="coursesListing col-sm-12">
                        <div className="col-sm-12 listName pdng">
                          <div className="col-sm-6 pdng corseListName dsplyNoneResp">
                            {(_.size(this.state.courseDetails)>0) && isExistObj(this.state.courseDetails.course) && (<div className="txtUnderline cursor-pointer" onClick={this.gotoCourse.bind(this)}>{this.state.courseDetails.course.name}</div>)}

                          </div>
                          <div className="col-sm-6 pdng">
                            <div className="searchBar">
                              <span className="glyphicon glyphicon-search searchIcon" /><input type="text" className="searchInput" placeholder=" Search" onKeyPress={this.onPostSearch.bind(this)}/>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-12 zeroPad mt1pc">
                        <div className="addCourse col-sm-12">
                          <div className="col-sm-12"><input type="text" className="txtarea" maxLength="1000" ref="post_msg"  name="post_msg" onKeyDown={this.enterCapture.bind(this)} onChange={this.onRequired.bind(this)} id="txtPostInput" placeholder="write something.."/>
                            {this.state.catErr}
                          </div>
                          <div className="col-sm-12 hrzntLine"></div>
                          <div className="col-sm-12 txtRyt pdryt23px"><input id="postBtn" type="button" value="Post" className="btn postCourse-butn" onClick={this.addPost.bind(this)} disabled={!this.state.postMsg} /></div>
                        </div>
                        <div className="corsesLists col-sm-12 pdng">
                          {_.size(this.state.forumCourseDetails)>0  ? this.state.forumCourseDetails.map((item, i) => {
                                  return (<div key={i}>
                                    <div className="courseDetail pdng col-sm-12">
                            <div className="postingCourse col-sm-12 pdng">
                              <div className=" col-sm-12 brdrbtm pdng pdbtm1pc col-xs-12">
                                <div className=" col-sm-12 pdng col-xs-12">
                                  <div className="col-sm-4 personName">{item.author.first_name} {item.author.last_name}</div>
                                  <div className="col-sm-6 personSeen">{item.created}</div>
                                  <div className="col-sm-2 col-xs-1 rspns"data-toggle="collapse" data-target={"#"+item.id+"rplyTopstPerson_one"}>reply</div>
                                </div>
                                <div className=" col-sm-12 col-xs-12 personMsg mt1pc pdng">
                                {isExistObj(this.props.activeUser) && this.props.activeUser.id==item.author.id?<span className="glyphicon glyphicon-trash fr cursor-pointer mt-7px mr1pc" data-toggle="modal" data-target="#postDelModal"></span>:''}
                                  {item.title}
                                </div>
                                {/* Delete Post PopUp*/}
                                 <div className="modal fade" id="postDelModal" role="dialog" data-dropback="static">
                                      <div className="modal-dialog">
                                         <div className="modal-content">
                                           <div className="modal-body">Are you sure you want to delete?</div>
                                             <div className="modal-footer">
                                                   <button type="button" className="cnfrmbtn checkng" data-dismiss="modal"  onClick={this.deletePost.bind(this,item.id)} >Yes</button>
                                                   <button type="button" className="cancelbtn checkng" data-dismiss="modal">No</button>
                                              </div>
                                          </div>
                                       </div>
                                  </div>
                             {/*PopupOver*/}
                                <div id={item.id+"rplyTopstPerson_one"} className="collapse fade closeThis">
                              <div className="col-sm-12 col-xs-12 pdlft0px pdlftryt0px">
                                  <p className="col-sm-12 col-xs-12 pdlft0px pdlftryt0px"><textarea id={item.id+"text"} maxLength="1000" name="reply_msg" className="col-sm-12 txtaria" placeholder="write something..." onChange={this.onRequired.bind(this)}></textarea></p>
                              </div>
                              <div className="col-sm-12 col-xs-12 pdlft0px pdlftryt0px">
                                <div className="col-sm-12 pdlft0px col-xs-12 pdlftryt0px">
                                  <button type="button" className="btn sbmtButn" onClick={this.Comment.bind(this, item.id)}>Reply</button>
                                  <button type="button" className="cnclButn" onClick={this.cancelReply.bind(this, item.id)}>Cancel</button>
                                </div>
                              </div>
                            </div>
                              </div>
                              <div className="coursesRspns col-xs-12 col-sm-12 pdng">
                                {isExistObj(item) && isExistObj(item.comments) && _.size(item.comments)>0 && item.comments.map((childItem, childIndex)=>{
                                      return(<div className="rplyMember col-xs-12 col-sm-12 pdng pdbtm1pc" key={childIndex}>
                                  <div className="col-sm-12 pdng">
                                    <div className="col-sm-4 personName">{childItem.author.first_name} {childItem.author.last_name}</div>
                                    <div className="col-sm-6 personSeen">{childItem.created}</div>
                                  </div>
                                  <div className="col-sm-12 personMsg mt1pc pdng">
                                  {isExistObj(this.props.activeUser) && isExistObj(childItem.author) && childItem.author.id==this.props.activeUser.id?<span className="glyphicon glyphicon-trash fr cursor-pointer mt1pc mr4pc" data-toggle="modal" onClick={this.delModal.bind(this,childItem.id)}></span>:''}
                                    {childItem.body}
                                  </div>
                                  {/* Delete Comments PopUp*/}
                               <div className="modal fade" id={childItem.id+"_commentsDelModal"} role="dialog" data-dropback="static">
                                     <div className="modal-dialog">
                                         <div className="modal-content">
                                           <div className="modal-body">Are you sure you want to delete?</div>
                                             <div className="modal-footer">
                                                   <button type="button" className="cnfrmbtn checkng" data-dismiss="modal"  onClick={this.deleteComments.bind(this,item.id)} >Yes</button>
                                                   <button type="button" className="cancelbtn checkng" data-dismiss="modal">No</button>
                                              </div>
                                          </div>
                                       </div>
                                  </div>
                                  {/*PopupOver*/}
                                </div>)
                              })}

                              </div>
                            </div>
                          </div>

                      </div>)
                  }):<div>No posts yet</div>}
                      </div>
                      </div>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-12 txtCntr">
                <img src="/assets/img/golfconnectx_ad.png" className="adImg" />
              </div>
            </div>
          </div>
        </div>)}
                </div>
         );
   }
}
ForumsCourse.contextTypes = {
  router: React.PropTypes.object.isRequired
};
function mapStateToProps(state) {
    return {

        activeUser: (state.activeUser!=null)?(state.activeUser):(JSON.parse(sessionStorage.getItem('userDetails'))),
        getCourseList:state.forumCourse,
        selectedCourse:state.selectedCourse,
        forumCourse:state.forumCourse,
        getCourses:state.getCourses

    };
}

function matchDispatchToProps(dispatch){
    return bindActionCreators({getcourseList, searchCourses, getCourseObject, getconversation,
      addNewPost, addComment, searchPosts, deletePost, deleteComment}, dispatch);


}

export default  connect(mapStateToProps, matchDispatchToProps)(ForumsCourse);
