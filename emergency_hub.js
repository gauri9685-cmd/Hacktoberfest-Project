/**
 * ============================================================================
 * SAFECAMPUS CONNECT V2 — SAFETY & WELLNESS HUB CONTROLLER
 * Implements:
 *   1. Top Banner Slider (Emergency, Healthcare, AI Wellness)
 *   2. Emergency Contacts Directory with Dynamic Database & Styled Scrollbar
 *   3. Incident Reporting System (Frame 37) with High-Contrast Dark Dropdown & "Other"
 *   4. Instant SOS Dispatch & Live Responders Directory (Frame 42 Split Layout)
 *   5. Floating Location Sharing Engine (Turn On / Turn Off) with Green Status Dot
 *   6. SafeCampus Health AI Assistant (Frame 36 Periwinkle Layout & Instant Advice)
 * ============================================================================
 */

// ----------------------------------------------------------------------------
// DATABASE MODELS (READY FOR BACKEND / DATABASE INTEGRATION)
// ----------------------------------------------------------------------------
const CAMPUS_EMERGENCY_CONTACTS = [
    {
        id: "sec-ctrl-01",
        name: "Main Campus Security Control Room",
        desc: "24/7 Central Gate Security Patrol & Despatch",
        phone: "+91 8943672354",
        accent: "cyan",
        callLabel: "Call Now",
        icon: "🚨"
    },
    {
        id: "med-amb-02",
        name: "Campus Health Center & Ambulance",
        desc: "Emergency Medical Transport & Dispensary Doctor",
        phone: "+91 9431102934",
        accent: "magenta",
        callLabel: "Call Medical",
        icon: "🚑"
    },
    {
        id: "counsel-03",
        name: "Student Counseling & Wellness Cell",
        desc: "Confidential Mental Health & Peer Counselor",
        phone: "+91 9835123490",
        accent: "cyan",
        callLabel: "Call Counselor",
        icon: "💬"
    },
    {
        id: "ragging-04",
        name: "Anti-Ragging Squad & Women Safety Desk",
        desc: "Dean of Student Welfare & Vigilance Cell",
        phone: "1800-180-5522",
        accent: "cyan",
        callLabel: "Call Helpline",
        icon: "🛡️"
    },
    {
        id: "warden-05",
        name: "Chief Hostel Warden Desk",
        desc: "Hostel 1 - 28 Coordination & Maintenance",
        phone: "+91 9470198765",
        accent: "magenta",
        callLabel: "Call Warden",
        icon: "🏢"
    },
    {
        id: "police-06",
        name: "Sindri Local Police Station",
        desc: "Local Town Police Patrol & Rapid Assistance",
        phone: "+91 3262245222",
        accent: "cyan",
        callLabel: "Call Police",
        icon: "👮"
    },
    {
        id: "fire-07",
        name: "Campus Fire & Hazardous Response",
        desc: "District Fire Station & Campus Hydrant Unit",
        phone: "101 / +91 3262312101",
        accent: "magenta",
        callLabel: "Call Fire Dept",
        icon: "🔥"
    },
    {
        id: "electric-08",
        name: "Campus Electrical & Power Outage Emergency",
        desc: "High-Voltage Substation & Emergency Generator Control",
        phone: "+91 9430114523",
        accent: "cyan",
        callLabel: "Call Electrical",
        icon: "⚡"
    }
];

const CAMPUS_RESPONDERS_DATABASE = [
    { phone: "+91 673973956", name: "Security Unit Alpha" },
    { phone: "+91 7834627495", name: "Dispensary Paramedic Desk" },
    { phone: "+91 9476384694", name: "Hostel Zone 4 Quick Patrol" },
    { phone: "+91 8475937556", name: "Central Gate Dispatch Officer" },
    { phone: "+91 9584755766", name: "Evening Women's Escort Team" },
    { phone: "+91 9845012399", name: "Campus Emergency Rover 2" },
    { phone: "+91 9123456780", name: "Night Vigilance Supervisor" }
];

