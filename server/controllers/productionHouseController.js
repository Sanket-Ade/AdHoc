const crypto = require('crypto');
const { query } = require('../config/db');

// Helper to safely parse JSON field
const parseJsonField = (val, defaultVal = []) => {
    if (!val) return defaultVal;
    if (typeof val === 'object') return val;
    try {
        return JSON.parse(val);
    } catch {
        return defaultVal;
    }
};

// Helper to format house record
const formatProductionHouse = (row, services = [], portfolio = [], verificationDoc = null) => ({
    id: row.id,
    userId: row.user_id,
    name: row.name,
    slug: row.slug,
    tagline: row.tagline,
    description: row.description,
    logoUrl: row.logo_url,
    coverImageUrl: row.cover_image_url,
    location: row.location,
    city: row.city,
    country: row.country,
    category: row.category,
    verified: Boolean(row.verified),
    gstRegistered: Boolean(row.gst_registered),
    verificationStatus: row.verification_status,
    rating: parseFloat(row.rating) || 0,
    reviewCount: row.review_count || 0,
    yearsInBusiness: row.years_in_business || 1,
    teamSize: row.team_size,
    responseRateHours: row.response_rate_hours,
    budgetTier: row.budget_tier,
    minBudget: row.min_budget,
    availability: row.availability,
    featured: Boolean(row.featured),
    badges: parseJsonField(row.badges, []),
    notableClients: parseJsonField(row.notable_clients, []),
    contactEmail: row.contact_email,
    phone: row.phone,
    website: row.website,
    equipmentFacilities: parseJsonField(row.equipment_facilities, []),
    studioFloorSpecs: row.studio_floor_specs,
    services,
    portfolio,
    verificationDocument: verificationDoc,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
});

// @route   GET /api/production-houses
exports.getAll = async (req, res, next) => {
    try {
        const {
            q,
            search,
            category,
            city,
            verified,
            budgetTier,
            minBudget,
            maxBudget,
            sort = 'featured',
        } = req.query;

        const searchTerm = (q || search || '').trim();
        let sql = 'SELECT * FROM production_houses WHERE 1=1';
        const params = [];

        if (searchTerm) {
            sql += ' AND (name LIKE ? OR tagline LIKE ? OR city LIKE ? OR location LIKE ?)';
            const wildcard = `%${searchTerm}%`;
            params.push(wildcard, wildcard, wildcard, wildcard);
        }

        if (category && (category === 'business' || category === 'freelancer')) {
            sql += ' AND category = ?';
            params.push(category);
        }

        if (city) {
            sql += ' AND city = ?';
            params.push(city);
        }

        if (verified === 'true') {
            sql += ' AND verified = 1';
        }

        if (budgetTier) {
            sql += ' AND budget_tier = ?';
            params.push(budgetTier);
        }

        if (minBudget) {
            sql += ' AND min_budget >= ?';
            params.push(parseInt(minBudget, 10));
        }

        if (maxBudget) {
            sql += ' AND min_budget <= ?';
            params.push(parseInt(maxBudget, 10));
        }

        // Sorting
        switch (sort) {
            case 'rating':
                sql += ' ORDER BY rating DESC, review_count DESC';
                break;
            case 'reviews':
                sql += ' ORDER BY review_count DESC';
                break;
            case 'price_low':
                sql += ' ORDER BY min_budget ASC';
                break;
            case 'price_high':
                sql += ' ORDER BY min_budget DESC';
                break;
            case 'newest':
                sql += ' ORDER BY created_at DESC';
                break;
            case 'featured':
            default:
                sql += ' ORDER BY featured DESC, rating DESC';
                break;
        }

        const rows = await query(sql, params);

        if (rows.length === 0) {
            return res.json({ count: 0, productionHouses: [] });
        }

        // Fetch all services for these houses
        const houseIds = rows.map((r) => r.id);
        const placeholders = houseIds.map(() => '?').join(',');
        const serviceRows = await query(
            `SELECT id, production_house_id AS productionHouseId, name, description, starting_price AS startingPrice, turnaround_days AS turnaroundDays, tags FROM services WHERE production_house_id IN (${placeholders})`,
            houseIds
        );

        // Group services by house id
        const serviceMap = {};
        for (const s of serviceRows) {
            if (!serviceMap[s.productionHouseId]) serviceMap[s.productionHouseId] = [];
            serviceMap[s.productionHouseId].push({
                id: s.id,
                name: s.name,
                description: s.description,
                startingPrice: s.startingPrice,
                turnaroundDays: s.turnaroundDays,
                tags: parseJsonField(s.tags, []),
            });
        }

        const productionHouses = rows.map((row) =>
            formatProductionHouse(row, serviceMap[row.id] || [])
        );

        res.json({
            count: productionHouses.length,
            productionHouses,
        });
    } catch (error) {
        next(error);
    }
};

