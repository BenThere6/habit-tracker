const router = require('express').Router();
const { Habit, Performances } = require('../../models');

router.post('/add', async (req, res) => {
    try {
        const { habitName, habitType } = req.body;
        const userId = req.user.id;

        // Validate user input here, e.g., check for empty habitName

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
        const userId = req.user.id;

        const currentDate = new Date();
        const startOfToday = new Date(currentDate.setHours(0, 0, 0, 0));
        const endOfToday = new Date(currentDate.setHours(23, 59, 59, 999));

        const performancesToday = await Performances.count({
            where: {
                // user_id: userId,
                habit_id: habitId,
                // performed_date: {
                //     [Op.between]: [startOfToday, endOfToday],
                // },
            },
        });

        console.log('success')

        res.json({ success: true, performancesToday });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch performances today' });
    }
});

module.exports = router;