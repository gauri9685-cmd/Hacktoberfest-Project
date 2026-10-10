/**
 * ============================================================================
 * SAFECAMPUS CONNECT V2 — CAMPUS MARKETPLACE CONTROLLER
 * Implements:
 *   - Top Banner Slider with Auto-play, Arrows & Dots
 *   - Search Bar with Enter Redirection & Dynamic Category Filter
 *   - Moving Continuous Cards Carousel with Hover-Pause
 *   - Frame 12: Item Details Pop-up Modal with Request / Cancel State
 *   - Frame 17: "Talk with AI" Chat Assistant with Fuzzy Item Recommendations
 *   - Extensible Database & API Model for backend integration
 * ============================================================================
 */

// ----------------------------------------------------------------------------
// 1. CAMPUS MARKETPLACE DATABASE & BACKEND MODEL
// ----------------------------------------------------------------------------
const MARKETPLACE_DATABASE = [
    {
        id: "item-001",
        name: "Casio FX-991CW Calculator",
        category: "Electronics",
        shortDesc: "Non-programmable scientific calculator, perfect for engineering exams.",
        fullDesc: "Casio FX-991CW Classwiz Non-Programmable Scientific Calculator, used for 4 years, in good working condition. Essential for Semester exams, Engineering Maths, and Gate prep.",
        image: "item_calculator.jpg",
        lenderName: "Rahul Verma",
        lenderRoll: "21/IT/042",
        lenderHostel: "Hostel No 24",
        lenderRoom: "Room No 203",
        availabilityPeriod: "5th Oct - 8th Oct",
        phone: "9437543796",
        email: "abcd@gmail.com",
        tags: ["calculator", "casio", "scientific", "maths", "exam", "electronics"]
    },
    {
        id: "item-002",
        name: "White Cotton Lab Coat",
        category: "Lab & Engineering",
        shortDesc: "Clean Size M lab coat for Chemistry & Physics laboratory practicals.",
        fullDesc: "Pure cotton white laboratory apron coat (Size Medium) with front buttons and deep pen pockets. Pre-washed and sanitized. Suitable for 1st & 2nd year practicals.",
        image: "banner_community.jpg",
        lenderName: "Priya Sharma",
        lenderRoll: "22/CHE/018",
        lenderHostel: "Hostel No 12",
        lenderRoom: "Room No 108",
        availabilityPeriod: "6th Oct - 14th Oct",
        phone: "9876543210",
        email: "priya.sharma@bitsindri.ac.in",
        tags: ["lab coat", "apron", "chemistry", "physics", "lab", "practical"]
    },
    {
        id: "item-003",
        name: "SanDisk 64GB USB 3.0 Pen Drive",
        category: "Electronics",
        shortDesc: "High-speed flash drive loaded with semester notes & past papers.",
        fullDesc: "SanDisk Ultra 64GB USB 3.0 Pen Drive with 130MB/s transfer speed. Pre-loaded with previous 5 years semester question papers, reference PDFs and lecture recordings.",
        image: "banner_gadgets.jpg",
        lenderName: "Aman Singh",
        lenderRoll: "21/CSE/055",
        lenderHostel: "Hostel No 19",
        lenderRoom: "Room No 312",
        availabilityPeriod: "Available Immediately",
        phone: "9123456780",
        email: "aman.singh@bitsindri.ac.in",
        tags: ["pen drive", "usb", "storage", "notes", "drive", "flash drive", "study material"]
    },
    {
        id: "item-004",
        name: "Engineering Mini Drafter & Board",
        category: "Lab & Engineering",
        shortDesc: "Precision mini drafter clamp with steel scales and drawing sheet clips.",
        fullDesc: "Omega precision engineering graphics mini drafter with dual scales (15cm & 30cm), heavy clamp and 4 sheet clips. Great condition, essential for First Year Engineering Drawing.",
        image: "banner_books.jpg",
        lenderName: "Vikash Kumar",
        lenderRoll: "22/MECH/089",
        lenderHostel: "Hostel No 16",
        lenderRoom: "Room No 405",
        availabilityPeriod: "7th Oct - 20th Oct",
        phone: "9988776655",
        email: "vikash.mech@bitsindri.ac.in",
        tags: ["drafter", "drawing", "engineering drawing", "scale", "graphics", "mechanical"]
    },
    {
        id: "item-005",
        name: "Hero Sprint 26T Gear Bicycle",
        category: "Mobility",
        shortDesc: "Smooth campus commuter bike for quick transit between departments.",
        fullDesc: "Hero Sprint 26T 21-speed mountain bicycle with front suspension, mudguards and combination lock. Ready to ride for hostel-to-department daily commutes.",
        image: "banner_community.jpg",
        lenderName: "Rohan Gupta",
        lenderRoll: "20/ECE/031",
        lenderHostel: "Hostel No 22",
        lenderRoom: "Room No 114",
        availabilityPeriod: "5th Oct - 15th Oct",
        phone: "9845123456",
        email: "rohan.g@bitsindri.ac.in",
        tags: ["cycle", "bicycle", "bike", "transport", "commute", "mobility"]
    },
    {
        id: "item-006",
        name: "CLRS Algorithms 4th Edition",
        category: "Books",
        shortDesc: "Standard algorithms textbook with annotated notes & solutions.",
        fullDesc: "Introduction to Algorithms (CLRS 4th Edition) hardbound copy. Contains handwritten notes and bookmarks on dynamic programming, graph algorithms and sorting.",
        image: "banner_books.jpg",
        lenderName: "Sneha Kumari",
        lenderRoll: "21/CSE/012",
        lenderHostel: "Hostel No 14",
        lenderRoom: "Room No 219",
        availabilityPeriod: "8th Oct - 30th Oct",
        phone: "9765432190",
        email: "sneha.cse@bitsindri.ac.in",
        tags: ["book", "algorithms", "clrs", "dsa", "cse", "textbook"]
    },
    {
        id: "item-007",
        name: "Arduino Uno R3 IoT Starter Kit",
        category: "Electronics",
        shortDesc: "Prototyping kit with breadboard, sensors, jumper wires & motor driver.",
        fullDesc: "Complete Arduino Uno R3 robotics & IoT experimental kit. Includes ultrasonic sensors, servo motors, LCD display, buzzer and USB programming cable.",
        image: "banner_gadgets.jpg",
        lenderName: "Ankit Das",
        lenderRoll: "21/EEE/078",
        lenderHostel: "Hostel No 20",
        lenderRoom: "Room No 102",
        availabilityPeriod: "5th Oct - 12th Oct",
        phone: "9543210987",
        email: "ankit.iot@bitsindri.ac.in",
        tags: ["arduino", "iot", "robotics", "electronics", "sensors", "kit"]
    }
];

