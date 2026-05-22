# Lessons Learned & Problem Resolutions

This document catalogs the major challenges faced during the development of the Chelsea Man Spa PWA and exactly how they were resolved. This serves as a knowledge base for future projects to prevent repeating the same pitfalls.

## 1. Supabase Guest Bookings & RLS Constraints
**Problem:** Unauthenticated users (guests) booking on the website were unable to save their appointments to the database. The database threw `row-level security` and `foreign key` constraint errors, forcing the frontend to silently fallback to `localStorage` (which is invisible to the Admin Dashboard).
**Root Causes:**
1. The `customers` table had a strict foreign key (`customers_id_fkey`) linking its `id` to `auth.users(id)`. Guests don't have registered accounts, so they don't exist in `auth.users`, causing inserts to fail.
2. The `customers.id` column lacked a default value, throwing `null constraint` errors when `BookingSheet.tsx` tried to insert a guest without specifying an ID.
**Fixes Applied:**
- Ran SQL to `DROP CONSTRAINT customers_id_fkey` on the `customers` table, completely decoupling customers from registered accounts.
- Ran SQL to add `DEFAULT gen_random_uuid()` to the `customers.id` column.
- Ran SQL to drop and recreate Row Level Security (RLS) policies giving `anon` users explicit `FOR INSERT WITH CHECK (true)` access to both `customers` and `bookings`.

## 2. Admin Authentication & Trigger Failures
**Problem:** The owner was unable to access the Admin Dashboard despite signing up. They were consistently routed to the client dashboard.
**Root Causes:**
1. A Supabase database trigger (`handle_new_user`) designed to automatically create a `profiles` row when a user signs up was failing silently.
2. The trigger failed because the `profiles` table possessed a strict `not-null` rule on a `custom_id` column, which the trigger wasn't providing.
**Fixes Applied:**
- **Short-term Bulletproof Fix:** Explicitly hardcoded the owner's email (`princeraymondpaul911@gmail.com`) into `useAuth.ts` and `Login.tsx`. If that email logs in, the app instantly forces the Admin role, completely bypassing the database profile check.
- **Long-term DB Fix:** Executed a manual SQL `INSERT ... ON CONFLICT DO UPDATE` providing a `gen_random_uuid()` for the missing `custom_id`, successfully forcing the admin profile into the database.

## 3. PWA Caching Stale Code
**Problem:** Code updates (like the hardcoded admin email) were pushed to GitHub Pages, but the user couldn't see the changes on their device.
**Root Cause:** The Vite PWA Service Worker caches the JavaScript bundles aggressively for offline support. When returning to the site, it loads the old cached version instantly.
**Fixes Applied:**
- Instructed users to perform a Hard Refresh (`Ctrl+F5` or `Cmd+Shift+R`) or clear browser data to bypass the service worker.
- *Future Project Recommendation:* Implement a "New Update Available" toast notification using `vite-plugin-pwa`'s `RegisterSW` module so users are prompted to reload when new code is published.

## 4. LocalStorage vs. Database Divergence
**Problem:** When database writes failed, bookings and services were saving to `localStorage`. This caused fragmentation where one device saw bookings that another device didn't.
**Root Cause:** Optimistic fallbacks in the code handled Supabase errors *too* gracefully, hiding the fact that the backend was broken.
**Fixes Applied:**
- Unified the `loadBookings` and `loadServices` fetching logic to rely on `Promise.race` with a timeout, ensuring Supabase is the primary source of truth.
- Properly fixed the underlying Supabase RLS policies so the app rarely has to rely on the `localStorage` fallback.
- *Future Project Recommendation:* Display a visible warning to the user (e.g., a "Sync Failed - Offline Mode" badge) when a write falls back to local storage, rather than failing silently.

## 5. Input Synchronization for Read-Only Fields
**Problem:** When checking out, the guest's name wasn't actually being passed to the `bookings` table because `CheckoutSummary.tsx` was just displaying the mock name "Gentleman" in a `<span>`.
**Fixes Applied:**
- Converted read-only display text into active `<input>` fields wired up with `useState`.
- Modified callback signatures (`onConfirm(customerName)`) to explicitly pass user input up the component tree to the database fetch call.
