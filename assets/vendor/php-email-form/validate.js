/**
* PHP Email Form Validation - v3.9
* URL: https://bootstrapmade.com/php-email-form/
* Author: BootstrapMade.com
*/
(function () {
  "use strict";

  let forms = document.querySelectorAll('.php-email-form');

  forms.forEach( function(e) {
    e.addEventListener('submit', function(event) {
      event.preventDefault();

      let thisForm = this;

      let action = thisForm.getAttribute('action');
      let recaptcha = thisForm.getAttribute('data-recaptcha-site-key');
      // Common failure: user opened the HTML file directly (file://) and the form action
      // points to a PHP endpoint. Fetch will fail in that case. Provide a clearer error.
      if (location.protocol === 'file:' && action && action.trim().toLowerCase().endsWith('.php')) {
        displayError(thisForm, 'Form submission blocked: you are viewing this page using the file:// protocol. The contact form requires a web server (with PHP) to handle requests. Upload the site to a PHP-enabled server or change the form action to an API endpoint (e.g. Formspree) to test locally.');
        return;
      }
      
      if( ! action ) {
        displayError(thisForm, 'The form action property is not set!');
        return;
      }
      thisForm.querySelector('.loading').classList.add('d-block');
      thisForm.querySelector('.error-message').classList.remove('d-block');
      thisForm.querySelector('.sent-message').classList.remove('d-block');

      let formData = new FormData( thisForm );

      if ( recaptcha ) {
        if(typeof grecaptcha !== "undefined" ) {
          grecaptcha.ready(function() {
            try {
              grecaptcha.execute(recaptcha, {action: 'php_email_form_submit'})
              .then(token => {
                formData.set('recaptcha-response', token);
                php_email_form_submit(thisForm, action, formData);
              })
            } catch(error) {
              displayError(thisForm, error);
            }
          });
        } else {
          displayError(thisForm, 'The reCaptcha javascript API url is not loaded!')
        }
      } else {
        php_email_form_submit(thisForm, action, formData);
      }
    });
  });

  function php_email_form_submit(thisForm, action, formData) {
    fetch(action, {
      method: 'POST',
      body: formData,
      headers: {'X-Requested-With': 'XMLHttpRequest'}
    })
    .then(response => {
      if (response.ok) {
        return response.text();
      }
      // Read response text (if any) to surface server-side error messages
      return response.text().then(text => {
        const bodyMsg = text ? ` - ${text}` : '';
        throw new Error(`${response.status} ${response.statusText}${bodyMsg} (${response.url})`);
      });
    })
    .then(data => {
      thisForm.querySelector('.loading').classList.remove('d-block');
      if (data.trim() == 'OK') {
        thisForm.querySelector('.sent-message').classList.add('d-block');
        thisForm.reset();
      } else {
        throw new Error(data ? data : 'Form submission failed and no error message returned from: ' + action);
      }
    })
    .catch((error) => {
      // Provide a friendlier, actionable message for network failures
      let message = '';
      try {
        const emsg = error && error.toString ? error.toString() : String(error);

        if (emsg.toLowerCase().includes('failed to fetch') || error instanceof TypeError) {
          message = 'Network error: could not reach the server when submitting the form to "' + action + '". Common causes:\n'
            + '- You opened the page using the file:// protocol (run a local web server such as `php -S localhost:8000`).\n'
            + '- The server is not running or the URL is incorrect (check that the POST to "' + action + '" returns 200).\n'
            + '- A CORS policy is blocking the request (if action is on a different origin).\n\n'
            + 'Open your browser DevTools → Network tab, submit the form, and inspect the POST request to see the exact failure. Error details: ' + emsg;
        } else {
          message = emsg;
        }
        console.error('Contact form submission error for', action, error);
      } catch (e) {
        message = 'An unknown error occurred while submitting the form.';
      }

      displayError(thisForm, message);
    });
  }

  function displayError(thisForm, error) {
    thisForm.querySelector('.loading').classList.remove('d-block');
    try {
      thisForm.querySelector('.error-message').innerHTML = (error && error.toString) ? error.toString() : String(error);
    } catch (e) {
      thisForm.querySelector('.error-message').innerHTML = 'An error occurred while displaying an error message.';
    }
    thisForm.querySelector('.error-message').classList.add('d-block');
  }

})();
