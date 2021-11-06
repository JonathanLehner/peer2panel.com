import React, {useEffect} from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { FaRegThumbsUp, FaRegThumbsDown } from 'react-icons/fa';
import Accordion from 'react-bootstrap/Accordion';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Comments from './Comments.jsx';
import ThreeDModel from './ThreeDModel.jsx';

import {
    useParams
  } from 'react-router-dom'

function RoomDetail(props) {

    let { id } = useParams()
    const [userData, updateUserData] = React.useState();
    const [fileUrl, updatefileUrl] = React.useState();
    
    useEffect(() => {
        const user = props.users.find((user)=>user._id == id);
        const userData = user && user.profile && user.profile.userData;
        updateUserData(userData);

        const fileID = user && user.profile && user.profile.profileImage;
        let fileUrl;
        if(fileID){
          const file = Images.findOne({_id: fileID});
          fileUrl = file && file.link();
          updatefileUrl(fileUrl);
        }
    });

    return (
        <div>
            <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
                <Tab eventKey="home" title="Room">
                    <div>Room</div>
                    <ThreeDModel />
                    <div>About the room</div>
                    <div>City: Zurich</div>
                    <div>Address: Roetelstrasse XXX</div>
                    <div>Description: We are looking for a new roommate for our WG.
                        We are all very nice.
                    </div>
                    <div>Questions</div>
                    <Comments />
                </Tab>
                <Tab eventKey="profile" title="Host">
                    {id ? 
                        <div>
                            <div>{userData && userData.name}, {userData && userData.gender}</div>
                            <div style={{margin: "15px"}} >
                                <div style={{width: "200px"}} >
                                    <div>Profile photo </div>
                                    <img style={{width: "200px"}}
                                    src={fileUrl} />
                                </div>
                            </div>                
                        </div> : ""
                    }
                </Tab>
            </Tabs>
        </div>     
    );
}

export default RoomDetailContainer = withTracker(() => {
    const user = Meteor.user();
    const users = Users.find({
        _id:{
            $ne : Meteor.userId()
        }
    }).fetch();
    return {
        user,
        users
    }; 
  })(RoomDetail);