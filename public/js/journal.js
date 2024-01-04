document.getElementById('new-journal-entry').addEventListener('submit', async function(event) {
    event.preventDefault();

    try {
        // Fetch current user's ID
        const userIdResponse = await fetch('/api/currentUserId');
        if (!userIdResponse.ok) {
            throw new Error('Could not fetch user ID');
        }
        const userIdData = await userIdResponse.json();

        const habitId = document.getElementById('habit-select').value;
        const entryText = document.getElementById('entryText').value;
        const entryDate = new Date().toISOString();

        const requestBody = {
            user_id: userIdData.userId, // Include the user's ID in the request body
            habit_id: habitId,
            entryText: entryText,
            entry_date: entryDate
        };

        const addEntryResponse = await fetch('/api/journal/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (!addEntryResponse.ok) {
            throw new Error('Failed to create journal entry');
        }

        const addEntryData = await addEntryResponse.json();
        console.log('Journal entry added:', addEntryData);
        // Handle the successful addition of a journal entry (e.g., clear form, update UI)
    } catch (error) {
        console.error('Error:', error);
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/habit/fetch');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const habits = await response.json();

        const selectElement = document.getElementById('habit-select');
        habits.forEach(habit => {
            const option = document.createElement('option');
            option.value = habit.habit_id;
            option.textContent = habit.habit_name;
            selectElement.appendChild(option);
        });
    } catch (err) {
        console.error('Error fetching habits:', err);
    }
});