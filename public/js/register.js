const registrationForm = document.getElementById('registration-form');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm-password');
const passwordError = document.getElementById('message');

registrationForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission

    // Check if passwords match
    if (passwordInput.value !== confirmPasswordInput.value) {
        passwordError.textContent = 'Passwords do not match';
        passwordInput.value = '';
        confirmPasswordInput.value = '';
    } else {
        // Passwords match, proceed with registration
        passwordError.textContent = '';

        // Prepare the data to send
        const formData = new FormData(registrationForm);
        const registrationData = {
            email: formData.get('email'),
            password: formData.get('password'),
        };

        // Send the registration request using the Fetch API
        const response = await fetch('/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(registrationData),
        })
        
        if (response.status === 400) {
            return response.json().then(data => {
                const errorMessage = data.error;
                const errorMessageElement = document.getElementById('message');
                errorMessageElement.textContent = errorMessage;
                errorMessageElement.style.display = 'block';
            });
        } else if (response.ok) {
            document.location.replace('/dashboard');
        } 
    }
    // this.reset();
});