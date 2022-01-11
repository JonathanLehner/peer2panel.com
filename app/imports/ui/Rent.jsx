import React, { Component } from 'react';
import ContactForm from './ContactForm';

export default class About extends Component {
  state = {
    counter: 0,
  }

  render() {
    return (
      <div>
        <section className="section">
          <div className="container">

            <h1 className="title">Rent solar panels</h1>
            <p>Get cheap and clean solar energy with no upfront payment! 
              Please contact us with your information and we will get back to you as soon as possible to install 
              solar panels on your roof. Using blockchain for innovative financing makes us cheaper than
              competitors such as <a href={"https://www.enpal.de"} target="_blank">Enpal</a>.</p>
            <p>We contact all customers within 24h.</p>

            <ContactForm />


          </div>
        </section>
      </div>
    );
  }
}

