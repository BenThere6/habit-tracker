document.getElementById('new-journal-entry').addEventListener('submit', async function (event) {
    event.preventDefault();

    try {
        const userId = await getUserID();

        const habitSelectElement = document.getElementById('habit-select');
        const habitId = habitSelectElement.value || null;
        const entryText = document.getElementById('entryText').value;
        const entryDate = new Date().toISOString();

        const requestBody = {
            user_id: userId,
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
        document.getElementById('new-journal-entry').reset();

        const newEntryDiv = document.createElement('div');
        newEntryDiv.className = 'journal-entry';

        // Ensure that habitMap[habitId] exists or handle accordingly
        const habitName = habitId ? ` - ${habitMap[habitId] || 'Unknown Habit'}` : '';
        const UIentryDate = new Date().toLocaleDateString();

        newEntryDiv.innerHTML = `
            <h3 class="font-alternative">${UIentryDate} ${habitName}</h3>
            <p>${entryText}</p>
        `;

        const entriesContainer = document.getElementById('journal-entries');
        entriesContainer.prepend(newEntryDiv); // Adds the new entry to the top of the list

    } catch (error) {
        console.error('Error:', error);
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Fetch user ID and habits
        const userId = await getUserID();
        await populateHabitOptions();

        // Fetch and display journal entries
        await displayJournalEntries(userId);
    } catch (err) {
        console.error('Error:', err);
    }
});

async function populateHabitOptions() {
    const habitResponse = await fetch('/api/habit/fetch');
    if (!habitResponse.ok) {
        throw new Error('Network response was not ok');
    }
    const habits = await habitResponse.json();
    const selectElement = document.getElementById('habit-select');
    habits.forEach(habit => {
        const option = document.createElement('option');
        option.value = habit.habit_id;
        option.textContent = habit.habit_name;
        selectElement.appendChild(option);
    });
}

async function displayJournalEntries(userId) {
    // Fetch entries
    const entriesResponse = await fetch(`/api/journal/entries/${userId}`);
    if (!entriesResponse.ok) {
        throw new Error('Network response was not ok');
    }
    const entries = await entriesResponse.json();

    // Fetch habits and create a map of habitId to habitName
    const habitsResponse = await fetch('/api/habit/fetch');
    if (!habitsResponse.ok) {
        throw new Error('Network response was not ok');
    }
    const habits = await habitsResponse.json();
    const habitMap = habits.reduce((map, habit) => {
        map[habit.habit_id] = habit.habit_name;
        return map;
    }, {});

    // Display entries
    const entriesContainer = document.getElementById('journal-entries');
    entriesContainer.innerHTML = '';

    entries.forEach(entry => {
        const entryDiv = document.createElement('div');
        entryDiv.className = 'journal-entry';
    
        // Create a new div for the header (date/habit name and trash button)
        const entryHeader = document.createElement('div');
        entryHeader.className = 'journal-entry-header';
    
        const trashBtn = document.createElement('img');
        trashBtn.className = 'journal-trash-btn';
        trashBtn.src = '/assets/trash-bin.png';
        trashBtn.alt = 'Delete';
    
        trashBtn.addEventListener('click', async function () {
            try {
                const deleteResponse = await fetch(`/api/journal/delete/${entry.entry_id}`, {
                    method: 'DELETE'
                });
    
                if (!deleteResponse.ok) {
                    throw new Error('Failed to delete journal entry');
                }
    
                displayJournalEntries(userId);
            } catch (error) {
                console.error('Error:', error);
            }
        });
    
        const habitName = entry.habit_id ? ` - ${habitMap[entry.habit_id]}` : '';
        const entryDate = new Date(entry.entry_date).toLocaleDateString();
        const entryTitle = document.createElement('h3');
        entryTitle.className = 'font-alternative';
        entryTitle.innerHTML = `${entryDate} ${habitName}`;
    
        // Append the title and trash button to the header div
        entryHeader.appendChild(entryTitle);
        entryHeader.appendChild(trashBtn);
    
        // Append the header div as the first child of the entryDiv
        entryDiv.appendChild(entryHeader);
    
        const entryContent = document.createElement('p');
        entryContent.innerHTML = entry.entryText;
    
        // Append the entry content to the entryDiv
        entryDiv.appendChild(entryContent);
    
        entriesContainer.appendChild(entryDiv);
    });    
}

async function getUserID() {
    const userIdResponse = await fetch('/api/currentUserId');
    if (!userIdResponse.ok) {
        throw new Error('Could not fetch user ID');
    }
    const userIdData = await userIdResponse.json();
    return userIdData.userId;
}