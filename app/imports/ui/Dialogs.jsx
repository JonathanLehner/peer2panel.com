
  import React from 'react';

  function Dialogs(props) {
      return (
          <div>
            <article id="successDialog" className="message is-success is-hidden">
              <div className="message-header">
                <p>Success</p>
                <button className="delete" aria-label="delete"></button>
              </div>
              <div className="message-body">
                <span id="successMessage"></span>
              </div>
            </article>
            <article id="errorDialog" className="message is-danger is-hidden">
              <div className="message-header">
                <p>Error</p>
                <button className="delete" aria-label="delete"></button>
              </div>
              <div className="message-body">
                An error occurred: <span id="errorMessage"></span>
              </div>
            </article>
          </div>
      )
    }
  
  export default Dialogs;