// Active Item in Detail Modal
let currentActiveItemId = null;
let activeCategoryFilter = "all";

// ----------------------------------------------------------------------------
// 2. INITIALIZATION
// ----------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    initUserSession();
    initBannerSlider();
    renderMarketplaceCards();
    initCarouselAutoMovement();
});

// Sync User Profile info in Top Right Circle
function initUserSession() {
    let user = null;
    try {
        const stored = localStorage.getItem('safeCampusUser');
        if (stored) user = JSON.parse(stored);
    } catch(e) {}

    const badge = document.getElementById('userInitialBadge');
    if (badge) {
        if (user && user.name) {
            badge.innerText = user.name.charAt(0).toUpperCase();
        } else {
            badge.innerText = 'G'; // Default wireframe profile badge 'G'
        }
    }
}

// Navigation back to previous page
function goBackToHome() {
    window.location.href = 'index.html';
}

function handleProfileClick() {
    window.location.href = 'profile.html';
}

// ----------------------------------------------------------------------------
// 3. TOP BANNER SLIDER CONTROLLER
// ----------------------------------------------------------------------------
let currentSlideIndex = 0;
let slideInterval = null;

function initBannerSlider() {
    const slides = document.querySelectorAll('.slider-slide');
    if (!slides.length) return;

    startSlideAutoTimer();

    // Pause on hover
    const sliderElem = document.getElementById('marketplaceSlider');
    if (sliderElem) {
        sliderElem.addEventListener('mouseenter', () => clearInterval(slideInterval));
        sliderElem.addEventListener('mouseleave', () => startSlideAutoTimer());
    }
}

