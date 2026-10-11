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
    
];

// Active Item in Detail Modal
let currentActiveItemId = null;
let activeCategoryFilter = "all";

// Live items cache
let liveMarketplaceItems = [...MARKETPLACE_DATABASE];

// ----------------------------------------------------------------------------
// 2. INITIALIZATION
// ----------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', async () => {
    initUserSession();
    initBannerSlider();
    await loadMarketplaceItemsFromDB();
    initCarouselAutoMovement();
});

async function loadMarketplaceItemsFromDB() {
    if (typeof DatabaseService !== 'undefined') {
        const dbItems = await DatabaseService.getMarketplaceItems();
        if (dbItems && dbItems.length > 0) {
            // Map Supabase DB items to marketplace format
            const mapped = dbItems.map(item => ({
                id: item.id,
                name: item.title,
                category: item.category,
                shortDesc: item.description ? (item.description.length > 75 ? item.description.substring(0, 75) + '...' : item.description) : 'Available for campus sharing',
                fullDesc: item.description || 'Campus student resource.',
                image: item.image_url || 'item_calculator.jpg',
                lenderName: item.seller_name || 'Campus Student',
                lenderRoll: item.seller_roll || 'Student',
                lenderHostel: item.seller_hostel || 'Hostel Campus',
                lenderRoom: 'Hostel Room',
                availabilityPeriod: item.price || 'Available Now',
                phone: item.seller_phone || '9437543796',
                email: 'student@bitsindri.ac.in',
                tags: [item.title.toLowerCase(), item.category.toLowerCase()]
            }));

            // Merge with static database (keeping unique items)
            const dbIds = new Set(mapped.map(m => m.id));
            liveMarketplaceItems = [...mapped, ...MARKETPLACE_DATABASE.filter(m => !dbIds.has(m.id))];
        }
    }
    renderMarketplaceCards();
}

// Sync User Profile info in Top Right Circle
async function initUserSession() {
    let user = null;
    try {
        const stored = localStorage.getItem('safeCampusUser');
        if (stored) user = JSON.parse(stored);
    } catch(e) {}

    if (user && user.roll && typeof DatabaseService !== 'undefined') {
        try {
            const dbProfile = await DatabaseService.getProfile(user.roll);
            if (!dbProfile) {
                localStorage.removeItem('safeCampusUser');
                localStorage.removeItem('safeCampusUserProfile');
                user = null;
            }
        } catch(e) {}
    }

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
    
    let filtered = liveMarketplaceItems;
    if (activeCategoryFilter !== 'all') {
        filtered = liveMarketplaceItems.filter(item => item.category.toLowerCase().includes(activeCategoryFilter.toLowerCase()));
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
    const item = liveMarketplaceItems.find(it => it.id === itemId) || MARKETPLACE_DATABASE.find(it => it.id === itemId);
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

// Marketplace Chat Conversation History for Groq
let marketplaceChatHistory = [];

async function generateAIResponse(query, msgContainer) {
    // Show typing indicator
    const typingId = `typing-${Date.now()}`;
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message ai-message';
    typingDiv.id = typingId;
    typingDiv.innerHTML = `
        <div class="chat-bubble ai-bubble" style="font-style: italic; color: #94a3b8;">
            🔍 Searching campus inventory...
        </div>
    `;
    msgContainer.appendChild(typingDiv);
    msgContainer.scrollTop = msgContainer.scrollHeight;

    let aiResult = null;
    if (typeof queryMarketplaceAI !== 'undefined') {
        aiResult = await queryMarketplaceAI(query, marketplaceChatHistory);
    } else {
        aiResult = {
            text: "Hello! Try asking for items like scientific calculators, engineering drafters, lab coats, or textbooks.",
            items: []
        };
    }

    // Remove typing indicator
    document.getElementById(typingId)?.remove();

    // Track history
    marketplaceChatHistory.push({ role: "user", content: query });
    marketplaceChatHistory.push({ role: "assistant", content: aiResult.text });

    // Render item cards if returned
    let itemsHTML = "";
    if (aiResult.items && aiResult.items.length > 0) {
        itemsHTML = `
            <div class="ai-chat-items-list" style="margin-top: 0.75rem; display: flex; flex-direction: column; gap: 0.5rem;">
                ${aiResult.items.map(item => `
                    <div class="ai-item-mini-card" style="background: rgba(30, 41, 59, 0.9); border: 1px solid rgba(0, 240, 255, 0.4); border-radius: 10px; padding: 0.65rem 0.85rem; display: flex; align-items: center; justify-content: space-between; gap: 0.75rem;">
                        <div style="display: flex; align-items: center; gap: 0.65rem;">
                            <img src="${item.image_url || 'item_calculator.jpg'}" alt="${escapeHTML(item.title)}" style="width: 36px; height: 36px; border-radius: 6px; object-fit: cover; border: 1px solid rgba(0,240,255,0.3);" onerror="this.src='item_calculator.jpg'">
                            <div style="display: flex; flex-direction: column;">
                                <span style="font-weight: bold; color: #ffffff; font-size: 0.85rem;">${escapeHTML(item.title)}</span>
                                <span style="color: #00f0ff; font-size: 0.78rem; font-weight: 600;">${escapeHTML(item.price || 'Free / Borrow')} • 📍 ${escapeHTML(item.hostel || 'Campus')}</span>
                            </div>
                        </div>
                        <button class="ai-mini-view-btn" onclick="openItemDetails('${item.id}')" style="background: #00f0ff; color: #070a12; border: none; padding: 0.35rem 0.75rem; border-radius: 6px; font-weight: 700; font-size: 0.75rem; cursor: pointer; white-space: nowrap;">
                            View Item ➔
                        </button>
                    </div>
                `).join('')}
            </div>
        `;
    }

    const aiMsgDiv = document.createElement('div');
    aiMsgDiv.className = 'chat-message ai-message';
    aiMsgDiv.innerHTML = `
        <div class="chat-bubble ai-bubble">
            <p style="margin: 0; line-height: 1.45;">${escapeHTML(aiResult.text).replace(/\n/g, '<br>')}</p>
            ${itemsHTML}
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
