import React from 'react';
import { Link } from 'react-router';
import{IMG_CONSTANT} from '../constants/application.constants';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'lodash';
import Spinner from 'react-spinner';

import {addNewForumCategory,
        getForumCategory,
        getForumCategoryObject,
        addNewForumCategoryPost,
        getForumCategoryDetails,
        addForumCategoryComment,
        searchForumCategoryPosts,
        searchCategory, deletePost, deleteComment} from '../actions/forumExceptCourseAction';

let forumType, forumTypeTitle, paramId;
let imagePath=IMG_CONSTANT.IMAGE_PATH;
let emptyArr=[];
class ForumExceptCourse extends React.Component{
  constructor(props) {
    super(props);
    this.state={ postMsg : "",catMsg:"",errRply:"",replyMsg:"",catErr:"",
                 Category:Object.assign([],props.forumCourse),
                 categoryDetails:(props.selectedCategory!=undefined && props.selectedCategory!=null)?(Object.assign([], props.selectedCategory.Category)):([]),
                 Details:Object.assign({}, props.selectedCategory), ajaxCallInProgress:false
          };

}
 componentDidMount() {
      $('.menu').parent().removeClass('active');
      }

      getTitle(forumType){
        switch(_.toNumber(forumType)){
          case 1: return "WATER COOLER";
          case 2: return "EQUIPMENT";
          case 3: return "INSTRUCTION & PLAYING TIPS";
          case 4: return "RULES & GOLF ETIQUETTE";
          case 5: return "19th HOLE";
          case 6: return "GET LOCAL";
          case 7: return "GOLF TRAVEL";
          case 8: return "PRO-AM & DISCUSSION";
          case 9: return "FITNESS & EXERCISE";
        }
      }

      componentWillMount(){
        let urlPath = _.split(location.pathname, '_');
        paramId =  (_.size(urlPath)>0)?(_.toInteger(urlPath[1])):(0);
        forumType = paramId;
        forumTypeTitle = this.getTitle(forumType);
        this.setState({ajaxCallInProgress:true});
        this.props.getForumCategory(this.props.activeUser.token, forumType).then(()=>{
            this.setState({Category:this.props.forumCourse.Category});
             this.setState({ajaxCallInProgress:false});
             $("#catList").trigger('click');
        }).catch((error)=>{
            console.log("Error", error);
            if(error == "Error: Request failed with status code 401"){
            this.context.router.push('/');
        }
         this.setState({ajaxCallInProgress:false});
        });
        /* if(_.size(this.state.categoryDetails)==0 && this.props.forumCourse!=undefined && this.props.forumCourse!=null && _.size(this.props.forumCourse)>0){
                this.showCategoryDetails(this.props.forumCourse.Category[0].id);

        }*/
    }


    componentWillReceiveProps(nextProps){
         if(this.props.getCategory!=nextProps.getCategory)
        {
            this.setState({Category:nextProps.forumCourse.Category});
        }
        if(_.size(this.state.categoryDetails)==0 && this.props.forumCourse!=undefined && this.props.forumCourse!=null && _.size(this.props.forumCourse)>0 && _.has(this.props.forumCourse, 'Category')){
                this.showCategoryDetails(this.props.forumCourse.Category[0].id);
        }

        if(this.props.selectedCategory!=nextProps.selectedCategory){
                this.setState({categoryDetails:nextProps.selectedCategory.Category});
        }
         if(this.props.selectedCategory!=nextProps.selectedCategory){
                this.setState({ Details:nextProps.selectedCategory.CatDetails});
        }

    }

     showCategoryDetails(id){

      this.props.getForumCategoryDetails(id, this.props.activeUser.token, forumType).then(()=>{
              this.setState({ Details:this.props.selectedCategory.CatDetails, catErr : ""});

               this.props.getForumCategoryObject(id, this.props.activeUser.token, forumType).then(()=>{
                    this.setState({categoryDetails:this.props.selectedCategory.Category});

                  }).catch((error)=>{
              });
          }).catch((error)=>{

          });


     }
     getCategoryConversation(){

      this.props.getForumCategoryObject(this.props.selectedCategory.CatDetails.id, this.props.activeUser.token, forumType).then((id)=>{

          this.setState({categoryDetails:this.props.selectedCategory.Category,postMsg : ""});


       }).catch((error)=>{
       });
     }

