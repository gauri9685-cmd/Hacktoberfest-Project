/**
 * ============================================================================
 * SAFECAMPUS CONNECT V2 — SELLER / LENDER PUBLIC PROFILE CONTROLLER
 * Reads seller/item from query params & renders verified lender information,
 * sharing track record history, and available inventory.
 * ============================================================================
 */

// Sellers / Lenders Database Directory
const SELLERS_DIRECTORY = {
    "Rahul Verma": {
        name: "Rahul Verma",
        roll: "21/IT/042",
        branch: "Information Technology (IT)",
        year: "3rd Year (B.Tech)",
        hostel: "Hostel No 24",
        room: "Room 203",
        phone: "+91 9437543796",
        email: "abcd@gmail.com",
        trustRating: "⭐ 4.9 Trust Rating (14 Borrows)",
        history: [
            { title: "Shared: Casio FX-991CW Calculator", meta: "Borrowed by Ananya Roy • Rated 5.0 ⭐", date: "Oct 2026", status: "Active" },
            { title: "Shared: Digital Signal Processing Notes", meta: "Borrowed by Rohit Raj • Returned on time", date: "Sep 2026", status: "Returned" },
            { title: "Shared: Microprocessor 8085 Kit", meta: "Borrowed by Karan Mehta • Completed", date: "Aug 2026", status: "Returned" },
            { title: "Shared: Engineering Mathematics Volume 2", meta: "Borrowed by Sneha K • Completed", date: "May 2026", status: "Returned" }
        ],
        items: [
            {
                id: "item-001",
                name: "Casio FX-991CW Calculator",
                category: "Electronics",
                type: "free",
                shortDesc: "Non-programmable scientific calculator, perfect for engineering exams.",
                fullDesc: "Casio FX-991CW Classwiz Non-Programmable Scientific Calculator, used for 4 years, in good working condition.",
                image: "item_calculator.jpg",
                availability: "5th Oct - 8th Oct",
                location: "Room No 203, Hostel No 24"
            },
            {
                id: "item-001-b",
                name: "Engineering Mechanics (S. Timoshenko)",
                category: "Books",
                type: "free",
                shortDesc: "Standard reference textbook with highlighted previous year questions.",
                fullDesc: "Classic Engineering Mechanics by Timoshenko & Young. Includes solved examples and notes.",
                image: "banner_books.jpg",
                availability: "Available Always",
                location: "Room No 203, Hostel No 24"
            }
        ]
    },
    "Priya Sharma": {
        name: "Priya Sharma",
        roll: "22/CHE/018",
        branch: "Chemical Engineering",
        year: "2nd Year (B.Tech)",
        hostel: "Hostel No 12",
        room: "Room 108",
        phone: "+91 9876543210",
        email: "priya.sharma@bitsindri.ac.in",
        trustRating: "⭐ 5.0 Trust Rating (8 Borrows)",
        history: [
            { title: "Shared: White Cotton Lab Coat", meta: "Borrowed by Rita Kumari • Returned on time", date: "Oct 2026", status: "Active" },
            { title: "Shared: Organic Chemistry Lab Manual", meta: "Borrowed by Pooja Verma • Completed", date: "Sep 2026", status: "Returned" }
        ],
        items: [
            {
                id: "item-002",
                name: "White Cotton Lab Coat (Size M)",
                category: "Lab & Engineering",
                type: "free",
                shortDesc: "Pure cotton white laboratory apron coat with pen pockets. Pre-washed.",
                fullDesc: "Clean Size M lab coat for Chemistry & Physics practicals.",
                image: "banner_community.jpg",
                availability: "6th Oct - 14th Oct",
                location: "Room 108, Hostel No 12"
            }
        ]
    },
    "Aman Singh": {
        name: "Aman Singh",
        roll: "21/CSE/055",
        branch: "Computer Science & Engineering",
        year: "3rd Year (B.Tech)",
        hostel: "Hostel No 19",
        room: "Room 312",
        phone: "+91 9123456780",
        email: "aman.singh@bitsindri.ac.in",
        trustRating: "⭐ 4.8 Trust Rating (11 Borrows)",
        history: [
            { title: "Shared: SanDisk 64GB USB 3.0 Pen Drive", meta: "Semester materials loaded • Completed", date: "Sep 2026", status: "Returned" },
            { title: "Shared: Operating Systems Concepts (Silberschatz)", meta: "Borrowed by Vikas Kumar • Completed", date: "Aug 2026", status: "Returned" }
        ],
        items: [
            {
                id: "item-003",
                name: "SanDisk 64GB USB 3.0 Pen Drive",
                category: "Electronics",
                type: "free",
                shortDesc: "Fast USB 3.0 flash drive loaded with Semester 3 & 4 study materials.",
                fullDesc: "SanDisk Ultra 64GB USB 3.0 Pen Drive with 130MB/s transfer speed.",
                image: "banner_gadgets.jpg",
                availability: "Available Immediately",
                location: "Room 312, Hostel No 19"
            }
        ]
    },
    "Vikash Kumar": {
        name: "Vikash Kumar",
        roll: "22/MECH/089",
        branch: "Mechanical Engineering",
        year: "2nd Year (B.Tech)",
        hostel: "Hostel No 16",
        room: "Room 405",
        phone: "+91 9988776655",
        email: "vikash.mech@bitsindri.ac.in",
        trustRating: "⭐ 4.9 Trust Rating (9 Borrows)",
        history: [
            { title: "Shared: Omega Precision Mini Drafter", meta: "Borrowed by Rita Kumari • Returned on time", date: "Sep 2026", status: "Returned" }
        ],
        items: [
            {
                id: "item-004",
                name: "Omega Engineering Mini Drafter & Board",
                category: "Lab & Engineering",
                type: "free",
                shortDesc: "Heavy-duty engineering graphics mini drafter with clamp & scales.",
                fullDesc: "Omega precision engineering graphics mini drafter with dual scales.",
                image: "banner_books.jpg",
                availability: "7th Oct - 20th Oct",
                location: "Room 405, Hostel No 16"
            }
        ]
    }
};

