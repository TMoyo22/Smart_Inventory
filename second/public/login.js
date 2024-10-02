document.getElementById('loginform').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Retrieve username and password
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // For demonstration purposes, we'll just check if the fields are filled
    if (username && password) {
        // Redirect to the dashboard (replace 'dashboard.html' with your actual dashboard URL)
        window.location.href = 'dashboard.html';
    } else {
        alert('Please enter both username and password.');
    }
});
