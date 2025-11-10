// This function runs once the HTML document is fully loaded
document.addEventListener('DOMContentLoaded', () => {

    // Find the button element by its ID ('interactiveButton')
    const myButton = document.getElementById('interactiveButton');

    // Add an event listener that waits for a 'click' on the button
    myButton.addEventListener('click', () => {

        // When the button is clicked, show this alert message
        alert('Button clicked! You triggered the JavaScript alert. 👍');

    });

});