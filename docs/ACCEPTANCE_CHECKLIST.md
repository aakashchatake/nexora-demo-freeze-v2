# NEXORA Institutional Gateway - Acceptance Checklist

This document contains the comprehensive acceptance criteria for the institutional gateway system implementation. All items must be verified before considering the feature complete.

---

## 📋 Pre-Deployment Requirements

### Database Setup
- [ ] Execute `docs/supabase_institutes.sql` in Supabase SQL Editor
- [ ] Verify `institutes` table exists with correct schema
- [ ] Confirm seed data exists: `SELECT * FROM institutes;` shows SIT-2026
- [ ] Test RLS policies: Anonymous can SELECT, authenticated can SELECT
- [ ] Verify indexes created on `status` column

### Code Review
- [x] AccessGateway component created at `src/pages/AccessGateway.jsx`
- [x] AccessGateway CSS created with premium dark theme
- [x] useInstitute hook implemented at `src/hooks/useInstitute.js`
- [x] App.jsx updated with /#/access route
- [x] InstituteLayout integrated with useInstitute hook
- [x] Dashboard has premium hero section with quick actions
- [x] Settings has Institution Governance section
- [x] WEBFLOW_LINKING.md documentation created
- [x] All changes committed to `feature/gateway-ui-v2` branch

---

## 🧪 Local Testing (npm start)

### Gateway Page - Initial Load
- [ ] Navigate to `http://localhost:3000/#/access`
- [ ] Page loads with premium dark theme (deep blue/black gradient background)
- [ ] Header shows "NEXORA" brand with gradient text
- [ ] Title: "Institution Access Gateway"
- [ ] Subtitle: "Enter your institution ID to continue to the platform"
- [ ] Input field visible with placeholder "e.g., SIT-2026"
- [ ] "Verify Institute" button visible and styled correctly
- [ ] Footer shows lock emoji, "Encrypted & Secure", powered by Nexora, copyright

### Gateway Page - Verification Success
- [ ] Enter "SIT-2026" in the input field (auto-converts to uppercase)
- [ ] Click "Verify Institute" button
- [ ] Loading spinner appears briefly
- [ ] Success state shows:
  - [ ] Green checkmark icon (✓) in circular badge
  - [ ] "Verified ✓" heading
  - [ ] Institute name: "Solapur Institute of Technology"
  - [ ] Institute ID: "SIT-2026" (uppercase, monospace)
  - [ ] Institution Type: "College"
  - [ ] "Continue to Portal" button (large, gradient purple/violet)
  - [ ] "Verify Different Institute" button (secondary, subtle)

### Gateway Page - Verification Failure
- [ ] Enter "INVALID-ID" in the input field
- [ ] Click "Verify Institute"
- [ ] Error state shows:
  - [ ] Red alert box with ⚠️ icon
  - [ ] Message: "Institute ID not recognised"
  - [ ] Support link: "Contact Support" → `mailto:nexora@chatakeinnoworks.com`
  - [ ] Error clears when typing new ID

### Gateway Page - Query Parameter Prefill
- [ ] Navigate to `http://localhost:3000/#/access?institute=SIT-2026`
- [ ] Input field automatically contains "SIT-2026"
- [ ] Can still edit the prefilled value
- [ ] Can click Verify directly without typing

### Gateway Page - Continue Flow
- [ ] From verified state, click "Continue to Portal"
- [ ] Navigates to `/#/platform?institute=SIT-2026`
- [ ] URL contains institute query parameter
- [ ] Login/signup page loads normally

---

## 🔐 Authentication & Context Flow

### Login After Gateway
- [ ] Complete gateway verification (SIT-2026)
- [ ] Click "Continue to Portal"
- [ ] Lands on login/signup page
- [ ] Switch to signup tab
- [ ] Fill in all fields (instituteId auto-populates or can be manual)
- [ ] Submit signup form
- [ ] Check email verification link, verify email
- [ ] Return to platform, login successfully
- [ ] Redirects to `/dashboard` after login

