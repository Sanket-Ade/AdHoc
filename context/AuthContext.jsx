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
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);
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
                const parsed = JSON.parse(savedEnqs);
                // Ensure every enquiry has a messages array
                const migrated = parsed.map((e) => {
                    if (!e.messages || e.messages.length === 0) {
                        const init = INITIAL_ENQUIRIES.find((ie) => ie.id === e.id);
                        return {
                            ...e,
                            messages: init?.messages || [
                                {
                                    id: `msg-${e.id}-init`,
                                    senderId: e.customerId || 'cust-1',
                                    senderName: e.customerName || 'Client',
                                    senderRole: 'customer',
                                    content: e.description ? `Project Brief: ${e.description}` : 'Hi, we submitted our creative brief and look forward to discussing the project proposal.',
                                    timestamp: e.createdAt || new Date().toISOString(),
                                }
                            ]
                        };
                    }
                    return e;
                });
                setEnquiries(migrated);
            }
            const savedHouses = localStorage.getItem('adhoc_production_houses');
            if (savedHouses) {
                const parsed = JSON.parse(savedHouses);
                // Merge initial mock houses with saved houses so new mock studios (e.g. local indie studios) are always available
                const existingIds = new Set(parsed.map((h) => h.id));
                const merged = [...parsed, ...MOCK_PRODUCTION_HOUSES.filter((h) => !existingIds.has(h.id))];
                setProductionHouses(merged);
            }
        }
        catch {
            // Fallback to default in-memory state
        }
        finally {
            setIsLoadingAuth(false);
        }
    }, []);
    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => {
            setToast(null);
        }, 4000);
    };
    const login = async (email, role, name) => {
        let assignedId = `cust-${Date.now()}`;
        let company = 'Creative Client Co.';
        let userName = name || (email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1));

        try {
            const savedUsers = localStorage.getItem('adhoc_registered_users');
            const registeredList = savedUsers ? JSON.parse(savedUsers) : [];
            const registeredUser = registeredList.find((u) => u.email?.toLowerCase() === email.toLowerCase());
            if (registeredUser) {
                assignedId = registeredUser.id;
                company = registeredUser.companyName;
                userName = registeredUser.name;
            }
        } catch {
            // fallback
        }

        if (role === 'production_house') {
            // Check if there is an existing studio associated with this email
            const existingStudio = productionHouses.find((h) => h.contactEmail?.toLowerCase() === email.toLowerCase());
            if (existingStudio) {
                assignedId = existingStudio.id;
                company = existingStudio.name;
            } else if (email === DEMO_PRODUCTION_HOUSE.email) {
                assignedId = 'ph-1';
                company = DEMO_PRODUCTION_HOUSE.companyName;
            } else {
                assignedId = assignedId.startsWith('ph-') ? assignedId : 'ph-1';
                company = company || 'Studio Bombay Films';
            }
        }

        const newUser = {
            id: assignedId,
            productionHouseId: role === 'production_house' ? assignedId : undefined,
            name: userName,
            email,
            role,
            companyName: company,
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
    const signup = async (email, name, role, companyName, location) => {
        if (role === 'production_house') {
            const studioId = `ph-${Date.now()}`;
            const studioName = companyName || `${name} Studios`;
            const studioCity = location ? location.split(',')[0].trim() : 'Mumbai';
            const studioLocation = location || `${studioCity}, India`;

            const newStudio = {
                id: studioId,
                name: studioName,
                slug: studioName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
                tagline: 'Independent Commercial & Creative Video Studio',
                description: `Independent creative studio based in ${studioLocation}. Founded by ${name}. We craft commercial films, branded video, and social campaigns. Document verification (GST or Udyam Certificate) is required to operate.`,
                logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=160&auto=format&fit=crop&q=80',
                coverImageUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1400&auto=format&fit=crop&q=80',
                location: studioLocation,
                city: studioCity,
                country: 'India',
                verified: false, // Mandatory verification required before operations are enabled
                gstRegistered: false,
                verificationStatus: 'unverified',
                verificationDocument: null,
                studioType: 'Commercial Production House',
                rating: 5.0,
                reviewCount: 0,
                yearsInBusiness: 1,
                teamSize: '5-12 Crew & Creatives',
                responseRateHours: 2,
                budgetTier: '₹',
                minBudget: 50000,
                availability: 'Available Now',
                featured: false,
                badges: ['Local Indie Studio', 'Portfolio Showcase'],
                notableClients: ['Local Brands & Creators'],
                contactEmail: email,
                phone: '+91 98765 43210',
                website: `https://${studioName.toLowerCase().replace(/[^a-z0-9]+/g, '')}.local`,
                equipmentFacilities: [
                    '4K Cinema Camera Rig Package',
                    'High-CRI Field Lighting Kit',
                    'DaVinci Resolve Color Grading Suite',
                ],
                studioFloorSpecs: 'Boutique studio workspace with edit & audio suite',
                services: [
                    {
                        id: `s-${Date.now()}-1`,
                        name: 'Video Production',
                        description: 'End-to-end commercial video production: concept ideation, cinematography, editing, and sound design.',
                        startingPrice: 65000,
                        turnaroundDays: 12,
                        tags: ['Commercial Ad', 'Brand Narrative', 'Music Video', '4K Master'],
                    },
                    {
                        id: `s-${Date.now()}-2`,
                        name: 'Digital Advertisement',
                        description: 'Short-form vertical video ads, dynamic social hooks, and promotional reels.',
                        startingPrice: 25000,
                        turnaroundDays: 5,
                        tags: ['Social Video', '9:16 Reels', 'Performance Hooks'],
                    },
                ],
                portfolio: [
                    {
                        id: `p-${Date.now()}-1`,
                        title: 'Debut Commercial Showcase',
                        category: 'Video Production',
                        clientName: 'Local Showcase Client',
                        thumbnailUrl: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&auto=format&fit=crop&q=80',
                        description: 'Cinematic commercial reel highlighting narrative pacing, color work, and creative cinematography.',
                        metrics: 'Debut Portfolio Film',
                        year: 2026,
                        featured: true,
                    },
                ],
                reviews: [],
            };

            const newUser = {
                id: studioId,
                productionHouseId: studioId,
                name,
                email,
                role,
                companyName: studioName,
                createdAt: new Date().toISOString(),
                avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
            };

            setProductionHouses((prev) => {
                const updated = [newStudio, ...prev];
                localStorage.setItem('adhoc_production_houses', JSON.stringify(updated));
                return updated;
            });

            try {
                const savedUsers = localStorage.getItem('adhoc_registered_users');
                const registeredList = savedUsers ? JSON.parse(savedUsers) : [];
                const updatedList = [newUser, ...registeredList.filter((u) => u.email?.toLowerCase() !== email.toLowerCase())];
                localStorage.setItem('adhoc_registered_users', JSON.stringify(updatedList));
            } catch {
                // ignore
            }

            showToast(`Account successfully created for ${studioName}! Please log in.`, 'success');
            return true;
        }

        const newUser = {
            id: `usr-${Date.now()}`,
            name,
            email,
            role,
            companyName: companyName || `${name} Ventures`,
            createdAt: new Date().toISOString(),
            avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        };

        try {
            const savedUsers = localStorage.getItem('adhoc_registered_users');
            const registeredList = savedUsers ? JSON.parse(savedUsers) : [];
            const updatedList = [newUser, ...registeredList.filter((u) => u.email?.toLowerCase() !== email.toLowerCase())];
            localStorage.setItem('adhoc_registered_users', JSON.stringify(updatedList));
        } catch {
            // ignore
        }

        showToast(`Account successfully created for ${name}! Please log in.`, 'success');
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
        const initialMsg = {
            id: `msg-${Date.now()}`,
            senderId: newEnquiryData.customerId || 'cust-1',
            senderName: newEnquiryData.customerName || 'Client',
            senderRole: 'customer',
            content: newEnquiryData.description
                ? `Initial Project Brief: ${newEnquiryData.description}`
                : 'Hi, we submitted our creative brief and look forward to discussing the project scope.',
            timestamp: new Date().toISOString(),
        };
        const created = {
            ...newEnquiryData,
            id: `enq-${Date.now()}`,
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            messages: [initialMsg],
        };
        setEnquiries((prev) => {
            const updated = [created, ...prev];
            localStorage.setItem('adhoc_enquiries', JSON.stringify(updated));
            return updated;
        });
        showToast(`Enquiry "${created.projectTitle}" successfully sent to ${created.productionHouseName}!`);
        return created;
    };
    const sendEnquiryMessage = (enquiryId, content, attachment) => {
        if (!content?.trim() && !attachment) return null;

        let sentMessage = null;
        let targetEnquiry = null;

        setEnquiries((prev) => {
            const updated = prev.map((enq) => {
                if (enq.id === enquiryId) {
                    targetEnquiry = enq;
                    const isStudioUser = user?.role === 'production_house';
                    const senderName = isStudioUser
                        ? (enq.productionHouseName || user?.companyName || user?.name || 'Production Studio')
                        : (user?.name || enq.customerName || 'Business Client');
                    const senderRole = isStudioUser ? 'production_house' : 'customer';
                    const senderId = user?.id || (isStudioUser ? enq.productionHouseId : enq.customerId);

                    sentMessage = {
                        id: `msg-${Date.now()}`,
                        senderId,
                        senderName,
                        senderRole,
                        content: content ? content.trim() : '',
                        attachment: attachment || null,
                        timestamp: new Date().toISOString(),
                    };

                    return {
                        ...enq,
                        messages: [...(enq.messages || []), sentMessage],
                        updatedAt: new Date().toISOString(),
                    };
                }
                return enq;
            });
            localStorage.setItem('adhoc_enquiries', JSON.stringify(updated));
            return updated;
        });

        // Interactive simulation for demo: simulate a reply from the other party after 1.6s
        if (targetEnquiry) {
            const isStudioUser = user?.role === 'production_house';
            const replyingRole = isStudioUser ? 'customer' : 'production_house';
            const replyingName = isStudioUser ? targetEnquiry.customerName : targetEnquiry.productionHouseName;
            const replyingId = isStudioUser ? targetEnquiry.customerId : targetEnquiry.productionHouseId;

            const clientReplies = [
                "Thank you for confirming! We are reviewing the deliverables with our marketing team.",
                "Sounds great. Could you confirm if high-speed slow-motion camera is included in this quote?",
                "That works with our timeline. We will prepare the product samples for the shoot location.",
                "Understood. Let's schedule a recce call this week to finalize the storyboard."
            ];
            const studioReplies = [
                "Thanks for the details! Our director and camera team reviewed your requirements.",
                "Understood! We can definitely accommodate that location. Our lighting and grip package is ready.",
                "We can deliver the first rough cut within 5 business days after shoot wrap.",
                "Sounds perfect. We will update the project schedule and formal proposal accordingly."
            ];

            const pool = isStudioUser ? clientReplies : studioReplies;
            const autoReplyText = pool[Math.floor(Math.random() * pool.length)];

            setTimeout(() => {
                setEnquiries((prev) => {
                    const found = prev.find((e) => e.id === enquiryId);
                    if (!found) return prev;
                    const replyMsg = {
                        id: `msg-rep-${Date.now()}`,
                        senderId: replyingId,
                        senderName: replyingName,
                        senderRole: replyingRole,
                        content: autoReplyText,
                        timestamp: new Date().toISOString(),
                    };
                    const withReply = prev.map((e) => (e.id === enquiryId ? {
                        ...e,
                        messages: [...(e.messages || []), replyMsg],
                        updatedAt: new Date().toISOString(),
                    } : e));
                    localStorage.setItem('adhoc_enquiries', JSON.stringify(withReply));
                    showToast(`New message from ${replyingName}!`, 'info');
                    return withReply;
                });
            }, 1600);
        }

        return sentMessage;
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
    const deleteEnquiry = (enquiryId) => {
        let deletedTitle = '';
        setEnquiries((prev) => {
            const target = prev.find((e) => e.id === enquiryId);
            deletedTitle = target?.projectTitle || 'Enquiry';
            const updated = prev.filter((e) => e.id !== enquiryId);
            localStorage.setItem('adhoc_enquiries', JSON.stringify(updated));
            return updated;
        });
        showToast(`Enquiry "${deletedTitle}" deleted.`);
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
    const verifyStudioDocuments = (houseId, documentData) => {
        let verifiedName = '';
        setProductionHouses((prev) => {
            const updated = prev.map((h) => {
                if (h.id === houseId) {
                    verifiedName = h.name;
                    const isGst = documentData.docType === 'gst';
                    const docLabel = isGst ? 'GST Verified' : 'Udyam MSME Verified';
                    const newBadges = Array.from(new Set([
                        docLabel,
                        'Genuine Document Verified',
                        ...h.badges.filter((b) => b !== 'Local Indie Studio' && b !== 'GST Verified' && b !== 'Udyam MSME Verified')
                    ]));
                    return {
                        ...h,
                        verified: true,
                        gstRegistered: isGst,
                        udyamRegistered: !isGst,
                        verificationStatus: 'verified',
                        verificationDocument: {
                            docType: documentData.docType, // 'gst' | 'udyam'
                            docNumber: documentData.docNumber,
                            legalName: documentData.legalName || h.name,
                            signatoryName: documentData.signatoryName || 'Authorized Signatory',
                            panNumber: documentData.panNumber || (documentData.docNumber?.length >= 10 ? documentData.docNumber.slice(2, 12) : 'AABCP1234M'),
                            fileName: documentData.fileName || (isGst ? 'gst_certificate.pdf' : 'udyam_registration_certificate.pdf'),
                            fileSize: documentData.fileSize || '1.8 MB',
                            submittedAt: new Date().toISOString(),
                            verifiedAt: new Date().toISOString(),
                            statusMessage: 'Verified & Confirmed Genuine Record'
                        },
                        badges: newBadges,
                    };
                }
                return h;
            });
            localStorage.setItem('adhoc_production_houses', JSON.stringify(updated));
            return updated;
        });
        showToast(`Verification Approved! ${verifiedName || 'Studio'} is verified genuine. All operations are now unlocked.`, 'success');
    };

    const revokeVerification = (houseId, reason = 'Document requires re-verification') => {
        setProductionHouses((prev) => {
            const updated = prev.map((h) => {
                if (h.id === houseId) {
                    return {
                        ...h,
                        verified: false,
                        gstRegistered: false,
                        udyamRegistered: false,
                        verificationStatus: 'unverified',
                        verificationDocument: null,
                        badges: h.badges.filter((b) => b !== 'GST Verified' && b !== 'Udyam MSME Verified' && b !== 'Genuine Document Verified')
                    };
                }
                return h;
            });
            localStorage.setItem('adhoc_production_houses', JSON.stringify(updated));
            return updated;
        });
        showToast(`Verification revoked: ${reason}. Studio locked.`, 'error');
    };

    const toggleVerification = (houseId) => {
        let isNowVerified = false;
        setProductionHouses((prev) => {
            const updated = prev.map((h) => {
                if (h.id === houseId) {
                    isNowVerified = !h.verified;
                    const badges = isNowVerified
                        ? Array.from(new Set(['GST Verified', 'Genuine Document Verified', ...h.badges.filter((b) => b !== 'Local Indie Studio')]))
                        : h.badges.filter((b) => b !== 'GST Verified' && b !== 'Genuine Document Verified');
                    return {
                        ...h,
                        verified: isNowVerified,
                        gstRegistered: isNowVerified,
                        verificationStatus: isNowVerified ? 'verified' : 'unverified',
                        verificationDocument: isNowVerified ? {
                            docType: 'gst',
                            docNumber: '27AAACP0123M1ZT',
                            legalName: h.name,
                            signatoryName: 'Authorized Signatory',
                            fileName: 'gst_certificate_verified.pdf',
                            fileSize: '1.5 MB',
                            verifiedAt: new Date().toISOString(),
                            statusMessage: 'Verified & Confirmed Genuine Record'
                        } : null,
                        badges,
                    };
                }
                return h;
            });
            localStorage.setItem('adhoc_production_houses', JSON.stringify(updated));
            return updated;
        });
        showToast(isNowVerified ? 'Studio verified genuine! All features unlocked.' : 'Studio unverified. Actions are locked until verified.', isNowVerified ? 'success' : 'error');
    };
    const requestVerification = (houseId, details = {}) => {
        setProductionHouses((prev) => {
            const updated = prev.map((h) => {
                if (h.id === houseId) {
                    return {
                        ...h,
                        verified: true,
                        gstRegistered: true,
                        gstNumber: details.gstNumber || '27AAACP0123M1ZT',
                        badges: Array.from(new Set(['GST Verified', ...h.badges])),
                    };
                }
                return h;
            });
            localStorage.setItem('adhoc_production_houses', JSON.stringify(updated));
            return updated;
        });
        showToast('Verification details recorded! Verified badge active.');
    };
    const addService = (houseId, service) => {
        const newService = {
            ...service,
            id: `s-${Date.now()}`,
        };
        setProductionHouses((prev) => {
            const updated = prev.map((h) => {
                if (h.id === houseId) {
                    return {
                        ...h,
                        services: [...(h.services || []), newService],
                    };
                }
                return h;
            });
            localStorage.setItem('adhoc_production_houses', JSON.stringify(updated));
            return updated;
        });
        showToast(`Added "${newService.name}" to services!`);
    };
    const deleteService = (houseId, serviceId) => {
        setProductionHouses((prev) => {
            const updated = prev.map((h) => {
                if (h.id === houseId) {
                    return {
                        ...h,
                        services: (h.services || []).filter((s) => s.id !== serviceId),
                    };
                }
                return h;
            });
            localStorage.setItem('adhoc_production_houses', JSON.stringify(updated));
            return updated;
        });
        showToast('Service removed.');
    };
    return (<AuthContext.Provider value={{
            user,
            role: user?.role || null,
            isAuthenticated: Boolean(user),
            isLoadingAuth,
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
            deleteEnquiry,
            sendEnquiryMessage,
            updateEnquiryStatus,
            updateProductionHouse,
            addPortfolioItem,
            deletePortfolioItem,
            toggleVerification,
            verifyStudioDocuments,
            revokeVerification,
            requestVerification,
            addService,
            deleteService,
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