function startSlideAutoTimer() {
    clearInterval(slideInterval);
    slideInterval = setInterval(() => {
        nextSlide();
    }, 2000);
}

function showSlide(index) {
    const slides = document.querySelectorAll('.slider-slide');
    const dots = document.querySelectorAll('.slider-dots .dot-btn');
    
    if (index >= slides.length) currentSlideIndex = 0;
    else if (index < 0) currentSlideIndex = slides.length - 1;
    else currentSlideIndex = index;

    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === currentSlideIndex);
    });

    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlideIndex);
    });
}

function nextSlide() {
    showSlide(currentSlideIndex + 1);
}

function prevSlide() {
    showSlide(currentSlideIndex - 1);
}

function goToSlide(index) {
    showSlide(index);
    startSlideAutoTimer();
}

// ----------------------------------------------------------------------------
// 4. MARKETPLACE CARDS RENDERING & CAROUSEL
// ----------------------------------------------------------------------------
function getRequestedItems() {
    try {
        const reqs = localStorage.getItem('safeCampusRequestedItems');
        return reqs ? JSON.parse(reqs) : [];
    } catch(e) {
        return [];
    }
}

function saveRequestedItems(reqArray) {
    localStorage.setItem('safeCampusRequestedItems', JSON.stringify(reqArray));
}

// Carousel Animation State Variables
let carouselAnimationId = null;
let currentOffset = 0;
let targetOffset = 0;
let isManualNavigating = false;
let isCarouselPaused = false;
let singleSetWidth = 0;
let singleCardPitch = 318;
let currentItemCount = 0;

function renderMarketplaceCards() {
    const track = document.getElementById('itemsCarouselTrack');
    if (!track) return;

    const requestedList = getRequestedItems();
    
    let filtered = MARKETPLACE_DATABASE;
    if (activeCategoryFilter !== 'all') {
        filtered = MARKETPLACE_DATABASE.filter(item => item.category.toLowerCase().includes(activeCategoryFilter.toLowerCase()));
    }

    if (filtered.length === 0) {
        track.innerHTML = `
            <div style="padding: 2rem; color: #94a3b8; font-size: 1.1rem; text-align: center; width: 100%;">
                No available items found in category "${activeCategoryFilter}". Try selecting "All Items".
            </div>
        `;
        singleSetWidth = 0;
        return;
    }

    currentItemCount = filtered.length;

    // Helper to generate HTML for one card
    const cardHTML = (item, index) => {
        const isReq = requestedList.includes(item.id);
        return `
            <div class="item-card" data-id="${item.id}" data-idx="${index}">
                <div class="item-card-image-wrap">
                    <img src="${item.image}" alt="${escapeHTML(item.name)}" class="item-card-img" onerror="this.src='banner_gadgets.jpg'">
                    <span class="item-card-badge">${escapeHTML(item.category)}</span>
                    <span class="item-card-status ${isReq ? 'requested' : ''}">${isReq ? 'Requested' : 'Available'}</span>
                </div>
                
                <div class="item-card-body">
                    <h3 class="item-card-title" title="${escapeHTML(item.name)}">${escapeHTML(item.name)}</h3>
                    <p class="item-card-desc">${escapeHTML(item.shortDesc)}</p>
                    
                    <div class="item-card-meta">
                        <span class="item-lender-loc">📍 ${escapeHTML(item.lenderHostel)}</span>
                        <span>🗓️ ${escapeHTML(item.availabilityPeriod.split('-')[0].trim())}</span>
                    </div>
                </div>

                <div class="item-card-footer">
                    <button class="btn-see-details" onclick="openItemDetails('${item.id}')">
                        SEE DETAILS
                    </button>
                </div>
            </div>
        `;
    };

    // Render 3 identical sets to ensure infinite seamless circular loop
    const loopItems = [...filtered, ...filtered, ...filtered];
    track.innerHTML = loopItems.map((it, idx) => cardHTML(it, idx)).join('');

    // Measure exact geometric set width
    setTimeout(measureSetGeometry, 60);
}

