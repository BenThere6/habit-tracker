// Function to get the current date and time, subtract 10 hours, and return the date portion as a string in "yyyy-mm-dd" format
function getAdjustedDateDate() {
    const currentDateTime = new Date();
    // Subtract 10 hours (10 * 60 minutes * 60 seconds * 1000 milliseconds)
    const adjustedDateTime = new Date(currentDateTime - 10 * 60 * 60 * 1000);

    // Get the date portion (yyyy-mm-dd)
    const year = adjustedDateTime.getFullYear();
    const month = String(adjustedDateTime.getMonth() + 1).padStart(2, '0'); // Add 1 to month since it's zero-based
    const day = String(adjustedDateTime.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

var adjustedDate = getAdjustedDateDate();

console.log(adjustedDate);

module.exports = { adjustedDate };