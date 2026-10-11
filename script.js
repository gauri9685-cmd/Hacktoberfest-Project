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
        localStorage.removeItem('safeCampusUserProfile');
        window.location.reload();
    }
};

// Initialize UI on page load — also clear any stale login sessions
document.addEventListener('DOMContentLoaded', () => {
    // ONE-TIME auto-clear: Remove stale login sessions and old registrations from previous tests.
    const AUTH_VERSION = 'v3_strict_auth_fix';
    if (localStorage.getItem('safeCampusAuthVersion') !== AUTH_VERSION) {
        console.log('[AUTH] Upgrading auth system to v3 — clearing old local cache...');
        // Clear all safeCampus localStorage entries
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('safeCampus')) {
                localStorage.removeItem(key);
            }
        });
        localStorage.setItem('safeCampusAuthVersion', AUTH_VERSION);
    }
    updateUIAuthStatus();
});

/* Update top bar button to either LOG IN text or PROFILE icon button */
async function updateUIAuthStatus() {
    const user = UserAuthManager.getUser();
    const loginHeaderBtn = document.getElementById('loginHeaderBtn');

    if (user && loginHeaderBtn) {
        // Asynchronously verify if the logged-in user actually exists in Supabase DB
        if (typeof DatabaseService !== 'undefined' && user.roll) {
            try {
                const dbProfile = await DatabaseService.getProfile(user.roll);
                if (!dbProfile) {
                    // Profile does NOT exist in Supabase — purge fake/stale session!
                    console.warn(`[AUTH] Session user "${user.roll}" not found in Supabase profiles. Purging stale session.`);
                    localStorage.removeItem('safeCampusUser');
                    localStorage.removeItem('safeCampusUserProfile');
                    updateUIAuthStatus();
                    return;
                }
            } catch(e) {}
        }

        // Logged in mode: Render Circular Profile icon button matching Desktop-2 / Wireframe
        const initial = (user.name && user.name.trim()) ? user.name.trim().charAt(0).toUpperCase() : 'G';
        if (user.photo) {
            loginHeaderBtn.innerHTML = `<img src="${user.photo}" alt="${escapeHTML(user.name)}" class="user-circle-avatar-img">`;
        } else {
            loginHeaderBtn.innerHTML = `<span class="user-circle-avatar" style="font-size: 1.2rem; font-weight: 900; line-height: 1;">${escapeHTML(initial)}</span>`;
        }
        loginHeaderBtn.className = 'btn-profile-circular';
        loginHeaderBtn.title = `Profile: ${escapeHTML(user.name)} (${escapeHTML(user.roll || '')})`;
        loginHeaderBtn.onclick = handleHeaderAuthClick;
    } else if (loginHeaderBtn) {
        // Logged out mode: Standard LOG IN button
        loginHeaderBtn.innerText = 'LOG IN';
        loginHeaderBtn.className = 'btn-login-cyber';
        loginHeaderBtn.onclick = handleHeaderAuthClick;
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
        showToast(`Please log in or sign up to access ${targetFeature}.`, 'info');
        openAuthModal('login');
    }
}

/* Process Login Form Submission - ONLY ALLOW IF ACCOUNT ALREADY EXISTS */
async function processLogin() {
    const nameInput = document.getElementById('loginName').value.trim();
    const rollInput = document.getElementById('loginRoll').value.trim();

    if (!nameInput || !rollInput) {
        showToast('Please enter both your name and roll number.', 'info');
        return;
    }

    const btnSubmit = document.querySelector('#loginFormView button[type="submit"]');
    if (btnSubmit) { btnSubmit.disabled = true; btnSubmit.innerText = 'Verifying...'; }
    showToast('Verifying student account...', 'info');

    // 1. Check if profile exists in Supabase (primary source of truth)
    let existingProfile = null;
    if (typeof DatabaseService !== 'undefined') {
        existingProfile = await DatabaseService.getProfile(rollInput);
    }

    // 2. Local offline fallback: ONLY check dedicated registration key matching exact roll number
    // (Never use the active login session key safeCampusUser for authentication proof)
    if (!existingProfile) {
        try {
            const registeredData = localStorage.getItem('safeCampusRegistered_' + rollInput.toLowerCase());
            if (registeredData) {
                const reg = JSON.parse(registeredData);
                if (reg && reg.roll && reg.roll.toLowerCase() === rollInput.toLowerCase()) {
                    existingProfile = {
                        full_name: reg.name,
                        roll_number: reg.roll,
                        branch: reg.branch,
                        email: reg.email,
                        phone: reg.phone,
                        hostel: reg.hostel,
                        room_number: reg.room,
                        photo_url: reg.photo
                    };
                }
            }
        } catch(e) {}
    }

    if (btnSubmit) { btnSubmit.disabled = false; btnSubmit.innerText = 'LOG IN'; }

    // 3. Strict Check: If no account found anywhere — block login!
    if (!existingProfile) {
        showToast(`⚠️ No account found with Roll No "${rollInput}". Please sign up first to create your account!`, 'info');
        switchAuthView('signup');
        const signupName = document.getElementById('signupFullName');
        const signupRoll = document.getElementById('signupRoll');
        if (signupName) signupName.value = nameInput;
        if (signupRoll) signupRoll.value = rollInput;
        return;
    }

    // 4. Account found — load stored data and log in
    const userData = {
        name: existingProfile.full_name || nameInput,
        roll: existingProfile.roll_number || rollInput,
        branch: existingProfile.branch || 'Engineering',
        email: existingProfile.email || `${rollInput.toLowerCase()}@bitsindri.ac.in`,
        phone: existingProfile.phone || '',
        hostel: existingProfile.hostel || 'Hostel Campus',
        room: existingProfile.room_number || '',
        photo: existingProfile.photo_url || '',
        loggedInAt: new Date().toISOString()
    };

    UserAuthManager.setUser(userData);
    localStorage.setItem('safeCampusUserProfile', JSON.stringify(userData));

    // Update UI instantly with first letter of name
    updateUIAuthStatus();

    closeAuthModal();
    executePostAuthAction(userData.name);
}

