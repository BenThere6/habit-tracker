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
                displayHabits();
                console.log('New habit created:', data.habit);
            } else {
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

async function displayHabits() {
    try {
        const response = await fetch('/api/habit/fetch');
        if (response.ok) {
            const data = await response.json();

            if (Array.isArray(data)) {
                const habitContainer = document.getElementById('habit-container');
                habitContainer.innerHTML = '';
                const goodContainer = document.createElement('div');
                const badContainer = document.createElement('div');

                goodContainer.classList.add('hide');
                badContainer.classList.add('hide');

                goodContainer.className = 'good-container';
                badContainer.className = 'bad-container';

                for (const habit of data) {
                    const habitDiv = await createHabitTile(habit);
                    
                    if (habit.habit_type === 'good') {
                        goodContainer.appendChild(habitDiv);
                    } else {
                        badContainer.appendChild(habitDiv);
                    }
                }

                const goodCard = document.createElement('div');
                const badCard = document.createElement('div');
                goodCard.className = 'good-card';
                badCard.className = 'bad-card';

                const goodTitle = document.createElement('div');
                const badTitle = document.createElement('div');
                goodTitle.className = 'good-title habit-title';
                badTitle.className = 'bad-title habit-title';
                goodTitle.textContent = "Good Habits";
                badTitle.textContent = "Bad Habits";

                goodCard.appendChild(goodTitle);
                badCard.appendChild(badTitle);
                goodCard.appendChild(goodContainer);
                badCard.appendChild(badContainer);
                habitContainer.appendChild(goodCard);
                habitContainer.appendChild(badCard);

                if (goodContainer.childElementCount < 1) {
                    goodCard.classList.add("hide");
                } else {
                    goodCard.style.display = 'flex';
                }

                if (badContainer.childElementCount < 1) {
                    badCard.classList.add("hide");
                } else {
                    badCard.style.display = 'flex';
                }

                if (goodContainer.childElementCount + badContainer.childElementCount < 1) {
                    habitContainer.classList.add("hide");
                } else {
                    habitContainer.classList.remove("hide");
                }

                // Apply font size adjustments to all streak elements
                document.querySelectorAll('.streak.tile-num').forEach(adjustFontSize);
            }
        } else {
            console.error('Error:', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
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

// Function to create a habit tile with dynamic font size based on streak
async function createHabitTile(habit) {
    const habitDiv = document.createElement('div');
    const habitName = document.createElement('div');
    habitName.textContent = habit.habit_name;
    habitName.className = 'habit-name';
    habitDiv.appendChild(habitName);
    habitDiv.addEventListener('click', function () {
        try {
            document.location.replace(`/api/habit/details/${habit.habit_id}`);
        } catch (err) {
            console.log(err);
        }
    });
    const numLabel = document.createElement('div');
    numLabel.className = 'num-label';

    if (habit.habit_type === 'good') {
        const performedToday = await isHabitPerformedToday(habit.habit_id);
        if (!performedToday) {
            habitDiv.style.border = '2px solid red';
        }

        habitDiv.className = 'habit-item good-habit';
        numLabel.textContent = 'Current Streak';

        const streak = await getHabitStreak(habit.habit_id);

        const streakDiv = document.createElement('div');
        streakDiv.className = 'streak tile-num';
        streakDiv.textContent = streak;

        // Adjust font size based on streak number
        adjustFontSize(streakDiv);

        habitDiv.appendChild(streakDiv);
        habitDiv.appendChild(numLabel);
    } else {
        habitDiv.className = 'habit-item bad-habit';
        numLabel.textContent = 'Days Without';

        // Use Moment.js for date comparison
        const lastPerformedDate = moment(habit.last_performed).startOf('day');
        const currentDate = moment().startOf('day');
        const daysSince = currentDate.diff(lastPerformedDate, 'days');

        const daysSinceDiv = document.createElement('div');
        daysSinceDiv.className = 'days-since tile-num';
        daysSinceDiv.textContent = daysSince >= 0 ? daysSince : 'N/A';

        habitDiv.appendChild(daysSinceDiv);
        habitDiv.appendChild(numLabel);
    }

    return habitDiv;
}

async function getHabitStreak(habitId) {
    try {
        const response = await fetch(`/api/habit/streak/${habitId}`);
        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                return data.streak;
            } else {
                console.error('Error:', data.error);
                return 'Error';
            }
        } else {
            console.error('Error:', response.statusText);
            return 'Error';
        }
    } catch (error) {
        console.error('Error:', error);
        return 'Error';
    }
}

async function adjustFontSize() {
    try {
        const allTileNums = document.querySelectorAll('.tile-num');

        allTileNums.forEach((tileNum) => {
            // Calculate the number of digits in the streak
            const numberOfDigits = tileNum.textContent.toString().length;

            // Set font size based on the number of digits
            if (numberOfDigits > 4) {
                tileNum.style.fontSize = '40px';
            } else if (numberOfDigits > 3) {
                tileNum.style.fontSize = '50px';
            } else if (numberOfDigits > 2) {
                tileNum.style.fontSize = '70px';
            } else if (numberOfDigits > 1) {
                tileNum.style.fontSize = '100px';
            }
        });
    } catch (error) {
        console.error('Error: ', error);
    }
}

async function isHabitPerformedToday(habitId) {
    try {
        const response = await fetch(`/api/habit/performancesToday/${habitId}`);
        const data = await response.json();
        if (data.success) {
            return data.performancesToday > 0;
        } else {
            console.error('Error:', data.error);
            return false;
        }
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
}