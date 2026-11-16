/**
 * ==============================================================================
 * MIMO Feedback Collection Website - Client Application Script
 * ==============================================================================
 * Architecture:
 * - Module: Form State Management & Cache
 * - Module: Interactive 5-Star Rating Component
 * - Module: Real-Time Character Counter
 * - Module: Form Validation Engine
 * - Module: Cloud Firestore Submission Handler via Modular SDK
 * - Module: Success Confirmation UI & Form Reset
 * ==============================================================================
 */

import { submitFeedbackToFirestore } from '../firebase.js';

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ----------------------------------------------------------------------------
  // 1. DOM Elements Cache
  // ----------------------------------------------------------------------------
  const form = document.getElementById('feedbackForm');
  const cardHeader = document.getElementById('cardHeader');
  const successCard = document.getElementById('successCard');
  const submitBtn = document.getElementById('submitBtn');
  const resetFormBtn = document.getElementById('resetFormBtn');

  // Form Global Error Banner
  const formGlobalError = document.getElementById('formGlobalError');
  const formGlobalErrorMessage = document.getElementById('formGlobalErrorMessage');

  // Input Fields & Groups
  const fullNameInput = document.getElementById('fullName');
  const fullNameGroup = document.getElementById('fullNameGroup');
  const fullNameError = document.getElementById('fullNameError');

  const emailInput = document.getElementById('emailAddress');
  const emailGroup = document.getElementById('emailAddressGroup');
  const emailError = document.getElementById('emailAddressError');

  const feedbackTextarea = document.getElementById('feedbackMessage');
  const feedbackGroup = document.getElementById('feedbackMessageGroup');
  const feedbackError = document.getElementById('feedbackMessageError');
  const charCounter = document.getElementById('charCounter');

  // Star Rating Elements
  const ratingGroup = document.getElementById('ratingGroup');
  const ratingStarsContainer = document.getElementById('ratingStars');
  const starButtons = Array.from(ratingStarsContainer.querySelectorAll('.star-btn'));
  const ratingDescription = document.getElementById('ratingDescription');
  const ratingBadge = document.getElementById('ratingBadge');
  const ratingError = document.getElementById('ratingError');

  // Success Card Summary Elements
  const summaryName = document.getElementById('summaryName');
  const summaryEmail = document.getElementById('summaryEmail');
  const summaryRating = document.getElementById('summaryRating');
  const summaryMessage = document.getElementById('summaryMessage');

  // ----------------------------------------------------------------------------
  // 2. Application State
  // ----------------------------------------------------------------------------
  const state = {
    selectedRating: 0,
    hoveredRating: 0,
    isSubmitting: false,
    minFeedbackLength: 15,
    maxFeedbackLength: 1000,
    ratingLabels: {
      0: 'Click a star to rate',
      1: 'Poor – Needs significant improvement',
      2: 'Fair – Decent, but has room to grow',
      3: 'Good – Helpful and enjoyable learning',
      4: 'Very Good – Exceeded my expectations',
      5: 'Excellent – Absolutely loved the MIMO experience!'
    }
  };

  // ----------------------------------------------------------------------------
  // 3. Global Form Error Management
  // ----------------------------------------------------------------------------
  function showGlobalError(message) {
    if (formGlobalError && formGlobalErrorMessage) {
      formGlobalErrorMessage.textContent = message;
      formGlobalError.style.display = 'flex';
      formGlobalError.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  function clearGlobalError() {
    if (formGlobalError) {
      formGlobalError.style.display = 'none';
      if (formGlobalErrorMessage) {
        formGlobalErrorMessage.textContent = '';
      }
    }
  }

  // ----------------------------------------------------------------------------
  // 4. Interactive Star Rating Component
  // ----------------------------------------------------------------------------
  /**
   * Updates visual highlight of stars based on current active / preview rating
   * @param {number} score - Current rating score (0 to 5)
   * @param {boolean} isPreview - Whether the highlight is from hover preview
   */
  function renderStars(score, isPreview = false) {
    starButtons.forEach((btn, index) => {
      const starRating = index + 1;
      const isFilled = starRating <= score;

      btn.classList.toggle('is-active', isFilled && !isPreview);
      btn.classList.toggle('is-preview', isFilled && isPreview);

      // Accessibility updates
      if (!isPreview) {
        btn.setAttribute('aria-checked', starRating === state.selectedRating ? 'true' : 'false');
      }
    });

    // Update label & badge
    const labelKey = score in state.ratingLabels ? score : 0;
    ratingDescription.textContent = state.ratingLabels[labelKey];

    if (score > 0) {
      ratingDescription.classList.add('has-rating');
      ratingBadge.textContent = `${score} / 5 stars`;
      ratingBadge.classList.add('active');
    } else {
      ratingDescription.classList.remove('has-rating');
      ratingBadge.textContent = '0 / 5 stars';
      ratingBadge.classList.remove('active');
    }
  }

  /**
   * Commits the rating selection
   * @param {number} rating - Selected rating (1-5)
   */
  function selectRating(rating) {
    state.selectedRating = rating;
    renderStars(rating, false);
    clearGlobalError();

    // Clear rating error if previously shown
    clearFieldError(ratingGroup, ratingError);

    // Set focus management for keyboard accessibility
    starButtons.forEach((btn, idx) => {
      btn.tabIndex = idx + 1 === rating ? 0 : -1;
    });
  }

  // Bind Star Event Listeners
  starButtons.forEach((btn) => {
    const starValue = parseInt(btn.getAttribute('data-rating'), 10);

    // Click: Select rating
    btn.addEventListener('click', () => {
      selectRating(starValue);
    });

    // Mouse Enter: Preview rating
    btn.addEventListener('mouseenter', () => {
      state.hoveredRating = starValue;
      renderStars(starValue, true);
    });

    // Keyboard navigation (Arrow Left/Right, Home, End)
    btn.addEventListener('keydown', (e) => {
      let targetRating = state.selectedRating;

      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        e.preventDefault();
        targetRating = Math.min(5, (state.selectedRating || 0) + 1);
        selectRating(targetRating);
        starButtons[targetRating - 1]?.focus();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        e.preventDefault();
        targetRating = Math.max(1, (state.selectedRating || 2) - 1);
        selectRating(targetRating);
        starButtons[targetRating - 1]?.focus();
      } else if (e.key === 'Home') {
        e.preventDefault();
        selectRating(1);
        starButtons[0]?.focus();
      } else if (e.key === 'End') {
        e.preventDefault();
        selectRating(5);
        starButtons[4]?.focus();
      }
    });
  });

  // Mouse Leave: Restore committed selection
  ratingStarsContainer.addEventListener('mouseleave', () => {
    state.hoveredRating = 0;
    renderStars(state.selectedRating, false);
  });

  // ----------------------------------------------------------------------------
  // 5. Character Counter for Feedback Message
  // ----------------------------------------------------------------------------
  function updateCharCounter() {
    const textLength = feedbackTextarea.value.length;
    charCounter.textContent = textLength;

    if (textLength >= state.minFeedbackLength && textLength <= state.maxFeedbackLength) {
      charCounter.classList.add('valid-min');
      charCounter.classList.remove('near-max', 'at-max');
    } else if (textLength > state.maxFeedbackLength * 0.9) {
      charCounter.classList.add('near-max');
      charCounter.classList.remove('valid-min');
    } else {
      charCounter.classList.remove('valid-min', 'near-max', 'at-max');
    }

    if (textLength >= state.maxFeedbackLength) {
      charCounter.classList.add('at-max');
    }
  }

  feedbackTextarea.addEventListener('input', () => {
    updateCharCounter();
    clearGlobalError();
    if (feedbackGroup.classList.contains('has-error')) {
      validateFeedbackMessage();
    }
  });

  // ----------------------------------------------------------------------------
  // 6. Validation Engine
  // ----------------------------------------------------------------------------

  /**
   * Displays an error message on a form group
   */
  function showFieldError(groupEl, errorEl, message) {
    groupEl.classList.add('has-error');
    groupEl.classList.remove('is-valid');
    const textSpan = errorEl.querySelector('span');
    if (textSpan && message) {
      textSpan.textContent = message;
    }
    const input = groupEl.querySelector('.form-input, .form-textarea');
    if (input) {
      input.setAttribute('aria-invalid', 'true');
    }
  }

  /**
   * Clears the error state on a form group
   */
  function clearFieldError(groupEl, errorEl) {
    groupEl.classList.remove('has-error');
    const input = groupEl.querySelector('.form-input, .form-textarea');
    if (input) {
      input.removeAttribute('aria-invalid');
      if (input.value.trim().length > 0) {
        groupEl.classList.add('is-valid');
      }
    }
  }

  /**
   * Validates Full Name
   * @returns {boolean}
   */
  function validateFullName() {
    const value = fullNameInput.value.trim();
    if (!value) {
      showFieldError(fullNameGroup, fullNameError, 'Full name is required.');
      return false;
    }
    if (value.length < 2) {
      showFieldError(fullNameGroup, fullNameError, 'Name must contain at least 2 characters.');
      return false;
    }
    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'\-.]+$/;
    if (!nameRegex.test(value)) {
      showFieldError(fullNameGroup, fullNameError, 'Please enter a valid name using alphabet letters.');
      return false;
    }
    clearFieldError(fullNameGroup, fullNameError);
    return true;
  }

  /**
   * Validates Email Address
   * @returns {boolean}
   */
  function validateEmail() {
    const value = emailInput.value.trim();
    if (!value) {
      showFieldError(emailGroup, emailError, 'Email address is required.');
      return false;
    }
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
    if (!emailRegex.test(value)) {
      showFieldError(emailGroup, emailError, 'Please provide a valid email format (e.g. name@domain.com).');
      return false;
    }
    clearFieldError(emailGroup, emailError);
    return true;
  }

  /**
   * Validates Star Rating Selection
   * @returns {boolean}
   */
  function validateRating() {
    if (!state.selectedRating || state.selectedRating < 1 || state.selectedRating > 5) {
      showFieldError(ratingGroup, ratingError, 'Please select a star rating from 1 to 5 stars.');
      return false;
    }
    clearFieldError(ratingGroup, ratingError);
    return true;
  }

  /**
   * Validates Feedback Message Textarea
   * @returns {boolean}
   */
  function validateFeedbackMessage() {
    const value = feedbackTextarea.value.trim();
    if (!value) {
      showFieldError(feedbackGroup, feedbackError, 'Feedback message is required.');
      return false;
    }
    if (value.length < state.minFeedbackLength) {
      const remaining = state.minFeedbackLength - value.length;
      showFieldError(
        feedbackGroup,
        feedbackError,
        `Please share at least ${state.minFeedbackLength} characters (${remaining} more needed).`
      );
      return false;
    }
    if (value.length > state.maxFeedbackLength) {
      showFieldError(
        feedbackGroup,
        feedbackError,
        `Feedback must be within ${state.maxFeedbackLength} characters.`
      );
      return false;
    }
    clearFieldError(feedbackGroup, feedbackError);
    return true;
  }

  // Real-time input listeners for automatic error clearing
  fullNameInput.addEventListener('input', () => {
    clearGlobalError();
    if (fullNameGroup.classList.contains('has-error')) validateFullName();
  });
  fullNameInput.addEventListener('blur', validateFullName);

  emailInput.addEventListener('input', () => {
    clearGlobalError();
    if (emailGroup.classList.contains('has-error')) validateEmail();
  });
  emailInput.addEventListener('blur', validateEmail);

  feedbackTextarea.addEventListener('blur', validateFeedbackMessage);

  // ----------------------------------------------------------------------------
  // 7. Form Submission & Firestore Flow
  // ----------------------------------------------------------------------------

  /**
   * Sets the Submit Button Loading State
   * @param {boolean} isLoading
   */
  function setLoadingState(isLoading) {
    state.isSubmitting = isLoading;
    submitBtn.disabled = isLoading;
    if (isLoading) {
      submitBtn.classList.add('is-loading');
    } else {
      submitBtn.classList.remove('is-loading');
    }
  }

  /**
   * Displays the confirmation success screen with summary of submission
   * @param {Object} feedbackData
   */
  function showSuccessScreen(feedbackData) {
    summaryName.textContent = feedbackData.name;
    summaryEmail.textContent = feedbackData.email;

    const starIcons = '★'.repeat(feedbackData.rating) + '☆'.repeat(5 - feedbackData.rating);
    summaryRating.textContent = `${starIcons} (${feedbackData.rating} / 5)`;

    const excerpt = feedbackData.message.length > 80
      ? feedbackData.message.slice(0, 80) + '...'
      : feedbackData.message;
    summaryMessage.textContent = `"${excerpt}"`;

    // Hide form & form header, reveal success screen
    cardHeader.style.display = 'none';
    form.style.display = 'none';
    successCard.style.display = 'block';

    successCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  /**
   * Resets form to clean state and returns to input view
   */
  function resetForm() {
    form.reset();
    clearGlobalError();
    state.selectedRating = 0;
    state.hoveredRating = 0;
    renderStars(0, false);
    updateCharCounter();

    [fullNameGroup, emailGroup, ratingGroup, feedbackGroup].forEach((group) => {
      group.classList.remove('has-error', 'is-valid');
      const input = group.querySelector('.form-input, .form-textarea');
      if (input) input.removeAttribute('aria-invalid');
    });

    starButtons.forEach((btn, idx) => {
      btn.tabIndex = idx === 0 ? 0 : -1;
    });

    successCard.style.display = 'none';
    cardHeader.style.display = 'block';
    form.style.display = 'flex';

    fullNameInput.focus();
  }

  resetFormBtn.addEventListener('click', resetForm);

  /**
   * Main Form Submission Handler connected to Cloud Firestore
   */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearGlobalError();

    // Prevent duplicate submission while submission is in progress
    if (state.isSubmitting) return;

    // Run client validation
    const isNameValid = validateFullName();
    const isEmailValid = validateEmail();
    const isRatingValid = validateRating();
    const isMessageValid = validateFeedbackMessage();

    const isFormValid = isNameValid && isEmailValid && isRatingValid && isMessageValid;

    if (!isFormValid) {
      const firstInvalid = form.querySelector('.has-error .form-input, .has-error .form-textarea, .has-error .star-btn');
      if (firstInvalid) {
        firstInvalid.focus();
      }
      return;
    }

    // Prepare payload matching the requested Firestore schema
    const feedbackPayload = {
      name: fullNameInput.value.trim(),
      email: emailInput.value.trim(),
      rating: state.selectedRating,
      message: feedbackTextarea.value.trim()
    };

    console.log('[MIMO Feedback] Submitting feedback payload to Firestore:', feedbackPayload);

    // Set loading state (disables button & activates spinner)
    setLoadingState(true);

    try {
      // Submit to Cloud Firestore collection "feedback"
      const docId = await submitFeedbackToFirestore(feedbackPayload);
      console.log('[MIMO Feedback] Firestore confirmed submission with doc ID:', docId);

      // Show the success screen ONLY after Firestore confirms successful submission
      showSuccessScreen(feedbackPayload);
    } catch (error) {
      console.error('[MIMO Feedback] Submission error:', error);
      // Show meaningful error message in form UI without revealing sensitive internals
      showGlobalError(error.message || 'An unexpected error occurred while saving your feedback to Firestore.');
    } finally {
      setLoadingState(false);
    }
  });

  // Initial setup call
  updateCharCounter();
  renderStars(0, false);
});
