import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import App from '/imports/ui/App.jsx';
import '/common/collections.js';
import '/common/de.i18n.json';
import '/common/en.i18n.json';
import i18n from 'meteor/universe:i18n';
import Cookies from 'js-cookie'

Meteor.startup(() => {
  render(<App />, document.getElementById('react-target'));
});

// use the browser's locale
// give preference to language cookies
function getLang () {
  return (
  Cookies.get('language') || 
      navigator.languages && navigator.languages[0] ||
      navigator.language ||
      navigator.browserLanguage ||
      navigator.userLanguage ||
      'en-US'
  );
}
const lang = getLang();
console.log(lang)
i18n.setLocale(lang);