     searchCategory(e){
          if(e.which==13)
          {
            this.props.searchCategory(this.props.activeUser.token, e.target.value, forumType).then(()=>{

                  this.setState({Category:this.props.forumCourse.WaterCoolerSearchList});
                 
            }).catch((error)=>{
                console.log("Error", error);
            });
          }
      }
      onPostSearch(e){

          if(e.which==13)
          {
            this.props.searchForumCategoryPosts(this.props.activeUser.token, this.props.selectedCategory.CatDetails.id, e.target.value, forumType).then(()=>{
                  this.setState({categoryDetails:this.props.selectedCategory.CategorySearchList});
              

            }).catch((error)=>{
                console.log("Error", error);
            });
          }
      }

      onforumclick(){
        this.context.router.push('/forumsPage');

      }
       addNewCategory(){
       this.setState({catMsg : ""});

      let name = document.getElementById('txtPostInput');
        
      this.props.addNewForumCategory(this.props.activeUser.token, name.value, forumType).then(()=>{
       this.props.getForumCategory(this.props.activeUser.token, forumType).then(()=>{
            this.setState({Category:this.props.forumCourse.Category,catMsg : ""});

        }).catch((error)=>{
          console.log("Error", error);
        });
        document.getElementById('txtPostInput').value='';
      }).catch((error)=>{
      });
    }
    closeReply(id){
     let commentTextBox=(id + "textComment");
      document.getElementById(commentTextBox).value='';
      let replyBox=$("#"+id+"rplyTopstPerson_one").collapse('hide');
    
    }
    addPost(){
       if(!this.state.Details.name){
        this.refs.post_msg.value = "";
          this.setState({
                    postMsg : "",
                    catErr : (<span className="color-red">please select category to post comment </span>)
                });
       }
       else{
      this.setState({postMsg : "",catErr:""});
      let subject_line = document.getElementById('PostInput');
        console.log("this.props.selectedCategory.id",this.props.selectedCategory.CatDetails.id);

      this.props.addNewForumCategoryPost(this.props.selectedCategory.CatDetails.id, this.props.activeUser.token, subject_line.value, forumType).then(()=>{

        document.getElementById('PostInput').value='';
        this.getCategoryConversation();
      }).catch((error)=>{
      });
    }
    }
    Comment( id){
let innerDescValue = document.getElementById(id + "textComment").value.replace(new RegExp('\r?\n','g'), '<br />');
      let commentTextBox=(id + "textComment");
      let body = document.getElementById(commentTextBox).value;
      
      if(body == ""){
      $("#"+commentTextBox).focus();
    }
    else{
      this.props.addForumCategoryComment(this.props.selectedCategory.CatDetails.id, id , this.props.activeUser.token, innerDescValue, forumType).then(()=>{

         this.getCategoryConversation();
        document.getElementById(commentTextBox).value='';
        $(".closeThis").collapse('hide');
      }).catch((error)=>{
      });
    }
    }
    /*****/
    onRequired(e) {
   if(e.target.name == "cat_msg"){
    if(e.target.value == ""){

    this.setState({ catMsg: ""});
    }

    else{
        this.setState({ catMsg: e.target.value});
    }
}
    if(e.target.name == "post_msg"){
    if(e.target.value == ""){

        this.setState({
        postMsg: ""
        });
    }

    else{
        this.setState({
        postMsg: e.target.value
         });
        }

}

 }

 enterCapture(e){
     if(e.target.name == "cat_msg"){
         if((e.target.value != "") && (e.keyCode == 13)){
           $("#addBtn").trigger("click");
         }
     }
     if(e.target.name == "post_msg"){
         if((e.target.value != "") && (e.keyCode == 13)){
            $("#postBtn").trigger("click");
        }
     }
 }


