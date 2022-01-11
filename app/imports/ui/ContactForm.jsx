// Make sure to run npm install @formspree/react
// For more help visit https://formspr.ee/react-help
import React from 'react';
import { useForm, ValidationError } from '@formspree/react';
function ContactForm() {
  const [state, handleSubmit] = useForm("xqknarbv");
  if (state.succeeded) {
      return <p>Thanks for your interest! We will get back to you shortly!</p>;
  }
  return (
      <form onSubmit={handleSubmit} style={{width: "200px"}}>
       <div>
            <label htmlFor="email">
                Email Address
            </label>
            <input
                    id="email"
                    type="email" 
                    name="email"
                    required
                />
                <ValidationError 
                    prefix="Email" 
                    field="email"
                    errors={state.errors}
                />
       </div>
       <div>
            <label htmlFor="email">
                Name
            </label>
            <input
                id="name"
                name="name"
                required
            />
        </div>
        <div>
            <label htmlFor="email">
                Postcode
            </label>
            <input
                id="postcode"
                type="number"
                name="postcode"
                required
            />
        </div>
        <div>
            <label htmlFor="email">
                Number of persons in household
            </label>
            <input
                id="postcode" // somehow it crashes when I change this
                type="number"
                name="household"
                required
            />
        </div>
        <div>
            <label htmlFor="email">
                Phone
            </label>
            <input
                id="tel"
                type="tel" 
                name="tel"
                required
            />
       </div>
       <div>
            <label htmlFor="email">
                Comments
            </label>
            <textarea
                id="message"
                name="message"
                required
            />
            <ValidationError 
                prefix="Message" 
                field="message"
                errors={state.errors}
            />
        </div>
      <button className="button" type="submit" disabled={state.submitting}>
        Submit
      </button>
    </form>
  );
}
function App() {
  return (
    <ContactForm />
  );
}
export default App;
