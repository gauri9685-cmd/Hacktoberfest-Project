/**
 * ============================================================================
 * SAFECAMPUS CONNECT V2 — HOMEPAGE CONTROLLER
 * Handles User Auth state & 3 distinct Log In / Sign Up entry workflows:
 *   1) BROWSE button -> Log In/Sign Up -> Redirect to Marketplace
 *   2) ENTER HUB button -> Log In/Sign Up -> Redirect to Emergency Hub
 *   3) Top Right LOG IN button -> Log In/Sign Up -> Page Reload, Profile Icon,
 *      direct profile page redirection, & seamless future access to both portals.
 * ============================================================================
 */

// Tracks where the user initiated login from: 'marketplace', 'hub', or 'header'
let pendingRedirectIntent = null;

// Global User State Manager
const UserAuthManager = {
    getUser: function() {
        const stored = localStorage.getItem('safeCampusUser');
        return stored ? JSON.parse(stored) : null;
    },

    setUser: function(userData) {
        localStorage.setItem('safeCampusUser', JSON.stringify(userData));
    },

    logout: function() {
        localStorage.removeItem('safeCampusUser');
        window.location.reload();
    }
};

// Initialize UI on page load
document.addEventListener('DOMContentLoaded', () => {
    updateUIAuthStatus();
});

/* Update top bar button to either LOG IN text or PROFILE icon button */
function updateUIAuthStatus() {
    const user = UserAuthManager.getUser();
    const loginHeaderBtn = document.getElementById('loginHeaderBtn');

    if (user && loginHeaderBtn) {
        // Logged in mode: Render Circular Profile icon button matching Desktop-2 / Wireframe
        const initial = (user.name && user.name.trim()) ? user.name.trim().charAt(0).toUpperCase() : 'G';
        loginHeaderBtn.innerHTML = `<span class="user-circle-avatar">${escapeHTML(initial)}</span>`;
        loginHeaderBtn.className = 'btn-profile-circular';
        loginHeaderBtn.title = `Profile: ${escapeHTML(user.name)}`;
    } else if (loginHeaderBtn) {
        // Logged out mode: Standard LOG IN button
        loginHeaderBtn.innerText = 'LOG IN';
        loginHeaderBtn.className = 'btn-login-cyber';
    }
}

/* Header Auth button handler (Way 3) */
function handleHeaderAuthClick() {
    const user = UserAuthManager.getUser();
    if (user) {
        // If already logged in, clicking profile button navigates to profile page
        window.location.href = 'profile.html';
    } else {
        // If not logged in, open Auth modal with 'header' intent
        pendingRedirectIntent = 'header';
        openAuthModal('login');
    }
}

/* Card Portal buttons handler (Way 1 & Way 2) */
function handlePortalClick(targetFeature, targetUrl) {
    const user = UserAuthManager.getUser();

    if (user) {
        // Direct Access: Navigate directly to target page
        showToast(`Opening ${targetFeature}...`, 'success');
        setTimeout(() => {
            window.location.href = targetUrl;
        }, 300);
    } else {
        // If logged out / no account, set intent and open auth modal
        pendingRedirectIntent = targetFeature; // 'marketplace' or 'hub'
        showToast(`Log in or Sign up to access ${targetFeature}.`, 'info');
        openAuthModal('login');
    }
}

/* Process Login Form Submission with 3-Way Redirect Logic */
function processLogin() {
    const name = document.getElementById('loginName').value.trim();
    const roll = document.getElementById('loginRoll').value.trim();

    if (!name || !roll) return;

    // Save User Session
    UserAuthManager.setUser({
        name: name,
        roll: roll,
        branch: 'IT',
        email: `${roll.toLowerCase()}@bitsindri.ac.in`,
        loggedInAt: new Date().toISOString()
    });

    closeAuthModal();
    executePostAuthAction(name);
}

/* Process Sign Up Form Submission with 3-Way Redirect Logic */
function processSignup() {
    const name = document.getElementById('signupFullName').value.trim();
    const roll = document.getElementById('signupRoll').value.trim();
    const branch = document.getElementById('signupBranch').value.trim();
    const email = document.getElementById('signupEmail').value.trim();

    if (!name || !roll || !email) return;

    // Save User Session
    UserAuthManager.setUser({
        name: name,
        roll: roll,
        branch: branch || 'Engineering',
        email: email,
        loggedInAt: new Date().toISOString()
    });

    closeAuthModal();
    executePostAuthAction(name);
}

/* Execute specific redirect behavior based on the 3 login pathways */
function executePostAuthAction(userName) {
    if (pendingRedirectIntent === 'marketplace') {
        // Way 1: Redirect to Marketplace
        showToast(`Welcome ${userName}! Redirecting to Campus Marketplace...`, 'success');
        setTimeout(() => {
            window.location.href = 'marketplace.html';
        }, 400);

    } else if (pendingRedirectIntent === 'hub') {
        // Way 2: Redirect to Emergency & Health Hub
        showToast(`Welcome ${userName}! Redirecting to Safety & Health Hub...`, 'success');
        setTimeout(() => {
            window.location.href = 'emergency_hub.html';
        }, 400);

    } else if (pendingRedirectIntent === 'header' || !pendingRedirectIntent) {
        // Way 3: Top-Right Log in -> Updates Profile circle button
        showToast(`Log in successful! Welcome ${userName}.`, 'success');
        updateUIAuthStatus();
    }

    // Reset intent tracker
    pendingRedirectIntent = null;
}

/* Urgent Emergency Call Trigger (ACCESSIBLE WITHOUT LOGIN) */
function triggerDirectEmergencyCall() {
    const urgentModal = document.getElementById('urgentHelpModal');
    if (urgentModal) {
        urgentModal.classList.add('active');
        shareLiveLocationNoAuth();
    }
}

function closeUrgentHelpModal() {
    const urgentModal = document.getElementById('urgentHelpModal');
    if (urgentModal) {
        urgentModal.classList.remove('active');
    }
}

function endUrgentCall() {
    closeUrgentHelpModal();
    showToast('Emergency call ended.', 'info');
}

function shareLiveLocationNoAuth() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                showToast(`📍 Live GPS shared with BIT Security Patrol: Lat ${pos.coords.latitude.toFixed(4)}, Lon ${pos.coords.longitude.toFixed(4)}`, 'success');
            },
            (err) => {
                showToast('📍 Campus Location shared: BIT Sindri Central Hostels Zone.', 'success');
            }
        );
    } else {
        showToast('📍 Campus Location shared: BIT Sindri Main Campus.', 'success');
    }
}

/* Auth Modal Controllers */
function openAuthModal(defaultView = 'login') {
    switchAuthView(defaultView);
    const modal = document.getElementById('authModal');
    if (modal) modal.classList.add('active');
}

function closeAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) modal.classList.remove('active');
}

function switchAuthView(viewName) {
    const loginView = document.getElementById('loginFormView');
    const signupView = document.getElementById('signupFormView');

    if (viewName === 'login') {
        if (loginView) loginView.classList.add('active');
        if (signupView) signupView.classList.remove('active');
    } else {
        if (loginView) loginView.classList.remove('active');
        if (signupView) signupView.classList.add('active');
    }
}

function handlePhotoSelect(event) {
    const file = event.target.files[0];
    const label = document.getElementById('photoLabel');
    if (file && label) {
        label.innerText = `✓ Selected: ${file.name}`;
    }
}

/* Toast Notifications */
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
    }, 4000);
}

function escapeHTML(str) {
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
