/**
 * ============================================================
 * config.js — Firebase Configuration & App Constants
 * ============================================================
 *
 * This file contains all configuration constants used throughout
 * the app. It has zero dependencies and is loaded first so that
 * all other modules can reference these values.
 *
 * @file   Chelsea Man Spa — Mobile Booking App
 * @author Chelsea Man Spa Development Team
 */

/**
 * Firebase project configuration.
 *
 * These values come from the Firebase Console:
 *   Project Settings > General > Your Apps > Web App
 *
 * The project "salon-app-256d3" hosts:
 *   - Firestore database (services, stylists, addons, bookings)
 *   - Authentication (Google Sign-In)
 *   - Hosting (CDN deployment)
 *
 * @constant {Object}
 * @property {string} apiKey - Firebase API key (public, safe to expose)
 * @property {string} authDomain - Auth domain for redirect flows
 * @property {string} projectId - Firebase project identifier
 * @property {string} storageBucket - Cloud Storage bucket URL
 * @property {string} messagingSenderId - FCM sender ID
 * @property {string} appId - Firebase web app ID
 */
const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyC9tdYeG-Fkqt2YIX_kOcOgBtAZ7RJ4qNA',
  authDomain: 'salon-app-256d3.firebaseapp.com',
  projectId: 'salon-app-256d3',
  storageBucket: 'salon-app-256d3.firebasestorage.app',
  messagingSenderId: '442632013221',
  appId: '1:442632013221:web:68f031d1f6b25ef290144c'
};

/**
 * Available morning time slots.
 *
 * The salon operates from 9:00 AM to 12:30 PM in the morning
 * session (before the Friday prayer break). Each slot is 30 minutes.
 *
 * @constant {string[]}
 */
const AM_SLOTS = [
  '9:00', '9:30', '10:00', '10:30',
  '11:00', '11:30', '12:00'
];

/**
 * Available afternoon/evening time slots.
 *
 * The salon reopens at 2:00 PM and operates until 8:30 PM.
 * The gap between 12:30 PM and 2:00 PM is the Friday prayer break
 * (blocked in the UI regardless of day).
 *
 * @constant {string[]}
 */
const PM_SLOTS = [
  '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30',
  '20:00', '20:30'
];
