const router = require('express').Router();
const { sequelize, Habit, Performances } = require('../../models');
const { Op } = require('sequelize');
const moment = require('moment-timezone');
const userTimezone = 'America/Denver';
// const { adjustedDate } = require('../../utils/getDate');

router.post('/add', async (req, res) => {
    try {
        const { habitName, habitType } = req.body;
        const userId = req.user.id;

        // Check if a habit with the same name already exists for the user
        const existingHabit = await Habit.findOne({
            where: {
                user_id: userId,
                habit_name: habitName,
            },
        });

        if (existingHabit) {
            return res.status(400).json({ success: false, error: 'Habit with the same name already exists' });
        }

        const newHabit = await Habit.create({
            user_id: userId,
            habit_name: habitName,
            habit_type: habitType,
        });

        res.json({ success: true, habit: newHabit });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to create habit' });
    }
});

router.get('/fetch', async (req, res) => {
    try {
        const userId = req.user.id;
        const userHabits = await Habit.findAll({
            where: { user_id: userId },
        });

        res.json(userHabits);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch habits' });
    }
});

router.post('/markPerformed/:habitId', async (req, res) => {
    try {
        const { habitId } = req.params;
        const userId = req.user.id;

        await Habit.update({ last_performed: new Date() }, {
            where: {
                habit_id: habitId,
                user_id: userId,
            },
        });

        // Create a new entry in the Performance model
        await Performances.create({
            user_id: userId,
            habit_id: habitId,
            performance_date: new Date(),
        });

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to create new performance log' });
        console.log('Failed to create new performance log');
    }
});

router.get('/performancesToday/:habitId', async (req, res) => {
    try {
        const { habitId } = req.params;

        // Get the performances for the habit and user
        const performances = await Performances.findAll({
            where: {
                habit_id: habitId,
            },
        });

        let performancesToday = 0;

        // Iterate through each performance and check if it was performed today after 3 AM in the user's time zone
        performances.forEach((performance) => {
            const performanceDate = moment(performance.performance_date).tz(userTimezone);
            const currentDate = moment().tz(userTimezone);
            const threeAMToday = currentDate.startOf('day').hour(3);

            if (performanceDate.isSameOrAfter(threeAMToday)) {
                performancesToday++;
            }
        });

        res.json({ success: true, performancesToday });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch performances today' });
        console.log(error);
    }
});

router.get('/streak/:habitId', async (req, res) => {
    try {
        const { habitId } = req.params;
        const userId = req.user.id;

        // Get the current date and time in MST (Mountain Standard Time)
        const currentDate = new Date();
        currentDate.setHours(currentDate.getHours() - 7); // MST is UTC-7

        // Initialize streak to 0
        let streak = 0;

        // Check if it's before 3 AM MST (end of day), and if so, treat it as the previous day
        if (currentDate.getHours() < 3) {
            currentDate.setDate(currentDate.getDate() - 1);
        }

        // Start with yesterday and go backward
        for (let i = 1; ; i++) {
            const dateToCheck = new Date(currentDate);
            dateToCheck.setDate(currentDate.getDate() - i);

            // Check if it's before 3 AM MST (end of day) for the date to check
            if (dateToCheck.getHours() < 3) {
                dateToCheck.setDate(dateToCheck.getDate() - 1);
            }

            const yearToCheck = dateToCheck.getFullYear();
            const monthToCheck = dateToCheck.getMonth() + 1;
            const dayToCheck = dateToCheck.getDate();

            // Check if there's a performance on the date
            const performance = await Performances.findOne({
                where: {
                    user_id: userId,
                    habit_id: habitId,
                    performance_date: {
                        [Op.and]: [
                            sequelize.where(sequelize.fn('YEAR', sequelize.col('performance_date')), yearToCheck),
                            sequelize.where(sequelize.fn('MONTH', sequelize.col('performance_date')), monthToCheck),
                            sequelize.where(sequelize.fn('DAY', sequelize.col('performance_date')), dayToCheck),
                        ]
                    },
                },
            });

            if (performance) {
                // If a performance is found for the date, increment the streak
                streak++;
            } else {
                // If there's no performance for a date, stop the loop
                break;
            }
        }

        // Update the streak for today (based on the current date)
        const todayPerformance = await Performances.findOne({
            where: {
                user_id: userId,
                habit_id: habitId,
                performance_date: {
                    [Op.and]: [
                        sequelize.where(sequelize.fn('YEAR', sequelize.col('performance_date')), currentDate.getFullYear()),
                        sequelize.where(sequelize.fn('MONTH', sequelize.col('performance_date')), currentDate.getMonth() + 1),
                        sequelize.where(sequelize.fn('DAY', sequelize.col('performance_date')), currentDate.getDate()),
                    ]
                },
            },
        });

        if (todayPerformance) {
            streak++;
        }

        res.json({ success: true, streak });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch streak' });
        console.log(error);
    }
});


router.get('/details/:habitId', async (req, res) => {
    try {
        const { habitId } = req.params;

        const habitDetails = await Habit.findOne({
            where: {
                habit_id: habitId,
            },
        });

        if (!habitDetails) {
            return res.status(404).json({ success: false, error: 'Habit not found' });
        }
        let formattedDate;
        if (habitDetails.last_performed) {
            var lastPerformedDate = new Date(habitDetails.last_performed)
            const isoString = lastPerformedDate.toISOString();
            formattedDate = isoString.split('T')[0];
        } else {
            formattedDate = 'N/A'
        }
        res.render('habit-details', { habit_name: habitDetails.habit_name, habit_type: habitDetails.habit_type, last_performed: formattedDate, habit_id: habitDetails.habit_id });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Failed to fetch habit details' });
        console.log(err);
    }
})

module.exports = router;

// INSERT INTO performances (user_id, habit_id, performance_date) VALUES (1, 1, '2023-11-01 09:14:08');
// INSERT INTO performances (user_id, habit_id, performance_date) VALUES (1, 9, '2023-10-29');