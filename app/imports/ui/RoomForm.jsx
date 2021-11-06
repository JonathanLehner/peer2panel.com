import React, {useState} from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import FileUpload from './FileUpload.js';
import VideoRecorder from 'react-video-recorder'
import VideoUpload from './VideoUpload.js';

const RoomForm = (props) => {
    console.log(props);
    const user = props.user;
    const userData = user && user.profile && user.profile.userData;
    console.log(userData)
    const name = userData && userData.name || "";
    const gender = userData && userData.gender || "man";
    const aboutme = userData && userData.aboutme || "";
    const lookingfor = userData && userData.lookingfor || "men";
    console.log(name)

    const [video, setVideo] = useState();
  
  /*if(!user){ // prevent loading formik with bad values
    return <div></div>
  }*/

  return (
  <div>
    <Formik
      initialValues={{ 
        name, 
        gender, 
        aboutme,
        lookingfor,
      }}
      validate={values => {
        return true;
      }}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(true);
        setTimeout(() => {
          Meteor.call('saveUserData', values);
          setSubmitting(false);
        }, 400);
      }}
    >
      {({ values, isSubmitting }) => (
        <Form>
          <div>
            <div>Name</div>
            <Field 
              type="text" 
              name="name"
              value={values.name} 
            />
          </div>  
          <div>
            <div>I identify as ... </div>
            <Field 
              as="select" 
              name="gender" 
              value={values.gender} 
              >
              <option val="man">man</option>
              <option val="woman">woman</option>
            </Field>
          </div>
          <div>
            <div>About me </div>
            <Field 
              as="textarea" 
              name="aboutme" 
              value={values.aboutme} 
              />
          </div>
          <div>
            <div>Looking for </div>
            <Field 
              as="select" 
              name="lookingfor" 
              value={values.lookingfor} 
              >
              <option val="men">men</option>
              <option val="women">women</option>
              <option val="both">both</option>
            </Field>
          </div>
          <div style={{width: "200px"}} >
            <div>Profile photo </div>
            <img style={{width: "200px"}}
              src={props.profileImage} />
          </div>
          <div style={{marginBottom: "15px"}} >
            <FileUpload />
          </div>
          <div style={{width: "500px", margin: "15px"}} >
            <VideoRecorder 
              replayVideoAutoplayAndLoopOff={true}
              showReplayControls={true}
              onRecordingComplete={(videoBlob) => {
                // Do something with the video...
                setVideo(videoBlob);
                console.log('videoBlob', videoBlob)
              }} 
            />
          </div>
          <div style={{margin: "15px"}} >
            <VideoUpload video={video}/>
          </div>
          <div style={{margin: "15px"}} >
            <div>Preview</div>
          </div>
          <div style={{width: "500px", margin: "15px"}} >
            {props.pitchVideo ? 
              <video style={{width: "500px"}} height="auto" controls="controls">
                <source src={`${props.pitchVideo}?play=true`} type={props.videoType} />
              </video>
              : ""
            }
          </div>
          <button type="submit" disabled={isSubmitting}>
            Save
          </button>
        </Form>
      )}
    </Formik>
  </div>
    );
}

export default RoomForm;