document.addEventListener('DOMContentLoaded', () => {
    // Get the habitId from the HTML element, you may need to adjust the selector
    const habitId = document.getElementById('habitId').textContent; // Adjust this selector as needed

    // Add the event listener to the "Mark as Performed" button
    document.getElementById('markPerformedButton').addEventListener('click', () => {
        markHabitAsPerformed(habitId);
    });
});

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
