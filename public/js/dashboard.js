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

document.addEventListener('DOMContentLoaded', () => {
    displayHabits();
})

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

                    const markPerformedButton = document.createElement('button');
                    markPerformedButton.textContent = 'Mark as Performed';
                    markPerformedButton.addEventListener('click', () => {
                        markHabitAsPerformed(habit.habit_id);
                    });
                    habitDiv.appendChild(markPerformedButton);

                    if (habit.habit_type === 'good') {
                        habitDiv.className = 'habit-item good-habit';
                        goodContainer.appendChild(habitDiv);
                    } else {
                        const badHabitParentDiv = document.createElement('div');
                        badHabitParentDiv.className = 'bad-habit-parent';

                        habitDiv.className = 'habit-item bad-habit';

                        let daysSinceLastPerformed = 'Not performed yet';

                        if (habit.last_performed) {
                            const lastPerformedDate = new Date(habit.last_performed);
                            const currentDate = new Date();
                            daysSinceLastPerformed = `Last performed: ${Math.floor((currentDate - lastPerformedDate) / (1000 * 60 * 60 * 24))} days ago`;
                            if (daysSinceLastPerformed === 'Last performed: 0 days ago') {
                                daysSinceLastPerformed = 'Last performed: Today';
                            } else if (daysSinceLastPerformed === 'Last performed: 1 days ago') {
                                daysSinceLastPerformed = 'Last performed: Yesterday';
                            }
                        }

                        // Create a child div for days since last performed
                        const daysSinceLastPerformedDiv = document.createElement('div');
                        daysSinceLastPerformedDiv.textContent = daysSinceLastPerformed;
                        badHabitParentDiv.appendChild(habitDiv);
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

function markHabitAsPerformed(habitId) {
    fetch('/api/habit/markPerformed', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ habitId }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayHabits();
            } else {
                console.error('Error:', data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    displayHabits();
}