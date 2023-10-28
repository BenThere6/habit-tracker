let adjustedDate = getAdjustedDateDate();

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

                    const performancesTodayDiv = document.createElement('div');
                    getPerformancesToday(habit.habit_id, performancesTodayDiv);
                    habitDiv.appendChild(performancesTodayDiv);

                    // const markPerformedButton = document.createElement('button');
                    // markPerformedButton.textContent = 'Mark as Performed';
                    // markPerformedButton.addEventListener('click', () => {
                    //     markHabitAsPerformed(habit.habit_id);
                    // });
                    // habitDiv.appendChild(markPerformedButton);

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
                            const currentDate = new Date(adjustedDate);
                            const timeDifference = currentDate.getTime() - lastPerformedDate.getTime();

                            daysSinceLastPerformed = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

                            if (daysSinceLastPerformed === 0) {
                                daysSinceLastPerformed = 'Last performed: Today';
                            } else if (daysSinceLastPerformed === 1) {
                                daysSinceLastPerformed = 'Last performed: Yesterday';
                            } else {
                                daysSinceLastPerformed = `Last performed: ${daysSinceLastPerformed} days ago`;
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

function getPerformancesToday(habitId, divToUpdate) {
    fetch(`/api/habit/performancesToday/${habitId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                divToUpdate.textContent = `Performed today: ${data.performancesToday}`;
            } else {
                console.error('Error:', data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function getAdjustedDateDate() {
    const currentDateTime = new Date();
    // Subtract 10 hours (10 * 60 minutes * 60 seconds * 1000 milliseconds)
    const adjustedDateTime = new Date(currentDateTime - 10 * 60 * 60 * 1000);

    // Get the date portion (yyyy-mm-dd)
    const year = adjustedDateTime.getFullYear();
    const month = String(adjustedDateTime.getMonth() + 1).padStart(2, '0'); // Add 1 to month since it's zero-based
    const day = String(adjustedDateTime.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}