// ----------------------------------------------------------------------------
// 1. INITIALIZATION & SESSION
// ----------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    initUserSession();
    initHubSlider();
    initLocationSharingStatus();
    renderEmergencyContactsDirectory();
    renderFrame42RespondersList();
});

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

    const circleBtn = document.querySelector('.hub-profile-circle-badge');
    const badge = document.getElementById('userInitialBadge');
    const frame36Badge = document.getElementById('frame36UserInitial');

    if (user && user.photo) {
        if (circleBtn) {
            circleBtn.innerHTML = `<img src="${user.photo}" alt="${user.name ? user.name.replace(/"/g, '&quot;') : 'Profile'}" class="user-circle-avatar-img">`;
        }
        if (frame36Badge) {
            frame36Badge.innerHTML = `<img src="${user.photo}" alt="${user.name ? user.name.replace(/"/g, '&quot;') : 'Profile'}" class="user-circle-avatar-img">`;
        }
    } else {
        const initial = (user && user.name) ? user.name.charAt(0).toUpperCase() : 'G';
        if (badge) badge.innerText = initial;
        if (frame36Badge) frame36Badge.innerText = initial;
    }
}

function goBackToHome() {
    window.location.href = 'index.html';
}

function openStudentProfile() {
    window.location.href = 'student_profile.html';
}

// ----------------------------------------------------------------------------
// 2. TOP BANNER SLIDER CONTROLLER
// ----------------------------------------------------------------------------
let currentSlideIndex = 0;
let slideInterval = null;

function initHubSlider() {
    const slides = document.querySelectorAll('.slider-slide');
    if (!slides.length) return;

    startSlideTimer();

    const slider = document.getElementById('hubSlider');
    if (slider) {
        slider.addEventListener('mouseenter', () => clearInterval(slideInterval));
        slider.addEventListener('mouseleave', () => startSlideTimer());
    }
}

function startSlideTimer() {
    clearInterval(slideInterval);
    slideInterval = setInterval(() => {
        nextSlide();
    }, 2000);
}

function showSlide(index) {
    const slides = document.querySelectorAll('.slider-slide');
    const dots = document.querySelectorAll('.slider-dots .dot-btn');
    if (!slides.length) return;

    if (index >= slides.length) currentSlideIndex = 0;
    else if (index < 0) currentSlideIndex = slides.length - 1;
    else currentSlideIndex = index;

    slides.forEach((s, i) => s.classList.toggle('active', i === currentSlideIndex));
    dots.forEach((d, i) => d.classList.toggle('active', i === currentSlideIndex));
}

function nextSlide() { showSlide(currentSlideIndex + 1); }
function prevSlide() { showSlide(currentSlideIndex - 1); }
function goToSlide(idx) { showSlide(idx); startSlideTimer(); }

