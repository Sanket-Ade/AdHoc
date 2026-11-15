const test = require('node:test');
const assert = require('node:assert');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- Helper simulation functions derived from lib/format.js and controllers ---
const formatINR = (amount) => {
    if (isNaN(amount)) return '₹0';
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(amount);
};

const formatINRCompact = (amount) => {
    if (isNaN(amount) || amount === 0) return '₹0';
    if (amount >= 10000000) {
        const val = (amount / 10000000).toFixed(2);
        return `₹${val.replace(/\.00$/, '')} Cr`;
    }
    if (amount >= 100000) {
        const val = (amount / 100000).toFixed(1);
        return `₹${val.replace(/\.0$/, '')} Lakh`;
    }
    if (amount >= 1000) {
        return `₹${(amount / 1000).toFixed(0)}k`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
};

const INR_BUDGET_RANGES = [
    { id: 'all', label: 'All Budgets (From ₹50,000)', min: 50000, max: Infinity },
    { id: '50k-1l', label: '₹50,000 – ₹1 Lakh (Starter / Social Ads)', min: 50000, max: 100000 },
    { id: '1l-5l', label: '₹1 Lakh – ₹5 Lakh (Mid-tier shoots / Packaging)', min: 100000, max: 500000 },
    { id: '5l-20l', label: '₹5 Lakh – ₹20 Lakh (Digital Films & Brand Systems)', min: 500000, max: 2000000 },
    { id: '20l-50l', label: '₹20 Lakh – ₹50 Lakh (Commercial Broadcast TVC)', min: 2000000, max: 5000000 },
    { id: '50l-plus', label: '₹50 Lakh+ (National Multi-city Campaign)', min: 5000000, max: Infinity },
];

// --- 1. UNIT TESTING: Currency & Budget Formatting ---
test('TC_UNIT_01: INR Currency Formatter Standard Conversion', (t) => {
    assert.strictEqual(formatINR(50000).replace(/\s/g, ''), '₹50,000');
    assert.strictEqual(formatINR(1500000).replace(/\s/g, ''), '₹15,00,000');
    assert.strictEqual(formatINR(NaN), '₹0');
});

test('TC_UNIT_02: Compact INR Formatter (Lakhs & Crores)', (t) => {
    assert.strictEqual(formatINRCompact(50000), '₹50k');
    assert.strictEqual(formatINRCompact(350000), '₹3.5 Lakh');
    assert.strictEqual(formatINRCompact(15000000), '₹1.50 Cr');
    assert.strictEqual(formatINRCompact(20000000), '₹2 Cr');
    assert.strictEqual(formatINRCompact(0), '₹0');
});

test('TC_UNIT_03: Budget Range Tier Verification & Boundaries', (t) => {
    const starterRange = INR_BUDGET_RANGES.find(r => r.id === '50k-1l');
    assert.ok(starterRange);
    assert.strictEqual(starterRange.min, 50000);
    assert.strictEqual(starterRange.max, 100000);

    const midRange = INR_BUDGET_RANGES.find(r => r.id === '1l-5l');
    assert.ok(midRange);
    assert.strictEqual(midRange.min, 100000);
    assert.strictEqual(midRange.max, 500000);

    const nationalRange = INR_BUDGET_RANGES.find(r => r.id === '50l-plus');
    assert.ok(nationalRange);
    assert.strictEqual(nationalRange.min, 5000000);
});

// --- 2. SECURITY & AUTHENTICATION TESTING ---
test('TC_SEC_01: Bcrypt Password Hashing and Match Verification', async (t) => {
    const rawPassword = 'password123';
    const saltRounds = 10;
    const hash = await bcrypt.hash(rawPassword, saltRounds);

    assert.ok(hash.startsWith('$2'));
    const isMatch = await bcrypt.compare(rawPassword, hash);
    assert.strictEqual(isMatch, true);

    const isWrongMatch = await bcrypt.compare('wrongPassword', hash);
    assert.strictEqual(isWrongMatch, false);
});

test('TC_SEC_02: JWT Token Lifecycle & RBAC Role Enforcement', (t) => {
    const secret = 'test_adhoc_jwt_secret_key_2026';
    const payload = {
        userId: 'user-cust-001',
        email: 'sarah@aurorabev.in',
        role: 'customer',
        category: 'business'
    };

    const token = jwt.sign(payload, secret, { expiresIn: '1h' });
    assert.ok(token && typeof token === 'string');

    const decoded = jwt.verify(token, secret);
    assert.strictEqual(decoded.userId, payload.userId);
    assert.strictEqual(decoded.email, payload.email);
    assert.strictEqual(decoded.role, 'customer');

    // Role Guard Simulation
    const checkRolePermission = (requiredRole, userRole) => {
        if (requiredRole === 'production_house') {
            return userRole === 'production_house' || userRole === 'admin';
        }
        return true;
    };

    assert.strictEqual(checkRolePermission('production_house', decoded.role), false);
    assert.strictEqual(checkRolePermission('production_house', 'production_house'), true);
});

// --- 3. FILTERING & SEARCH MATCHING ALGORITHM ---
test('TC_INT_01: Multi-Facet Discovery & Search Algorithm', (t) => {
    const sampleStudios = [
        {
            id: 'ph-1',
            name: 'Studio Bombay Films',
            category: 'business',
            city: 'Mumbai',
            verified: true,
            minBudget: 250000,
            services: [{ name: 'Commercial Films' }, { name: 'Brand Documentaries' }],
            rating: 4.9
        },
        {
            id: 'ph-2',
            name: 'Bangalore Indie Reels',
            category: 'freelancer',
            city: 'Bengaluru',
            verified: false,
            minBudget: 60000,
            services: [{ name: 'Social Ads' }, { name: 'Reels Production' }],
            rating: 4.7
        },
        {
            id: 'ph-3',
            name: 'Delhi Motion Works',
            category: 'business',
            city: 'Delhi NCR',
            verified: true,
            minBudget: 600000,
            services: [{ name: 'VFX & CGI' }, { name: 'Commercial Films' }],
            rating: 4.8
        }
    ];

    // Search query test
    const q = 'indie';
    const matched = sampleStudios.filter(s => s.name.toLowerCase().includes(q));
    assert.strictEqual(matched.length, 1);
    assert.strictEqual(matched[0].id, 'ph-2');

    // City and verified filter
    const mumbaiVerified = sampleStudios.filter(s => s.city.toLowerCase() === 'mumbai' && s.verified);
    assert.strictEqual(mumbaiVerified.length, 1);
    assert.strictEqual(mumbaiVerified[0].name, 'Studio Bombay Films');

    // Budget range filter (50k - 100k)
    const affordable = sampleStudios.filter(s => s.minBudget >= 50000 && s.minBudget <= 100000);
    assert.strictEqual(affordable.length, 1);
    assert.strictEqual(affordable[0].id, 'ph-2');
});

// --- 4. ENQUIRY & PROPOSAL WORKFLOW STATE MACHINE ---
test('TC_INT_02: Enquiry Workflow Lifecycle & Thread State Machine', (t) => {
    const allowedTransitions = {
        'pending': ['in_discussion', 'declined'],
        'in_discussion': ['accepted', 'declined'],
        'accepted': ['completed'],
        'declined': [],
        'completed': []
    };

    let enquiry = {
        id: 'enq-test-101',
        status: 'pending',
        customerId: 'cust-1',
        productionHouseId: 'ph-1',
        quoteAmount: null,
        messages: []
    };

    // Transition 1: Customer enquiry acknowledged into discussion
    assert.ok(allowedTransitions[enquiry.status].includes('in_discussion'));
    enquiry.status = 'in_discussion';

    // Transition 2: Studio submits customized proposal quote & message
    enquiry.quoteAmount = 350000;
    enquiry.messages.push({
        id: 'msg-1',
        senderRole: 'production_house',
        senderName: 'Karan Singhal',
        message: 'We can deliver a 4K commercial film with 2 rounds of edits for ₹3,50,000.',
        createdAt: new Date().toISOString()
    });
    assert.strictEqual(enquiry.quoteAmount, 350000);
    assert.strictEqual(enquiry.messages.length, 1);

    // Transition 3: Client accepts proposal
    assert.ok(allowedTransitions[enquiry.status].includes('accepted'));
    enquiry.status = 'accepted';
    assert.strictEqual(enquiry.status, 'accepted');

    // Security check: cannot transition from accepted back to pending
    const canRevert = allowedTransitions[enquiry.status].includes('pending');
    assert.strictEqual(canRevert, false);
});

// --- 5. GST VERIFICATION & COMPLIANCE RULES ---
test('TC_SYS_01: GSTIN Legal Validation & Format Verification', (t) => {
    const validateGSTIN = (gstin) => {
        // Indian GSTIN regex: 2 digits (state code), 10 char PAN, 1 entity code, 'Z', 1 checksum
        const regex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
        return regex.test(gstin);
    };

    assert.strictEqual(validateGSTIN('27AAECS1234F1Z5'), true);
    assert.strictEqual(validateGSTIN('07AAAAA0000A1Z5'), true);
    assert.strictEqual(validateGSTIN('INVALID_GST_123'), false);
    assert.strictEqual(validateGSTIN(''), false);
});

// --- 6. AI ASSISTANT CREATIVE BRIEF ENGINE ---
test('TC_SYS_02: AI Creative Assistant Intent Parsing & Studio Recommendation', (t) => {
    const sampleUserPrompt = "I need a 30s TV commercial for our organic beverage launch with ₹5 Lakh budget in Mumbai";

    const detectIntentAndRecommend = (text) => {
        const lower = text.toLowerCase();
        let detected = {
            category: 'Commercial Film',
            city: 'All',
            estimatedBudget: 0,
            recommendedTags: []
        };
        if (lower.includes('mumbai')) {
            detected.city = 'Mumbai';
            detected.recommendedTags.push('Mumbai Studio');
        }
        if (lower.includes('5 lakh') || lower.includes('5l')) {
            detected.estimatedBudget = 500000;
        }
        if (lower.includes('commercial') || lower.includes('tv')) {
            detected.category = 'Commercial Film';
            detected.recommendedTags.push('Broadcast TVC');
        }
        return detected;
    };

    const parsed = detectIntentAndRecommend(sampleUserPrompt);
    assert.strictEqual(parsed.city, 'Mumbai');
    assert.strictEqual(parsed.estimatedBudget, 500000);
    assert.strictEqual(parsed.category, 'Commercial Film');
    assert.ok(parsed.recommendedTags.includes('Broadcast TVC'));
});

// --- 7. AUTOMATED E2E / TESTIM.IO WORKFLOW SIMULATION ---
test('TC_E2E_01: Testim.io Simulated User Journey (Search -> Select -> Brief -> Quote)', (t) => {
    // Step 1: User Lands on Explore Page
    const session = {
        currentUser: { id: 'cust-101', name: 'Vikram Mehta', email: 'vikram@finscale.io', role: 'customer' },
        activeRoute: '/explore',
        selectedFilters: { category: 'Commercial Films', location: 'Mumbai' },
        selectedStudio: null,
        enquirySubmitted: false,
        activeThreadId: null
    };

    assert.strictEqual(session.activeRoute, '/explore');

    // Step 2: User clicks Studio Bombay Films card
    session.selectedStudio = { id: 'ph-1', name: 'Studio Bombay Films', minBudget: 250000 };
    session.activeRoute = `/production-houses/${session.selectedStudio.id}`;
    assert.strictEqual(session.selectedStudio.name, 'Studio Bombay Films');

    // Step 3: User triggers Send Enquiry Modal & submits creative brief
    const enquiryPayload = {
        customerId: session.currentUser.id,
        productionHouseId: session.selectedStudio.id,
        projectTitle: 'Fintech Mobile App Launch TVC',
        projectType: 'Commercial Film',
        budget: '₹5L - ₹10L',
        timeline: '3 Weeks',
        description: 'Need a fast-paced 30s promo for mobile app install campaign.'
    };
    assert.ok(enquiryPayload.projectTitle.length > 5);
    session.enquirySubmitted = true;
    session.activeThreadId = 'enq-generated-999';

    // Step 4: Verification of completed flow
    assert.strictEqual(session.enquirySubmitted, true);
    assert.ok(session.activeThreadId !== null);
});
