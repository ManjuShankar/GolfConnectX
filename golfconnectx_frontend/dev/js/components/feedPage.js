import React from 'react';
import { Link } from 'react-router';
import {getPostDetails, searchPosts} from '../actions/postAction';
import {addComment, likePost, deletePostPhoto} from '../actions/groupListAction';
import {deletePost, deleteComment} from '../actions/eventDetailsAction';
import {connect} from 'react-redux';
import Spinner from 'react-spinner';
import {bindActionCreators} from 'redux';
import {isValidImage} from "../utils/Validation";
import {SERVICE_URLS} from '../constants/serviceUrl';
import {isExistObj} from '../utils/functions';
class FeedPage extends React.Component {
   constructor(props){
       super(props);
       this.state={
      posts: Object.assign([], props.postList),  ajaxCallInProgress:false, cimgArray:'', imgId:'',pImgId:'', commentId:'', ajax:false, postId:''
    };
   }
   componentWillMount(){
      
      this.setState({ajaxCallInProgress:true});
        this.props.getPostDetails(this.props.activeUser.token).then(()=>{
                  this.setState({posts:this.props.postList.feedPosts, ajaxCallInProgress:false});
              $(".imgSpinner").hide();
        }).catch((error)=>{
           if(error == "Error: Request failed with status code 401"){
         this.context.router.push('/');
        }
          this.setState({ajaxCallInProgress:false});
     });
   }
    
 Comment(postsId){

      let commentTextBox=(postsId + "_txtComment");
      let commentSection=(postsId+"_commentSection");
      let innerDescValue = document.getElementById(commentTextBox).value.replace(new RegExp('\r?\n','g'), '<br />');
        let body;

          _.set( body, innerDescValue);

      let imgArray={};
      let imgId=[];
      for(var i=0;i<_.size(this.state.cimgArray);i++){
      imgArray=this.state.cimgArray[i];
      imgId.push(imgArray.id);
      }
      if(innerDescValue == ""){
      $("#"+commentTextBox).focus();
    }
      else{
        //$('#'+postsId).prop('disabled', true);
           $("#"+postsId+"_imgSpinner").show();
        $("#"+postsId+"_commentSection").hide();
       this.props.addComment(postsId, this.props.activeUser.token, innerDescValue, imgId).then(()=>{
          
$('textarea#'+ postsId + '_txtComment').val('');
        //$('#'+ postsId + "_txtComment").innerText();
           this.getPostsDetails();
       
           $("#"+postsId+"_imgSpinner").hide();
        $("#"+postsId+"_commentSection").show();
this.setState({cimgArray:''});


       
      }).catch((error)=>{
      });
      }
    }
    getPostsDetails(){
       
        this.props.getPostDetails(this.props.activeUser.token).then(()=>{
                  this.setState({posts:this.props.postList.feedPosts, ajaxCallInProgress:false});
        }).catch((error)=>{
          this.setState({ajaxCallInProgress:false});
     });

    }
 componentDidMount() {
    
     $(".imgSpinner").hide();
    
      $('.menu').parent().removeClass('active');
      $('#feed').parent().addClass('active');
     
     
   }
    onPostSearch(e){

          if(e.which==13)
          {
            this.props.searchPosts(this.props.activeUser.token, e.target.value).then(()=>{

                  this.setState({posts:this.props.postList.PostList});
            }).catch((error)=>{

            });
          }
      }
      onPostSearchIcon(){
           // let searchTxtValue = document.getElementById('searchCriteriaText').value;  
           let searchTxtValue  = this.refs.searchCriteriaText.value;    
           
           this.props.searchPosts(this.props.activeUser.token, searchTxtValue).then(()=>{
                 this.setState({posts:this.props.postList.PostList});
           }).catch((error)=>{

           });
     }