### Institute Context Persistence
- [ ] After login, dashboard shows "Solapur Institute of Technology" in header
- [ ] Header also shows "ID: SIT-2026" subtitle
- [ ] Refresh page (F5 / Cmd+R) → institute context persists
- [ ] Navigate to /students → header still shows institute
- [ ] Navigate to /attendance → header still shows institute
- [ ] Navigate to /results → header still shows institute
- [ ] Navigate to /settings → header still shows institute
- [ ] Institute context stored in localStorage (`nexora_institute_id`, `nexora_institute_profile`)

### Missing Context Redirect
- [ ] Clear localStorage: `localStorage.clear()` in browser console
- [ ] Refresh page while on /dashboard
- [ ] Should redirect to /#/access (institute context missing)
- [ ] After verification, should navigate back to platform flow

---

## 🎨 UI/UX Premium Polish

### Dashboard Hero Section
- [ ] Large institute name heading (2.5rem, bold, dark gray)
- [ ] Subtitle: "Academic Command Center" (1.25rem, medium gray)
- [ ] Meta row with institute ID, role, academic year
- [ ] Three quick action buttons in grid:
  - [ ] "+ Add Student" (purple/violet gradient) → navigates to /students
  - [ ] "✓ Mark Attendance" (green gradient) → navigates to /attendance
  - [ ] "📊 Publish Results" (orange gradient) → navigates to /results
- [ ] Buttons have hover effect (translateY up, shadow increase)
- [ ] All text readable, proper spacing, professional appearance

### InstituteLayout Header
- [ ] Shows "NEXORA | Solapur Institute of Technology"
- [ ] Institute ID subtitle visible: "ID: SIT-2026"
- [ ] No hardcoded "Spring University" anywhere
- [ ] User avatar with initials
- [ ] Logout button works
- [ ] Sidebar navigation functional

### Settings Page - Governance
- [ ] "Institution Governance" card exists
- [ ] Explanation text clear and professional
- [ ] "Request Institutional Change" button present
- [ ] Clicking button opens mailto with:
  - [ ] To: nexora@chatakeinnoworks.com
  - [ ] Subject: "Institution Detail Change Request - SIT-2026"
  - [ ] Body: Pre-filled with institute ID, name, user email, change prompt
- [ ] Footer note about escalation to admin@chatakeinnoworks.com
- [ ] Account section shows institute name, ID, type (read-only, no input fields)

### Settings Page - Institute Data
- [ ] Institution Name displays correctly (from useInstitute)
- [ ] Institution ID displays correctly (monospace, bold)
- [ ] Institution Type displays correctly
- [ ] All data matches what was verified in gateway

---

## 🚀 GitHub Pages Deployment

### Build Process
- [ ] Run `npm run build` successfully
- [ ] No compilation errors
- [ ] Build output in `build/` directory
- [ ] `asset-manifest.json` and `index.html` updated

### Deployment
- [ ] Run `npm run deploy`
- [ ] Deployment completes successfully
- [ ] `gh-pages` branch updated on GitHub
- [ ] Wait 2-3 minutes for GitHub Pages propagation

### Live Site Testing - Gateway
- [ ] Navigate to `https://aakashchatake.github.io/nexora-demo-freeze-v2/#/access`
- [ ] Page loads correctly (no 404, no blank screen)
- [ ] Premium dark theme renders properly
- [ ] Enter "SIT-2026", verify, success state shows
- [ ] Click "Continue to Portal" → navigates to `/#/platform?institute=SIT-2026`

### Live Site Testing - Prefill
- [ ] Navigate to `https://aakashchatake.github.io/nexora-demo-freeze-v2/#/access?institute=SIT-2026`
- [ ] Input field contains "SIT-2026"
- [ ] Click verify → success state
- [ ] Continue flow works

### Live Site Testing - Authentication Flow
- [ ] Complete gateway verification on live site
- [ ] Continue to platform
- [ ] Signup with new account
- [ ] Verify email (check inbox for Supabase magic link)
- [ ] Login after verification
- [ ] Dashboard shows correct institute name
- [ ] Institute context persists on refresh

### Live Site Testing - Protected Routes
- [ ] Open incognito/private window
- [ ] Navigate directly to `/#/dashboard` → redirects to `/#/platform`
- [ ] Navigate to `/#/students` → redirects to `/#/platform`
- [ ] Navigate to `/#/access` → loads normally (public route)

