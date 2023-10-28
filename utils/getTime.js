// Function to get the current date and time, subtract 10 hours, and return the new date time
function getAdjustedDateTime() {
    const currentDateTime = new Date();
    // Subtract 10 hours (10 * 60 minutes * 60 seconds * 1000 milliseconds)
    const adjustedDateTime = new Date(currentDateTime - 10 * 60 * 60 * 1000);
    return adjustedDateTime;
}

// Export the function so other files can access it
module.exports = {
    getAdjustedDateTime,
};