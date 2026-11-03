const crypto = require('crypto');
const { query } = require('../config/db');

// @route   GET /api/enquiries
exports.getEnquiries = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const role = req.user.role;

        let sql = `
            SELECT 
                e.id, e.customer_id AS customerId, e.production_house_id AS productionHouseId,
                e.service_id AS serviceId, e.project_title AS projectTitle, e.project_type AS category,
                e.budget AS budgetRange, e.timeline AS deadline, e.description, e.status,
                e.quote_amount AS quotedAmount, e.created_at AS createdAt, e.updated_at AS updatedAt,
                u.name AS customerName, u.email AS customerEmail, u.company_name AS customerCompany,
                ph.name AS productionHouseName, ph.logo_url AS productionHouseLogo, ph.location AS productionHouseLocation
            FROM enquiries e
            JOIN users u ON e.customer_id = u.id
            JOIN production_houses ph ON e.production_house_id = ph.id
        `;

        const params = [];
        if (role === 'customer') {
            sql += ' WHERE e.customer_id = ?';
            params.push(userId);
        } else {
            // Find production house owned by this user
            const [myHouse] = await query('SELECT id FROM production_houses WHERE user_id = ?', [userId]);
            if (!myHouse) {
                return res.json({ enquiries: [] });
            }
            sql += ' WHERE e.production_house_id = ?';
            params.push(myHouse.id);
        }

        sql += ' ORDER BY e.created_at DESC';

        const enquiries = await query(sql, params);

        // Fetch messages for each enquiry
        if (enquiries.length > 0) {
            const enqIds = enquiries.map((e) => e.id);
            const placeholders = enqIds.map(() => '?').join(',');
            const messages = await query(
                `SELECT id, enquiry_id AS enquiryId, sender_id AS senderId, sender_name AS senderName, sender_role AS senderRole, message AS content, created_at AS timestamp
                 FROM enquiry_messages WHERE enquiry_id IN (${placeholders}) ORDER BY created_at ASC`,
                enqIds
            );

            const msgMap = {};
            for (const m of messages) {
                if (!msgMap[m.enquiryId]) msgMap[m.enquiryId] = [];
                msgMap[m.enquiryId].push(m);
            }

            for (const e of enquiries) {
                e.messages = msgMap[e.id] || [];
            }
        }

        res.json({ enquiries });
    } catch (error) {
        next(error);
    }
};

// @route   GET /api/enquiries/:id
exports.getById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const [enq] = await query(
            `SELECT 
                e.id, e.customer_id AS customerId, e.production_house_id AS productionHouseId,
                e.service_id AS serviceId, e.project_title AS projectTitle, e.project_type AS category,
                e.budget AS budgetRange, e.timeline AS deadline, e.description, e.status,
                e.quote_amount AS quotedAmount, e.created_at AS createdAt, e.updated_at AS updatedAt,
                u.name AS customerName, u.email AS customerEmail, u.company_name AS customerCompany,
                ph.name AS productionHouseName, ph.logo_url AS productionHouseLogo, ph.location AS productionHouseLocation,
                ph.user_id AS phOwnerId
            FROM enquiries e
            JOIN users u ON e.customer_id = u.id
            JOIN production_houses ph ON e.production_house_id = ph.id
            WHERE e.id = ?`,
            [id]
        );

        if (!enq) {
            return res.status(404).json({ error: 'Enquiry not found.' });
        }

        // Verify access: customer or studio owner or admin
        const isCustomer = enq.customerId === req.user.id;
        const isStudioOwner = enq.phOwnerId === req.user.id;
        if (!isCustomer && !isStudioOwner && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Forbidden: Access to this enquiry is restricted.' });
        }

        // Fetch thread messages
        const messages = await query(
            `SELECT id, enquiry_id AS enquiryId, sender_id AS senderId, sender_name AS senderName, sender_role AS senderRole, message AS content, created_at AS timestamp
             FROM enquiry_messages WHERE enquiry_id = ? ORDER BY created_at ASC`,
            [id]
        );

        enq.messages = messages;
        delete enq.phOwnerId;

        res.json({ enquiry: enq });
    } catch (error) {
        next(error);
    }
};

