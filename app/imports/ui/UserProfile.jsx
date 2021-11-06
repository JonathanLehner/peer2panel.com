import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import UserProfileForm from './UserProfileForm.jsx';
import Accordion from 'react-bootstrap/Accordion';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import RoomForm from './RoomForm.jsx';

class UserProfile extends Component {
  constructor(props){
    super(props);
    this.state = {}
  }

  render() {
    return (
      <div>
        <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
          <Tab eventKey="home" title="My profile">
            <div>My Profile</div>
            <UserProfileForm {...this.props} />
          </Tab>
          <Tab eventKey="profile" title="My rooms">
            <div>My rooms</div>
            <RoomList />
          </Tab>
        </Tabs>
      </div>
    );
  }
}

export default StartupContainer = withTracker(() => {
  const user = Meteor.user();
  const fileID = user && user.profile && user.profile.profileImage;
  let fileUrl;
  let videoUrl;
  let videoType;
  if(fileID){
    const file = Images.findOne({_id: fileID});
    fileUrl = file && file.link();
  }
  const videoID = user && user.profile && user.profile.pitchVideo;
  if(videoID){
    const file = Videos.findOne({_id: videoID});
    videoUrl = file && file.link();
    videoType = file && file.type;
  }
  return {
    user,
    profileImage: fileUrl,
    pitchVideo: videoUrl,
    videoType,
  };
})(UserProfile);

const RoomList = () => {
  const [modalShow, setModalShow] = React.useState(false);

  return (
    <div>
      <Accordion>
        <Card>
          <Card.Header>
            <Accordion.Toggle as={Button} variant="link" eventKey="0">
              Room1
            </Accordion.Toggle>
          </Card.Header>
          <Accordion.Collapse eventKey="0">
            <Card.Body>Hello! I'm the body</Card.Body>
          </Accordion.Collapse>
        </Card>
        <Card>
          <Card.Header>
            <Accordion.Toggle as={Button} variant="link" eventKey="1">
              Room2
            </Accordion.Toggle>
          </Card.Header>
          <Accordion.Collapse eventKey="1">
            <Card.Body>Hello! I'm another body</Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
      <Button variant="primary" onClick={() => setModalShow(true)}>
        Add room
      </Button>
      <NewRoomModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </div>
  );
}

function NewRoomModal(props) {
  return (
    <Modal
      {...props}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Modal heading
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Centered Modal</h4>
        <RoomForm />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
