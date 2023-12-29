const performancesTodayEl = document.getElementById('performancesToday');

document.addEventListener('DOMContentLoaded', async () => {
    // Get the habitId from the HTML element, you may need to adjust the selector
    const habitId = document.getElementById('habitId').textContent; // Adjust this selector as needed

    await updatePerformancesToday(habitId);

    // Add the event listener to the "Mark as Performed" button
    document.getElementById('markPerformedButton').addEventListener('click', async () => {
        markHabitAsPerformed(habitId);
        await updatePerformancesToday(habitId);

        const lastPerformedDate = document.querySelector('#lastPerformedDate');
        lastPerformedDate.textContent = getCurrentDate();
    });
});

function getCurrentDate() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 to the month since it's zero-based
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
            // divToUpdate.textContent = `Performed today: ${data.performancesToday}`;
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