'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_PRODUCTION_HOUSES, INITIAL_ENQUIRIES } from '@/lib/mock-data';
const AuthContext = createContext(undefined);
const DEMO_CUSTOMER = {
    id: 'cust-1',
    name: 'Sarah Jenkins',
    email: 'sarah@aurorabev.in',
    role: 'customer',
    companyName: 'Aurora Beverages India',
    location: 'Bandra, Mumbai',
    createdAt: '2026-01-15T00:00:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
};
const DEMO_PRODUCTION_HOUSE = {
    id: 'ph-1',
    name: 'Karan Singhal',
    email: 'production@studiobombayfilms.in',
    role: 'production_house',
    companyName: 'Studio Bombay Films',
    location: 'Andheri West, Mumbai',
    createdAt: '2024-03-10T00:00:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: 'Executive Producer at Studio Bombay Films. Commercial film director with 12+ years experience across TVCs and broadcast campaigns.',
};
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [savedHouseIds, setSavedHouseIds] = useState(['ph-1', 'ph-3']);
    const [enquiries, setEnquiries] = useState(INITIAL_ENQUIRIES);
    const [productionHouses, setProductionHouses] = useState(MOCK_PRODUCTION_HOUSES);
    const [toast, setToast] = useState(null);
    // Initialize from localStorage if client-side
    useEffect(() => {
        try {
            const savedUser = localStorage.getItem('adhoc_user');
            if (savedUser) {
                setUser(JSON.parse(savedUser));
            }
            const savedBookmarks = localStorage.getItem('adhoc_saved_houses');
            if (savedBookmarks) {
                setSavedHouseIds(JSON.parse(savedBookmarks));
            }
            const savedEnqs = localStorage.getItem('adhoc_enquiries');
            if (savedEnqs) {
                setEnquiries(JSON.parse(savedEnqs));
            }
            const savedHouses = localStorage.getItem('adhoc_production_houses');
            if (savedHouses) {
                setProductionHouses(JSON.parse(savedHouses));
            }
        }
        catch {
            // Fallback to default in-memory state
        }
    }, []);
    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => {
            setToast(null);
        }, 4000);
    };
    const login = async (email, role, name) => {
        const newUser = {
            id: role === 'production_house' ? 'ph-1' : `cust-${Date.now()}`,
            name: name || (email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1)),
            email,
            role,
            companyName: role === 'production_house' ? 'PixelCraft Studios' : 'Creative Client Co.',
            createdAt: new Date().toISOString(),
            avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        };
        setUser(newUser);
        localStorage.setItem('adhoc_user', JSON.stringify(newUser));
        showToast(`Welcome back, ${newUser.name}! Logged in as ${role === 'customer' ? 'Business' : 'Production House'}.`);
        return true;
    };
    const loginAsDemo = (demoRole) => {
        const targetUser = demoRole === 'customer' ? DEMO_CUSTOMER : DEMO_PRODUCTION_HOUSE;
        setUser(targetUser);
        localStorage.setItem('adhoc_user', JSON.stringify(targetUser));
        showToast(`Switched demo account: Logged in as ${targetUser.name} (${targetUser.role === 'customer' ? 'Business' : 'Production House'})`);
    };
    const signup = async (email, name, role, companyName) => {
        const newUser = {
            id: `usr-${Date.now()}`,
            name,
            email,
            role,
            companyName: companyName || (role === 'production_house' ? `${name} Studios` : `${name} Ventures`),
            createdAt: new Date().toISOString(),
            avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        };
        setUser(newUser);
        localStorage.setItem('adhoc_user', JSON.stringify(newUser));
        showToast(`Account successfully created! Welcome to Adhoc, ${name}.`);
        return true;
    };
    const logout = () => {
        setUser(null);
        localStorage.removeItem('adhoc_user');
        showToast('You have been logged out.');
    };
    const toggleSaveHouse = (houseId) => {
        setSavedHouseIds((prev) => {
            const isSaved = prev.includes(houseId);
            const updated = isSaved ? prev.filter((id) => id !== houseId) : [...prev, houseId];
            localStorage.setItem('adhoc_saved_houses', JSON.stringify(updated));
            const targetHouse = productionHouses.find((h) => h.id === houseId);
            showToast(isSaved
                ? `Removed ${targetHouse?.name || 'Studio'} from saved bookmarks.`
                : `Saved ${targetHouse?.name || 'Studio'} to your favorites!`, 'info');
            return updated;
        });
    };
    const isHouseSaved = (houseId) => savedHouseIds.includes(houseId);
    const addEnquiry = (newEnquiryData) => {
        const created = {
            ...newEnquiryData,
            id: `enq-${Date.now()}`,
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        setEnquiries((prev) => {
            const updated = [created, ...prev];
            localStorage.setItem('adhoc_enquiries', JSON.stringify(updated));
            return updated;
        });
        showToast(`Enquiry "${created.projectTitle}" successfully sent to ${created.productionHouseName}!`);
        return created;
    };
    const updateEnquiryStatus = (enquiryId, status, quoteAmount, quoteNotes) => {
        setEnquiries((prev) => {
            const updated = prev.map((enq) => {
                if (enq.id === enquiryId) {
                    return {
                        ...enq,
                        status,
                        ...(quoteAmount !== undefined ? { quotedAmount: quoteAmount } : {}),
                        ...(quoteNotes !== undefined ? { quoteNotes } : {}),
                        updatedAt: new Date().toISOString(),
                    };
                }
                return enq;
            });
            localStorage.setItem('adhoc_enquiries', JSON.stringify(updated));
            return updated;
        });
        const statusLabels = {
            pending: 'marked as Pending',
            under_review: 'set to Under Review',
            quoted: 'Quote Sent to Customer',
            in_progress: 'moved to Active Production',
            completed: 'marked as Completed',
            declined: 'Declined',
        };
        showToast(`Enquiry ${statusLabels[status]}.`);
    };
    const updateProductionHouse = (houseId, updates) => {
        setProductionHouses((prev) => {
            const updated = prev.map((h) => (h.id === houseId ? { ...h, ...updates } : h));
            localStorage.setItem('adhoc_production_houses', JSON.stringify(updated));
            return updated;
        });
        showToast('Production House profile updated successfully.');
    };
    const addPortfolioItem = (houseId, item) => {
        const newItem = {
            ...item,
            id: `p-${Date.now()}`,
        };
        setProductionHouses((prev) => {
            const updated = prev.map((h) => {
                if (h.id === houseId) {
                    return {
                        ...h,
                        portfolio: [newItem, ...h.portfolio],
                    };
                }
                return h;
            });
            localStorage.setItem('adhoc_production_houses', JSON.stringify(updated));
            return updated;
        });
        showToast(`Added "${newItem.title}" to portfolio!`);
    };
    const deletePortfolioItem = (houseId, itemId) => {
        setProductionHouses((prev) => {
            const updated = prev.map((h) => {
                if (h.id === houseId) {
                    return {
                        ...h,
                        portfolio: h.portfolio.filter((p) => p.id !== itemId),
                    };
                }
                return h;
            });
            localStorage.setItem('adhoc_production_houses', JSON.stringify(updated));
            return updated;
        });
        showToast('Portfolio item removed.');
    };
    return (<AuthContext.Provider value={{
            user,
            role: user?.role || null,
            isAuthenticated: Boolean(user),
            savedHouseIds,
            enquiries,
            productionHouses,
            login,
            loginAsDemo,
            signup,
            logout,
            toggleSaveHouse,
            isHouseSaved,
            addEnquiry,
            updateEnquiryStatus,
            updateProductionHouse,
            addPortfolioItem,
            deletePortfolioItem,
            toast,
            showToast,
        }}>
      {children}
      {toast && (<div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-soft-lg bg-white border border-[#DCE8F5] text-[#172B4D] animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className={`w-2.5 h-2.5 rounded-full ${toast.type === 'success'
                ? 'bg-emerald-500'
                : toast.type === 'error'
                    ? 'bg-rose-500'
                    : 'bg-[#5B9DF9]'}`}/>
          <span className="text-sm font-medium">{toast.message}</span>
        </div>)}
    </AuthContext.Provider>);
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
