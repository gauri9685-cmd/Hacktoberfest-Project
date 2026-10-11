/**
 * ============================================================================
 * SAFECAMPUS CONNECT V2 — PROFILE & INVENTORY CONTROLLER
 * Implements:
 *   - User Information display & Profile Editor (matching wireframe)
 *   - Activity History (records when user borrowed, shared, sold or uploaded items)
 *   - Uploaded Items Grid (items to sell or share free of cost)
 *   - Item Upload System with instant inventory sync & history logging
 * ============================================================================
 */

// Default Profile Data (Matching Wireframe Profile)
const DEFAULT_PROFILE = {
    name: "Rita Kumari",
    branch: "IT",
    year: "2nd Year",
    hostel: "Hostel No 43",
    room: "Room 23",
    phone: "+91 9437543796",
    email: "ritaa34@gmail.com"
};

// Initial Sample Activity History
const INITIAL_HISTORY = [
    {
        id: "hist-1",
        type: "borrowed",
        title: "Borrowed: Casio FX-991CW Calculator",
        counterparty: "Lender: Rahul Verma (Hostel 24)",
        date: "5th Oct 2026",
        status: "Active",
        statusClass: "status-active"
    },
    {
        id: "hist-2",
        type: "shared",
        title: "Shared: Chemistry Lab Coat (Size M)",
        counterparty: "Borrower: Priya Sharma (Hostel 12)",
        date: "2nd Oct 2026",
        status: "Returned",
        statusClass: "status-completed"
    },
    {
        id: "hist-3",
        type: "uploaded",
        title: "Uploaded: CLRS Algorithms 4th Edition",
        counterparty: "Listed as Free to Borrow",
        date: "28th Sep 2026",
        status: "Available",
        statusClass: "status-active"
    },
    {
        id: "hist-4",
        type: "borrowed",
        title: "Borrowed: Omega Engineering Mini Drafter",
        counterparty: "Lender: Vikash Kumar (Hostel 16)",
        date: "20th Sep 2026",
        status: "Returned",
        statusClass: "status-completed"
    },
    {
        id: "hist-5",
        type: "shared",
        title: "Shared: SanDisk 64GB Pen Drive",
        counterparty: "Borrower: Aman Singh (Hostel 19)",
        date: "15th Sep 2026",
        status: "Returned",
        statusClass: "status-completed"
    }
];

// Initial Uploaded Items by this user
const INITIAL_MY_ITEMS = [
    {
        id: "my-item-1",
        name: "CLRS Algorithms 4th Edition",
        category: "Books",
        type: "free",
        price: 0,
        desc: "Hardbound algorithms textbook in great condition with sticky notes for exam prep.",
        image: "banner_books.jpg",
        availability: "8th Oct - 30th Oct",
        location: "Room 23, Hostel No 43"
    },
    {
        id: "my-item-2",
        name: "Casio Scientific FX-82MS",
        category: "Electronics",
        type: "sell",
        price: 250,
        desc: "Secondary backup scientific calculator with hard case and fresh battery.",
        image: "item_calculator.jpg",
        availability: "Immediate",
        location: "Room 23, Hostel No 43"
    },
    {
        id: "my-item-3",
        name: "White Cotton Lab Apron",
        category: "Lab & Engineering",
        type: "free",
        price: 0,
        desc: "Clean chemistry practical lab coat (Size M) with pen holder.",
        image: "banner_community.jpg",
        availability: "10th Oct - 20th Oct",
        location: "Room 23, Hostel No 43"
    },
    {
        id: "my-item-4",
        name: "USB 3.2 Type-C OTG Drive 32GB",
        category: "Electronics",
        type: "free",
        price: 0,
        desc: "High speed dual Type-C and USB-A drive with semester study materials.",
        image: "banner_gadgets.jpg",
        availability: "5th Oct - 15th Oct",
        location: "Room 23, Hostel No 43"
    }
];

// ----------------------------------------------------------------------------
// INITIALIZATION
// ----------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    loadUserProfile();
    renderHistoryFeed();
    renderUploadedItems();
});

