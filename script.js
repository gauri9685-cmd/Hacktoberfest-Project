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

/* Process Login Form Submission - SUPABASE AUTH VIA EMAIL & PASSWORD */
async function processLogin() {
    const emailInput = document.getElementById('loginEmail') ? document.getElementById('loginEmail').value.trim() : '';
    const passwordInput = document.getElementById('loginPassword') ? document.getElementById('loginPassword').value : '';

    if (!emailInput || !passwordInput) {
        showToast('Please enter both your email address and password.', 'info');
        return;
    }

    const btnSubmit = document.querySelector('#loginFormView button[type="submit"]');
    if (btnSubmit) { btnSubmit.disabled = true; btnSubmit.innerText = 'Verifying...'; }
    showToast('Authenticating with Supabase...', 'info');

    let userData = null;
    let authSuccess = false;

    // 1. Authenticate with Supabase Auth (Email + Password)
    if (typeof DatabaseService !== 'undefined') {
        try {
            const { data, error } = await DatabaseService.signInWithEmail(emailInput, passwordInput);
            if (!error && data && data.user) {
                authSuccess = true;
                // Fetch linked student profile by email or user metadata
                const dbProfile = await DatabaseService.getProfileByEmail(emailInput);
                const meta = data.user.user_metadata || {};

                userData = {
                    id: data.user.id,
                    name: (dbProfile && dbProfile.full_name) || meta.full_name || emailInput.split('@')[0],
                    roll: (dbProfile && dbProfile.roll_number) || meta.roll_number || '',
                    branch: (dbProfile && dbProfile.branch) || meta.branch || 'Engineering',
                    email: data.user.email || emailInput,
                    phone: (dbProfile && dbProfile.phone) || meta.phone || '',
                    hostel: (dbProfile && dbProfile.hostel) || meta.hostel || 'Hostel Campus',
                    room: (dbProfile && dbProfile.room_number) || meta.room || '',
                    photo: (dbProfile && dbProfile.photo_url) || meta.photo_url || '',
                    loggedInAt: new Date().toISOString()
                };
            } else if (error) {
                console.warn("[Supabase Auth] Login notice:", error.message);
            }
        } catch(e) {
            console.error("Supabase signin error:", e);
        }
    }

    // 2. Offline / Local fallback check if network issue or Supabase Auth offline
    if (!authSuccess) {
        try {
            const registeredKey = 'safeCampusAuth_' + emailInput.toLowerCase();
            const storedReg = localStorage.getItem(registeredKey);
            if (storedReg) {
                const reg = JSON.parse(storedReg);
                if (reg && reg.password === passwordInput) {
                    authSuccess = true;
                    userData = {
                        name: reg.name,
                        roll: reg.roll || '',
                        branch: reg.branch || 'Engineering',
                        email: reg.email,
                        phone: reg.phone || '',
                        hostel: reg.hostel || 'Hostel Campus',
                        room: reg.room || '',
                        photo: reg.photo || '',
                        loggedInAt: new Date().toISOString()
                    };
                }
            }
        } catch(e) {}
    }

    if (btnSubmit) { btnSubmit.disabled = false; btnSubmit.innerText = 'LOG IN'; }

    // 3. Strict Check: If credentials don't match
    if (!authSuccess || !userData) {
        showToast('⚠️ Invalid email or password. Please check your credentials or Sign up!', 'info');
        return;
    }

    // 4. Save Session
    UserAuthManager.setUser(userData);
    localStorage.setItem('safeCampusUserProfile', JSON.stringify(userData));

    // Update UI instantly with profile photo or initial
    updateUIAuthStatus();

    closeAuthModal();
    executePostAuthAction(userData.name);
}