    deletePost(id){
        this.props.deletePost(this.props.selectedCategory.CatDetails.id, id, this.props.activeUser.token, forumType).then(()=>{
        this.getCategoryConversation();
         }).catch((error)=>{
         console.log("Error", error);
       });
    }
     
    deleteComments(id, commentId){
       this.props.deleteComment(this.props.selectedCategory.CatDetails.id, id, commentId, this.props.activeUser.token, forumType).then(()=>{
       this.getCategoryConversation();
        }).catch((error)=>{
       console.log("Error", error);
        });
      }
render() {

    return (
        <div className="forumCourse">
          <div className=" col-sm-12 frumCrse">
             {(this.state.ajaxCallInProgress)?(<div className="mt25pc"><Spinner /></div>):(<div className="row">
              <div className="headerContent col-sm-12">
                <div className="courseHeader">
                  <h3 className="header"><span className="glyphicon glyphicon-chevron-left arrowChevron" onClick={this.onforumclick.bind(this)}/>{forumTypeTitle}</h3>
                </div>
              </div>
              <div className="col-sm-12 coursesCntnt pdng">
                <div className="bgwhite forumCntnt col-sm-12">
                  <div className="col-sm-3 brdrRyt pdng left-column ">
                    <div className="col-sm-12 pdng7pc">
                    <div className="addCourse col-sm-12">

                          <div className="col-sm-12"><input type="text" className="txtarea"  name="cat_msg" onChange={this.onRequired.bind(this)} onKeyDown={this.enterCapture.bind(this)} id="txtPostInput" placeholder="Add a category.." /></div>

                          <div className="col-sm-12 hrzntLine"></div>
                          <div className="col-sm-12 txtRyt pdryt23px"><input id="addBtn" type="button" value="Add" className="btn postCourse-butn" onClick={this.addNewCategory.bind(this)} disabled={!this.state.catMsg} /></div>

                        </div>
                      <div className="searchBar col-sm-12">
                        <span className="glyphicon glyphicon-search searchIcon" /><input type="text" onKeyPress={this.searchCategory.bind(this)} className="searchInput" placeholder=" Search"/>
                      </div>
                      <div className="forumsCourseList col-sm-12 pdng">
                        <ul className="crsesLst">
                        {_.size(this.state.Category)>0 && this.state.Category.map((item, index)=>{
                              return(<div key={index} onClick={this.showCategoryDetails.bind(this,item.id)}>
                              <li id="catList" className={(this.props.selectedCategory!=undefined && this.props.selectedCategory!=null && this.props.selectedCategory.CatDetails.id==item.id)?("selected_element"):("")}><a>{item.name}</a></li>
                             </div> );
                              })}

                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-9 right-column">
                    <div className="col-sm-12 pdng3pc">
                    <div className="coursesListing col-sm-12">
                      <div className="col-sm-12 listName pdng">
                        <div className="col-sm-6 pdng corseListName">
                          {(_.size(this.state.Details)>0)?this.state.Details.name:''}
                        </div>
                        <div className="col-sm-6 pdng">
                          <div className="searchBar">
                            <span className="glyphicon glyphicon-search searchIcon" /><input type="text" className="searchInput" placeholder=" Search" onKeyPress={this.onPostSearch.bind(this)}/>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-12 zeroPad mt1pc">
                      <div className="addCourse col-sm-12">
                        <div className="col-sm-12"><input type="text" className="txtarea" ref="post_msg" name="post_msg" onChange={this.onRequired.bind(this)} onKeyDown={this.enterCapture.bind(this)} id="PostInput" placeholder="write something.."/>
                                           {this.state.catErr}
                                           </div>

                                    <div className="col-sm-12 hrzntLine"></div>
                        <div className="col-sm-12 txtRyt pdryt23px"><input type="button" id="postBtn" value="Post" className="btn postCourse-butn" onClick={this.addPost.bind(this)} disabled={!this.state.postMsg} /></div>
                      </div>
                      <div className="corsesLists col-sm-12 pdng">
                         {((this.state.categoryDetails!=undefined &&   this.state.categoryDetails!=null && _.size(this.state.categoryDetails)>0)?(this.state.categoryDetails.map((item, i) => {

                                  return (<div key={i}>
                                    <div className="courseDetail pdng col-sm-12">
                          <div className="postingCourse col-sm-12 pdng">
                            <div className=" col-sm-12 brdrbtm pdng pdbtm1pc">
                              <div className=" col-sm-12 pdng">
                                <div className="col-sm-4 personName">{item.created_by}</div>
                                <div className="col-sm-6 personSeen">{item.created_on}</div>
                                <div className="col-sm-2 rspns"data-toggle="collapse" data-target={"#"+item.id+"rplyTopstPerson_one"}>reply</div>
                              </div>
                              <div className=" col-sm-12 personMsg mt1pc pdng">
                              {item.created_by==this.props.activeUser.name?<span className="glyphicon glyphicon-trash fr cursor-pointer mt-7px mr1pc" data-toggle="modal" data-target="#postDelModal"></span>:''}
                                {item.subject_line}
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
                              <div className="col-sm-12 pdlft0px">
                                <p className="col-sm-12 pdlft0px"><textarea id={item.id+"textComment"} name="reply_msg" className="col-sm-12 txtaria" placeholder="write something..." onChange={this.onRequired.bind(this)}></textarea></p>

                                                            </div>
                              <div className="col-sm-12 pdlft0px">
                                <div className="col-sm-12 pdlft0px">
                                  <button type="button" className="btn sbmtButn"  onClick={this.Comment.bind(this, item.id)}>Reply</button>
                                  <button type="button" className="cnclButn" onClick={this.closeReply.bind(this, item.id)}>Cancel</button>
                                </div>
                              </div>
                            </div>
                              </div>
                              <div className="coursesRspns col-sm-12 pdng">
                                {_.size(item.comments)>0 && item.comments.map((childItem, childIndex)=>{
                                      return(<div className="rplyMember col-sm-12 pdng pdbtm1pc">
                                  <div className="col-sm-12 pdng">
                                    <div className="col-sm-4 personName">{childItem.created_by}</div>
                                    <div className="col-sm-6 personSeen">{childItem.created_on}</div>
                                  </div>
                                  <div className="col-sm-12 personMsg mt1pc pdng">
                                  {childItem.created_by==this.props.activeUser.name?<span className="glyphicon glyphicon-trash fr cursor-pointer mt1pc" data-toggle="modal" data-target="#commentsDelModal"></span>:''}
                                    <p dangerouslySetInnerHTML={{__html: childItem.body}}></p>
                                  </div>
                                  {/* Delete Comments PopUp*/}
                             <div className="modal fade" id="commentsDelModal" role="dialog" data-dropback="static">
                                  <div className="modal-dialog">
                                         <div className="modal-content">
                                           <div className="modal-body">Are you sure you want to delete?</div>
                                             <div className="modal-footer">
                                                   <button type="button" className="cnfrmbtn checkng" data-dismiss="modal"  onClick={this.deleteComments.bind(this,item.id, childItem.id)} >Yes</button>
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
                  })):(<div>No posts yet</div>))}


                      </div>
</div>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-12 txtCntr">
                <img src="/assets/img/ads.png" className="adImg" />
              </div>
            </div>)}
          </div>
        </div>
         );
   }
}
ForumExceptCourse.contextTypes = {
  router: React.PropTypes.object.isRequired
};
function mapStateToProps(state) {
    return {

        activeUser: (state.activeUser!=null)?(state.activeUser):(JSON.parse(sessionStorage.getItem('userDetails'))),
        forumCourse:state.forumCourse,
        selectedCategory:state.selectedCategory


    };
}

function matchDispatchToProps(dispatch){
    return bindActionCreators({addNewForumCategory, getForumCategory, getForumCategoryObject,
      addNewForumCategoryPost, getForumCategoryDetails, addForumCategoryComment,
      searchForumCategoryPosts, searchCategory,deletePost, deleteComment}, dispatch);
}

export default  connect(mapStateToProps, matchDispatchToProps)(ForumExceptCourse);