---

## 📝 Documentation

### WEBFLOW_LINKING.md
- [x] Document created in `docs/WEBFLOW_LINKING.md`
- [ ] Contains production links (after deployment):
  - [ ] `/#/access` for main CTA
  - [ ] `/#/access?institute=SIT-2026` for demo link
- [ ] Contains temporary fallback links (if needed)
- [ ] Integration steps for Webflow clear
- [ ] Testing instructions provided
- [ ] Switch timing documented
- [ ] Email contact configuration included
- [ ] Troubleshooting section helpful

### Supabase SQL
- [x] SQL file created at `docs/supabase_institutes.sql`
- [ ] Execution instructions in file header
- [ ] Table schema documented
- [ ] RLS policies explained
- [ ] Seed data documented
- [ ] Security considerations noted (anonymous SELECT policy)

---

## 🔍 Quality Assurance

### No Hardcoded References
- [ ] Search codebase for "Spring University" → 0 results
- [ ] Search for "spring" (case-insensitive) → only legitimate uses
- [ ] All institution data comes from useInstitute hook or Supabase
- [ ] No placeholder text contains fake institute names

### Error Handling
- [ ] Invalid institute ID shows clear error
- [ ] Network errors handled gracefully
- [ ] Loading states visible during async operations
- [ ] No console errors during normal operation
- [ ] No React warnings in dev console

### Accessibility
- [ ] All buttons have clear labels
- [ ] Form inputs have labels
- [ ] Error messages are readable
- [ ] Focus states visible on keyboard navigation
- [ ] Color contrast meets WCAG standards

### Performance
- [ ] Page loads under 3 seconds on 3G connection
- [ ] No unnecessary re-renders
- [ ] localStorage caching reduces Supabase queries
- [ ] Images/assets optimized

### Mobile Responsiveness
- [ ] Gateway page works on mobile (320px width)
- [ ] Dashboard responsive
- [ ] Quick actions stack on mobile
- [ ] Forms usable on touch devices

---

## ✅ Final Acceptance Criteria

**All items below MUST pass before feature is considered complete:**

1. [ ] /#/access route exists and loads premium dark theme page
2. [ ] Enter "SIT-2026" → shows verified "Solapur Institute of Technology"
3. [ ] Continue button routes to /#/platform?institute=SIT-2026
4. [ ] Institute context persists across navigation and page refresh
5. [ ] Missing institute context redirects to /#/access from protected pages
6. [ ] No "Spring University" or hardcoded institute names anywhere
7. [ ] Dashboard has hero section with institute name + quick actions
8. [ ] Students/Attendance/Results pages accessible and header shows institute
9. [ ] Settings includes governance section with request-change mailto
10. [ ] App runs locally (npm start) without errors
11. [ ] GitHub Pages deployment successful and HashRouter paths work
12. [ ] docs/WEBFLOW_LINKING.md exists with exact URLs
13. [ ] Supabase institutes table created and queryable
14. [ ] Code committed to feature/gateway-ui-v2 branch

---

## 📊 Testing Summary

**Date**: _____________  
**Tester**: _____________  
**Environment**: [ ] Local (npm start)  [ ] GitHub Pages (production)

**Overall Result**: [ ] ✅ PASS  [ ] ❌ FAIL

**Notes**:
_______________________________________________________________________
_______________________________________________________________________
_______________________________________________________________________

**Issues Found**:
1. _______________________________________________________________________
2. _______________________________________________________________________
3. _______________________________________________________________________

**Sign-off**: ____________________  Date: ______________

---

## 🎯 Next Steps After Acceptance

1. [ ] Merge `feature/gateway-ui-v2` to `main` branch
2. [ ] Deploy to production (npm run deploy from main)
3. [ ] Update Webflow links to `/#/access`
4. [ ] Add more institutes to Supabase table as needed
5. [ ] Monitor error logs and user feedback
6. [ ] Consider production hardening (remove anon SELECT on institutes)

---

**Document Version**: 1.0  
**Last Updated**: February 7, 2026  
**Feature**: Institutional Gateway System  
**Status**: ⏳ Testing in Progress
