const router = require('express').Router();
const { sequelize, Habit, Performances } = require('../../models');
const { Op, NUMBER } = require('sequelize');
const moment = require('moment-timezone');
const userTimezone = 'America/Denver';

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
        console.error("Error fetching habits:", error);
        res.status(500).json({ error: 'Failed to fetch habits' });
    }
});

router.post('/markPerformed/:habitId', async (req, res) => {
    try {
        const userTime = moment().tz(userTimezone).toDate();

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
            performance_date: userTime,
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
        const performances = await Performances.findAll({
            where: {
                habit_id: habitId,
            },
        });

        let performancesToday = 0;
        const currentDate = moment().tz(userTimezone).startOf('day');

        performances.forEach((performance) => {
            const performanceDate = moment(performance.performance_date).tz(userTimezone);

            if (performanceDate.isSameOrAfter(currentDate)) {
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

        const performances = await Performances.findAll({
            where: {
                habit_id: habitId,
                user_id: userId,
            },
            order: [['performance_date', 'DESC']],
        });

        let streak = 0;
        let checkDate = moment().tz(userTimezone).subtract(1, 'days').startOf('day'); // Start checking from yesterday

        for (const performance of performances) {
            const performanceDate = moment(performance.performance_date).tz(userTimezone).startOf('day');

            if (performanceDate.isSame(checkDate, 'day')) {
                streak++;
                checkDate = checkDate.subtract(1, 'days'); // Move check date to the previous day
            } else if (performanceDate.isBefore(checkDate, 'day')) {
                break; // A gap in performances, stop counting the streak
            }
        }

        // Now check for today's performance and increment streak if present
        const todayPerformance = performances.find(performance =>
            moment(performance.performance_date).tz(userTimezone).startOf('day').isSame(moment().tz(userTimezone).startOf('day'))
        );
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

        let createdAtDate = habitDetails.createdAt;
        if (!createdAtDate) {
            const firstPerformance = await Performances.findOne({
                where: { habit_id: habitId },
                order: [['performance_date', 'ASC']]
            });
            createdAtDate = firstPerformance ? firstPerformance.performance_date : new Date();
        }

        let formattedDate;
        if (habitDetails.last_performed) {
            const lastPerformedDate = moment(habitDetails.last_performed).tz(userTimezone);
            formattedDate = lastPerformedDate.format('MM-DD-YYYY');
        } else {
            formattedDate = 'N/A';
        }

        const currentDate = moment().startOf('day');
        const daysSinceCreated = currentDate.diff(moment(createdAtDate).startOf('day'), 'days');
        const daysSinceLastPerformed = habitDetails.last_performed ? currentDate.diff(moment(habitDetails.last_performed).startOf('day'), 'days') : null;

        let createdDays, lastPerformedDays;
        if (daysSinceCreated === 0) {
            createdDays = 'today';
        } else if (daysSinceCreated < 30) {
            createdDays = daysSinceCreated === 1 ? '1 day ago' : `${daysSinceCreated} days ago`;
        } else if (daysSinceCreated < 365) {
            let months = Math.floor(daysSinceCreated / 30);
            createdDays = months === 1 ? '1 month ago' : `${months} months ago`;
        } else {
            let years = Math.floor(daysSinceCreated / 365);
            createdDays = years === 1 ? '1 year ago' : `${years} years ago`;
        }

        if (daysSinceLastPerformed !== null) {
            if (daysSinceLastPerformed === 0) {
                lastPerformedDays = 'Today';
            } else if (daysSinceLastPerformed < 30) {
                lastPerformedDays = daysSinceLastPerformed === 1 ? '1 day ago' : `${daysSinceLastPerformed} days ago`;
            } else if (daysSinceLastPerformed < 365) {
                let months = Math.floor(daysSinceLastPerformed / 30);
                lastPerformedDays = months === 1 ? '1 month ago' : `${months} months ago`;
            } else {
                let years = Math.floor(daysSinceLastPerformed / 365);
                lastPerformedDays = years === 1 ? '1 year ago' : `${years} years ago`;
            }
        } else {
            lastPerformedDays = 'N/A';
        }        

        res.render('habit-details', {
            habit_name: habitDetails.habit_name,
            habit_type: habitDetails.habit_type,
            last_performed: lastPerformedDays,
            habit_id: habitDetails.habit_id,
            created_at: createdDays
        });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Failed to fetch habit details' });
        console.log(err);
    }
});

router.post('/delete/:habitId', async (req, res) => {
    const habitId = req.params.habitId;

    try {
        const result = await Habit.deleteHabitById(habitId);

        if (result.success) {
            // Habit deleted successfully
            res.status(200).json({ success: true, message: result.message });
        } else {
            // Handle error cases
            res.status(404).json({ success: false, error: result.error });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

router.put('/update/:habitId', async (req, res) => {
    try {
        const { habitId } = req.params;
        const { habitName } = req.body;

        await Habit.update({ habit_name: habitName }, {
            where: {
                habit_id: habitId,
                user_id: req.user.id
            }
        });

        res.json({ success: true, message: 'Habit name updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to update habit name' });
    }
});

module.exports = router;