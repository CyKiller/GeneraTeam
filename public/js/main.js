// Adding an event listener to ensure proper form submission and logging for debugging.
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    const feedbackElement = document.createElement('p');
    form.appendChild(feedbackElement); // Add feedback element to the form

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission
        submitButton.textContent = 'Submitting...'; // Indicate submission process
        submitButton.disabled = true; // Disable the button to prevent multiple submissions

        const formData = new FormData(form);
        const requestText = formData.get('requestText'); // Correctly extracting 'requestText' from formData using get method

        if (!requestText.trim()) {
            console.error('Error submitting form: Request text cannot be empty.');
            feedbackElement.textContent = 'Request text cannot be empty.';
            feedbackElement.style.color = 'red';
            submitButton.textContent = originalButtonText; // Restore button text
            submitButton.disabled = false; // Re-enable the button
            return;
        }

        // Fetch API to submit the form data to the server
        fetch('/api/requests', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ requestText: requestText }), // Correctly using 'requestText' in the JSON body
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => Promise.reject(data.message || "An error occurred while submitting the request."));
            }
            return response.json();
        })
        .then(data => {
            console.log('Response from server:', data); // Log the response from the server
            if (data.success) {
                window.location.href = '/team'; // Redirect on success
            } else {
                throw new Error('Error submitting request: ' + (data.message || "Unknown error occurred."));
            }
        })
        .catch(error => {
            console.error('Error submitting form:', error);
            feedbackElement.textContent = error.toString();
            feedbackElement.style.color = 'red';
            submitButton.textContent = originalButtonText; // Restore button text
            submitButton.disabled = false; // Re-enable the button
        });
    });
});