function measureSetGeometry() {
    const track = document.getElementById('itemsCarouselTrack');
    if (!track || currentItemCount === 0) return;

    const cards = track.querySelectorAll('.item-card');
    if (cards.length > currentItemCount) {
        const firstCard = cards[0];
        const nextSetFirstCard = cards[currentItemCount];
        if (firstCard && nextSetFirstCard) {
            singleSetWidth = nextSetFirstCard.offsetLeft - firstCard.offsetLeft;
            singleCardPitch = singleSetWidth / currentItemCount;
            return;
        }
    }
    // Fallback: 290px card width + 28px gap = 318px
    singleCardPitch = 318;
    singleSetWidth = currentItemCount * singleCardPitch;
}

window.addEventListener('resize', () => {
    measureSetGeometry();
});

function filterItemsByCategory(category) {
    activeCategoryFilter = category;
    
    // Update chip buttons
    document.querySelectorAll('.filter-chip').forEach(chip => {
        const text = chip.innerText.toLowerCase();
        if (category === 'all' && text.includes('all')) {
            chip.classList.add('active');
        } else if (category !== 'all' && text.includes(category.toLowerCase().split(' ')[0])) {
            chip.classList.add('active');
        } else {
            chip.classList.remove('active');
        }
    });

    currentOffset = 0;
    targetOffset = 0;
    renderMarketplaceCards();
    showToast(`Showing ${category === 'all' ? 'All' : category} items`, 'info');
}

// Manual Carousel Navigation Buttons (< and >) - 100% responsive
function scrollCarousel(direction) {
    if (singleSetWidth <= 0) {
        measureSetGeometry();
    }

    const step = singleCardPitch > 0 ? singleCardPitch : 318;
    // direction: -1 for left (prev), +1 for right (next)
    targetOffset = currentOffset + (direction * step);
    isManualNavigating = true;
    isCarouselPaused = false;
}

// Continuous Infinite GPU-accelerated Carousel Movement (Rotating like carousel horses)
function initCarouselAutoMovement() {
    const wrapper = document.querySelector('.carousel-outer-wrapper');
    const track = document.getElementById('itemsCarouselTrack');
    if (!wrapper || !track) return;

    // Hover / Touch interaction listeners
    wrapper.addEventListener('mouseenter', () => { isCarouselPaused = true; });
    wrapper.addEventListener('mouseleave', () => { isCarouselPaused = false; });
    wrapper.addEventListener('touchstart', () => { isCarouselPaused = true; }, { passive: true });
    wrapper.addEventListener('touchend', () => { isCarouselPaused = false; }, { passive: true });

    const CRUISE_SPEED = 0.9; // Smooth continuous reading speed in px/frame

    function stepLoop() {
        if (singleSetWidth > 0) {
            if (isManualNavigating) {
                // Smooth ease-out interpolation when user clicks < or > arrow buttons
                const diff = targetOffset - currentOffset;
                if (Math.abs(diff) < 0.5) {
                    currentOffset = targetOffset;
                    isManualNavigating = false;
                } else {
                    currentOffset += diff * 0.14;
                }
            } else if (!isCarouselPaused) {
                // Normal continuous carousel cruise
                currentOffset += CRUISE_SPEED;
                targetOffset = currentOffset;
            }

            // Infinite seamless boundary wrapping (invisible to user)
            if (currentOffset >= singleSetWidth) {
                currentOffset -= singleSetWidth;
                targetOffset -= singleSetWidth;
            } else if (currentOffset < 0) {
                currentOffset += singleSetWidth;
                targetOffset += singleSetWidth;
            }

            // Apply hardware-accelerated 3D transform
            track.style.transform = `translate3d(-${currentOffset}px, 0, 0)`;
        }

        carouselAnimationId = requestAnimationFrame(stepLoop);
    }

    if (carouselAnimationId) cancelAnimationFrame(carouselAnimationId);
    carouselAnimationId = requestAnimationFrame(stepLoop);
}