// ----------------------------------------------------------------------------
// 1. USER PROFILE MANAGEMENT
// ----------------------------------------------------------------------------
function getUserProfile() {
    try {
        const stored = localStorage.getItem('safeCampusUserProfile');
        if (stored) return JSON.parse(stored);

        // Fallback to auth login if available
        const authUser = localStorage.getItem('safeCampusUser');
        if (authUser) {
            const parsed = JSON.parse(authUser);
            return {
                name: parsed.name || DEFAULT_PROFILE.name,
                branch: parsed.branch || DEFAULT_PROFILE.branch,
                year: "2nd Year",
                hostel: parsed.hostel || DEFAULT_PROFILE.hostel,
                room: parsed.room || DEFAULT_PROFILE.room,
                phone: parsed.phone || DEFAULT_PROFILE.phone,
                email: parsed.email || DEFAULT_PROFILE.email,
                photo: parsed.photo || ''
            };
        }
    } catch(e) {}
    return DEFAULT_PROFILE;
}

function saveUserProfile(profileData) {
    localStorage.setItem('safeCampusUserProfile', JSON.stringify(profileData));
}

function loadUserProfile() {
    const profile = getUserProfile();

    document.getElementById('displayProfileName').innerText = profile.name;
    document.getElementById('displayProfileBranch').innerText = profile.branch;
    document.getElementById('displayProfileYear').innerText = profile.year;
    document.getElementById('displayProfileHostel').innerText = profile.hostel;
    document.getElementById('displayProfileRoom').innerText = profile.room;
    document.getElementById('displayProfilePhone').innerText = profile.phone;
    document.getElementById('displayProfileEmail').innerText = profile.email;

    const avatarCircle = document.getElementById('profileAvatarLarge');
    if (profile.photo && avatarCircle) {
        avatarCircle.innerHTML = `
            <img src="${profile.photo}" alt="${profile.name.replace(/"/g, '&quot;')}" class="user-circle-avatar-img">
            <div class="avatar-online-dot"></div>
        `;
    } else {
        const initial = (profile.name && profile.name.trim()) ? profile.name.trim().charAt(0).toUpperCase() : 'R';
        if (avatarCircle) {
            avatarCircle.innerHTML = `
                <span id="profileAvatarInitial">${initial}</span>
                <div class="avatar-online-dot"></div>
            `;
        }
    }
}

function openEditProfileModal() {
    const profile = getUserProfile();
    document.getElementById('editName').value = profile.name;
    document.getElementById('editBranch').value = profile.branch;
    document.getElementById('editYear').value = profile.year;
    document.getElementById('editHostel').value = profile.hostel;
    document.getElementById('editRoom').value = profile.room;
    document.getElementById('editPhone').value = profile.phone;
    document.getElementById('editEmail').value = profile.email;

    document.getElementById('editProfileModal').classList.add('active');
}

function closeEditProfileModal() {
    document.getElementById('editProfileModal').classList.remove('active');
}

function saveEditedProfile() {
    const updated = {
        name: document.getElementById('editName').value.trim(),
        branch: document.getElementById('editBranch').value.trim(),
        year: document.getElementById('editYear').value.trim(),
        hostel: document.getElementById('editHostel').value.trim(),
        room: document.getElementById('editRoom').value.trim(),
        phone: document.getElementById('editPhone').value.trim(),
        email: document.getElementById('editEmail').value.trim()
    };

    saveUserProfile(updated);
    loadUserProfile();
    closeEditProfileModal();
    showToast('✓ Profile updated successfully!', 'success');
}

// ----------------------------------------------------------------------------
// 2. ACTIVITY HISTORY FEED
// ----------------------------------------------------------------------------
function getHistoryData() {
    try {
        const stored = localStorage.getItem('safeCampusHistory');
        return stored ? JSON.parse(stored) : INITIAL_HISTORY;
    } catch(e) {
        return INITIAL_HISTORY;
    }
}

function saveHistoryData(historyList) {
    localStorage.setItem('safeCampusHistory', JSON.stringify(historyList));
}

