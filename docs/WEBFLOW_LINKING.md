# WEBFLOW Linking Guide for NEXORA Platform

This document provides exact URLs for linking the NEXORA Webflow marketing site to the institutional portal (GitHub Pages deployment).

## Repository Information

- **GitHub Repository**: [aakashchatake/nexora-demo-freeze-v2](https://github.com/aakashchatake/nexora-demo-freeze-v2)
- **GitHub Pages URL**: https://aakashchatake.github.io/nexora-demo-freeze-v2/
- **Routing**: HashRouter (client-side routing with `#` prefix)

---

## Production Links (After /#/access Deployment)

**✅ RECOMMENDED: Use these links once the institutional gateway (`/#/access`) is deployed and verified on GitHub Pages.**

### Primary Call-to-Action Buttons

#### "Access Nexora Platform" Button
```
https://aakashchatake.github.io/nexora-demo-freeze-v2/#/access
```
- **Purpose**: Main entry point for institutions
- **Flow**: User lands on institutional gateway → verifies institute ID → continues to platform
- **Use Case**: Primary CTA on homepage, navigation menu

#### "Request Demo" or "Get Started" Button
```
https://aakashchatake.github.io/nexora-demo-freeze-v2/#/access?institute=SIT-2026
```
- **Purpose**: Demo link with pre-filled institute ID
- **Flow**: User lands on gateway with "SIT-2026" pre-filled → clicks verify → continues to platform
- **Use Case**: Demo requests, marketing campaigns, example institutes
- **Note**: Replace `SIT-2026` with actual institute ID for specific institutions

---

## Temporary Fallback Links (Before /#/access Deployment)

**⚠️ USE TEMPORARILY: Only use these if the institutional gateway (`/#/access`) is not yet deployed. Switch to production links above once deployed.**

### Direct Platform Access (Bypass Gateway)
```
https://aakashchatake.github.io/nexora-demo-freeze-v2/#/platform
```
- **Purpose**: Direct access to login/signup page
- **Flow**: User lands directly on login screen (no institute verification)
- **Use Case**: Quick access for testing, bypasses institute gateway

### Direct Signup (Legacy)
```
https://aakashchatake.github.io/nexora-demo-freeze-v2/#/signup
```
- **Purpose**: Direct signup page
- **Note**: This route may be deprecated in favor of unified login/signup at `/#/platform`

---

## Route Structure Overview

| Route | Purpose | Access Level |
|-------|---------|--------------|
| `/#/access` | Institutional Gateway (verify institute ID) | Public |
| `/#/platform` | Login/Signup (unified interface) | Public |
| `/#/dashboard` | Dashboard (post-login) | Protected |
| `/#/students` | Student Management | Protected |
| `/#/attendance` | Attendance Management | Protected |
| `/#/results` | Results Management | Protected |
| `/#/settings` | Settings | Protected |

---

## Integration Steps for Webflow

### Step 1: Update CTA Buttons
1. Open Webflow Designer
2. Locate primary CTA buttons:
   - "Access Nexora Platform" (homepage hero)
   - "Get Started" (navigation menu)
   - "Request Demo" (contact section)
3. Update button links:
   - **Link Type**: URL (external link)
   - **URL**: `https://aakashchatake.github.io/nexora-demo-freeze-v2/#/access`
   - **Open in**: Same tab (recommended for seamless UX)

### Step 2: Add Demo Links with Prefill
1. For demo or example institute sections:
   - Use URL with query parameter: `?institute=SIT-2026`
   - Full link: `https://aakashchatake.github.io/nexora-demo-freeze-v2/#/access?institute=SIT-2026`
2. This will pre-fill "SIT-2026" in the institute ID field

### Step 3: Test the Flow
1. **Before deployment** (temporary):
   - Test direct platform link: `/#/platform`
   - Verify login/signup works
2. **After deployment** (production):
   - Test gateway link: `/#/access`
   - Enter "SIT-2026" → Verify → Continue to Portal
   - Test prefill link: `/#/access?institute=SIT-2026`
   - Verify institute context persists on dashboard

### Step 4: Switch Timing
**When to switch from temporary to production links:**
1. Deploy updated code to GitHub Pages (`npm run deploy`)
2. Wait 2-3 minutes for GitHub Pages to update
3. Manually test `/#/access` URL in browser
4. Verify:
   - Gateway page loads with premium dark theme
   - Enter "SIT-2026" → shows "Solapur Institute of Technology"
   - Continue button navigates to `/#/platform?institute=SIT-2026`
   - Dashboard shows correct institute name in header
5. **Only after verification**: Update Webflow links to production URLs

---

## Example Institute IDs (for testing)

| Institute ID | Institute Name | Type |
|--------------|----------------|------|
| `SIT-2026` | Solapur Institute of Technology | College |

**To add more institutes:**
1. Insert into Supabase `institutes` table
2. Use format: `ABBREVIATION-YEAR` (e.g., `MIT-2026`, `UCLA-2026`)
3. Update this documentation with new IDs

---

## Email Contact Configuration

For "Contact Support" links on Webflow:

### Primary Support
```
mailto:nexora@chatakeinnoworks.com
```

### General Inquiries
```
mailto:admin@chatakeinnoworks.com
```

### Pre-filled Support Request (for institution changes)
```
mailto:nexora@chatakeinnoworks.com?subject=Institution%20Detail%20Change%20Request&body=Please%20describe%20your%20request%20here
```

---

## Troubleshooting

### Issue: Links return 404 on GitHub Pages
- **Cause**: GitHub Pages caching or deployment incomplete
- **Solution**: 
  1. Wait 3-5 minutes after deployment
  2. Clear browser cache (Cmd+Shift+R / Ctrl+Shift+R)
  3. Verify build deployed to `gh-pages` branch on GitHub

### Issue: Institute ID not recognized
- **Cause**: Institute not added to Supabase `institutes` table
- **Solution**:
  1. Open Supabase Dashboard
  2. Navigate to SQL Editor
  3. Insert new institute: 
     ```sql
     INSERT INTO institutes (institute_id, institute_name, institution_type, status)
     VALUES ('NEW-ID', 'Full Institution Name', 'College', 'active');
     ```

### Issue: Dashboard shows "Spring University" (old hardcoded name)
- **Cause**: Browser cache or old deployment
- **Solution**:
  1. Hard refresh browser
  2. Verify latest code deployed to GitHub Pages
  3. Check console for errors

---

## Deployment Checklist

Before updating Webflow links:
- [ ] Code deployed to GitHub Pages (`npm run deploy`)
- [ ] Waited 3-5 minutes for GitHub Pages propagation
- [ ] Tested `/#/access` manually in browser (incognito mode)
- [ ] Verified institute ID "SIT-2026" works
- [ ] Verified institute context persists on dashboard
- [ ] Checked all protected routes require authentication
- [ ] No hardcoded "Spring University" visible anywhere
- [ ] Support emails work (nexora@chatakeinnoworks.com)
- [ ] Supabase `institutes` table populated with seed data

---

## Version History

- **v2.0** (Current): Institutional gateway system with `/#/access` route
- **v1.0**: Direct platform access with `/#/platform`

---

## License & Attribution

- **Platform**: NEXORA v1.0
- **Developed by**: Chatake Innoworks
- **Copyright**: © 2026 Chatake Innoworks. All rights reserved.
- **Deployment**: GitHub Pages (aakashchatake/nexora-demo-freeze-v2)