// ----------------------------------------------------------------------------
// 5. SEARCH BAR LOGIC & REDIRECTION
// ----------------------------------------------------------------------------
function handleSearchKeydown(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        triggerSearch();
    }
}

function triggerSearch() {
    const input = document.getElementById('marketplaceSearchInput');
    if (!input) return;
    const query = input.value.trim();

    if (!query) {
        showToast('Please type an item name to search...', 'info');
        return;
    }

    // Filter cards immediately for user convenience
    const matches = MARKETPLACE_DATABASE.filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.shortDesc.toLowerCase().includes(query.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );

    showToast(`Searching for "${query}"... Redirecting to results`, 'success');

    setTimeout(() => {
        // Redirect to search results page as required
        const targetUrl = `search_results.html?q=${encodeURIComponent(query)}`;
        // For demonstration, also dynamically filter if user stays or cancels
        console.log(`Redirecting to: ${targetUrl}`);
        window.location.href = targetUrl;
    }, 600);
}

// ----------------------------------------------------------------------------
// 6. FRAME 12 ITEM DETAILS POPUP MODAL
// ----------------------------------------------------------------------------
function openItemDetails(itemId) {
    const item = MARKETPLACE_DATABASE.find(it => it.id === itemId);
    if (!item) return;

    currentActiveItemId = itemId;
    const requestedList = getRequestedItems();
    const isRequested = requestedList.includes(itemId);

    // Populate modal fields matching Frame 12 layout
    const imgElem = document.getElementById('detailItemImage');
    if (imgElem) {
        imgElem.src = item.image;
        imgElem.onerror = () => { imgElem.src = 'banner_gadgets.jpg'; };
    }

    document.getElementById('detailItemCategory').innerText = item.category;
    document.getElementById('detailItemName').innerText = item.name;
    document.getElementById('detailItemDesc').innerText = item.fullDesc;
    document.getElementById('detailLenderName').innerText = item.lenderName;
    document.getElementById('detailLocation').innerText = `${item.lenderRoom}, ${item.lenderHostel}`;
    document.getElementById('detailAvailability').innerText = item.availabilityPeriod;
    document.getElementById('detailPhone').innerText = item.phone;
    document.getElementById('detailEmail').innerText = item.email;

    // Update Request Button state
    updateRequestButtonUI(isRequested);

    // Show modal
    const modal = document.getElementById('itemDetailsModal');
    if (modal) modal.classList.add('active');
}

function updateRequestButtonUI(isRequested) {
    const btn = document.getElementById('btnRequestItem');
    const textSpan = document.getElementById('requestBtnText');

    if (isRequested) {
        btn.classList.add('active-requested');
        textSpan.innerText = 'Cancel Request';
    } else {
        btn.classList.remove('active-requested');
        textSpan.innerText = 'Request Item';
    }
}

function toggleItemRequest() {
    if (!currentActiveItemId) return;

    let requestedList = getRequestedItems();
    const isRequested = requestedList.includes(currentActiveItemId);
    const item = MARKETPLACE_DATABASE.find(it => it.id === currentActiveItemId);

    if (isRequested) {
        // Cancel Request
        requestedList = requestedList.filter(id => id !== currentActiveItemId);
        saveRequestedItems(requestedList);
        updateRequestButtonUI(false);
        showToast(`Request for "${item ? item.name : 'item'}" cancelled.`, 'info');
    } else {
        // Submit Request
        requestedList.push(currentActiveItemId);
        saveRequestedItems(requestedList);
        updateRequestButtonUI(true);
        showToast(`✓ Request submitted to ${item ? item.lenderName : 'lender'}! Check contact details.`, 'success');
    }

    renderMarketplaceCards();
}

function closeItemDetailsModal() {
    const modal = document.getElementById('itemDetailsModal');
    if (modal) modal.classList.remove('active');
    currentActiveItemId = null;
}

function openLenderProfile() {
    if (!currentActiveItemId) return;
    const item = MARKETPLACE_DATABASE.find(it => it.id === currentActiveItemId);
    if (item) {
        window.location.href = `seller_profile.html?item=${encodeURIComponent(item.id)}&seller=${encodeURIComponent(item.lenderName)}`;
    } else {
        window.location.href = 'seller_profile.html';
    }
}

