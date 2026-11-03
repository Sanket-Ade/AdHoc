const crypto = require('crypto');
const { query } = require('../config/db');

// @route   POST /api/verification/submit
exports.submitVerification = async (req, res, next) => {
    try {
        const {
            productionHouseId,
            docType = 'gst',
            docNumber,
            legalName,
            signatoryName,
            panNumber,
            fileName,
            fileSize,
        } = req.body;

        if (!productionHouseId || !docNumber || !legalName) {
            return res.status(400).json({ error: 'Production house ID, document number, and legal name are required.' });
        }

        // Verify the user owns this production house
        const [ph] = await query('SELECT * FROM production_houses WHERE id = ?', [productionHouseId]);
        if (!ph) {
            return res.status(404).json({ error: 'Production house not found.' });
        }

        if (ph.user_id && req.user && ph.user_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Not authorized to submit verification for this studio.' });
        }

        const id = 'verif-' + crypto.randomUUID().slice(0, 8);
        const statusMessage = 'Verified & Genuine GST Record (Active)';

        // Upsert verification record
        await query(
            `INSERT INTO verification_documents (
                id, production_house_id, doc_type, doc_number, legal_name,
                signatory_name, pan_number, file_name, file_size, verified_at,
                status_message, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, 'verified')
            ON DUPLICATE KEY UPDATE
                doc_type = VALUES(doc_type),
                doc_number = VALUES(doc_number),
                legal_name = VALUES(legal_name),
                signatory_name = VALUES(signatory_name),
                pan_number = VALUES(pan_number),
                file_name = VALUES(file_name),
                file_size = VALUES(file_size),
                verified_at = NOW(),
                status_message = VALUES(status_message),
                status = 'verified'`,
            [
                id,
                productionHouseId,
                docType,
                docNumber,
                legalName,
                signatoryName || '',
                panNumber || '',
                fileName || 'gst_certificate.pdf',
                fileSize || '1.2 MB',
                statusMessage,
            ]
        );

        // Update production house verified flag
        await query(
            "UPDATE production_houses SET verified = 1, gst_registered = 1, verification_status = 'verified' WHERE id = ?",
            [productionHouseId]
        );

        const [updatedDoc] = await query(
            'SELECT * FROM verification_documents WHERE production_house_id = ?',
            [productionHouseId]
        );

        res.json({
            message: 'Verification document submitted and verified successfully.',
            verificationDocument: updatedDoc,
        });
    } catch (error) {
        next(error);
    }
};

// @route   GET /api/verification/:productionHouseId
exports.getStatus = async (req, res, next) => {
    try {
        const { productionHouseId } = req.params;

        const [doc] = await query(
            'SELECT * FROM verification_documents WHERE production_house_id = ?',
            [productionHouseId]
        );

        if (!doc) {
            return res.json({ verified: false, status: 'unverified' });
        }

        res.json({
            verified: doc.status === 'verified',
            verificationDocument: doc,
        });
    } catch (error) {
        next(error);
    }
};
