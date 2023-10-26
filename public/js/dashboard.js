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
                const habitContainer = document.getElementById('habit-container');
                habitContainer.innerHTML = '';
                const goodContainer = document.createElement('div');
                const badContainer = document.createElement('div');
                goodContainer.className = 'good-container';
                badContainer.className = 'bad-container';

                data.forEach(habit => {
                    const habitDiv = document.createElement('div');
                    habitDiv.textContent = habit.habit_name;

                    if (habit.habit_type === 'good') {
                        habitDiv.className = 'habit-item good-habit';
                        goodContainer.appendChild(habitDiv);
                    } else {
                        // Create a parent div for the bad habit
                        const badHabitParentDiv = document.createElement('div');
                        badHabitParentDiv.className = 'bad-habit-parent';

                        // Create a child div for the bad habit's name
                        const badHabitNameDiv = document.createElement('div');
                        badHabitNameDiv.textContent = habit.habit_name;
                        badHabitNameDiv.className = 'habit-item bad-habit';

                        let daysSinceLastPerformed = 'Not performed yet';

                        if (habit.last_performed) {
                            const lastPerformedDate = new Date(habit.last_performed);
                            const currentDate = new Date();
                            daysSinceLastPerformed = `Last performed: ${Math.floor((currentDate - lastPerformedDate) / (1000 * 60 * 60 * 24))} days ago`;
                        }

                        // Create a child div for days since last performed
                        const daysSinceLastPerformedDiv = document.createElement('div');
                        daysSinceLastPerformedDiv.textContent = daysSinceLastPerformed;
                        badHabitParentDiv.appendChild(badHabitNameDiv);
                        badHabitParentDiv.appendChild(daysSinceLastPerformedDiv);
                        badContainer.appendChild(badHabitParentDiv);
                    }
                    habitContainer.appendChild(goodContainer);
                    habitContainer.appendChild(badContainer);
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