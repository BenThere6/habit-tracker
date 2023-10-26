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
            displayHabits();
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

function displayHabits() {
    fetch('/api/habit/fetch')
        .then(response => response.json())
        .then(data => {
            if (Array.isArray(data)) {
                const habitContainer = document.getElementById('habit-container')
                habitContainer.innerHTML = '';

                data.forEach(habit => {
                    const habitDiv = document.createElement('div');
                    habitDiv.className = 'habit-item';

                    // Populate the habit <div> with content (e.g., habit name)
                    habitDiv.textContent = habit.habit_name;

                    // Append the habit <div> to the container
                    habitContainer.appendChild(habitDiv);
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

document.addEventListener('DOMContentLoaded', () => {
    displayHabits();
})