// @route   GET /api/production-houses/:identifier (id or slug)
exports.getByIdentifier = async (req, res, next) => {
    try {
        const { identifier } = req.params;

        const rows = await query(
            'SELECT * FROM production_houses WHERE id = ? OR slug = ?',
            [identifier, identifier]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Production house not found.' });
        }

        const house = rows[0];

        // Fetch services
        const serviceRows = await query(
            'SELECT id, name, description, starting_price AS startingPrice, turnaround_days AS turnaroundDays, tags FROM services WHERE production_house_id = ?',
            [house.id]
        );
        const services = serviceRows.map((s) => ({
            ...s,
            tags: parseJsonField(s.tags, []),
        }));

        // Fetch portfolio
        const portfolioRows = await query(
            'SELECT id, title, category, client_name AS clientName, thumbnail_url AS thumbnailUrl, video_url AS videoUrl, description, metrics, year, featured FROM portfolio_items WHERE production_house_id = ? ORDER BY year DESC',
            [house.id]
        );
        const portfolio = portfolioRows.map((p) => ({
            ...p,
            featured: Boolean(p.featured),
        }));

        // Fetch verification document
        const verifRows = await query(
            'SELECT id, doc_type AS docType, doc_number AS docNumber, legal_name AS legalName, signatory_name AS signatoryName, pan_number AS panNumber, file_name AS fileName, file_size AS fileSize, verified_at AS verifiedAt, status_message AS statusMessage, status FROM verification_documents WHERE production_house_id = ?',
            [house.id]
        );
        const verificationDoc = verifRows.length > 0 ? verifRows[0] : null;

        res.json({
            productionHouse: formatProductionHouse(house, services, portfolio, verificationDoc),
        });
    } catch (error) {
        next(error);
    }
};

// @route   POST /api/production-houses
exports.create = async (req, res, next) => {
    try {
        const {
            name,
            tagline,
            description,
            logoUrl,
            coverImageUrl,
            location,
            city = 'Mumbai',
            country = 'India',
            category = 'business',
            budgetTier = '₹₹',
            minBudget = 50000,
            teamSize,
            responseRateHours = 24,
            contactEmail,
            phone,
            website,
            equipmentFacilities = [],
            studioFloorSpecs,
            badges = [],
            notableClients = [],
        } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Production house name is required.' });
        }

        const id = 'ph-' + crypto.randomUUID().slice(0, 8);
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + id.slice(-4);

        await query(
            `INSERT INTO production_houses (
                id, user_id, name, slug, tagline, description, logo_url, cover_image_url,
                location, city, country, category, budget_tier, min_budget, team_size,
                response_rate_hours, contact_email, phone, website, equipment_facilities,
                studio_floor_specs, badges, notable_clients
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                id,
                req.user ? req.user.id : null,
                name,
                slug,
                tagline || '',
                description || '',
                logoUrl || null,
                coverImageUrl || null,
                location || '',
                city,
                country,
                category,
                budgetTier,
                minBudget,
                teamSize || '',
                responseRateHours,
                contactEmail || (req.user ? req.user.email : ''),
                phone || '',
                website || '',
                JSON.stringify(equipmentFacilities),
                studioFloorSpecs || null,
                JSON.stringify(badges),
                JSON.stringify(notableClients),
            ]
        );

        const [created] = await query('SELECT * FROM production_houses WHERE id = ?', [id]);

        res.status(201).json({
            message: 'Production house registered successfully.',
            productionHouse: formatProductionHouse(created),
        });
    } catch (error) {
        next(error);
    }
};

// @route   PATCH /api/production-houses/:id
exports.update = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Check ownership
        const [existing] = await query('SELECT * FROM production_houses WHERE id = ?', [id]);
        if (!existing) {
            return res.status(404).json({ error: 'Production house not found.' });
        }

        if (existing.user_id && req.user && existing.user_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'You are not authorized to update this production house.' });
        }

        const updates = req.body;
        const allowedFields = [
            'name', 'tagline', 'description', 'logo_url', 'cover_image_url',
            'location', 'city', 'country', 'budget_tier', 'min_budget', 'team_size',
            'response_rate_hours', 'contact_email', 'phone', 'website',
            'studio_floor_specs', 'availability'
        ];

        const setClauses = [];
        const params = [];

        for (const field of allowedFields) {
            const camelKey = field.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
            const val = updates[camelKey] !== undefined ? updates[camelKey] : updates[field];
            if (val !== undefined) {
                setClauses.push(`${field} = ?`);
                params.push(val);
            }
        }

        // Handle JSON fields
        if (updates.badges !== undefined) {
            setClauses.push('badges = ?');
            params.push(JSON.stringify(updates.badges));
        }
        if (updates.notableClients !== undefined) {
            setClauses.push('notable_clients = ?');
            params.push(JSON.stringify(updates.notableClients));
        }
        if (updates.equipmentFacilities !== undefined) {
            setClauses.push('equipment_facilities = ?');
            params.push(JSON.stringify(updates.equipmentFacilities));
        }

        if (setClauses.length > 0) {
            params.push(id);
            await query(`UPDATE production_houses SET ${setClauses.join(', ')} WHERE id = ?`, params);
        }

        const [updated] = await query('SELECT * FROM production_houses WHERE id = ?', [id]);

        res.json({
            message: 'Production house updated successfully.',
            productionHouse: formatProductionHouse(updated),
        });
    } catch (error) {
        next(error);
    }
};
