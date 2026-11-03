const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Load mock data from frontend lib
const { MOCK_PRODUCTION_HOUSES, INITIAL_ENQUIRIES } = require('../../lib/mock-data.js');

async function seed() {
    const host = process.env.DB_HOST || 'localhost';
    const port = parseInt(process.env.DB_PORT || '3306', 10);
    const user = process.env.DB_USER || 'root';
    const password = process.env.DB_PASSWORD || '';
    const database = process.env.DB_NAME || 'adhoc_db';

    console.log(`Connecting to MySQL database "${database}"...`);

    let connection;
    try {
        connection = await mysql.createConnection({
            host,
            port,
            user,
            password,
            database,
        });

        console.log('Connected to MySQL. Starting data seed...');

        // Disable foreign key checks for clean cleanup
        await connection.query('SET FOREIGN_KEY_CHECKS = 0');
        await connection.query('TRUNCATE TABLE enquiry_messages');
        await connection.query('TRUNCATE TABLE enquiries');
        await connection.query('TRUNCATE TABLE saved_houses');
        await connection.query('TRUNCATE TABLE verification_documents');
        await connection.query('TRUNCATE TABLE portfolio_items');
        await connection.query('TRUNCATE TABLE services');
        await connection.query('TRUNCATE TABLE production_houses');
        await connection.query('TRUNCATE TABLE users');
        await connection.query('SET FOREIGN_KEY_CHECKS = 1');

        console.log('Cleared existing table data.');

        // Default password for all seed accounts
        const defaultPasswordHash = await bcrypt.hash('password123', 10);

        // 1. Seed Demo Users
        const demoUsers = [
            {
                id: 'cust-1',
                name: 'Sarah Jenkins',
                email: 'sarah@aurorabev.in',
                password_hash: defaultPasswordHash,
                role: 'customer',
                category: 'business',
                company_name: 'Aurora Beverages India',
                location: 'Bandra, Mumbai',
                avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
                bio: 'Brand Lead at Aurora Beverages India. Commissioning commercial TVCs, digital video campaigns, and high-conversion motion ads.',
            },
            {
                id: 'cust-2',
                name: 'Vikram Mehta',
                email: 'vikram@finscale.io',
                password_hash: defaultPasswordHash,
                role: 'customer',
                category: 'business',
                company_name: 'FinScale Payments',
                location: 'Indiranagar, Bengaluru',
                avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
                bio: 'VP Growth & Marketing at FinScale Payments.',
            },
            {
                id: 'ph-user-1',
                name: 'Karan Singhal',
                email: 'production@studiobombayfilms.in',
                password_hash: defaultPasswordHash,
                role: 'production_house',
                category: 'business',
                company_name: 'Studio Bombay Films',
                location: 'Andheri West, Mumbai',
                avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                bio: 'Executive Producer at Studio Bombay Films. Commercial film director with 12+ years experience across TVCs and broadcast campaigns.',
            },
            {
                id: 'ph-user-freelance-1',
                name: 'Aman Deshmukh',
                email: 'aman.freelance@adhoc.in',
                password_hash: defaultPasswordHash,
                role: 'production_house',
                category: 'freelancer',
                company_name: 'Aman Deshmukh Cinematography',
                location: 'Bandra West, Mumbai',
                avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
                bio: 'Freelance Commercial Cinematographer & Director. Crafting high-aesthetic ad films and visual campaigns.',
            },
        ];

        for (const u of demoUsers) {
            await connection.execute(
                `INSERT INTO users (id, name, email, password_hash, role, category, company_name, location, avatar_url, bio)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [u.id, u.name, u.email, u.password_hash, u.role, u.category, u.company_name, u.location, u.avatar_url, u.bio]
            );
        }
        console.log(`Seeded ${demoUsers.length} initial demo users.`);

        // 2. Seed Production Houses & nested entities
        let totalServices = 0;
        let totalPortfolio = 0;
        let totalVerifications = 0;

        for (const ph of MOCK_PRODUCTION_HOUSES) {
            // Assign owner user
            let ownerUserId = null;
            if (ph.id === 'ph-1') ownerUserId = 'ph-user-1';
            else if (ph.id === 'ph-freelancer-1') ownerUserId = 'ph-user-freelance-1';

            await connection.execute(
                `INSERT INTO production_houses (
                    id, user_id, name, slug, tagline, description, logo_url, cover_image_url,
                    location, city, country, category, verified, gst_registered, verification_status,
                    rating, review_count, years_in_business, team_size, response_rate_hours,
                    budget_tier, min_budget, availability, featured, badges, notable_clients,
                    contact_email, phone, website, equipment_facilities, studio_floor_specs
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    ph.id,
                    ownerUserId,
                    ph.name,
                    ph.slug,
                    ph.tagline || '',
                    ph.description || '',
                    ph.logoUrl || null,
                    ph.coverImageUrl || null,
                    ph.location || '',
                    ph.city || 'Mumbai',
                    ph.country || 'India',
                    ph.category || 'business',
                    ph.verified ? 1 : 0,
                    ph.gstRegistered ? 1 : 0,
                    ph.verificationStatus || 'unverified',
                    ph.rating || 0.0,
                    ph.reviewCount || 0,
                    ph.yearsInBusiness || 1,
                    ph.teamSize || '',
                    ph.responseRateHours || 24,
                    ph.budgetTier || '₹₹',
                    ph.minBudget || 50000,
                    ph.availability || 'Available Now',
                    ph.featured ? 1 : 0,
                    JSON.stringify(ph.badges || []),
                    JSON.stringify(ph.notableClients || []),
                    ph.contactEmail || '',
                    ph.phone || '',
                    ph.website || '',
                    JSON.stringify(ph.equipmentFacilities || []),
                    ph.studioFloorSpecs || null,
                ]
            );

            // Services
            if (Array.isArray(ph.services)) {
                for (const s of ph.services) {
                    await connection.execute(
                        `INSERT INTO services (id, production_house_id, name, description, starting_price, turnaround_days, tags)
                         VALUES (?, ?, ?, ?, ?, ?, ?)`,
                        [
                            s.id,
                            ph.id,
                            s.name,
                            s.description || '',
                            s.startingPrice || 0,
                            s.turnaroundDays || 7,
                            JSON.stringify(s.tags || []),
                        ]
                    );
                    totalServices++;
                }
            }

            // Portfolio
            if (Array.isArray(ph.portfolio)) {
                for (const p of ph.portfolio) {
                    await connection.execute(
                        `INSERT INTO portfolio_items (id, production_house_id, title, category, client_name, thumbnail_url, video_url, description, metrics, year, featured)
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                        [
                            p.id,
                            ph.id,
                            p.title,
                            p.category || '',
                            p.clientName || '',
                            p.thumbnailUrl || null,
                            p.videoUrl || null,
                            p.description || '',
                            p.metrics || '',
                            p.year || 2025,
                            p.featured ? 1 : 0,
                        ]
                    );
                    totalPortfolio++;
                }
            }

            // Verification Document
            if (ph.verificationDocument) {
                const vd = ph.verificationDocument;
                const docId = `verif-${ph.id}`;
                await connection.execute(
                    `INSERT INTO verification_documents (
                        id, production_house_id, doc_type, doc_number, legal_name,
                        signatory_name, pan_number, file_name, file_size, status_message, status
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        docId,
                        ph.id,
                        vd.docType || 'gst',
                        vd.docNumber || '',
                        vd.legalName || '',
                        vd.signatoryName || '',
                        vd.panNumber || '',
                        vd.fileName || '',
                        vd.fileSize || '',
                        vd.statusMessage || '',
                        ph.verificationStatus || 'verified',
                    ]
                );
                totalVerifications++;
            }
        }

        console.log(`Seeded ${MOCK_PRODUCTION_HOUSES.length} production houses, ${totalServices} services, ${totalPortfolio} portfolio items, ${totalVerifications} verification documents.`);

        // 3. Seed Enquiries & Messages
        let totalEnquiries = 0;
        let totalMessages = 0;

        for (const enq of INITIAL_ENQUIRIES) {
            // Map status
            let status = 'pending';
            if (enq.status === 'accepted' || enq.status === 'confirmed') status = 'accepted';
            else if (enq.status === 'declined' || enq.status === 'rejected') status = 'declined';
            else if (enq.status === 'in_discussion' || enq.status === 'under_review') status = 'in_discussion';
            else if (enq.status === 'completed') status = 'completed';

            // Make sure customer exists
            const [custCheck] = await connection.execute('SELECT id FROM users WHERE id = ?', [enq.customerId]);
            const customerId = custCheck.length > 0 ? enq.customerId : 'cust-1';

            await connection.execute(
                `INSERT INTO enquiries (
                    id, customer_id, production_house_id, project_title, project_type,
                    budget, timeline, description, status, quote_amount, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    enq.id,
                    customerId,
                    enq.productionHouseId,
                    enq.projectTitle || 'Creative Campaign',
                    enq.category || 'Video Production',
                    enq.budgetRange || '₹5,00,000 - ₹10,00,000',
                    enq.deadline || '4 Weeks',
                    enq.description || '',
                    status,
                    enq.quotedAmount || null,
                    enq.createdAt ? new Date(enq.createdAt) : new Date(),
                ]
            );
            totalEnquiries++;

            // Seed messages for this enquiry
            if (Array.isArray(enq.messages)) {
                for (const msg of enq.messages) {
                    const senderId = msg.senderRole === 'customer' ? 'cust-1' : (
                        enq.productionHouseId === 'ph-1' ? 'ph-user-1' : 'ph-user-freelance-1'
                    );

                    await connection.execute(
                        `INSERT INTO enquiry_messages (id, enquiry_id, sender_id, sender_role, sender_name, message, created_at)
                         VALUES (?, ?, ?, ?, ?, ?, ?)`,
                        [
                            msg.id,
                            enq.id,
                            senderId,
                            msg.senderRole === 'customer' ? 'customer' : 'production_house',
                            msg.senderName || 'User',
                            msg.content || msg.message || '',
                            msg.timestamp ? new Date(msg.timestamp) : new Date(),
                        ]
                    );
                    totalMessages++;
                }
            }
        }
        console.log(`Seeded ${totalEnquiries} enquiries and ${totalMessages} enquiry messages.`);

        // 4. Seed Saved Houses
        await connection.execute(
            `INSERT INTO saved_houses (id, user_id, production_house_id)
             VALUES ('fav-1', 'cust-1', 'ph-1'), ('fav-2', 'cust-1', 'ph-3')`
        );
        console.log('Seeded initial saved houses.');

        console.log('\n========================================');
        console.log('DATABASE SEED COMPLETED SUCCESSFULLY!');
        console.log('Demo Credentials for Testing:');
        console.log('  Customer:          sarah@aurorabev.in           / password123');
        console.log('  Production House:  production@studiobombayfilms.in / password123');
        console.log('  Freelancer:        aman.freelance@adhoc.in      / password123');
        console.log('========================================\n');
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

seed();
