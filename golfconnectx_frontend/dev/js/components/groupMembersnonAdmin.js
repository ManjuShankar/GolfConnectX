import React, {Component} from 'react';
import {render} from 'react-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import{IMG_CONSTANT} from '../constants/application.constants';

class GroupMembersnonAdmin extends Component{
    constructor(props,context)
    {
        super(props);
       
    }
    render()
    {
        let imagePath=IMG_CONSTANT.IMAGE_PATH;
        return(
             <div className="gpnonadminmembers">
              
       <div className="Groupmember">
        <div className="editgrpimg"> 
            <img src={imagePath+"coverimg.png"} className="coverimg"></img>
            <div className="captionDiv">
                <span className="imgtag">12 Members</span>
               
            </div> 
    </div>
    
    
    <div className="tabsForEvents">
    <Tabs>
              <TabList className="EventsTabHeader">
          
          <Tab>Member</Tab>
           <Tab>Gallery</Tab>
          <Tab>Events</Tab>
         <Tab>Info</Tab>
                  
        </TabList>
         <button className="btnContactAdmin">Contact Admin</button>
</Tabs>
    </div>       
              
                 <div className="tophead col-sm-12">
                  <div className="col-sm-4">
                  <span className="fontclr">12 Members
                  </span>
                  </div>
                  <div className=" col-sm-3">
                <button className="membersbtn">+ Add Members</button>
              </div>
              
                  <div className="searchbox col-sm-3">
                   <span className="glyphicon glyphicon-search"></span> <input type="text" className="searchbr" placeholder="        Find a Member"/>
                  </div>
                  <div className=" col-sm-2">
                      
                      <button className="buttoninvite">Invite People</button>
                      
                  </div>
         <div className="dividertag"> 
             
                  </div>
                  </div>
                 
           <div className="col-sm-12">
             
               
               <div className="col-sm-2">
           <img src={imagePath+"meo aldo.png"} className="moealdo"></img>
           
           </div>
           <div  className="col-sm-4">
            <h2> Moe Aldo</h2>
           <p>  Lorem ipsum dolor sit amet, consecteturadipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna.</p>

           </div>
           
           
            <div className="col-sm-2">
           <img src={imagePath+"gina arnold.png"} className="moealdo"></img>
           
           </div>
           <div  className="col-sm-4">
            <h2> Gina Arnold</h2>
           <p>  Lorem ipsum dolor sit amet, consecteturadipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna.</p>

           </div>
              </div>
           
           <div className="col-sm-12">
               <div className="col-sm-2">
         
           <img src={imagePath+"MB.png"} className="mb"></img>
            
           </div>
           
           <div  className="col-sm-4">
            <h2> Michael Bilson</h2>
           <p>  Lorem ipsum dolor sit amet, consecteturadipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna.</p>

           </div>
          
      
               
              
                     <div className="col-sm-2">
               
           <img src={imagePath+"tim carson.png"} className="imgtim"></img>
            
           </div>
           
           <div  className="col-sm-4  ">
            <h2 > Tim Carson</h2>
           <p>  Lorem ipsum dolor sit amet, consecteturadipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna.</p>

           </div>
           
                </div>
              </div>
               
               
               
               </div>
            );
    }
}
export default GroupMembersnonAdmin;