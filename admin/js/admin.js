/**
 * ==============================================================================
 * MIMO Feedback Collection Website - Admin Dashboard Client Application
 * ==============================================================================
 * Technologies: Firebase Modular SDK v10 (ES Modules via Google CDN)
 * Features:
 *   - Firebase Authentication (signInWithEmailAndPassword, signOut, onAuthStateChanged)
 *   - Administrator Email Verification (sendEmailVerification, reload, rate limiting)
 *   - Access Gating: Zero Firestore reads until email is verified
 *   - Cloud Firestore (collection, getDocs, query, orderBy)
 *   - Real-time KPI Analytics & Rating Distribution Engine
 *   - Search & Multi-Criteria Filtering Engine
 *   - Safe DOM Rendering (Strictly XSS-safe textContent injection)
 *   - Message Detail Modal Controller
 * ==============================================================================
 */

import { db, auth, isFirebaseConfigured } from '../../firebase.js';

import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendEmailVerification,
  reload
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';

import { 
  collection, 
  getDocs, 
  query, 
  orderBy 
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ----------------------------------------------------------------------------
  // 1. DOM Elements Cache
  // ----------------------------------------------------------------------------
  // Navigation & Session
  const adminUserPill = document.getElementById('adminUserPill');
  const adminUserEmail = document.getElementById('adminUserEmail');
  const logoutBtn = document.getElementById('logoutBtn');

  // Login View Elements
  const loginSection = document.getElementById('loginSection');
  const adminLoginForm = document.getElementById('adminLoginForm');
  const adminEmailInput = document.getElementById('adminEmail');
  const adminPasswordInput = document.getElementById('adminPassword');
  const loginSubmitBtn = document.getElementById('loginSubmitBtn');
  const loginError = document.getElementById('loginError');
  const loginErrorMessage = document.getElementById('loginErrorMessage');

  // Email Verification View Elements
  const verificationSection = document.getElementById('verificationSection');
  const verificationEmailTarget = document.getElementById('verificationEmailTarget');
  const verificationSuccess = document.getElementById('verificationSuccess');
  const verificationSuccessMessage = document.getElementById('verificationSuccessMessage');
  const verificationError = document.getElementById('verificationError');
  const verificationErrorMessage = document.getElementById('verificationErrorMessage');
  const sendVerificationBtn = document.getElementById('sendVerificationBtn');
  const checkVerificationBtn = document.getElementById('checkVerificationBtn');
  const resendCooldownText = document.getElementById('resendCooldownText');
  const cooldownSeconds = document.getElementById('cooldownSeconds');
  const verificationSignOutBtn = document.getElementById('verificationSignOutBtn');

  // Dashboard View Elements
  const dashboardSection = document.getElementById('dashboardSection');
  const refreshBtn = document.getElementById('refreshBtn');

  // KPI Metrics Elements
  const metricTotalCount = document.getElementById('metricTotalCount');
  const metricAvgRating = document.getElementById('metricAvgRating');
  const metricAvgStars = document.getElementById('metricAvgStars');
  const metricFiveStarCount = document.getElementById('metricFiveStarCount');
  const metricFiveStarPct = document.getElementById('metricFiveStarPct');

  // Rating Distribution Elements
  const barFills = {
    5: document.getElementById('barFill5'),
    4: document.getElementById('barFill4'),
    3: document.getElementById('barFill3'),
    2: document.getElementById('barFill2'),
    1: document.getElementById('barFill1')
  };
  const barCounts = {
    5: document.getElementById('barCount5'),
    4: document.getElementById('barCount4'),
    3: document.getElementById('barCount3'),
    2: document.getElementById('barCount2'),
    1: document.getElementById('barCount1')
  };

  // Search, Filter & Toolbar Elements
  const searchInput = document.getElementById('searchInput');
  const ratingFilter = document.getElementById('ratingFilter');
  const sortOrder = document.getElementById('sortOrder');
  const clearFiltersBtn = document.getElementById('clearFiltersBtn');
  const resultsCount = document.getElementById('resultsCount');

  // Table & State Boxes
  const tableLoader = document.getElementById('tableLoader');
  const tableErrorState = document.getElementById('tableErrorState');
  const tableErrorMessage = document.getElementById('tableErrorMessage');
  const tableErrorDesc = document.getElementById('tableErrorDesc');
  const tableEmptyState = document.getElementById('tableEmptyState');
  const feedbackTable = document.getElementById('feedbackTable');
  const feedbackTableBody = document.getElementById('feedbackTableBody');

  // Modal Elements
  const detailModal = document.getElementById('detailModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalDismissBtn = document.getElementById('modalDismissBtn');
  const modalCustomerName = document.getElementById('modalCustomerName');
  const modalCustomerEmail = document.getElementById('modalCustomerEmail');
  const modalCustomerRating = document.getElementById('modalCustomerRating');
  const modalCustomerDate = document.getElementById('modalCustomerDate');
  const modalCustomerMessage = document.getElementById('modalCustomerMessage');

  // ----------------------------------------------------------------------------
  // 2. Application State Cache
  // ----------------------------------------------------------------------------
  const state = {
    currentUser: null,
    allFeedbacks: [],
    filteredFeedbacks: [],
    isLoading: false,
    searchQuery: '',
    selectedRating: 'all',
    selectedSort: 'newest'
  };

  let cooldownTimerId = null;
  let cooldownRemaining = 0;

  // ----------------------------------------------------------------------------
  // 3. Authentication & Error Helpers
  // ----------------------------------------------------------------------------

  /**
   * Translates Firebase Auth error codes into human-readable messages
   * @param {string} code
   * @returns {string}
   */
  function getFriendlyAuthError(code) {
    switch (code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        return 'Invalid administrator email or password. Please try again.';
      case 'auth/too-many-requests':
        return 'Access temporarily blocked due to multiple requests. Please wait a few moments and try again.';
      case 'auth/user-disabled':
        return 'This administrator account has been disabled.';
      case 'auth/network-request-failed':
        return 'Network connection error. Please check your internet connectivity.';
      default:
        return 'Authentication failed. Please verify your administrator credentials.';
    }
  }

  function showLoginError(msg) {
    if (loginError && loginErrorMessage) {
      loginErrorMessage.textContent = msg;
      loginError.style.display = 'flex';
    }
  }

  function clearLoginError() {
    if (loginError) {
      loginError.style.display = 'none';
      loginErrorMessage.textContent = '';
    }
  }

  function showVerificationSuccess(msg) {
    if (verificationSuccess && verificationSuccessMessage) {
      verificationSuccessMessage.textContent = msg;
      verificationSuccess.style.display = 'flex';
    }
    if (verificationError) verificationError.style.display = 'none';
  }

  function showVerificationError(msg) {
    if (verificationError && verificationErrorMessage) {
      verificationErrorMessage.textContent = msg;
      verificationError.style.display = 'flex';
    }
    if (verificationSuccess) verificationSuccess.style.display = 'none';
  }

  function clearVerificationBanners() {
    if (verificationSuccess) verificationSuccess.style.display = 'none';
    if (verificationError) verificationError.style.display = 'none';
  }

  /**
   * Resend Verification Email Cooldown Timer (prevents rapid repeat requests)
   */
  function startResendCooldown(seconds = 60) {
    cooldownRemaining = seconds;
    sendVerificationBtn.disabled = true;
    resendCooldownText.style.display = 'block';
    cooldownSeconds.textContent = cooldownRemaining;

    if (cooldownTimerId) clearInterval(cooldownTimerId);

    cooldownTimerId = setInterval(() => {
      cooldownRemaining--;
      if (cooldownRemaining <= 0) {
        clearInterval(cooldownTimerId);
        cooldownTimerId = null;
        sendVerificationBtn.disabled = false;
        resendCooldownText.style.display = 'none';
      } else {
        cooldownSeconds.textContent = cooldownRemaining;
      }
    }, 1000);
  }

  // ----------------------------------------------------------------------------
  // 4. View State Controller (Gated by Auth & Email Verification)
  // ----------------------------------------------------------------------------

  /**
   * Updates UI according to authentication and email verification status
   * @param {Object|null} user - Firebase User object
   */
  function updateUIForAuthState(user) {
    state.currentUser = user;

    if (!user) {
      // ------------------------------------------------------------------------
      // State 1: Unauthenticated -> Show Login, Hide Everything Else
      // ------------------------------------------------------------------------
      state.allFeedbacks = [];
      state.filteredFeedbacks = [];
      feedbackTableBody.innerHTML = '';

      loginSection.style.display = 'flex';
      verificationSection.style.display = 'none';
      dashboardSection.style.display = 'none';
      adminUserPill.style.display = 'none';
      logoutBtn.style.display = 'none';

      clearLoginError();
      clearVerificationBanners();
      if (cooldownTimerId) clearInterval(cooldownTimerId);
      adminEmailInput.focus();

    } else if (!user.emailVerified) {
      // ------------------------------------------------------------------------
      // State 2: Authenticated but Email NOT Verified -> Show Verification View
      // ------------------------------------------------------------------------
      // IMPORTANT: Do NOT fetch or display Firestore feedback records!
      state.allFeedbacks = [];
      state.filteredFeedbacks = [];
      feedbackTableBody.innerHTML = '';

      loginSection.style.display = 'none';
      verificationSection.style.display = 'flex';
      dashboardSection.style.display = 'none';

      // Header status
      adminUserPill.style.display = 'inline-flex';
      logoutBtn.style.display = 'inline-flex';
      adminUserEmail.textContent = `${user.email} (Unverified)`;

      // Populate target email inside verification card
      verificationEmailTarget.textContent = user.email;

    } else {
      // ------------------------------------------------------------------------
      // State 3: Authenticated AND Verified -> Grant Access to Dashboard
      // ------------------------------------------------------------------------
      loginSection.style.display = 'none';
      verificationSection.style.display = 'none';
      dashboardSection.style.display = 'block';

      // Header status
      adminUserPill.style.display = 'inline-flex';
      logoutBtn.style.display = 'inline-flex';
      adminUserEmail.textContent = user.email;

      clearVerificationBanners();

      // Protected fetch of feedback records from Cloud Firestore
      fetchFeedbacks();
    }
  }

  // ----------------------------------------------------------------------------
  // 5. Auth Event Handlers (Sign In, Send Verification, Check Status, Sign Out)
  // ----------------------------------------------------------------------------

  // Handle Login Form Submission
  adminLoginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearLoginError();

    const email = adminEmailInput.value.trim();
    const password = adminPasswordInput.value;

    if (!email || !password) {
      showLoginError('Please provide both administrator email and password.');
      return;
    }

    if (!isFirebaseConfigured || !auth) {
      showLoginError('Firebase is not configured. Please verify firebase.js configuration.');
      return;
    }

    // Set button loading state
    loginSubmitBtn.disabled = true;
    const btnSpan = loginSubmitBtn.querySelector('span');
    const originalText = btnSpan ? btnSpan.textContent : 'Sign In';
    if (btnSpan) btnSpan.textContent = 'Verifying Credentials...';

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.info('[MIMO Admin Auth] Sign in successful:', userCredential.user.email);
      adminLoginForm.reset();
      // Auth observer automatically handles routing to verification or dashboard
    } catch (err) {
      console.error('[MIMO Admin Auth] Sign in error:', err);
      showLoginError(getFriendlyAuthError(err.code));
    } finally {
      loginSubmitBtn.disabled = false;
      if (btnSpan) btnSpan.textContent = originalText;
    }
  });

  // Handle "Send Verification Email" Button Click
  sendVerificationBtn.addEventListener('click', async () => {
    if (!state.currentUser || cooldownRemaining > 0) return;

    clearVerificationBanners();
    sendVerificationBtn.disabled = true;
    const btnText = sendVerificationBtn.querySelector('.btn-text');
    const originalText = btnText ? btnText.textContent : 'Send Verification Email';
    if (btnText) btnText.textContent = 'Sending Email...';

    try {
      await sendEmailVerification(state.currentUser);
      console.info('[MIMO Admin Auth] Verification email dispatched to:', state.currentUser.email);

      showVerificationSuccess(
        `Verification email sent! Please check your inbox at ${state.currentUser.email} (and spam folder) and click the confirmation link.`
      );

      // Start 60-second cooldown to prevent repeated rate-limiting requests
      startResendCooldown(60);
    } catch (err) {
      console.error('[MIMO Admin Auth] sendEmailVerification error:', err);
      if (err.code === 'auth/too-many-requests') {
        showVerificationError('Too many email requests sent. Please wait a moment before trying again.');
      } else {
        showVerificationError(err.message || 'Unable to send verification email. Please try again.');
      }
      sendVerificationBtn.disabled = false;
    } finally {
      if (btnText) btnText.textContent = originalText;
    }
  });

  // Handle "I've Verified My Email" Button Click
  checkVerificationBtn.addEventListener('click', async () => {
    if (!state.currentUser) return;

    clearVerificationBanners();
    checkVerificationBtn.disabled = true;
    const btnText = checkVerificationBtn.querySelector('.btn-text');
    const originalText = btnText ? btnText.textContent : "I've Verified My Email";
    if (btnText) btnText.textContent = 'Checking Status...';

    try {
      // Reload current user from Firebase Auth servers to get the updated emailVerified boolean
      await reload(state.currentUser);
      console.info('[MIMO Admin Auth] Reloaded user state. emailVerified =', state.currentUser.emailVerified);

      if (state.currentUser.emailVerified) {
        showVerificationSuccess('Email verified successfully! Loading your dashboard...');
        setTimeout(() => {
          updateUIForAuthState(state.currentUser);
        }, 600);
      } else {
        showVerificationError(
          `Your email address is not yet verified. Please click the verification link sent to ${state.currentUser.email} and click this button again.`
        );
      }
    } catch (err) {
      console.error('[MIMO Admin Auth] reload error:', err);
      showVerificationError(err.message || 'Error checking verification status. Please check your connection.');
    } finally {
      checkVerificationBtn.disabled = false;
      if (btnText) btnText.textContent = originalText;
    }
  });

  // Handle Admin Logout (Header button & Verification footer link)
  async function performSignOut() {
    try {
      if (auth) {
        await signOut(auth);
        console.info('[MIMO Admin Auth] Administrator signed out.');
      }
    } catch (err) {
      console.error('[MIMO Admin Auth] Error signing out:', err);
    }
  }

  logoutBtn.addEventListener('click', performSignOut);
  verificationSignOutBtn.addEventListener('click', performSignOut);

  // Firebase Auth State Observer (Single Source of Truth)
  if (auth) {
    onAuthStateChanged(auth, (user) => {
      updateUIForAuthState(user);
    });
  } else {
    showLoginError('Firebase Authentication could not be initialized.');
  }

  // ----------------------------------------------------------------------------
  // 6. Protected Cloud Firestore Feedback Fetching
  // ----------------------------------------------------------------------------

  async function fetchFeedbacks() {
    // STRICT GATE: User must be authenticated AND email must be verified
    if (!state.currentUser || !state.currentUser.emailVerified || !db) {
      console.warn('[MIMO Admin] Access denied: User is not authenticated or email is not verified.');
      return;
    }

    state.isLoading = true;
    refreshBtn.classList.add('is-spinning');
    refreshBtn.disabled = true;

    // Show Table Loader, Hide Other States
    tableLoader.style.display = 'block';
    tableErrorState.style.display = 'none';
    tableEmptyState.style.display = 'none';
    feedbackTable.style.display = 'none';
    resultsCount.textContent = 'Retrieving feedback records from Cloud Firestore...';

    try {
      const feedbackColRef = collection(db, 'feedback');
      // Order records by creation timestamp descending (newest first)
      const q = query(feedbackColRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);

      const items = [];
      snapshot.forEach((docSnap) => {
        const d = docSnap.data();

        // Convert timestamp safely
        let dateObj = null;
        if (d.createdAt && typeof d.createdAt.toDate === 'function') {
          dateObj = d.createdAt.toDate();
        } else if (d.createdAt && d.createdAt.seconds) {
          dateObj = new Date(d.createdAt.seconds * 1000);
        } else {
          dateObj = new Date();
        }

        items.push({
          id: docSnap.id,
          name: d.name || 'Anonymous User',
          email: d.email || '—',
          rating: Number(d.rating) || 0,
          message: d.message || '',
          createdAt: dateObj
        });
      });

      state.allFeedbacks = items;
      console.info(`[MIMO Admin] Successfully fetched ${items.length} feedback record(s).`);

      // Update Analytics & KPI Metrics
      updateMetrics(state.allFeedbacks);

      // Apply current search and filters
      applyFilters();
    } catch (err) {
      console.error('[MIMO Admin] Error loading feedback from Firestore:', err);
      tableLoader.style.display = 'none';
      tableErrorState.style.display = 'block';

      if (err.code === 'permission-denied') {
        tableErrorMessage.textContent = 'Firestore Permission Denied';
        tableErrorDesc.textContent = 
          `The authenticated account (${state.currentUser.email}) is not authorized by Firestore Security Rules. Ensure your email is added to the administrator allowlist in the Firebase Console.`;
      } else {
        tableErrorMessage.textContent = 'Failed to load feedback records';
        tableErrorDesc.textContent = err.message || 'An error occurred while connecting to Cloud Firestore.';
      }
    } finally {
      state.isLoading = false;
      refreshBtn.classList.remove('is-spinning');
      refreshBtn.disabled = false;
    }
  }

  refreshBtn.addEventListener('click', fetchFeedbacks);

  // ----------------------------------------------------------------------------
  // 7. KPI Analytics & Rating Distribution Computation
  // ----------------------------------------------------------------------------

  function updateMetrics(items) {
    const total = items.length;
    metricTotalCount.textContent = total.toLocaleString();

    if (total === 0) {
      metricAvgRating.textContent = '0.0';
      metricAvgStars.textContent = '☆☆☆☆☆';
      metricFiveStarCount.textContent = '0';
      metricFiveStarPct.textContent = '(0%)';

      for (let star = 1; star <= 5; star++) {
        barFills[star].style.width = '0%';
        barCounts[star].textContent = '0 (0%)';
      }
      return;
    }

    const totalRatingSum = items.reduce((acc, curr) => acc + (curr.rating || 0), 0);
    const avg = (totalRatingSum / total).toFixed(1);
    metricAvgRating.textContent = avg;

    const roundAvg = Math.round(Number(avg));
    metricAvgStars.textContent = '★'.repeat(roundAvg) + '☆'.repeat(5 - roundAvg);

    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    items.forEach((item) => {
      const r = Math.min(5, Math.max(1, Math.round(item.rating)));
      counts[r] = (counts[r] || 0) + 1;
    });

    const fiveCount = counts[5] || 0;
    const fivePct = Math.round((fiveCount / total) * 100);
    metricFiveStarCount.textContent = fiveCount.toLocaleString();
    metricFiveStarPct.textContent = `(${fivePct}%)`;

    for (let star = 1; star <= 5; star++) {
      const c = counts[star] || 0;
      const pct = Math.round((c / total) * 100);
      barFills[star].style.width = `${pct}%`;
      barCounts[star].textContent = `${c} (${pct}%)`;
    }
  }

  // ----------------------------------------------------------------------------
  // 8. Search, Filtering & Sorting Engine
  // ----------------------------------------------------------------------------

  function applyFilters() {
    let result = [...state.allFeedbacks];

    // Filter A: Search by customer name or email
    const queryTerm = state.searchQuery.trim().toLowerCase();
    if (queryTerm) {
      result = result.filter((item) => {
        return (item.name && item.name.toLowerCase().includes(queryTerm)) ||
               (item.email && item.email.toLowerCase().includes(queryTerm));
      });
    }

    // Filter B: Filter by star rating (1 to 5)
    if (state.selectedRating !== 'all') {
      const targetRating = Number(state.selectedRating);
      result = result.filter((item) => item.rating === targetRating);
    }

    // Filter C: Sort order
    if (state.selectedSort === 'newest') {
      result.sort((a, b) => b.createdAt - a.createdAt);
    } else if (state.selectedSort === 'oldest') {
      result.sort((a, b) => a.createdAt - b.createdAt);
    } else if (state.selectedSort === 'rating-high') {
      result.sort((a, b) => b.rating - a.rating || b.createdAt - a.createdAt);
    } else if (state.selectedSort === 'rating-low') {
      result.sort((a, b) => a.rating - b.rating || b.createdAt - a.createdAt);
    }

    state.filteredFeedbacks = result;
    renderTable(result);
  }

  searchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    applyFilters();
  });

  ratingFilter.addEventListener('change', (e) => {
    state.selectedRating = e.target.value;
    applyFilters();
  });

  sortOrder.addEventListener('change', (e) => {
    state.selectedSort = e.target.value;
    applyFilters();
  });

  clearFiltersBtn.addEventListener('click', () => {
    searchInput.value = '';
    ratingFilter.value = 'all';
    sortOrder.value = 'newest';
    state.searchQuery = '';
    state.selectedRating = 'all';
    state.selectedSort = 'newest';
    applyFilters();
  });

  // ----------------------------------------------------------------------------
  // 9. Safe DOM Table Rendering (Strictly XSS-Safe via textContent)
  // ----------------------------------------------------------------------------

  function formatDate(date) {
    if (!date || isNaN(date.getTime())) return 'Recently';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function renderTable(items) {
    tableLoader.style.display = 'none';
    tableErrorState.style.display = 'none';

    const totalAll = state.allFeedbacks.length;
    resultsCount.textContent = `Showing ${items.length} of ${totalAll} feedback submission(s)`;

    if (items.length === 0) {
      feedbackTable.style.display = 'none';
      tableEmptyState.style.display = 'block';
      feedbackTableBody.innerHTML = '';
      return;
    }

    tableEmptyState.style.display = 'none';
    feedbackTable.style.display = 'table';
    feedbackTableBody.innerHTML = '';

    const fragment = document.createDocumentFragment();

    items.forEach((item) => {
      const tr = document.createElement('tr');

      // 1. Customer Cell (Initials avatar + Name + Email)
      const tdCustomer = document.createElement('td');
      const customerWrapper = document.createElement('div');
      customerWrapper.className = 'customer-cell';

      const avatar = document.createElement('div');
      avatar.className = 'customer-avatar';
      const initials = item.name.split(' ').map(p => p[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() || 'U';
      avatar.textContent = initials;

      const detailsDiv = document.createElement('div');
      const nameEl = document.createElement('div');
      nameEl.className = 'customer-name';
      nameEl.textContent = item.name; // Safe textContent

      const emailEl = document.createElement('div');
      emailEl.className = 'customer-email';
      emailEl.textContent = item.email; // Safe textContent

      detailsDiv.appendChild(nameEl);
      detailsDiv.appendChild(emailEl);
      customerWrapper.appendChild(avatar);
      customerWrapper.appendChild(detailsDiv);
      tdCustomer.appendChild(customerWrapper);

      // 2. Rating Badge Cell
      const tdRating = document.createElement('td');
      const ratingBadge = document.createElement('span');
      ratingBadge.className = 'rating-stars-badge';

      const starSpan = document.createElement('span');
      starSpan.className = 'star-gold';
      starSpan.textContent = '★'.repeat(item.rating);

      const ratingText = document.createTextNode(` ${item.rating}/5`);
      ratingBadge.appendChild(starSpan);
      ratingBadge.appendChild(ratingText);
      tdRating.appendChild(ratingBadge);

      // 3. Message Preview Cell
      const tdMessage = document.createElement('td');
      tdMessage.className = 'message-preview-cell';
      tdMessage.textContent = item.message; // Safe textContent
      tdMessage.title = item.message;

      // 4. Submission Date Cell
      const tdDate = document.createElement('td');
      tdDate.className = 'date-cell';
      tdDate.textContent = formatDate(item.createdAt);

      // 5. Action Cell ("View Full Details")
      const tdAction = document.createElement('td');
      tdAction.style.textAlign = 'right';

      const btnView = document.createElement('button');
      btnView.type = 'button';
      btnView.className = 'btn-view-details';
      btnView.setAttribute('data-id', item.id);
      btnView.textContent = 'View Details';

      btnView.addEventListener('click', () => {
        openDetailModal(item);
      });

      tdAction.appendChild(btnView);

      tr.appendChild(tdCustomer);
      tr.appendChild(tdRating);
      tr.appendChild(tdMessage);
      tr.appendChild(tdDate);
      tr.appendChild(tdAction);

      fragment.appendChild(tr);
    });

    feedbackTableBody.appendChild(fragment);
  }

  // ----------------------------------------------------------------------------
  // 10. Full Feedback Detail Modal
  // ----------------------------------------------------------------------------

  function openDetailModal(item) {
    modalCustomerName.textContent = item.name;
    modalCustomerEmail.textContent = item.email;
    modalCustomerRating.textContent = `${'★'.repeat(item.rating)}${'☆'.repeat(5 - item.rating)} (${item.rating} / 5 stars)`;
    modalCustomerDate.textContent = formatDate(item.createdAt);
    modalCustomerMessage.textContent = item.message; // Strictly safe textContent

    detailModal.style.display = 'flex';
    modalCloseBtn.focus();
  }

  function closeDetailModal() {
    detailModal.style.display = 'none';
  }

  modalCloseBtn.addEventListener('click', closeDetailModal);
  modalDismissBtn.addEventListener('click', closeDetailModal);

  detailModal.addEventListener('click', (e) => {
    if (e.target === detailModal) {
      closeDetailModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && detailModal.style.display === 'flex') {
      closeDetailModal();
    }
  });

});