      onLikeClick(id){
       
        this.props.likePost(this.props.activeUser.token, id).then(()=>{
              this.getPostsDetails();
        }).catch((error)=>{

        });
    }
    focusOnCommentBox(id){
        
        /* $('#'+ id + "_commentSection").toggle();
        //  $('#'+ id + "_commentText").css("color", "green");
        //  $('#'+ id).toggle();
         $('#'+id).prop('disabled', false);*/
        $('#'+ id + "_txtComment").focus();

    }
    postDelModal(id){
        $("#modalPostDelet").modal('show');
        this.setState({postId:id});
    }
    deletePost(){
        let id=this.state.postId;
      this.props.deletePost(id, this.props.activeUser.token).then(()=>{
    this.getPostsDetails();
  }).catch((error)=>{

  });
    }
    setCommentId(id){
        $("#modalCommentDlt").modal('show');
        this.setState({commentId:id});
    }
     deleteComments(id){
         let cId=this.state.commentId;
         
      this.props.deleteComment(id, cId, this.props.activeUser.token).then(()=>{
          
    this.getPostsDetails();
  }).catch((error)=>{

  });
    }
    getFileExtension(name){
      var found = name.lastIndexOf('.') + 1;
      return (parseInt(found) > 0 ? name.substr(found) : "");
    }
    commentImage(id){
       
        $("#"+id+"_imgSpinner").addClass("display:none");
    
        $("#"+id+"_imgSpinner").show();
        $("#"+id+"_commentSection").hide();
   
 var that = this;
          var imagesArray = new FormData();
           $.each($('#commentFile')[0].files, function(i, file) {
             imagesArray.append('images', file);
           });
        
           let fileExtention = this.getFileExtension(document.getElementById('commentFile').files[0].name);

           if(isValidImage(fileExtention)){

           $.ajax({
               url: SERVICE_URLS.URL_USED+'api/posts/comment-upload-images/',
               data: imagesArray,
               processData: false,
               contentType: false,
               type: 'POST',
               headers:{
               'Authorization':'Token '+ this.props.activeUser.token
              },
               success: function(data){
                that.setState({cimgArray:data});
                   
 $("#"+id+"_imgSpinner").hide();
        $("#"+id+"_commentSection").show();

               },
               error: function(error){
                   console.log("err",error);
                  //that.setState({selectedScoreId:null});
                   $("#"+id+"_imgSpinner").hide();
        $("#"+id+"_commentSection").show();
               }
           });
          }
          else{
$("#"+id+"_imgSpinner").hide();
        $("#"+id+"_commentSection").show();
              toastr.error('Upload a valid Image');
          }
}
/*deletePostImage(id){
 
  this.props.deletePostPhoto(this.props.activeUser.token, id).then(()=>{
                this.getPostsDetails();
           }).catch((error)=>{
           });
}*/
    postImage(id){
      var that = this;
          var imagesArray = new FormData();
           $.each($('#postFile')[0].files, function(i, file) {
             imagesArray.append('images', file);
           });
           let fileExtention = this.getFileExtension(document.getElementById('postFile').files[0].name);

           if(isValidImage(fileExtention)){

           $.ajax({
               url: SERVICE_URLS.URL_USED+'api/posts/'+id+'/gallery',
               data: imagesArray,
               processData: false,
               contentType: false,
               type: 'POST',
               headers:{
               'Authorization':'Token '+ this.props.activeUser.token
              },
               success: function(data){
                //that.setState({imgArray:data});
               that.getPostsDetails();


               },
               error: function(){
                  //that.setState({selectedScoreId:null});
               }
           });
          }
          else{

              toastr.error('Upload a valid Image');
          }
    }
deletePostImage(){
  let id=this.state.pImgId;
  this.props.deletePostPhoto(this.props.activeUser.token, id).then(()=>{
    $('#deletecImageModal').modal('hide');
                this.getPostsDetails();
           }).catch((error)=>{
           });
}
deleteCommtenImage(){
  $('#deleteImageModal').modal('hide');
  let id=this.state.imgId;
  this.props.deletePostPhoto(this.props.activeUser.token, id).then(()=>{
             this.getPostsDetails();
           }).catch((error)=>{
           });
}

checkId(id){
 
  this.setState({imgId:id});
   $('#deleteImageModal').modal('show');
}
setpImgId(id){
  this.setState({pImgId:id});
  $("#deletecImageModal").modal('show');
}