function renderHistoryFeed() {
    const feedContainer = document.getElementById('historyFeedList');
    if (!feedContainer) return;

    const historyList = getHistoryData();
    document.getElementById('historyCountBadge').innerText = `${historyList.length} Activities`;

    if (historyList.length === 0) {
        feedContainer.innerHTML = `<div style="color:#94a3b8; padding:1.5rem; text-align:center;">No activity history recorded yet.</div>`;
        return;
    }

    feedContainer.innerHTML = historyList.map(entry => `
        <div class="history-entry-card type-${entry.type}">
            <div class="history-entry-main">
                <span class="history-entry-title">${escapeHTML(entry.title)}</span>
                <span class="history-entry-sub">${escapeHTML(entry.counterparty)} • <em>${escapeHTML(entry.date)}</em></span>
            </div>
            <span class="history-entry-badge ${entry.statusClass || 'status-completed'}">${escapeHTML(entry.status)}</span>
        </div>
    `).join('');
}

function addHistoryEntry(type, title, counterparty, status = "Active") {
    const historyList = getHistoryData();
    const newEntry = {
        id: `hist-${Date.now()}`,
        type: type,
        title: title,
        counterparty: counterparty,
        date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
        status: status,
        statusClass: status === 'Active' ? 'status-active' : 'status-completed'
    };

    historyList.unshift(newEntry);
    saveHistoryData(historyList);
    renderHistoryFeed();
}

// ----------------------------------------------------------------------------
// 3. UPLOADED ITEMS MANAGEMENT (SELL OR FREE SHARING)
// ----------------------------------------------------------------------------
function getMyUploadedItems() {
    try {
        const stored = localStorage.getItem('safeCampusMyUploadedItems');
        return stored ? JSON.parse(stored) : INITIAL_MY_ITEMS;
    } catch(e) {
        return INITIAL_MY_ITEMS;
    }
}

function saveMyUploadedItems(items) {
    localStorage.setItem('safeCampusMyUploadedItems', JSON.stringify(items));
}

