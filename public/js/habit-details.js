const performancesTodayEl = document.getElementById('performancesToday');

document.addEventListener('DOMContentLoaded', async () => {
    const habitId = document.getElementById('habitId').textContent;

    await updatePerformancesToday(habitId);

    document.getElementById('markPerformedButton').addEventListener('click', async () => {
        markHabitAsPerformed(habitId);
        await updatePerformancesToday(habitId);

        const lastPerformedDate = document.querySelector('#lastPerformedDate');
        lastPerformedDate.textContent = getCurrentDate();
    });
});

const backButton = document.getElementById('back-button');
backButton.addEventListener('click', function() {
    document.location.replace('/dashboard');
})

const deleteButton = document.getElementById('delete-btn');
deleteButton.addEventListener('click', deleteCurrentHabit);

async function deleteCurrentHabit() {
    const habitId = getHabitIdFromURL();
    if (habitId) {
        try {
            const response = await fetch(`/api/habit/delete/${habitId}`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);

            // Check if the content type is JSON
            const contentType = response.headers.get('Content-Type');
            if (contentType && contentType.includes('application/json')) {
                const responseData = await response.json();
                console.log('Response data:', responseData);

                if (response.ok) {
                    if (responseData.success) {
                        console.log('Habit deleted successfully:', habitId);
                        window.location.replace('/dashboard');
                    } else {
                        console.error('Error:', responseData.error);
                    }
                } else {
                    console.error('Error:', response.statusText);
                }
            } else {
                // Handle non-JSON content (possibly HTML or error page)
                const responseText = await response.text();
                console.error('Non-JSON response:', responseText);
                // You might want to redirect or display an error message here
            }
        } catch (error) {
            console.error('Error:', error);
        }
    } else {
        console.error('Error: Unable to determine habit ID');
    }
}

function getHabitIdFromURL() {
    // Implement this function to extract the habit ID from the current URL
    // Example: /api/habit/details/123
    const urlParts = window.location.pathname.split('/');
    return urlParts[urlParts.length - 1];
}

function getCurrentDate() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function markHabitAsPerformed(habitId) {
    fetch(`/api/habit/markPerformed/${habitId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // After marking the habit as performed, you may want to update the UI
                // You can call a function here to refresh the habit details or do any other necessary updates
                // For example, display a success message or update the last performed date
            } else {
                console.error('Error:', data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

async function getPerformancesToday(habitId, divToUpdate) {
    try {
        const response = await fetch(`/api/habit/performancesToday/${habitId}`);
        const data = await response.json();
        if (data.success) {
            return data.performancesToday;
        } else {
            console.error('Error:', data.error);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function updatePerformancesToday(habitId) {
    try {
        const performancesToday = await getPerformancesToday(habitId);
        performancesTodayEl.textContent = `${performancesToday}`;
    } catch (error) {
        console.error('Error:', error);
    }
}