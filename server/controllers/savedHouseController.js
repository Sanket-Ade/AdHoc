const crypto = require('crypto');
const { query } = require('../config/db');

// @route   GET /api/saved-houses
exports.getSaved = async (req, res, next) => {
    try {
        const rows = await query(
            `SELECT sh.production_house_id AS id, ph.name, ph.slug, ph.logo_url AS logoUrl,
                    ph.cover_image_url AS coverImageUrl, ph.location, ph.city, ph.rating,
                    ph.review_count AS reviewCount, ph.verified, ph.budget_tier AS budgetTier
             FROM saved_houses sh
             JOIN production_houses ph ON sh.production_house_id = ph.id
             WHERE sh.user_id = ?
             ORDER BY sh.created_at DESC`,
            [req.user.id]
        );

        const savedHouseIds = rows.map((r) => r.id);

        res.json({
            savedHouseIds,
            savedHouses: rows,
        });
    } catch (error) {
        next(error);
    }
};

// @route   POST /api/saved-houses/toggle
exports.toggleSave = async (req, res, next) => {
    try {
        const { productionHouseId } = req.body;

        if (!productionHouseId) {
            return res.status(400).json({ error: 'Production house ID is required.' });
        }

        const [existing] = await query(
            'SELECT id FROM saved_houses WHERE user_id = ? AND production_house_id = ?',
            [req.user.id, productionHouseId]
        );

        let isSaved = false;

        if (existing) {
            // Remove bookmark
            await query('DELETE FROM saved_houses WHERE user_id = ? AND production_house_id = ?', [
                req.user.id,
                productionHouseId,
            ]);
            isSaved = false;
        } else {
            // Add bookmark
            const id = 'sh-' + crypto.randomUUID().slice(0, 8);
            await query(
                'INSERT INTO saved_houses (id, user_id, production_house_id) VALUES (?, ?, ?)',
                [id, req.user.id, productionHouseId]
            );
            isSaved = true;
        }

        // Return updated list of IDs
        const rows = await query('SELECT production_house_id AS id FROM saved_houses WHERE user_id = ?', [req.user.id]);
        const savedHouseIds = rows.map((r) => r.id);

        res.json({
            isSaved,
            savedHouseIds,
            message: isSaved ? 'Added to saved production houses.' : 'Removed from saved production houses.',
        });
    } catch (error) {
        next(error);
    }
};