let currentSeller = SELLERS_DIRECTORY["Rahul Verma"];
let currentActiveItem = null;

// ----------------------------------------------------------------------------
// INITIALIZATION
// ----------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', async () => {
    await initSellerDataFromURL();
    renderSellerProfile();
});

async function initSellerDataFromURL() {
    const params = new URLSearchParams(window.location.search);
    const sellerParam = params.get('seller');
    const itemParam = params.get('item');

    if (sellerParam && SELLERS_DIRECTORY[sellerParam]) {
        currentSeller = SELLERS_DIRECTORY[sellerParam];
    } else if (itemParam) {
        // Find seller by item ID
        for (const [name, data] of Object.entries(SELLERS_DIRECTORY)) {
            if (data.items.some(it => it.id === itemParam)) {
                currentSeller = data;
                break;
            }
        }
    }

    // Try finding seller in Supabase
    if (sellerParam && typeof DatabaseService !== 'undefined' && supabaseClient) {
        try {
            const { data: dbItems } = await supabaseClient
                .from('marketplace_items')
                .select('*')
                .ilike('seller_name', `%${sellerParam}%`);

            if (dbItems && dbItems.length > 0) {
                const first = dbItems[0];
                currentSeller = {
                    name: first.seller_name,
                    roll: first.seller_roll || 'Student',
                    branch: 'BIT Sindri Engineering',
                    year: 'B.Tech Student',
                    hostel: first.seller_hostel || 'Hostel Campus',
                    room: 'Room',
                    phone: first.seller_phone || '+91 9437543796',
                    email: 'student@bitsindri.ac.in',
                    trustRating: '⭐ 5.0 Verified Student',
                    history: [
                        { title: `Listed: ${first.title}`, meta: 'Active Campus Listing', date: 'Oct 2026', status: 'Active' }
                    ],
                    items: dbItems.map(d => ({
                        id: d.id,
                        name: d.title,
                        category: d.category,
                        type: 'free',
                        shortDesc: d.description || '',
                        fullDesc: d.description || '',
                        image: d.image_url || 'item_calculator.jpg',
                        availability: d.price || 'Available',
                        location: d.seller_hostel || 'Hostel Campus'
                    }))
                };
            }
        } catch(e) {}
    }

    // Sync header profile initial
    let user = null;
    try {
        const stored = localStorage.getItem('safeCampusUser');
        if (stored) user = JSON.parse(stored);
    } catch(e) {}
    const badge = document.getElementById('userInitialBadge');
    if (badge) {
        badge.innerText = (user && user.name) ? user.name.charAt(0).toUpperCase() : 'G';
    }
}

