const registrationForm = document.getElementById('registration-form');

registrationForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const errorMessageElement = document.getElementById('register-error-message');

    // Clear previous error messages
    errorMessageElement.textContent = '';
    errorMessageElement.style.display = 'none';

    if (passwordInput.value !== confirmPasswordInput.value) {
        errorMessageElement.textContent = 'Passwords do not match';
        errorMessageElement.style.display = 'block';
        passwordInput.value = '';
        confirmPasswordInput.value = '';
        return; // Stop further execution
    }

    // Prepare the data to send
    const registrationData = {
        email: emailInput.value,
        password: passwordInput.value,
    };

    // Send the registration request using the Fetch API
    const response = await fetch('/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
    });

    if (response.status === 400) {
        return response.json().then(data => {
            const errorMessage = data.error;
            errorMessageElement.textContent = errorMessage;
            errorMessageElement.style.display = 'block';
        });
    } else if (response.ok) {
        // Redirect to dashboard or a confirmation page
        document.location.replace('/dashboard');
    } else {
        errorMessageElement.textContent = 'An error occurred during registration. Please try again.';
        errorMessageElement.style.display = 'block';
    }
});