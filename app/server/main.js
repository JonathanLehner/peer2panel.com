import { Meteor } from 'meteor/meteor';
import '/common/collections.js';
import './methods.js';

Meteor.startup(() => {
    if(Users.find().fetch().length == 1){
        console.log("doing fixtures");
        for(var i=0; i<20; i++){
            Meteor.call('createNewUser', {name: i});
        }
    }
});

import { UserStatus } from 'meteor/mizzao:user-status';

// Try setting this so it works on meteor.com
// (https://github.com/oortcloud/unofficial-meteor-faq)
process.env.HTTP_FORWARDED_COUNT = 1;

Meteor.publish(null, () => [
  Meteor.users.find({
    'status.online': true
  }, { // online users only
    fields: {
      status: 1,
      username: 1
    }
  }),
  UserStatus.connections.find()
]);
