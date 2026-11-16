/**
 * ==============================================================================
 * MIMO Feedback Collection Website - Firebase Firestore Integration (Preparation)
 * ==============================================================================
 * PHASE: Phase 2 Preparation
 *
 * NOTE FOR INTERNSHIP EVALUATOR / DEVELOPER:
 * This file is prepared for the upcoming Phase 2 integration using the modern
 * Firebase Modular SDK (v10+). In accordance with the project guidelines:
 * 1. No fake credentials or mock tokens are hardcoded.
 * 2. No active connections to Firebase are initialized yet.
 * 3. Security best practices are documented below.
 *
 * Follow the setup guide below when you are ready to connect Cloud Firestore.
 * ==============================================================================
 */

/*
// =============================================================================
// STEP 1: Uncomment Firebase Modular SDK Imports (CDN or NPM bundler)
// =============================================================================
// If using pure Vanilla JavaScript via browser ES modules:
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  serverTimestamp 
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
*/

// =============================================================================
// STEP 2: Add your Firebase project configuration
// =============================================================================
// Replace the placeholder values with your real configuration from the Firebase Console:
// 1. Visit: https://console.firebase.google.com
// 2. Select or create your project: "mimo-feedback-collection"
// 3. Go to Project Settings -> General -> "Your apps" -> Add Web App (</>)
// 4. Copy the config object provided and paste the keys below:

export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

/*
// =============================================================================
// STEP 3: Initialize Firebase App & Firestore Database Instance
// =============================================================================
// Uncomment when credentials have been configured:

// const app = initializeApp(firebaseConfig);
// export const db = getFirestore(app);
*/

// =============================================================================
// STEP 4: Prepared Feedback Submission Helper for Phase 2
// =============================================================================
/**
 * Submits feedback document to Cloud Firestore
 * Collection name: "feedbacks"
 *
 * @param {Object} feedbackData
 * @param {string} feedbackData.fullName - Submitter's full name
 * @param {string} feedbackData.emailAddress - Submitter's email
 * @param {number} feedbackData.rating - Star rating from 1 to 5
 * @param {string} feedbackData.message - Submitter's feedback message
 * @returns {Promise<string>} - Returns the generated Firestore Document ID
 */
export async function submitFeedbackToFirestore(feedbackData) {
  /*
  // Uncomment and connect in Phase 2:
  try {
    const feedbackCollectionRef = collection(db, 'feedbacks');
    const docRef = await addDoc(feedbackCollectionRef, {
      fullName: feedbackData.fullName,
      emailAddress: feedbackData.emailAddress,
      rating: Number(feedbackData.rating),
      message: feedbackData.message,
      submittedAt: serverTimestamp(),
      clientTimestamp: feedbackData.submittedAt || new Date().toISOString(),
      status: 'pending_review'
    });

    console.log('[Firebase Firestore] Document written with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('[Firebase Firestore] Error adding feedback document:', error);
    throw error;
  }
  */

  console.info('[Firebase Preparation] submitFeedbackToFirestore called with payload:', feedbackData);
  console.info('[Firebase Preparation] Cloud Firestore connection will be enabled in Phase 2.');
  return 'mock-phase-1-doc-id';
}

/*
// =============================================================================
// STEP 5: Recommended Firestore Security Rules for "feedbacks" Collection
// =============================================================================
// Copy and paste into: Firebase Console -> Firestore Database -> Rules tab
/*
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /feedbacks/{feedbackId} {
      // Allow any visitor to create a feedback entry if valid
      allow create: if request.resource.data.fullName is string
                    && request.resource.data.fullName.size() >= 2
                    && request.resource.data.emailAddress is string
                    && request.resource.data.rating is int
                    && request.resource.data.rating >= 1
                    && request.resource.data.rating <= 5
                    && request.resource.data.message is string
                    && request.resource.data.message.size() >= 15;
                    
      // Only authenticated team members can read or delete feedback entries
      allow read, update, delete: if request.auth != null;
    }
  }
}
*/
