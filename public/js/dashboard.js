// let adjustedDate = getAdjustedDateDate();

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

async function displayHabits() {
    try {
        const response = await fetch('/api/habit/fetch');
        if (response.ok) {
            const data = await response.json();

            if (Array.isArray(data)) {
                // let goodCount = 0;
                // let badCount = 0;

                const habitContainer = document.getElementById('habit-container');
                habitContainer.innerHTML = '';
                const goodContainer = document.createElement('div');
                const badContainer = document.createElement('div');

                goodContainer.classList.add('hide');
                badContainer.classList.add('hide');

                goodContainer.className = 'good-container auth-container';
                badContainer.className = 'bad-container auth-container';

                for (const habit of data) {
                    const habitDiv = document.createElement('div');
                    habitDiv.textContent = habit.habit_name;
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
                        // goodCount++;
                        // goodContainer.classList.remove('hide');

                        habitDiv.className = 'habit-item good-habit';
                        numLabel.textContent = 'Current Streak';

                        const streak = await getHabitStreak(habit.habit_id);

                        const streakDiv = document.createElement('div');
                        streakDiv.className = 'streak tile-num';
                        streakDiv.textContent = streak;

                        habitDiv.appendChild(streakDiv);
                        habitDiv.appendChild(numLabel);
                        goodContainer.appendChild(habitDiv);
                    } else {
                        // badCount++;
                        // badContainer.classList.remove('hide');

                        habitDiv.className = 'habit-item bad-habit';
                        numLabel.textContent = 'Days Ago';

                        const lastPerformedDate = new Date(habit.last_performed);
                        const currentDate = new Date();
                        const timeDifference = currentDate.getTime() - lastPerformedDate.getTime();

                        const daysSinceDiv = document.createElement('div');
                        daysSinceDiv.className = 'days-since tile-num';
                        daysSinceDiv.textContent = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
                        if (daysSinceDiv.textContent == 19661) {
                            daysSinceDiv.textContent = 'N/A';
                        }

                        habitDiv.appendChild(daysSinceDiv);
                        habitDiv.appendChild(numLabel);
                        badContainer.appendChild(habitDiv);
                    }
                }

                habitContainer.appendChild(goodContainer);
                habitContainer.appendChild(badContainer);

                // habitCount = goodCount + badCount;
                // if (habitCount < 1) {
                //     habitContainer.classList.add("hide");
                // } else {
                //     habitContainer.classList.remove("hide");
                // }
                // if (goodCount < 1) {
                //     goodContainer.classList.add("hide");
                // }
                // if (badCount < 1) {
                //     badContainer.classList.add("hide");
                // }

                if (goodContainer.childElementCount < 1) {
                    goodContainer.classList.add("hide");
                } else {
                    goodContainer.style.display = 'flex';
                }
                
                if (badContainer.childElementCount < 1) {
                    badContainer.classList.add("hide");
                } else {
                    badContainer.style.display = 'flex';
                }
                
                if (goodContainer.childElementCount + badContainer.childElementCount < 1) {
                    habitContainer.classList.add("hide");
                    // badContainer.classList.add('hide')
                    // goodContainer.classList.add('hide')
                } else {
                    habitContainer.classList.remove("hide");
                }
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

// function getAdjustedDateDate() {
//     const currentDateTime = new Date();
//     // Subtract 10 hours (10 * 60 minutes * 60 seconds * 1000 milliseconds)
//     const adjustedDateTime = new Date(currentDateTime - 3 * 60 * 60 * 1000);

//     // Get the date portion (yyyy-mm-dd)
//     const year = adjustedDateTime.getFullYear();
//     const month = String(adjustedDateTime.getMonth() + 1).padStart(2, '0'); // Add 1 to month since it's zero-based
//     const day = String(adjustedDateTime.getDate()).padStart(2, '0');

//     return `${year}-${month}-${day}`;
// }

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