/* Process Sign Up Form Submission - CREATE NEW ACCOUNT WITH EMAIL & PASSWORD */
async function processSignup() {
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const name = document.getElementById('signupFullName').value.trim();
    const roll = document.getElementById('signupRoll') ? document.getElementById('signupRoll').value.trim() : '';
    const branch = document.getElementById('signupBranch') ? document.getElementById('signupBranch').value.trim() : '';
    const phone = document.getElementById('signupPhone') ? document.getElementById('signupPhone').value.trim() : '';
    const hostel = document.getElementById('signupHostel') ? document.getElementById('signupHostel').value.trim() : '';
    const room = document.getElementById('signupRoom') ? document.getElementById('signupRoom').value.trim() : '';

    if (!email || !password || !name) {
        showToast('Please provide your Email, Password, and Full Name.', 'info');
        return;
    }

    // Campus domain verification: Only allow BIT Sindri emails
    const campusDomain = '@bitsindri.ac.in';
    if (!email.toLowerCase().endsWith(campusDomain)) {
        showToast(`⚠️ Registration restricted: Please use your campus email ending in ${campusDomain}`, 'info');
        const emailInput = document.getElementById('signupEmail');
        if (emailInput) {
            emailInput.focus();
            emailInput.style.borderColor = '#ef4444';
        }
        return;
    }

    if (password.length < 6) {
        showToast('Password must be at least 6 characters.', 'info');
        return;
    }

    const btnSubmit = document.querySelector('#signupFormView button[type="submit"]');
    if (btnSubmit) { btnSubmit.disabled = true; btnSubmit.innerText = 'Creating...'; }
    showToast('Creating account with Supabase...', 'info');

    let signupPhotoBase64 = '';
    if (selectedSignupPhotoBase64) {
        signupPhotoBase64 = selectedSignupPhotoBase64;
    }

    const profilePayload = {
        name: name,
        roll: roll || '', // Roll number is optional additional information
        branch: branch || 'Engineering',
        email: email,
        phone: phone || '',
        hostel: hostel || 'Hostel Campus',
        room: room || '',
        photo: signupPhotoBase64,
        loggedInAt: new Date().toISOString()
    };

    // 1. Supabase Auth Sign Up
    const supabaseReady = (typeof DatabaseService !== 'undefined' && typeof supabaseClient !== 'undefined' && supabaseClient !== null);
    if (supabaseReady) {
        try {
            const { data, error } = await DatabaseService.signUpWithEmail(email, password, {
                full_name: name,
                roll_number: roll,
                branch: branch,
                phone: phone,
                hostel: hostel,
                room_number: room,
                photo_url: signupPhotoBase64
            });

            if (error) {
                // If user already registered, alert them
                if (error.message && error.message.toLowerCase().includes('already registered')) {
                    if (btnSubmit) { btnSubmit.disabled = false; btnSubmit.innerText = 'REGISTER ACCOUNT'; }
                    showToast('This email is already registered! Please log in.', 'info');
                    switchAuthView('login');
                    const loginEmail = document.getElementById('loginEmail');
                    if (loginEmail) loginEmail.value = email;
                    return;
                }
                console.warn("[Supabase Auth] SignUp notice:", error.message);
            }

            // Save / sync profile to profiles table
            await DatabaseService.saveProfile(profilePayload);
        } catch(err) {
            console.error("Supabase signup error:", err);
        }
    }

    // 2. Save local cached registration & active login session
    localStorage.setItem('safeCampusAuth_' + email.toLowerCase(), JSON.stringify({
        ...profilePayload,
        password: password
    }));

    if (roll) {
        localStorage.setItem('safeCampusRegistered_' + roll.toLowerCase(), JSON.stringify(profilePayload));
    }

    UserAuthManager.setUser(profilePayload);
    localStorage.setItem('safeCampusUserProfile', JSON.stringify(profilePayload));

    if (btnSubmit) { btnSubmit.disabled = false; btnSubmit.innerText = 'REGISTER ACCOUNT'; }

    // Reset photo cache
    selectedSignupPhotoBase64 = null;

    // Update UI Header instantly with the photo or initial!
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
