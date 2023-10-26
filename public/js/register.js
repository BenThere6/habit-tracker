const registrationForm = document.getElementById('registration-form');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm-password');
const passwordError = document.getElementById('password-error');

registrationForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission

    // Check if passwords match
    if (passwordInput.value !== confirmPasswordInput.value) {
        passwordError.style.display = 'block';
    } else {
        // Passwords match, proceed with registration
        passwordError.style.display = 'none';

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
        
        if (response.ok) {
            document.location.replace('/dashboard');
        } else {
            alert(response.statusText);
        }
    }
    this.reset();
});