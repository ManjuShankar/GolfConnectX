import React from 'react';
import { Link } from 'react-router';
import{IMG_CONSTANT} from '../constants/application.constants';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'lodash';
import {get19HoleCategory, get19HoleCategoryDetails, get19HoleCategoryObject, addNew19HoleCategory, addNew19HoleCategoryPost, search19HoleCategoryPosts, add19HoleCategoryComment, searchCategory} from '../actions/forum19thHoleAction';
import Spinner from 'react-spinner';
class Forum19Hole extends React.Component{
  constructor(props) {
    super(props);
   this.state={   postMsg : "",catMsg:"",replyMsg:"",catErr:"", Category:Object.assign([],props.forumCourse),
                  categoryDetails:Object.assign({}, props.selected19thHoleCategory), 
                  Details:Object.assign({}, props.selected19thHoleCategory), ajaxCallInProgress:false
          };
   
}
 componentDidMount() {
      $('.menu').parent().removeClass('active');
      }
componentWillMount(){
      this.setState({ajaxCallInProgress:true});
        this.props.get19HoleCategory(this.props.activeUser.token).then(()=>{
            this.setState({Category:this.props.forumCourse.get19Category});
            this.setState({ajaxCallInProgress:false});
            $("#catList").trigger('click');
        }).catch((error)=>{

           if(error == "Error: Request failed with status code 401"){
           this.context.router.push('/');
           }
           this.setState({ajaxCallInProgress:false});  
        });
         if(_.size(this.state.categoryDetails)==0 && _.size(this.props.get19HoleCategory)>0){
                this.showCategoryDetails(this.props.forumCourse.get19Category[0].id);
                
        }
        
    }
          
    
    componentWillReceiveProps(nextProps){
         if(this.props.get19HoleCategory!=nextProps.get19HoleCategory)
        {
            this.setState({Category:nextProps.forumCourse.get19Category});
        }
       /* if(_.size(this.state.categoryDetails)==0 && _.size(this.state.Category)>0){
                this.showCategoryDetails(this.state.Category[0].id);
          }*/

        if(this.props.selected19thHoleCategory!=nextProps.selected19thHoleCategory){
                this.setState({categoryDetails:nextProps.selected19thHoleCategory.Category, 
                  Details:nextProps.selected19thHoleCategory.CatDetails});
        }
        /* if(this.props.selectedCategory.CatDetails!=nextProps.selectedCategory.CatDetails){
                this.setState({ Details:nextProps.selectedCategory.CatDetails});
        }*/
        
    }
   
     showCategoryDetails(id){
     
      this.props.get19HoleCategoryDetails(id, this.props.activeUser.token).then(()=>{
              this.setState({Details:this.props.selected19thHoleCategory.CatDetails,catErr : ""});
              this.props.get19HoleCategoryObject(id, this.props.activeUser.token).then((id)=>{

          this.setState({categoryDetails:this.props.selected19thHoleCategory.Category});
         
      
       }).catch((error)=>{
       });
          }).catch((error)=>{

          });
      
        
     }
     getCategoryConversation(){
      this.props.get19HoleCategoryObject(this.props.selected19thHoleCategory.CatDetails.id, this.props.activeUser.token).then((id)=>{
        
          this.setState({categoryDetails:this.props.selected19thHoleCategory.Category});
         
      
       }).catch((error)=>{
       });
     }
    
     onCategorySearch(e){

          if(e.which==13)
          {
            this.props.searchCategory(this.props.activeUser.token, e.target.value).then(()=>{
              
                  this.setState({Category:this.props.selected19thHoleCategory.SearchList});
            }).catch((error)=>{

            });
          }
      }
      onPostSearch(e){
     
          if(e.which==13)
          {
            this.props.search19HoleCategoryPosts(this.props.activeUser.token, this.props.selected19thHoleCategory.CatDetails.id, e.target.value).then(()=>{
                  this.setState({categoryDetails:this.props.selected19thHoleCategory.CategorySearchList});

            }).catch((error)=>{

            });
          }
      }

