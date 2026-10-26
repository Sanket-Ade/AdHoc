/**
 * Indian Rupee (INR) formatting utilities
 */
export const formatINR = (amount) => {
    if (isNaN(amount))
        return '₹0';
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(amount);
};
export const formatINRCompact = (amount) => {
    if (isNaN(amount) || amount === 0)
        return '₹0';
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
export const INR_BUDGET_RANGES = [
    { id: 'all', label: 'All Budgets', min: 0, max: Infinity },
    { id: 'under-1l', label: 'Under ₹1 Lakh (Digital / Collateral)', min: 0, max: 100000 },
    { id: '1l-5l', label: '₹1 Lakh – ₹5 Lakh (Mid-tier shoots / Packaging)', min: 100000, max: 500000 },
    { id: '5l-20l', label: '₹5 Lakh – ₹20 Lakh (Digital Films & Brand Systems)', min: 500000, max: 2000000 },
    { id: '20l-50l', label: '₹20 Lakh – ₹50 Lakh (Commercial Broadcast TVC)', min: 2000000, max: 5000000 },
    { id: '50l-plus', label: '₹50 Lakh+ (National Multi-city Campaign)', min: 5000000, max: Infinity },
];
