/**
 * ============================================================
 * data.js — Hardcoded Service, Stylist & Addon Data
 * ============================================================
 *
 * This file defines the default catalog data that ships with the
 * app. It serves as the PRIMARY data source — the app works
 * immediately with these values before any Firebase calls resolve.
 *
 * If Firestore data loads successfully (within 3 seconds), it
 * overrides the corresponding STATE values. If Firebase is slow
 * or unavailable, these hardcoded defaults persist.
 *
 * DESIGN RATIONALE:
 *   Users should never see a blank screen. By shipping data with
 *   the app, every screen is renderable immediately. Firebase
 *   becomes an enhancement layer, not a dependency.
 *
 * @file   Chelsea Man Spa — Mobile Booking App
 * @author Chelsea Man Spa Development Team
 */

/**
 * List of salon services offered.
 *
 * Each service has:
 *   - id:     Unique identifier (matches Firestore doc ID if applicable)
 *   - name:   Display name shown in service cards
 *   - price:  Price in AED (UAE Dirhams)
 *   - dur:    Duration as a human-readable string
 *
 * @constant {Array<{id: string, name: string, price: number, dur: string}>}
 */
const SERVICES = [
  { id: '1',  name: "Men's Haircut",           price: 180, dur: '30 min' },
  { id: '2',  name: 'Haircut & Blow-Dry',      price: 280, dur: '60 min' },
  { id: '3',  name: 'Haircut & Beard Grooming', price: 250, dur: '45 min' },
  { id: '4',  name: 'Blow-Dry & Style',         price: 150, dur: '30 min' },
  { id: '5',  name: 'Full Hair Color',          price: 350, dur: '90 min' },
  { id: '6',  name: 'Highlights',               price: 450, dur: '120 min' },
  { id: '7',  name: 'Keratin Smoothing',        price: 650, dur: '120 min' },
  { id: '8',  name: 'Signature Facial',         price: 380, dur: '60 min' },
  { id: '9',  name: 'Deep Cleansing Facial',    price: 280, dur: '45 min' },
  { id: '10', name: 'Manicure & Pedicure',      price: 280, dur: '60 min' },
  { id: '11', name: 'Royal Shave',              price: 150, dur: '30 min' },
  { id: '12', name: 'Full Body Massage',        price: 450, dur: '60 min' }
];

/**
 * List of salon stylists and specialists.
 *
 * Each stylist has:
 *   - id:      Unique identifier
 *   - name:    Display name
 *   - title:   Professional title / specialty
 *   - rating:  0-5 star rating
 *   - reviews: Number of reviews
 *   - avail:   Whether currently accepting bookings
 *   - gender:  'male' or 'female' (used for gender filtering)
 *
 * @constant {Array<{id: string, name: string, title: string, rating: number, reviews: number, avail: boolean, gender: string}>}
 */
const STYLISTS = [
  { id: '1', name: 'Mustafa',       title: 'Master Barber',          rating: 5.0, reviews: 214, avail: true, gender: 'male'   },
  { id: '2', name: 'Layla Hassan',  title: 'Senior Colorist',        rating: 4.9, reviews: 98,  avail: true, gender: 'female' },
  { id: '3', name: 'Karim Othman',  title: 'Barber & Stylist',       rating: 4.8, reviews: 156, avail: true, gender: 'male'   },
  { id: '4', name: 'Aisha Rashid',  title: 'Facial & Skin Specialist', rating: 4.7, reviews: 72,  avail: true, gender: 'female' },
  { id: '5', name: 'Mariam Khalid', title: 'Nail Technician',        rating: 4.6, reviews: 54,  avail: true, gender: 'female' },
  { id: '6', name: 'Omar Hassan',   title: 'Massage Therapist',      rating: 4.9, reviews: 89,  avail: true, gender: 'male'   }
];

/**
 * List of bookable add-ons / upgrades.
 *
 * Each add-on:
 *   - id:    Unique identifier
 *   - name:  Display name
 *   - price: Additional price in AED
 *
 * These are presented as toggle switches during checkout.
 *
 * @constant {Array<{id: string, name: string, price: number}>}
 */
const ADDONS = [
  { id: '1', name: 'Scalp massage (10 min)',   price: 50  },
  { id: '2', name: 'Luxury hair treatment',     price: 120 },
  { id: '3', name: 'Styling product (take-home)', price: 75 }
];
