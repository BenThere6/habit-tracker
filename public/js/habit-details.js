const performancesTodayEl = document.getElementById('performancesToday');

document.addEventListener('DOMContentLoaded', async () => {
    const habitId = document.getElementById('habitId').textContent;

    await updatePerformancesToday(habitId);

    // updateLastPerformedDate(habitId);

    document.getElementById('markPerformedButton').addEventListener('click', async () => {
        await markHabitAsPerformed(habitId);
        
        // Wait for a short delay to ensure the server has processed the update
        await delay(500);
    
        await updatePerformancesToday(habitId);
    
        const lastPerformedDate = document.querySelector('#lastPerformedDate');
        lastPerformedDate.textContent = formatDate(false);
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

function formatDate(date) {
    let unformattedDate;
    if (date) {
        unformattedDate = date;
    } else {
        unformattedDate = new Date();
    }
    // const currentDate = new Date();
    const year = unformattedDate.getFullYear();
    const month = (unformattedDate.getMonth() + 1).toString().padStart(2, '0');
    const day = unformattedDate.getDate().toString().padStart(2, '0');
    return `${month}-${day}-${year}`;
}

function markHabitAsPerformed(habitId) {
    return new Promise((resolve, reject) => {
        fetch(`/api/habit/markPerformed/${habitId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                resolve(data);
            } else {
                console.error('Error:', data.error);
                reject(data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            reject(error);
        });
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

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// async function updateLastPerformedDate(habitId) {
//     try {
//         const response = await fetch(`/api/habit/lastPerformedDate/${habitId}`);
//         const data = await response.json();
//         if (data.success) {
//             const lastPerformedDate = document.querySelector('#lastPerformedDate');
//             lastPerformedDate.textContent = markPerformed(data.lastPerformedDate);
//         } else {
//             console.error('Error:', data.error);
//         }
//     } catch (error) {
//         console.error('Error:', error);
//     }
// }