   render() {
    
      return (
          <div className="feedPage">
   <div className="pageFeed col-sm-12 pdryt0px">
      <div className="feedcntnt col-sm-12">
         <div className="img-cntnt col-sm-12">
             <div className="cover-img col-sm-12 zeroPad"><img src="/assets/img/feedImg (1).png" className="feedImg col-sm-12 zeroPad" /></div>
            <div className="img-feed col-sm-12">
                <h3 className="col-sm-8">Feed</h3>
                <span className="search-feed col-sm-4 zeroPad">
                  <div className="col-sm-12 pdlft0px">
                    <input type="search" ref="searchCriteriaText" placeholder="Search Feed" className="searching col-sm-11" onKeyPress={this.onPostSearch.bind(this)}/>
                    <button className="search-btn col-sm-1" onClick={this.onPostSearchIcon.bind(this)}  >
                      
                      <span className="searchbtn-img"><img src="/assets/img/icons/Search_Icon.png"/></span>
                    </button>
                  </div>
                </span>
             </div>
         </div>
         <div className="col-sm-12 mt22px pdlftryt0px">
         {(this.state.ajaxCallInProgress)?(<div className="col-sm-12 bgwhite"><Spinner /></div>):(
          <div>
         {isExistObj(this.state.posts) && _.size(this.state.posts)>0 ? this.state.posts.map((item,i)=>{
              return(<div className="users col-sm-12"  key={i}>
            <div className="user1 pdlft0px pdngryt0px col-xs-12 pdlftryt0px col-sm-12">
            <div className="col-sm-12 zeroPad">
              <div className="col-sm-1 col-xs-1 wd6pc dsplyInln">
               <img className="Harvey-img" src={'http://'+item.author.profile_image_url} /></div>

               <div className="user1-header col-sm-6 col-xs-6">
                  <h3><Link to={item.author.id==this.props.activeUser.id?"/profile_0":"/profileDetail_"+item.author.id}>{item.author.first_name} {item.author.last_name}</Link></h3>
                      <span>
                  {item.object_name!=null?item.object_type=="Group"?<b>Posted on {item.object_type} <Link to={"groupMembers_" + item.object_id}><span className="txtUnderline text_overflow"> {item.object_name}  </span></Link>  </b>:item.object_type=="Course"?<b>Posted on {item.object_type} <Link to={"forumCourse_" + item.object_id}><span className="txtUnderline text_overflow"> {item.object_name}  </span></Link>   </b>:<b>Posted on {item.object_type} <Link to={"/events_"+item.object_id}><span className="txtUnderline text_overflow"> {item.object_name}  </span></Link> </b>:''}
                  </span>
                  </div>
                  <div className="col-sm-5 dsplyInln zeroPad feedRyt txtRyt">
                  <p className="ryt">{item.created} <br/>{item.created_since}</p>
               </div>
               </div>
               <div className="tglng">
               <div className="user1-spl word-break">
                 {this.props.activeUser.id==item.author.id?<span className="glyphicon glyphicon-trash fr cursor-pointer mt1pc marTop10px" data-toggle="modal" onClick={this.postDelModal.bind(this,item.id)}></span>:''}
                  <h3>{item.title}</h3>


                </div>
                <div className="modal fade" id="modalPostDelet" role="dialog" data-dropback="static">
                                        <div className="modal-dialog">
                                              <div className="modal-content">
                                               <div className="modal-header modalHder">
                                         <h4>Delete Post</h4>
                                         </div>
                                                <div className="modal-body"><p className="pdleft15px">Are you sure you want to delete?</p></div>
                                                  <div className="modal-footer txtRight zeroPad">
                                                        <button type="button" className="cnfrmbtn checkng" data-dismiss="modal"onClick={this.deletePost.bind(this)} >Yes</button>
                                                        <button type="button" className="cancelbtn checkng" data-dismiss="modal">No</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                        {item.body!=null?<div>
                            <h4 className="detil">Details</h4>
                            <p className="xplin">{item.body}</p>
                        </div>:<div></div>}

                  </div>
                  <div className="user-footer">
                     <div className="col-sm-12 rspnsng">
                      {/* <img src="/assets/img/Camera Icon.png" className="fr mr4_5pc" />
                         <input type="file" id="postFile" name="postFile" className="postCameraImg" onChange={this.postImage.bind(this,item.id)} multiple/>*/}
                          <div className="col-sm-12">
                      {isExistObj(item) && isExistObj(item.images) && _.size(item.images)>0? item.images.map((imgItem,i)=>{
                        return(
                        
                         <div className="col-sm-2 postImgDiv">
                           <img src={"http://"+imgItem.image} className="img-thumbnail wd120px hgt120px"/>
                    <i className="glyphicon glyphicon-remove top-55px cursor-pointer color-black" onClick={this.setpImgId.bind(this,imgItem.id)} data-toggle="modal" ></i>
                     <div className="modal fade" id="deletecImageModal" role="dialog">
                  <div className="modal-dialog modal-sm">
                  <div className="modal-content">
                   <div className="modal-header modalHder">
                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                            <h4 className="modal-title">Delete Photo</h4>
                          </div>
                          <div className="modal-body">
                            <p className="pdleft15px">Are you sure you want to delete this photo?</p>
                          </div>
                          <div className="modal-footer">
                            <button type="button" className="checkng" data-dismiss="modal">No</button>
                            <button type="button" className="checkng" onClick={this.deletePostImage.bind(this)}>Yes</button>
                          </div>
                        </div>
                      </div>
                    </div>
                   </div>
                    
                        );
                      }):''}
                    </div>
                      <div className="col-sm-8"></div>
                      <div className="col-sm-4 pdng">
                        <div className="col-sm-12 pdng">
                          <span onClick={this.onLikeClick.bind(this, item.id)} className={(item.has_like)?"like color-green":"like"}><span className={(item.has_like)?("rspnsImg glyphicon glyphicon-heart color-green"):("rspnsImg glyphicon glyphicon-heart ")}></span>Like (<span   className="likingNumber">{item.likes_count}</span>)</span>
                          <span className="cursor-pointer" id={item.id+"_commentText"} onClick={this.focusOnCommentBox.bind(this, item.id)} className="comment"><img src="/assets/img/icons/comment.png"  className="rspnsImg"/>Comment</span>
                        </div>
                      </div>
                    </div>
                     <span className="footer4">
                        <span className="butn-err" data-toggle="modal" data-target="">

                        </span>
                     </span>
                     <div className="modal fade secondModal" id="myModal" role="dialog" data-backdrop="static">
                        <div className="modal-dialog modal-sm">
                           <div className="modal-content">
                              <div className="modal-body">
                                 <div className="checkbox">
                                    <input type="checkbox" value="1" id="checkboxInput" name="" />Hide/DeletePost
                                 </div>
                                 <div className="checkbox">
                                    <input type="checkbox" value="1" id="checkboxInput" name="" />Block
                                 </div>
                                 <div className="checkbox">
                                    <input type="checkbox" value="1" id="checkboxsInput" name="" />Report
                                 </div>
                                 <div className="reason">Reason for reporting</div>
                                 <textarea className="txtarea form-control" maxLength="200" name="txtArea"></textarea>
                              </div>
                              <div className="modal-footer">
                                <button type="button" className="butnPrimary" id="btnSubmit">Submit</button>
                                <button type="button" className="butnSecondary" data-dismiss="modal">Cancel</button></div>
                           </div>
                        </div>
                     </div>
                  </div>
                   {isExistObj(item) && isExistObj(item.comments) && _.size(item.comments)>0 && item.comments.map((childItem, childIndex)=>{
              return(<div key={childIndex} className="col-sm-12 col-xs-12 mt-6pc" >
             

                             <div className="modal fade" id="modalCommentDlt" role="dialog" data-dropback="static">
                                  <div className="modal-dialog">
                                         <div className="modal-content">
                                            <div className="modal-header modalHder">
                                          <button type="button" className="close" data-dismiss="modal">&times;</button>
                                         <h4 className="textMargin">Delete comment</h4>
                                         </div>
                                         <div className="modal-body">
                                         <p className="pdleft15px">Are you sure you want to delete?</p>
                                         </div>
                                             <div className="modal-footer zeroPad">
                                                   <button type="button" className="cancelbtn checkng" data-dismiss="modal">No</button>
                                                   <button type="button" className="cnfrmbtn checkng" data-dismiss="modal"  onClick={this.deleteComments.bind(this,item.id)}>Yes</button>
                                                   </div>
                                          </div>
                                       </div>
                                  </div>


                    <div className="col-sm-12 col-xs-12 mt3pc pdryt0px">
                     {this.props.activeUser.id==childItem.author.id || this.props.activeUser.id==item.author.id?<span className="glyphicon glyphicon-trash fr cursor-pointer mt1pc top40px zIndex1" data-toggle="modal" onClick={this.setCommentId.bind(this,childItem.id)}></span>:''}
                      <div className="col-sm-1 col-xs-2">
                        <div className=""><img src={'http://'+childItem.author.profile_image_url} className="rplyImg"/></div>
                      </div>
                      <div className="col-sm-9 col-xs-7 feedRply">
                        <div className="col-sm-12 prsnName">
                          <Link to={childItem.author.id==this.props.activeUser.id?"/profile_0":"/profileDetail_"+childItem.author.id}>{childItem.author.first_name} {childItem.author.last_name}</Link>
                        </div>
                        <div className="col-sm-12 prsnSent">
                          {childItem.created}
                        </div>
                      </div>
                      <div className="col-sm-12 col-xs-12 mt1pc ">

                        <div className="pstReply col-sm-12">
                        <p dangerouslySetInnerHTML={{__html: childItem.body}} ></p>
                         
                         </div>
                          <div className="col-sm-12">
                      {isExistObj(childItem) && isExistObj(childItem.images) && _.size(childItem.images)>0? childItem.images.map((cimgItem,i)=>{
                        return(
                        
                           <div className="col-sm-2 postImgDiv">
                           <img src={"http://"+cimgItem.image} className="img-thumbnail wd120px hgt120px"/>
                    {this.props.activeUser.id==childItem.author.id || this.props.activeUser.id==item.author.id?<i className="glyphicon glyphicon-remove top-55px cursor-pointer" data-toggle="modal"  onClick={this.checkId.bind(this,cimgItem.id)} ></i>:''}
                  <div className="modal fade" id="deleteImageModal" role="dialog">
                  <div className="modal-dialog modal-sm">
                  <div className="modal-content">
                   <div className="modal-header modalHder">
                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                            <h4 className="modal-title">Delete Photo</h4>
                          </div>
                          <div className="modal-body">
                            <p className="pdleft15px">Are you sure you want to delete this photo?</p>
                          </div>
                          <div className="modal-footer">
                            <button type="button" className="checkng" data-dismiss="modal">No</button>
                            <button type="button" className="checkng" onClick={this.deleteCommtenImage.bind(this)}>Yes</button>
                          </div>
                        </div>
                      </div>
                    </div>
                   </div>
                    
                        );
                      }):''}
                    </div>
                      </div>
                    </div>
                  </div>)
            })}
            <div className="col-sm-12 bgwhite imgSpinner" id={item.id+"_imgSpinner"} ><Spinner /></div>
                <div id={item.id+ "_commentSection"} className="" >
                  <div className="cmnt-matter">
                            <textarea type="text" maxLength="250" className="txtarea form-control" placeholder="Write Something..." id={item.id+ "_txtComment"}></textarea>
                            <img src="/assets/img/Camera Icon.png" className="fr cameraCommentImg" />
                            <input type="file" id="commentFile" name="commentFile" className="commentCameraImg" onChange={this.commentImage.bind(this,item.id)} />
                  </div>

                   <div>
                              <input type="button" id={item.id} value="Add Comment" className="btnAddComment" onClick={this.Comment.bind(this, item.id)}/>
                   </div>
              </div>

                  </div>


          </div>)
                }):<div className=" users col-sm-12">There are no posts to show.</div>}
</div>
)}
</div>
               </div>
            </div>
          </div>
              );
   }
}
FeedPage.contextTypes = {
  router: React.PropTypes.object
};


function mapStateToProps(state) {

    return {
       activeUser: (state.activeUser!=null)?(state.activeUser):(JSON.parse(sessionStorage.getItem('userDetails'))),
       postList: state.savePost
    };
}
function matchDispatchToProps(dispatch){
    return bindActionCreators({getPostDetails, searchPosts, addComment, likePost, deletePost, deleteComment, deletePostPhoto}, dispatch);
}
export default connect(mapStateToProps,matchDispatchToProps) (FeedPage);