function copyText(elementId) {
    const text = document.getElementById(elementId)?.innerText;
    if (text) {
        navigator.clipboard.writeText(text).then(() => {
            showToast(`Copied ${text} to clipboard!`, 'success');
        }).catch(() => {
            showToast(`Selected: ${text}`, 'info');
        });
    }
}

// ----------------------------------------------------------------------------
// 7. FRAME 17 "TALK WITH AI" CHAT ASSISTANT
// ----------------------------------------------------------------------------
function toggleAIChatModal() {
    const chatModal = document.getElementById('aiChatModal');
    if (!chatModal) return;

    chatModal.classList.toggle('active');
    if (chatModal.classList.contains('active')) {
        setTimeout(() => {
            document.getElementById('aiChatInput')?.focus();
        }, 150);
    }
}

function handleAIChatKeydown(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        sendAIChatMessage();
    }
}

function sendAIChatMessage() {
    const input = document.getElementById('aiChatInput');
    const msgContainer = document.getElementById('aiChatMessages');
    if (!input || !msgContainer) return;

    const query = input.value.trim();
    if (!query) return;

    // 1. Append User Message
    const userMsgDiv = document.createElement('div');
    userMsgDiv.className = 'chat-message user-message';
    userMsgDiv.innerHTML = `
        <div class="chat-bubble user-bubble">${escapeHTML(query)}</div>
        <span class="chat-timestamp">${getCurrentTimeStr()}</span>
    `;
    msgContainer.appendChild(userMsgDiv);
    input.value = '';
    msgContainer.scrollTop = msgContainer.scrollHeight;

    // 2. Process AI Fuzzy Response
    setTimeout(() => {
        generateAIResponse(query, msgContainer);
    }, 600);
}

function generateAIResponse(query, msgContainer) {
    const lower = query.toLowerCase();
    
    // Find matching items from DB
    const matchingItems = MARKETPLACE_DATABASE.filter(item => 
        lower.includes(item.name.toLowerCase()) ||
        item.tags.some(t => lower.includes(t)) ||
        lower.includes(item.category.toLowerCase())
    );

    let replyText = "";
    let itemSuggestionHTML = "";

    if (matchingItems.length > 0) {
        const topItem = matchingItems[0];
        replyText = `I found **${topItem.name}** available from ${topItem.lenderName} in ${topItem.lenderHostel}! Here are the details:`;
        itemSuggestionHTML = `
            <div class="chat-product-suggestion">
                <strong>${escapeHTML(topItem.name)}</strong><br>
                <span style="color:#94a3b8; font-size:0.8rem;">${escapeHTML(topItem.shortDesc)}</span><br>
                <button class="chat-suggestion-btn" onclick="openItemDetails('${topItem.id}')">View Details & Request</button>
            </div>
        `;
    } else if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
        replyText = "Hello! Looking for any specific item today? Try asking for calculators, lab coats, pen drives, cycles or textbooks!";
    } else if (lower.includes('lend') || lower.includes('share') || lower.includes('sell')) {
        replyText = "To put your own items up for sharing, click your Profile icon on the top right to create a new resource listing!";
    } else {
        replyText = `I checked the campus inventory for "${escapeHTML(query)}". You can borrow similar items from our Available Items carousel or post a campus request.`;
    }

    const aiMsgDiv = document.createElement('div');
    aiMsgDiv.className = 'chat-message ai-message';
    aiMsgDiv.innerHTML = `
        <div class="chat-bubble ai-bubble">
            ${replyText}
            ${itemSuggestionHTML}
        </div>
        <span class="chat-timestamp">${getCurrentTimeStr()}</span>
    `;
    msgContainer.appendChild(aiMsgDiv);
    msgContainer.scrollTop = msgContainer.scrollHeight;
}

function getCurrentTimeStr() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ----------------------------------------------------------------------------
// 8. UTILITIES & TOAST
// ----------------------------------------------------------------------------
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
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}