function renderSellerProfile() {
    // 1. Fill Profile Fields
    document.getElementById('displaySellerName').innerText = currentSeller.name;
    document.getElementById('displaySellerBranch').innerText = currentSeller.branch;
    document.getElementById('displaySellerYear').innerText = currentSeller.year;
    document.getElementById('displaySellerHostel').innerText = currentSeller.hostel;
    document.getElementById('displaySellerRoom').innerText = currentSeller.room;
    document.getElementById('displaySellerPhone').innerText = currentSeller.phone;
    document.getElementById('displaySellerEmail').innerText = currentSeller.email;

    const initial = currentSeller.name.charAt(0).toUpperCase();
    document.getElementById('sellerAvatarInitial').innerText = initial;

    // Contact CTA buttons
    const phoneClean = currentSeller.phone.replace(/[^0-9+]/g, '');
    document.getElementById('sellerCallBtn').href = `tel:${phoneClean}`;
    document.getElementById('sellerMailBtn').href = `mailto:${currentSeller.email}`;

    // 2. Render History Feed
    const historyFeed = document.getElementById('sellerHistoryFeedList');
    if (historyFeed) {
        historyFeed.innerHTML = currentSeller.history.map(entry => `
            <div class="history-entry-card type-shared">
                <div class="history-entry-main">
                    <span class="history-entry-title">${escapeHTML(entry.title)}</span>
                    <span class="history-entry-sub">${escapeHTML(entry.meta)} • <em>${escapeHTML(entry.date)}</em></span>
                </div>
                <span class="history-entry-badge status-active">${escapeHTML(entry.status)}</span>
            </div>
        `).join('');
    }

    // 3. Render Seller's Active Items
    document.getElementById('sellerItemsHeading').innerText = `Items Available from ${currentSeller.name}`;
    const itemsGrid = document.getElementById('sellerActiveItemsGrid');
    if (itemsGrid) {
        itemsGrid.innerHTML = currentSeller.items.map(item => `
            <div class="my-item-card" id="${item.id}">
                <div class="my-item-img-wrap">
                    <img src="${item.image}" alt="${escapeHTML(item.name)}" class="my-item-img" onerror="this.src='banner_gadgets.jpg'">
                    <span class="my-item-type-badge badge-free">FREE TO BORROW</span>
                </div>
                
                <div class="my-item-body">
                    <h3 class="my-item-title">${escapeHTML(item.name)}</h3>
                    <p class="my-item-desc">${escapeHTML(item.shortDesc)}</p>
                    
                    <div class="my-item-footer">
                        <span style="font-size: 0.78rem; color: #38bdf8;">📍 ${escapeHTML(item.location)}</span>
                        <button class="btn-see-details" style="padding: 0.4rem 0.85rem; font-size: 0.78rem; width: auto;" onclick="openItemDetails('${item.id}')">
                            SEE DETAILS
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// ----------------------------------------------------------------------------
// MODAL & ITEM REQUESTS
// ----------------------------------------------------------------------------
function openItemDetails(itemId) {
    const item = currentSeller.items.find(it => it.id === itemId) || currentSeller.items[0];
    if (!item) return;

    currentActiveItem = item;

    document.getElementById('detailItemImage').src = item.image;
    document.getElementById('detailItemCategory').innerText = item.category;
    document.getElementById('detailItemName').innerText = item.name;
    document.getElementById('detailItemDesc').innerText = item.fullDesc;
    document.getElementById('detailLenderName').innerText = currentSeller.name;
    document.getElementById('detailLocation').innerText = `${currentSeller.room}, ${currentSeller.hostel}`;
    document.getElementById('detailAvailability').innerText = item.availability;
    document.getElementById('detailPhone').innerText = currentSeller.phone;
    document.getElementById('detailEmail').innerText = currentSeller.email;

    const modal = document.getElementById('itemDetailsModal');
    if (modal) modal.classList.add('active');
}

function closeItemDetailsModal() {
    const modal = document.getElementById('itemDetailsModal');
    if (modal) modal.classList.remove('active');
    currentActiveItem = null;
}

function toggleItemRequest() {
    if (!currentActiveItem) return;
    const btn = document.getElementById('btnRequestItem');
    const textSpan = document.getElementById('requestBtnText');

    if (btn.classList.contains('active-requested')) {
        btn.classList.remove('active-requested');
        textSpan.innerText = 'Request Item';
        showToast(`Request cancelled for ${currentActiveItem.name}.`, 'info');
    } else {
        btn.classList.add('active-requested');
        textSpan.innerText = 'Cancel Request';
        showToast(`✓ Request sent directly to ${currentSeller.name}!`, 'success');
    }
}

function copyText(elementId) {
    const text = document.getElementById(elementId)?.innerText;
    if (text) {
        navigator.clipboard.writeText(text).then(() => {
            showToast(`Copied ${text} to clipboard!`, 'success');
        });
    }
}

function goBack() {
    window.location.href = 'marketplace.html';
}

function showToast(msg, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-item ${type}`;
    toast.innerText = msg;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

function escapeHTML(str) {
    if (!str) return '';
    return String(str).replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}
