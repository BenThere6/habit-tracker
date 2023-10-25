document.getElementById('habit-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const habitName = document.getElementById('habitName').value;
    const habitType = document.getElementById('habitType').value;

    fetch('/api/habit/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ habitName, habitType }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Handle successful habit creation, e.g., update the UI
            console.log('New habit created:', data.habit);
        } else {
            // Handle errors, e.g., display an error message
            console.error('Error:', data.error);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });

    this.reset();
});