function renderUploadedItems() {
    const grid = document.getElementById('uploadedItemsGrid');
    if (!grid) return;

    const items = getMyUploadedItems();

    if (items.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; padding: 2.5rem; text-align: center; color: #94a3b8;">
                <p style="font-size: 1.1rem;">You have not uploaded any items to share or sell yet.</p>
                <p style="font-size: 0.85rem; margin-top: 0.5rem;">Click "Upload Item" below to share calculators, books, lab coats or gadgets with college mates.</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = items.map(item => {
        const isSell = item.type === 'sell';
        const priceLabel = isSell ? `SELL: ₹${item.price}` : 'FREE TO BORROW';
        const badgeClass = isSell ? 'badge-sell' : 'badge-free';

        return `
            <div class="my-item-card" id="${item.id}">
                <div class="my-item-img-wrap">
                    <img src="${item.image}" alt="${escapeHTML(item.name)}" class="my-item-img" onerror="this.src='banner_books.jpg'">
                    <span class="my-item-type-badge ${badgeClass}">${priceLabel}</span>
                </div>
                
                <div class="my-item-body">
                    <h3 class="my-item-title" title="${escapeHTML(item.name)}">${escapeHTML(item.name)}</h3>
                    <p class="my-item-desc">${escapeHTML(item.desc)}</p>
                    
                    <div class="my-item-footer">
                        <span style="font-size: 0.78rem; color: #38bdf8;">📍 ${escapeHTML(item.location || 'Hostel')}</span>
                        <button class="btn-delete-item" onclick="deleteUploadedItem('${item.id}')" title="Remove Listing">Delete 🗑️</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

async function deleteUploadedItem(itemId) {
    if (!confirm('Are you sure you want to remove this item listing from campus marketplace & database?')) return;

    let items = getMyUploadedItems();
    const removedItem = items.find(it => it.id === itemId || it.dbId === itemId);
    items = items.filter(it => it.id !== itemId && it.dbId !== itemId);
    saveMyUploadedItems(items);
    renderUploadedItems();

    const user = getUserProfile();

    // Delete item permanently from Supabase Database
    if (typeof DatabaseService !== 'undefined' && removedItem) {
        try {
            await DatabaseService.deleteMarketplaceItem(
                removedItem.dbId || removedItem.id,
                removedItem.name,
                user ? user.roll : ''
            );
        } catch (e) {
            console.error("Error deleting item from Supabase:", e);
        }
    }

    if (removedItem) {
        addHistoryEntry('uploaded', `Unlisted: ${removedItem.name}`, 'Removed from active listings', 'Completed');
        showToast(`Item "${removedItem.name}" deleted permanently from database!`, 'info');
    }
}

// ----------------------------------------------------------------------------
// 4. UPLOAD ITEM MODAL & PROCESSOR
// ----------------------------------------------------------------------------
function openUploadItemModal() {
    const modal = document.getElementById('uploadItemModal');
    if (modal) {
        // Pre-fill location & phone from user profile
        const profile = getUserProfile();
        document.getElementById('newItemLocation').value = `${profile.room}, ${profile.hostel}`;
        document.getElementById('newItemPhone').value = profile.phone;
        modal.classList.add('active');
    }
}

function closeUploadItemModal() {
    const modal = document.getElementById('uploadItemModal');
    if (modal) modal.classList.remove('active');
}

function togglePriceField(listingType) {
    const priceGroup = document.getElementById('priceFieldGroup');
    if (priceGroup) {
        priceGroup.style.display = (listingType === 'sell') ? 'block' : 'none';
    }
}

async function processItemUpload() {
    const name = document.getElementById('newItemName').value.trim();
    const category = document.getElementById('newItemCategory').value;
    const type = document.getElementById('newItemListingType').value;
    const price = type === 'sell' ? (parseFloat(document.getElementById('newItemPrice').value) || 0) : 0;
    const availability = document.getElementById('newItemAvailability').value.trim();
    const desc = document.getElementById('newItemDesc').value.trim();
    const location = document.getElementById('newItemLocation').value.trim();
    const phone = document.getElementById('newItemPhone').value.trim();

    // Selected photo preset
    const selectedPhoto = document.querySelector('input[name="itemPhotoPreset"]:checked')?.value || 'banner_gadgets.jpg';

    if (!name || !desc) {
        showToast('Please fill in all required fields.', 'info');
        return;
    }

    const user = getUserProfile();
    const priceFormatted = type === 'sell' ? `₹${price}` : 'Free / Borrow';

    let dbId = null;

    // Upload to Supabase Database
    if (typeof DatabaseService !== 'undefined') {
        const dbRes = await DatabaseService.addMarketplaceItem({
            title: name,
            category: category,
            description: desc,
            price: priceFormatted,
            condition: 'Good',
            image_url: selectedPhoto,
            seller_name: user.name || 'Campus Student',
            seller_phone: phone || user.phone || '',
            seller_hostel: location || user.hostel || 'Hostel Campus',
            seller_roll: user.roll || ''
        });

        if (dbRes && dbRes.data && dbRes.data.id) {
            dbId = dbRes.data.id;
        }
    }

    const newItem = {
        id: `upload-${Date.now()}`,
        dbId: dbId,
        name: name,
        category: category,
        type: type,
        price: price,
        availability: availability,
        desc: desc,
        location: location,
        phone: phone,
        image: selectedPhoto
    };

    // 1. Save to User's Uploaded Items locally
    const myItems = getMyUploadedItems();
    myItems.unshift(newItem);
    saveMyUploadedItems(myItems);
    renderUploadedItems();

    // 2. Add to Activity History Feed
    const typeLabel = type === 'sell' ? `Selling for ₹${price}` : 'Free to Borrow';
    addHistoryEntry('uploaded', `Uploaded: ${name}`, `Listed as ${typeLabel}`, 'Active');

    // 3. Close modal & Notify user
    closeUploadItemModal();
    document.getElementById('uploadItemForm').reset();
    showToast(`✓ "${name}" uploaded to Supabase & published to Marketplace!`, 'success');
}

// ----------------------------------------------------------------------------
// 5. NAVIGATION & UTILITIES
// ----------------------------------------------------------------------------
function goBack() {
    window.location.href = 'marketplace.html';
}

function handleLogout() {
    if (confirm('Are you sure you want to log out of SafeCampus Connect?')) {
        localStorage.removeItem('safeCampusUser');
        showToast('Logged out successfully.', 'info');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 400);
    }
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