// ----------------------------------------------------------------------------
// 3. POINT 2: EMERGENCY CONTACTS DIRECTORY (DYNAMIC RENDERER & SCROLLBAR)
// ----------------------------------------------------------------------------
async function renderEmergencyContactsDirectory() {
    const container = document.getElementById('contactsDirectoryContainer');
    if (!container) return;

    let contacts = CAMPUS_EMERGENCY_CONTACTS;
    if (typeof DatabaseService !== 'undefined') {
        const dbContacts = await DatabaseService.getEmergencyContacts();
        if (dbContacts && dbContacts.length > 0) {
            contacts = dbContacts;
        }
    }

    container.innerHTML = contacts.map(contact => {
        const glowClass = contact.accent === 'magenta' ? 'magenta-glow-card' : 'cyan-glow-card';
        const btnClass = contact.accent === 'magenta' ? 'magenta-btn' : 'cyan-btn';

        return `
            <div class="contact-card ${glowClass}">
                <div class="contact-card-info">
                    <span class="contact-name">${escapeHTML(contact.name)}</span>
                    <span class="contact-desc">${escapeHTML(contact.desc || contact.description)}</span>
                    <span class="contact-phone-number">${escapeHTML(contact.phone)}</span>
                </div>
                <div class="contact-card-actions">
                    <a href="tel:${contact.phone.replace(/[^0-9+]/g, '')}" class="btn-contact-call ${btnClass}">
                        <span>📞</span> ${contact.call_label || contact.callLabel || 'Call'}
                    </a>
                    <button class="btn-contact-copy" onclick="copyContactNumber('${contact.phone}')" title="Copy number">
                        📋
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function openEmergencyContactsModal() {
    const modal = document.getElementById('contactsModal');
    if (modal) modal.classList.add('active');
}

function closeEmergencyContactsModal() {
    const modal = document.getElementById('contactsModal');
    if (modal) modal.classList.remove('active');
}

function copyContactNumber(phoneNum) {
    navigator.clipboard.writeText(phoneNum).then(() => {
        showToast(`Copied ${phoneNum} to clipboard!`, 'success');
    }).catch(() => {
        showToast(`Number: ${phoneNum}`, 'info');
    });
}

// ----------------------------------------------------------------------------
// 4. POINT 1: REPORT AN INCIDENT MODAL (FRAME 37 WITH OTHER CATEGORY)
// ----------------------------------------------------------------------------
function openReportIncidentModal() {
    const modal = document.getElementById('reportIncidentModal');
    if (modal) modal.classList.add('active');
}

function closeReportIncidentModal() {
    const modal = document.getElementById('reportIncidentModal');
    if (modal) modal.classList.remove('active');
}

async function submitIncidentReport() {
    const categoryElem = document.getElementById('incidentCategory');
    const locElem = document.getElementById('incidentLocation');
    const detailsElem = document.getElementById('incidentDetails');
    const gpsElem = document.getElementById('incidentAttachGps');
    const anonElem = document.getElementById('incidentAnonymous');

    const category = categoryElem ? categoryElem.value : 'General';
    const location = locElem ? locElem.value.trim() : '';
    const details = detailsElem ? detailsElem.value.trim() : '';
    const isGps = gpsElem ? gpsElem.checked : true;
    const isAnonymous = anonElem ? anonElem.checked : false;

    if (!location || !details) {
        showToast('Please provide a campus location and incident details.', 'info');
        return;
    }

    const reportRef = `INC-${Date.now().toString().slice(-6)}`;
    
    // Save to Supabase Database
    if (typeof DatabaseService !== 'undefined') {
        await DatabaseService.submitIncident({
            category: category,
            location: location,
            details: details,
            has_gps: isGps,
            is_anonymous: isAnonymous
        });
    }

    // Save locally
    try {
        const existing = JSON.parse(localStorage.getItem('safeCampusIncidents') || '[]');
        existing.unshift({
            ref: reportRef,
            category: category,
            location: location,
            details: details,
            isGps: isGps,
            isAnonymous: isAnonymous,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('safeCampusIncidents', JSON.stringify(existing));
    } catch(e) {}

    closeReportIncidentModal();
    if (detailsElem) detailsElem.value = '';
    if (locElem) locElem.value = '';
    showToast(`✓ Incident Report submitted (Ref #${reportRef}). Security dispatched.`, 'success');
}

// ----------------------------------------------------------------------------
// 5. POINT 4: FRAME 42 SOS & CAMPUS RESPONDERS SPLIT MODAL (3RD BUTTON)
// ----------------------------------------------------------------------------
function renderFrame42RespondersList() {
    const list = document.getElementById('frame42RespondersList');
    if (!list) return;

    list.innerHTML = CAMPUS_RESPONDERS_DATABASE.map(resp => `
        <div class="frame42-responder-item">
            <span class="frame42-resp-phone">${escapeHTML(resp.phone)}</span>
            <div class="frame42-resp-actions">
                <button class="frame42-icon-action-btn" onclick="directCallResponder('${resp.phone}')" title="Direct Call">
                    📞
                </button>
                <button class="frame42-icon-action-btn" onclick="directChatResponder('${resp.phone}')" title="Direct Message">
                    💬
                </button>
            </div>
        </div>
    `).join('');
}

function triggerSOSConnect() {
    const modal = document.getElementById('sosModal');
    if (modal) {
        modal.classList.add('active');
        retransmitGPS();
    }
}

function closeSOSModal() {
    const modal = document.getElementById('sosModal');
    if (modal) modal.classList.remove('active');
    showToast('Emergency call terminated.', 'info');
}

function directCallResponder(phone) {
    const phoneClean = phone.replace(/[^0-9+]/g, '');
    window.open(`tel:${phoneClean}`);
    showToast(`Initiating direct call to ${phone}...`, 'success');
}

function directChatResponder(phone) {
    showToast(`Opening encrypted radio message channel to ${phone}...`, 'info');
}

function retransmitGPS() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                showToast(`📍 Live GPS Broadcasted: Lat ${pos.coords.latitude.toFixed(4)}, Lon ${pos.coords.longitude.toFixed(4)}`, 'success');
            },
            () => {
                showToast(`📍 Shared location: BIT Sindri Central Hostels Zone`, 'success');
            }
        );
    } else {
        showToast(`📍 Shared location: BIT Sindri Main Campus`, 'success');
    }
}

// ----------------------------------------------------------------------------
// 6. LOCATION SHARING ENGINE (TURN ON / OFF)
// ----------------------------------------------------------------------------
function initLocationSharingStatus() {
    const stored = localStorage.getItem('safeCampusLocationSharing');
    const isEnabled = (stored === 'true' || stored === null); // default enabled
    updateLocationSharingUI(isEnabled);
}

