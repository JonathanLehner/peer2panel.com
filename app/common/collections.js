
// common collections
Users = Meteor.users;
Data = new Mongo.Collection('data');
PVAssets = new Mongo.Collection('pvassets');
PVContracts = new Mongo.Collection('pvcontracts');
PVListings = new Mongo.Collection('pvlistings');

import { Meteor } from 'meteor/meteor';