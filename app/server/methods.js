
Meteor.methods({
    'saveUserData': (args) => {
        const oldUserData = Meteor.user().profile.userData || {};
        const newUserData = {...oldUserData, ...args};
        console.log(newUserData);
        Meteor.users.update({_id: Meteor.userId()},
            {$set: {"profile.userData": newUserData}});
    },
    'createNewUser': (args) => {
        Meteor.users.insert(
            {
                "emails": [],
                "profile": {
                  "profileImage": "dmnv2mjb4Kd2wQKoa",
                  "userData" : {
                      "name": args.name,
                      "gender": "woman",
                      "aboutme": "I am lonely",
                      "lookingfor": "men"
                  }
                }
              }
        );
    },
    'likeUser': (args) => {
        const userData = Meteor.user().profile.userData || {};
        const likedUsers = userData && userData.likedUsers || [];
        Meteor.users.update({_id: Meteor.userId()},
            {$set: {"profile.userData.likedUsers": [...likedUsers, args.likedUser]}});
        const likedUserData = Users.findOne({_id: args.likedUser}).profile.userData || {};
        const likedByUsers = likedUserData && likedUserData.likedByUsers || [];
        Meteor.users.update({_id: args.likedUser},
            {$set: {"profile.userData.likedByUsers": [...likedByUsers, Meteor.userId()]}});

        const otherLinkedUsers = likedUserData.likedUsers || [];
        if(otherLinkedUsers.includes(Meteor.userId())){
            console.log("match");
            Meteor.call('matchUser', {user1: Meteor.userId(), user2: args.likedUser});
        }
    },
    'dislikeUser': (args) => {
        const userData = Meteor.user().profile.userData || {};
        const dislikedUsers = userData && userData.dislikedUsers || [];
        Meteor.users.update({_id: Meteor.userId()},
            {$set: {"profile.userData.dislikedUsers": [...dislikedUsers, args.dislikedUser]}});
        const dislikedUserData = Users.findOne({_id: args.dislikedUser}).profile.userData || {};
        const dislikedByUsers = dislikedUserData && dislikedUserData.dislikedByUsers || [];
        Meteor.users.update({_id: args.dislikedUser},
            {$set: {"profile.userData.dislikedByUsers": [...dislikedByUsers, Meteor.userId()]}});
    },
    'resetLikes': () => {
        const userData = Meteor.user().profile.userData || {};
        const likedUsers = userData && userData.likedUsers || [];
        Meteor.users.update({_id: Meteor.userId()},
            {$set: {"profile.userData.likedUsers": []}});
        likedUsers.forEach((likedUser) => {
            const likedUserObj = Users.findOne({_id: likedUser});
            const likedByUsers = likedUserObj && likedUserObj.profile.userData.likedByUsers;
            const newLikedByUsers = likedByUsers.filter((n)=>n!=Meteor.userId());
            Meteor.users.update({_id: likedUser},
                {$set: {"profile.userData.likedByUsers": newLikedByUsers}});
        });
    },
    'resetDislikes': () => {
        const userData = Meteor.user().profile.userData || {};
        const dislikedUsers = userData && userData.dislikedUsers || [];
        Meteor.users.update({_id: Meteor.userId()},
            {$set: {"profile.userData.dislikedUsers": []}});
        dislikedUsers.forEach((dislikedUser) => {
            const dislikedUserObj = Users.findOne({_id: dislikedUser});
            const dislikedByUsers = dislikedUserObj && dislikedUserObj.profile.userData.dislikedByUsers;
            const newDislikedByUsers = dislikedByUsers.filter((n)=>n!=Meteor.userId());
            Meteor.users.update({_id: dislikedUser},
                {$set: {"profile.userData.likedByUsers": newDislikedByUsers}});
        });
    },
    'unmatchUser': () => {
        const matchedUser = Meteor.user().profile.userData.match;
        Meteor.users.update({_id: Meteor.userId()},
            {$set: {"profile.userData.match": null}});
        Meteor.users.update({_id: matchedUser},
            {$set: {"profile.userData.match": null}});
    },
    'matchUser': (args) => {
        console.log(args);
        Meteor.users.update({_id: args.user1},
            {$set: {"profile.userData.match": args.user2}});
        Meteor.users.update({_id: args.user2},
            {$set: {"profile.userData.match": args.user1}});
    },
    'rockpaperscissors': (args) => {
        console.log(args);
        Meteor.users.update({_id: Meteor.userId()},
            {$set: {"profile.games.rockpaperscissors": args.action}});
    },
    'rockpaperscissors_reset': (args) => {
        console.log(args);
        Meteor.users.update({_id: Meteor.userId()},
            {$set: {"profile.games.rockpaperscissors": ''}});
        Meteor.users.update({_id: args.player2},
            {$set: {"profile.games.rockpaperscissors": ''}});
    }


});