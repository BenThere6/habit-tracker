const router = require('express').Router();
const { sequelize, Habit, Performances } = require('../../models');
const { Op } = require('sequelize');
const { adjustedDate } = require('../../utils/getDate');

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

        await Habit.update({ last_performed: adjustedDate }, {
            where: {
                habit_id: habitId,
                user_id: userId,
            },
        });

        // Create a new entry in the Performance model
        await Performances.create({
            user_id: userId,
            habit_id: habitId,
            performance_date: adjustedDate,
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
        const userId = req.user.id;

        const dateParts = adjustedDate.split('-');
        const year = parseInt(dateParts[0]);
        const month = parseInt(dateParts[1]);
        const day = parseInt(dateParts[2]);

        const performancesToday = await Performances.count({
            where: {
                user_id: userId,
                habit_id: habitId,
                [Op.and]: [
                    sequelize.where(sequelize.fn('YEAR', sequelize.col('performance_date')), year),
                    sequelize.where(sequelize.fn('MONTH', sequelize.col('performance_date')), month),
                    sequelize.where(sequelize.fn('DAY', sequelize.col('performance_date')), day)
                ]
            }
        });
        res.json({ success: true, performancesToday });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch performances today' });
        console.log(error)
    }
});

router.get('/streak/:habitId', async (req, res) => {
    try {
        const { habitId } = req.params;
        const userId = req.user.id;

        // Get all performances for the habit, ordered by performance_date in descending order
        const performances = await Performances.findAll({
            where: {
                user_id: userId,
                habit_id: habitId,
            },
            order: [['performance_date', 'DESC']],
        });

        let streak = 0;

        // Analyze the performance history to calculate the streak
        for (let i = 0; i < performances.length; i++) {
            // Calculate the time difference in days between the current performance and the next one
            if (i < performances.length - 1) {
                const currentPerformanceDate = performances[i].performance_date;
                const nextPerformanceDate = performances[i + 1].performance_date;
                const timeDifference = (nextPerformanceDate - currentPerformanceDate) / (1000 * 60 * 60 * 24);

                // If the time difference is 1 day, increment the streak
                if (timeDifference === 1) {
                    streak++;
                } else {
                    // If there's a gap, break the streak
                    break;
                }
            }
        }

        res.json({ success: true, streak });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch streak' });
        console.log(error);
    }
});

router.get('/details/:habitId' , async (req, res) => {
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
        // res.render('habit-details', { habit: habitDetails })
        res.render('habit-details', { habit_name: habitDetails.habit_name, habit_type: habitDetails.habit_type, last_performed: formattedDate, habit_id: habitDetails.habit_id });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Failed to fetch habit details' });
        console.log(err);
    }
})

module.exports = router;