// @route   POST /api/enquiries
exports.create = async (req, res, next) => {
    try {
        const {
            productionHouseId,
            serviceId,
            projectTitle,
            category = 'Video Production',
            budgetRange,
            deadline,
            description,
            initialMessage,
        } = req.body;

        if (!productionHouseId || !projectTitle) {
            return res.status(400).json({ error: 'Production house and project title are required.' });
        }

        // Verify production house exists
        const [ph] = await query('SELECT id, name FROM production_houses WHERE id = ?', [productionHouseId]);
        if (!ph) {
            return res.status(404).json({ error: 'Selected production house does not exist.' });
        }

        const enquiryId = 'enq-' + crypto.randomUUID().slice(0, 8);

        await query(
            `INSERT INTO enquiries (id, customer_id, production_house_id, service_id, project_title, project_type, budget, timeline, description, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
            [
                enquiryId,
                req.user.id,
                productionHouseId,
                serviceId || null,
                projectTitle,
                category,
                budgetRange || 'Flexible',
                deadline || 'Flexible',
                description || '',
            ]
        );

        // Add initial message if provided
        const messages = [];
        if (initialMessage && initialMessage.trim()) {
            const msgId = 'msg-' + crypto.randomUUID().slice(0, 8);
            await query(
                `INSERT INTO enquiry_messages (id, enquiry_id, sender_id, sender_role, sender_name, message)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [msgId, enquiryId, req.user.id, 'customer', req.user.name, initialMessage.trim()]
            );
            messages.push({
                id: msgId,
                enquiryId,
                senderId: req.user.id,
                senderRole: 'customer',
                senderName: req.user.name,
                content: initialMessage.trim(),
                timestamp: new Date(),
            });
        }

        const [created] = await query('SELECT * FROM enquiries WHERE id = ?', [enquiryId]);
        created.messages = messages;

        res.status(201).json({
            message: 'Project enquiry submitted successfully.',
            enquiry: created,
        });
    } catch (error) {
        next(error);
    }
};

// @route   PATCH /api/enquiries/:id/status
exports.updateStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status, quoteAmount } = req.body;

        const [enq] = await query(
            `SELECT e.*, ph.user_id AS phOwnerId 
             FROM enquiries e
             JOIN production_houses ph ON e.production_house_id = ph.id
             WHERE e.id = ?`,
            [id]
        );

        if (!enq) {
            return res.status(404).json({ error: 'Enquiry not found.' });
        }

        // Only studio owner or customer or admin can update status
        const isCustomer = enq.customer_id === req.user.id;
        const isStudioOwner = enq.phOwnerId === req.user.id;
        if (!isCustomer && !isStudioOwner && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'You are not authorized to update this enquiry.' });
        }

        await query(
            `UPDATE enquiries
             SET status = COALESCE(?, status),
                 quote_amount = COALESCE(?, quote_amount)
             WHERE id = ?`,
            [status, quoteAmount !== undefined ? quoteAmount : null, id]
        );

        const [updated] = await query('SELECT * FROM enquiries WHERE id = ?', [id]);

        res.json({
            message: 'Enquiry status updated successfully.',
            enquiry: updated,
        });
    } catch (error) {
        next(error);
    }
};

// @route   POST /api/enquiries/:id/messages
exports.addMessage = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { content, message } = req.body;
        const text = (content || message || '').trim();

        if (!text) {
            return res.status(400).json({ error: 'Message text cannot be empty.' });
        }

        const [enq] = await query(
            `SELECT e.*, ph.user_id AS phOwnerId 
             FROM enquiries e
             JOIN production_houses ph ON e.production_house_id = ph.id
             WHERE e.id = ?`,
            [id]
        );

        if (!enq) {
            return res.status(404).json({ error: 'Enquiry not found.' });
        }

        const isCustomer = enq.customer_id === req.user.id;
        const isStudioOwner = enq.phOwnerId === req.user.id;
        if (!isCustomer && !isStudioOwner && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'You are not authorized to post in this discussion.' });
        }

        const msgId = 'msg-' + crypto.randomUUID().slice(0, 8);
        const senderRole = isCustomer ? 'customer' : 'production_house';

        await query(
            `INSERT INTO enquiry_messages (id, enquiry_id, sender_id, sender_role, sender_name, message)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [msgId, id, req.user.id, senderRole, req.user.name, text]
        );

        // Auto move status from pending to in_discussion if needed
        if (enq.status === 'pending') {
            await query("UPDATE enquiries SET status = 'in_discussion' WHERE id = ?", [id]);
        }

        const [createdMsg] = await query(
            'SELECT id, enquiry_id AS enquiryId, sender_id AS senderId, sender_name AS senderName, sender_role AS senderRole, message AS content, created_at AS timestamp FROM enquiry_messages WHERE id = ?',
            [msgId]
        );

        res.status(201).json({
            message: 'Message sent successfully.',
            enquiryMessage: createdMsg,
        });
    } catch (error) {
        next(error);
    }
};
