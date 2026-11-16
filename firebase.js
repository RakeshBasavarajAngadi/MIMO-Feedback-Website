/**
 * ==============================================================================
 * MIMO Feedback Collection Website - Cloud Firestore Integration Module
 * ==============================================================================
 * Technology: Firebase Modular SDK v10 (Browser ES Modules via official CDN)
 * Database: Cloud Firestore
 * Collection: "feedback"
 * Document Structure:
 *   - name: string (Full name of submitter)
 *   - email: string (Email address of submitter)
 *   - rating: number (Integer 1 to 5)
 *   - message: string (Feedback message)
 *   - createdAt: serverTimestamp (Firestore Server Timestamp)
 * ==============================================================================
 */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  serverTimestamp 
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

// =============================================================================
// Firebase Web App Configuration
// =============================================================================
// Paste the exact configuration from the Firebase Console:
// (Firebase Console -> Project Settings -> General -> Your apps -> Web App)
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

/**
 * Check whether valid production credentials have been configured
 */
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== "YOUR_API_KEY" &&
  firebaseConfig.projectId &&
  firebaseConfig.projectId !== "YOUR_PROJECT_ID"
);

// Initialize Firebase App & Firestore Database Instance
let app;
let db = null;

try {
  if (isFirebaseConfigured) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.info('[Firebase] Modular SDK initialized for project:', firebaseConfig.projectId);
  } else {
    console.warn('[Firebase] Configuration placeholders detected in firebase.js. Awaiting Firebase Console configuration.');
  }
} catch (initError) {
  console.error('[Firebase] Initialization error:', initError);
}

// Export the Firestore instance
export { db };

// =============================================================================
// Reusable Feedback Submission Handler for Cloud Firestore
// =============================================================================
/**
 * Submits feedback document to Cloud Firestore collection "feedback"
 *
 * @param {Object} feedbackData
 * @param {string} feedbackData.name - Submitter's full name
 * @param {string} feedbackData.email - Submitter's email address
 * @param {number} feedbackData.rating - Star rating from 1 to 5
 * @param {string} feedbackData.message - Submitter's feedback message
 * @returns {Promise<string>} - Resolves with the new Firestore Document ID on success
 * @throws {Error} - Rejects with a descriptive error message on failure
 */
export async function submitFeedbackToFirestore(feedbackData) {
  if (!isFirebaseConfigured || !db) {
    throw new Error(
      'Firebase is not yet configured. Please add your web app configuration from the Firebase Console into firebase.js.'
    );
  }

  // Validate required payload fields before attempting database write
  if (!feedbackData.name || typeof feedbackData.name !== 'string' || feedbackData.name.trim().length < 2) {
    throw new Error('A valid name with at least 2 characters is required.');
  }
  if (!feedbackData.email || typeof feedbackData.email !== 'string' || !feedbackData.email.includes('@')) {
    throw new Error('A valid email address is required.');
  }
  const ratingValue = Number(feedbackData.rating);
  if (!ratingValue || ratingValue < 1 || ratingValue > 5) {
    throw new Error('A valid experience rating between 1 and 5 stars is required.');
  }
  if (!feedbackData.message || typeof feedbackData.message !== 'string' || feedbackData.message.trim().length < 15) {
    throw new Error('A feedback message with at least 15 characters is required.');
  }

  try {
    const feedbackCollectionRef = collection(db, 'feedback');
    
    // Create new document in "feedback" collection using addDoc() and serverTimestamp()
    const docRef = await addDoc(feedbackCollectionRef, {
      name: feedbackData.name.trim(),
      email: feedbackData.email.trim(),
      rating: ratingValue,
      message: feedbackData.message.trim(),
      createdAt: serverTimestamp()
    });

    console.info('[Firebase Firestore] Document successfully stored with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('[Firebase Firestore] Error writing to "feedback" collection:', error);

    // Friendly error messaging according to Firebase Firestore error codes
    let userMessage = 'Unable to save feedback to the database. Please try again.';
    if (error.code === 'permission-denied') {
      userMessage = 'Database permission denied. Please verify your Firestore Security Rules in the Firebase Console.';
    } else if (error.code === 'unavailable') {
      userMessage = 'The database service is currently unavailable. Please check your network connection and try again.';
    } else if (error.code === 'resource-exhausted') {
      userMessage = 'Database quota limit reached. Please try again later.';
    } else if (error.message) {
      userMessage = error.message;
    }

    throw new Error(userMessage);
  }
}

// =============================================================================
// Firestore Security Rules (Prepared for Firebase Console)
// =============================================================================
/**
 * Copy and paste the following rules into:
 * Firebase Console -> Firestore Database -> Rules tab
 *
 * rules_version = '2';
 * service cloud.firestore {
 *   match /databases/{database}/documents {
 *     match /feedback/{feedbackId} {
 *       // Allow public visitors to create a feedback entry with valid fields only
 *       allow create: if request.resource.data.name is string
 *                     && request.resource.data.name.size() >= 2
 *                     && request.resource.data.name.size() <= 100
 *                     && request.resource.data.email is string
 *                     && request.resource.data.email.size() <= 150
 *                     && request.resource.data.rating is int
 *                     && request.resource.data.rating >= 1
 *                     && request.resource.data.rating <= 5
 *                     && request.resource.data.message is string
 *                     && request.resource.data.message.size() >= 15
 *                     && request.resource.data.message.size() <= 1000
 *                     && request.resource.data.createdAt == request.time;
 *                     
 *       // Disallow public reads, updates, and deletes to protect user privacy
 *       allow read, update, delete: if false;
 *     }
 *   }
 * }
 */
