const router = require('express').Router();
const { Habit, Performances } = require('../../models');
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

router.post('/markPerformed', async (req, res) => {
    try {
        const { habitId } = req.body;
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

        const performancesToday = await Performances.count({
            where: {
                user_id: userId,
                habit_id: habitId,
                [Op.and]: [
                    sequelize.where(sequelize.fn('YEAR', sequelize.col('performance_date')), new Date(adjustedDate).getFullYear()),
                    sequelize.where(sequelize.fn('MONTH', sequelize.col('performance_date')), new Date(adjustedDate).getMonth() + 1), // Months are zero-based
                    sequelize.where(sequelize.fn('DAY', sequelize.col('performance_date')), new Date(adjustedDate).getDate())
                ]
            }
        });
        res.json({ success: true, performancesToday });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch performances today' });
        console.log(error)
    }
});

module.exports = router;