      onforumclick(){
        this.context.router.push('/forumsPage');
      }
       addNewCategory(){
        this.setState({catMsg : ""});
        let name = document.getElementById('txtPostInput');
         this.props.addNew19HoleCategory(this.props.activeUser.token, name.value).then(()=>{
         this.props.get19HoleCategory(this.props.activeUser.token).then(()=>{
            this.setState({Category:this.props.forumCourse.get19Category,catMsg : ""});
            
        }).catch((error)=>{

        });
        document.getElementById('txtPostInput').value='';
      }).catch((error)=>{
      });
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
      this.setState({postMsg : ""});
      let subject_line = document.getElementById('PostInput');

      this.props.addNew19HoleCategoryPost(this.props.selected19thHoleCategory.CatDetails.id, this.props.activeUser.token, subject_line.value).then(()=>{
      
        document.getElementById('PostInput').value='';
        this.props.get19HoleCategoryObject(this.props.selected19thHoleCategory.CatDetails.id, this.props.activeUser.token).then((id)=>{
        
          this.setState({categoryDetails:this.props.selected19thHoleCategory.Category,postMsg : ""});
         
      
       }).catch((error)=>{
       });
      }).catch((error)=>{
      });
    }
    }
    Comment(id){
      
      let commentTextBox=(id + "textComment");
      let body = document.getElementById(commentTextBox).value;
      if(body == ""){
      $("#"+commentTextBox).focus();
    }
    else{
      this.props.add19HoleCategoryComment(this.props.selected19thHoleCategory.CatDetails.id, id , this.props.activeUser.token, body).then(()=>{
        
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

    this.setState({
        catMsg: ""
        });
    }

    else{
        this.setState({
        catMsg: e.target.value
    });

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
        }) ;
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


    /*****/
render() {
    let imagePath=IMG_CONSTANT.IMAGE_PATH;
    return (
        <div className="forumCourse">         
          <div className=" col-sm-12 frumCrse">
            {(this.state.ajaxCallInProgress)?(<div className="mt25pc"><Spinner /></div>):(<div className="row">
              <div className="headerContent col-sm-12">
                <div className="courseHeader">
                  <h3 className="header"><span className="glyphicon glyphicon-chevron-left arrowChevron" onClick={this.onforumclick.bind(this)}/>19th HOLE</h3>
                </div>
              </div>
              <div className="col-sm-12 coursesCntnt pdng">
                <div className="bgwhite forumCntnt col-sm-12">
                  <div className="col-sm-4 brdrRyt pdng left-column ">
                    <div className="col-sm-12 pdng7pc">
                    <div className="addCourse col-sm-12">
                          <div className="col-sm-12"><input type="text" className="txtarea"  name="cat_msg" onChange={this.onRequired.bind(this)} onKeyDown={this.enterCapture.bind(this)} id="txtPostInput" placeholder="Add a category.."/></div>
                          <div className="col-sm-12 hrzntLine"></div>
                          <div className="col-sm-12 txtRyt pdryt23px"><input id="addBtn" type="button" value="Add" className="btn postCourse-butn" onClick={this.addNewCategory.bind(this)} disabled={!this.state.catMsg} /></div>
                        </div>
                      <div className="searchBar col-sm-12">
                        <span className="glyphicon glyphicon-search searchIcon" /><input type="text" onKeyPress={this.onCategorySearch.bind(this)} className="searchInput" placeholder=" Search"/>
                      </div>
                      <div className="forumsCourseList col-sm-12 pdng">
                        <ul className="crsesLst">
                        {_.size(this.state.Category)>0 && this.state.Category.map((item, index)=>{
                              return(<div key={index} onClick={this.showCategoryDetails.bind(this,item.id)}>
                             <li id="catList" className={(this.props.selected19thHoleCategory!=undefined && this.props.selected19thHoleCategory!=null && this.props.selected19thHoleCategory.CatDetails.id==item.id)?("selected_element"):("")}><a>{item.name}</a></li>
                             </div> );
                              })}
                          
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-8 right-column">
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
                        <div className="col-sm-12"><input type="text" className="txtarea" ref="post_msg" name="post_msg" onKeyDown={this.enterCapture.bind(this)} onChange={this.onRequired.bind(this)} id="PostInput" placeholder="write something.."/>
                           {this.state.catErr}
                        </div>
                        
                          <div className="col-sm-12 hrzntLine"></div>
                        <div className="col-sm-12 txtRyt pdryt23px"><input type="button" id="postBtn" value="Post" className="btn postCourse-butn" onClick={this.addPost.bind(this)} disabled={!this.state.postMsg}/></div>
                      </div>
                      <div className="corsesLists col-sm-12 pdng">
                         {_.size(this.state.categoryDetails)>0 && this.state.categoryDetails!=undefined && this.state.categoryDetails!=null  ? this.state.categoryDetails.map((item, i) => {
                            
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
                                {item.subject_line}           
                              </div>
                            
                              <div id={item.id+"rplyTopstPerson_one"} className="collapse fade closeThis">
                              <div className="col-sm-12 pdlft0px">
                                <p className="col-sm-12 pdlft0px"><textarea id={item.id+"textComment"} name="reply_msg" className="col-sm-12 txtaria" placeholder="write something..." onChange={this.onRequired.bind(this)}></textarea></p>
                              </div>
                              <div className="col-sm-12 pdlft0px">
                                <div className="col-sm-12 pdlft0px">
                                  <button type="button" className="btn sbmtButn"   onClick={this.Comment.bind(this, item.id)}>Reply</button>
                                  <button type="button" className="cnclButn">Cancel</button>
                                </div>
                              </div>
                            </div>
                              </div>
                              <div className="coursesRspns col-sm-12 pdng">
                                {_.size(item.comments)>0 && item.comments.map((childItem, childIndex)=>{
                                      return(<div className="rplyMember col-sm-12 pdng pdbtm1pc" >
                                  <div className="col-sm-12 pdng">
                                    <div className="col-sm-4 personName">{childItem.created_by}</div>
                                    <div className="col-sm-6 personSeen">{childItem.created_on}</div>                               
                                  </div>
                                  <div className="col-sm-12 personMsg mt1pc pdng">
                                    {childItem.body}
                                  </div>
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
                <img src="/assets/img/ads.png" className="adImg" />
              </div>
            </div>)}
          </div>        
        </div>
         );
   }
}
Forum19Hole.contextTypes = {
  router: React.PropTypes.object.isRequired
};
function mapStateToProps(state) {
    return {

        activeUser: (state.activeUser!=null)?(state.activeUser):(JSON.parse(sessionStorage.getItem('userDetails'))),
        forumCourse:state.forumCourse,
        selected19thHoleCategory:state.selected19thHoleCategory
        
       
    };
}

function matchDispatchToProps(dispatch){
    return bindActionCreators({get19HoleCategory, get19HoleCategoryDetails, get19HoleCategoryObject, addNew19HoleCategory, addNew19HoleCategoryPost, search19HoleCategoryPosts, add19HoleCategoryComment, searchCategory}, dispatch);


}

export default  connect(mapStateToProps, matchDispatchToProps)(Forum19Hole);