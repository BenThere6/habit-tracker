const { Habit } = require('../models');

async function markHabitAsPerformedOnPastDate(habitId, performedDate) {
    try {
        // Retrieve the habit record by its ID
        const habit = await Habit.findByPk(habitId);

        if (habit) {
            // Update the last_performed field to the specific performed date
            habit.last_performed = performedDate;
            await habit.save(); // Save the updated habit record

            console.log('Habit updated with last_performed date:', performedDate);
        } else {
            console.log('Habit not found.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Call the function with the habit ID and the past date you want to set

markHabitAsPerformedOnPastDate(6, '2023-10-25');
markHabitAsPerformedOnPastDate(7, '2023-10-25');