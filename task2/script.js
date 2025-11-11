// STEP 2: JavaScript Form Validation Logic
const form = document.getElementById('contactForm');
const emailInput = document.getElementById('email');
const formMessage = document.getElementById('form-message');

form.addEventListener('submit', function(e) {
    e.preventDefault(); // Stop the default form submission (Crucial for validation)

    const name = document.getElementById('name').value.trim();
    const email = emailInput.value.trim();
    const message = document.getElementById('message').value.trim();

    // Check for empty fields
    if (name === "" || email === "" || message === "") {
        formMessage.textContent = "Error: All fields are required.";
        formMessage.style.color = 'red';
        return;
    }

    // Check for correct email format using a basic regular expression
    if (!isValidEmail(email)) {
        formMessage.textContent = "Error: Please enter a valid email address (e.g., example@domain.com).";
        formMessage.style.color = 'red';
        return;
    }

    // If all checks pass: Success
    formMessage.textContent = "Success! Form data is valid and ready to submit.";
    formMessage.style.color = 'green';
    
    // Clear the form after successful validation
    form.reset(); 
});

function isValidEmail(email) {
    // Basic regex for email validation: checks for name@domain.tld structure
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}


// STEP 4: Dynamic To-Do List (DOM Manipulation Logic)
const todoInput = document.getElementById('todo-input');
const addTaskBtn = document.getElementById('add-task-btn');
const todoList = document.getElementById('todo-list');

// Event listener for the "Add Task" button
addTaskBtn.addEventListener('click', addTask);

// Event listener for "Enter" key press in the input field
todoInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

function addTask() {
    const taskText = todoInput.value.trim();

    if (taskText === "") {
        alert("Task description cannot be empty!");
        return;
    }

    // 1. Create the list item element
    const listItem = document.createElement('li');
    
    // 2. Add the text content
    listItem.textContent = taskText;

    // 3. Create a delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Remove';
    deleteBtn.className = 'delete-btn';
    
    // 4. Attach an event handler to the delete button
    deleteBtn.onclick = function() {
        todoList.removeChild(listItem); // Remove the parent li when clicked
    };

    // 5. Append the button to the list item, and the list item to the main list
    listItem.appendChild(deleteBtn);
    todoList.appendChild(listItem);

    // 6. Clear the input field for the next task
    todoInput.value = '';
}