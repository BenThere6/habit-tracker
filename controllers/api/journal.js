const router = require('express').Router();
const { sequelize, Entries } = require('../../models');
const { Op } = require('sequelize');

// Route to add a new journal entry
router.post('/add', async (req, res) => {
    try {
        const { user_id, habit_id, entry_date, entryText } = req.body;
        const newEntry = await Entries.create({
            user_id,
            habit_id,
            entry_date,
            entryText
        });
        res.status(200).json(newEntry);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create a new journal entry' });
    }
});

// Route to get all journal entries for a specific user
router.get('/entries/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const entries = await Entries.findAll({
            where: { user_id: userId },
            order: [['entry_date', 'DESC']]
        });
        res.status(200).json(entries);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch entries' });
    }
});

// Route to update a journal entry
router.put('/update/:entryId', async (req, res) => {
    try {
        const { entryId } = req.params;
        const { entryText } = req.body;
        const updatedEntry = await Entries.update({ entryText }, {
            where: { entry_id: entryId }
        });
        res.status(200).json(updatedEntry);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update the journal entry' });
    }
});

// Route to delete a journal entry
router.delete('/delete/:entryId', async (req, res) => {
    try {
        const { entryId } = req.params;
        await Entries.destroy({
            where: { entry_id: entryId }
        });
        res.status(200).json({ message: 'Journal entry deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete the journal entry' });
    }
});

module.exports = router;