/* Process Sign Up Form Submission - CREATE NEW ACCOUNT */
async function processSignup() {
    const name = document.getElementById('signupFullName').value.trim();
    const roll = document.getElementById('signupRoll').value.trim();
    const branch = document.getElementById('signupBranch').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const phone = document.getElementById('signupPhone').value.trim();
    const hostel = document.getElementById('signupHostel').value.trim();
    const room = document.getElementById('signupRoom').value.trim();

    if (!name || !roll || !email) {
        showToast('Please fill in your name, roll number, and email.', 'info');
        return;
    }

    const btnSubmit = document.querySelector('#signupFormView button[type="submit"]');
    if (btnSubmit) { btnSubmit.disabled = true; btnSubmit.innerText = 'Creating...'; }
    showToast('Creating your student account...', 'info');

    // 1. Check if an account already exists with this Roll Number
    const supabaseReady = (typeof DatabaseService !== 'undefined' && typeof supabaseClient !== 'undefined' && supabaseClient !== null);
    if (supabaseReady) {
        const checkExisting = await DatabaseService.getProfile(roll);
        if (checkExisting) {
            if (btnSubmit) { btnSubmit.disabled = false; btnSubmit.innerText = 'REGISTER ACCOUNT'; }
            showToast(`An account with Roll No "${roll}" already exists! Please log in instead.`, 'info');
            switchAuthView('login');
            const loginRoll = document.getElementById('loginRoll');
            const loginName = document.getElementById('loginName');
            if (loginRoll) loginRoll.value = roll;
            if (loginName) loginName.value = checkExisting.full_name || name;
            return;
        }
    }

    let signupPhotoBase64 = '';
    if (selectedSignupPhotoBase64) {
        signupPhotoBase64 = selectedSignupPhotoBase64;
    }

    const userData = {
        name: name,
        roll: roll,
        branch: branch || 'Engineering',
        email: email,
        phone: phone || '',
        hostel: hostel || 'Hostel Campus',
        room: room || '',
        photo: signupPhotoBase64,
        loggedInAt: new Date().toISOString()
    };

    // Save session (current login)
    UserAuthManager.setUser(userData);
    localStorage.setItem('safeCampusUserProfile', JSON.stringify(userData));

    // Save dedicated registration record (keyed by roll number — used as offline login fallback)
    localStorage.setItem('safeCampusRegistered_' + roll.toLowerCase(), JSON.stringify(userData));

    // Save to Supabase Database
    if (supabaseReady) {
        await DatabaseService.saveProfile(userData);
    }

    if (btnSubmit) { btnSubmit.disabled = false; btnSubmit.innerText = 'REGISTER ACCOUNT'; }

    // Reset photo cache
    selectedSignupPhotoBase64 = null;

    // Update UI Header instantly with the photo or first letter of name!
    updateUIAuthStatus();

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

let selectedSignupPhotoBase64 = null;

function handlePhotoSelect(event) {
    const file = event.target.files && event.target.files[0];
    const label = document.getElementById('photoLabel');
    if (!file) return;

    if (label) {
        label.innerText = `⏳ Loading: ${file.name}...`;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            // Resize image to max 240x240 to store efficiently in localStorage and Supabase
            const maxDim = 240;
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > maxDim) {
                    height = Math.round((height * maxDim) / width);
                    width = maxDim;
                }
            } else {
                if (height > maxDim) {
                    width = Math.round((width * maxDim) / height);
                    height = maxDim;
                }
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            selectedSignupPhotoBase64 = canvas.toDataURL('image/jpeg', 0.85);

            if (label) {
                label.innerHTML = `✓ Photo Ready: <span style="color:#00f0ff;">${escapeHTML(file.name)}</span>`;
            }
        };
        img.onerror = function() {
            selectedSignupPhotoBase64 = e.target.result;
            if (label) {
                label.innerText = `✓ Selected: ${file.name}`;
            }
        };
        img.src = e.target.result;
    };
    reader.onerror = function() {
        if (label) label.innerText = `⚠️ Failed to read photo`;
    };
    reader.readAsDataURL(file);
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