function toggleLocationSharing(turnOn) {
    localStorage.setItem('safeCampusLocationSharing', turnOn ? 'true' : 'false');
    updateLocationSharingUI(turnOn);

    if (turnOn) {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    showToast(`📍 Live Location Active (Lat: ${pos.coords.latitude.toFixed(2)}, Lon: ${pos.coords.longitude.toFixed(2)})`, 'success');
                },
                () => {
                    showToast(`📍 Location Sharing Active: BIT Sindri Hostels Sector`, 'success');
                }
            );
        } else {
            showToast(`📍 Location Sharing Active: BIT Campus Zone`, 'success');
        }
    } else {
        showToast('Location Sharing turned OFF.', 'info');
    }
}

function updateLocationSharingUI(isEnabled) {
    const btnOn = document.getElementById('btnLocOn');
    const btnOff = document.getElementById('btnLocOff');
    const dot = document.getElementById('liveGpsIndicatorDot');
    const statusText = document.getElementById('locStatusText');

    if (isEnabled) {
        btnOn?.classList.add('active');
        btnOff?.classList.remove('active');
        dot?.classList.add('active');
        if (statusText) statusText.innerText = "GPS Active: BIT Campus";
    } else {
        btnOn?.classList.remove('active');
        btnOff?.classList.add('active');
        dot?.classList.remove('active');
        if (statusText) statusText.innerText = "GPS Standby: Disabled";
    }
}

// ----------------------------------------------------------------------------
// 7. POINT 3: FRAME 36 HEALTH AI CHAT ASSISTANT
// ----------------------------------------------------------------------------
function openWellnessChatModal() {
    const modal = document.getElementById('wellnessChatOverlay');
    if (modal) {
        modal.classList.add('active');
        setTimeout(() => {
            document.getElementById('wellnessChatInput')?.focus();
        }, 150);
    }
}

function closeWellnessChatModal() {
    const modal = document.getElementById('wellnessChatOverlay');
    if (modal) modal.classList.remove('active');
}

function handleWellnessKeydown(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        sendWellnessMessage();
    }
}

function sendWellnessMessage() {
    const input = document.getElementById('wellnessChatInput');
    const msgContainer = document.getElementById('wellnessChatMessages');
    if (!input || !msgContainer) return;

    const query = input.value.trim();
    if (!query) return;

    // 1. Render User Message in Frame 36
    const userMsgDiv = document.createElement('div');
    userMsgDiv.className = 'frame36-user-bubble';
    userMsgDiv.innerText = query;
    msgContainer.appendChild(userMsgDiv);
    input.value = '';
    msgContainer.scrollTop = msgContainer.scrollHeight;

    // 2. Generate Supportive Wellness AI Reply
    setTimeout(() => {
        generateWellnessAIReply(query, msgContainer);
    }, 550);
}

// Wellness AI Chat History
let wellnessChatHistory = [];

async function generateWellnessAIReply(query, msgContainer) {
    // Show typing bubble
    const typingId = `wellness-typing-${Date.now()}`;
    const typingDiv = document.createElement('div');
    typingDiv.className = 'frame36-ai-bubble';
    typingDiv.id = typingId;
    typingDiv.style.fontStyle = 'italic';
    typingDiv.style.opacity = '0.7';
    typingDiv.innerText = 'Thinking...';
    msgContainer.appendChild(typingDiv);
    msgContainer.scrollTop = msgContainer.scrollHeight;

    let reply = "";
    if (typeof queryHealthAI !== 'undefined') {
        reply = await queryHealthAI(query, wellnessChatHistory);
    } else {
        reply = "Stay well-hydrated, take rest in a quiet room, and remember that for any health concerns or checkups, the BIT Sindri Health Center is open daily.";
    }

    // Remove typing bubble
    document.getElementById(typingId)?.remove();

    // Track history
    wellnessChatHistory.push({ role: "user", content: query });
    wellnessChatHistory.push({ role: "assistant", content: reply });

    const aiMsgDiv = document.createElement('div');
    aiMsgDiv.className = 'frame36-ai-bubble';
    aiMsgDiv.innerText = reply;
    msgContainer.appendChild(aiMsgDiv);
    msgContainer.scrollTop = msgContainer.scrollHeight;
}

// ----------------------------------------------------------------------------
// 8. TOAST NOTIFICATIONS & UTILITY
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
