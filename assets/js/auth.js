/**
 * Neon Prop Studio - Auth & Dash Logic
 * Simulates authentication flow with Toast notifications
 */

document.addEventListener('DOMContentLoaded', () => {
    // 0. Toggle Password Visibility
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');
    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const targetInput = document.getElementById(targetId);
            const icon = this.querySelector('.toggle-password-icon');
            
            if (targetInput && icon) {
                if (targetInput.type === 'password') {
                    targetInput.type = 'text';
                    icon.classList.remove('bi-eye');
                    icon.classList.add('bi-eye-slash');
                } else {
                    targetInput.type = 'password';
                    icon.classList.remove('bi-eye-slash');
                    icon.classList.add('bi-eye');
                }
            }
        });
    });

    // 1. Toast Initialization
    const toastEl = document.getElementById('authToast');
    const toastMsg = document.getElementById('toastMessage');
    let toastInstance = null;

    if (toastEl) {
        toastInstance = new bootstrap.Toast(toastEl, { delay: 3000 });
    }

    const showToast = (message, type = 'success') => {
        if (!toastInstance) return;

        toastMsg.textContent = message;
        toastEl.classList.remove('bg-neon', 'bg-danger');
        toastEl.classList.add(type === 'success' ? 'bg-neon' : 'bg-danger');

        toastInstance.show();
    };

    // 2. Login Flow Simulation
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Visual feedback
            const btn = loginForm.querySelector('button');
            const originalText = btn.textContent;
            btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>SYNCING...';
            btn.disabled = true;

            setTimeout(() => {
                localStorage.setItem('isLoggedIn', 'true');
                showToast('ESTABLISHING UPLINK... LOGGED IN SUCCESSFUL');

                // Redirect after toast
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
            }, 1000);
        });
    }

    // 3. Signup Flow Simulation
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const btn = signupForm.querySelector('button');
            btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>INITIALIZING...';
            btn.disabled = true;

            setTimeout(() => {
                showToast('IDENTITY INITIALIZED! PLEASE SIGN IN.');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            }, 1200);
        });
    }

    // 4. Logout Flow
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('isLoggedIn');
            showToast('TERMINATING UPLINK... LOGOUT COMPLETE', 'danger');

            setTimeout(() => {
                window.location.href = '../index.html';
            }, 1500);
        });
    }

    // 5. Dynamic Navbar Update
    const updateNavbar = () => {
        const navAuthContainer = document.querySelector('.d-flex.align-items-center.gap-3');
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

        if (navAuthContainer && !document.body.classList.contains('dashboard-body')) {
            // Find sign in / sign up elements
            const signInBtn = navAuthContainer.querySelector('.btn-login');
            const signUpBtn = navAuthContainer.querySelector('.btn-premium');

            if (isLoggedIn) {
                // Determine path to dashboard based on current page location
                const isSubPage = window.location.pathname.includes('/pages/');
                const dashPath = isSubPage ? 'dashboard.html' : 'pages/dashboard.html';

                // Replace Sign In/Up with Dashboard and Logout
                if (signInBtn) signInBtn.remove();
                if (signUpBtn) signUpBtn.remove();

                // Create Dashboard link if it doesn't exist
                if (!navAuthContainer.querySelector('.btn-dashboard')) {
                    const dashBtn = document.createElement('a');
                    dashBtn.href = dashPath;
                    dashBtn.className = 'btn btn-outline-premium btn-sm btn-dashboard d-none d-lg-block me-2';
                    dashBtn.textContent = 'DASHBOARD';
                    navAuthContainer.prepend(dashBtn);
                }

                // Create Logout button if it doesn't exist
                if (!navAuthContainer.querySelector('.btn-auth-logout')) {
                    const logoutBtnNav = document.createElement('button');
                    logoutBtnNav.className = 'btn btn-premium btn-sm btn-auth-logout';
                    logoutBtnNav.textContent = 'LOGOUT';
                    logoutBtnNav.onclick = () => {
                        localStorage.removeItem('isLoggedIn');
                        showToast('TERMINATING UPLINK... LOGOUT COMPLETE', 'danger');
                        setTimeout(() => location.reload(), 1500);
                    };
                    navAuthContainer.insertBefore(logoutBtnNav, navAuthContainer.querySelector('#theme-toggle'));
                }
            }
        }
    };

    updateNavbar();

    // 6. Dashboard Auth Guard (Simple)
    if (document.body.classList.contains('dashboard-body')) {
        if (localStorage.getItem('isLoggedIn') !== 'true') {
            // Optional: Redirect to login if not authenticated
            // window.location.href = 'login.html';
        }
    }
});
