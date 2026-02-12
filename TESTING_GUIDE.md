# 🧪 Testing Guide - AI Chatbot Builder Fixes

## 🚀 Getting Started

### 1. Restart the Application

**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

Wait for both servers to be running:
- Backend: http://localhost:5000
- Frontend: http://localhost:3000

---

## ✅ Test Cases

### 🔐 Test 1: Enhanced Password Requirements

**Objective**: Verify strong password validation

**Steps**:
1. Navigate to http://localhost:3000/login
2. Click "Sign Up" to switch to registration
3. Fill in:
   - Name: Test User
   - Email: test@example.com
   - Password: (try each below)

**Test Cases**:
| Password | Expected Result |
|----------|----------------|
| `pass123` | ❌ Error: Must contain uppercase |
| `PASS123` | ❌ Error: Must contain lowercase |
| `Password` | ❌ Error: Must contain number |
| `Pass12` | ❌ Error: Must be 8+ characters |
| `Pass123word` | ✅ Success |

**Expected Result**: Only the last password should be accepted. Others should show clear error messages.

---

### ⏱️ Test 2: Rate Limiting

**Objective**: Verify API rate limiting prevents abuse

**Steps**:
1. Open browser developer tools (F12) → Network tab
2. Navigate to login page
3. Enter wrong credentials: `wrong@test.com` / `wrongpassword`
4. Click "Sign In" repeatedly (more than 5 times quickly)

**Expected Result**:
- First 5 attempts: Normal "Invalid credentials" error
- 6th attempt onwards: `429 Too Many Requests` error
- Error message: "Too many authentication attempts from this IP, please try again after 15 minutes"

---

### 🔄 Test 3: Loading States

**Objective**: Verify progressive loading feedback during bot creation

**Steps**:
1. Login to the application
2. Navigate to "Create Bot" page
3. Fill in bot details:
   - Name: Test Bot
   - Description: A test chatbot
4. Upload a document (any .txt, .pdf, or .docx file)
5. Click "Create & Continue"

**Expected Result**:
You should see loading messages appear in sequence:
1. "Creating your chatbot..."
2. "Uploading documents..."
3. "Setting up AI model..."
4. "Processing documents... This may take a moment."

Each message should be visible with a spinning loader.

---

### 🗑️ Test 4: File Removal

**Objective**: Verify file removal functionality works

**Steps**:
1. Go to "Create Bot" page
2. Upload 2-3 documents using drag & drop or file selector
3. Look for the "Remove" button next to each uploaded file
4. Click "Remove" on any file
5. Confirm in the dialog that appears

**Expected Result**:
- Remove button should be visible and styled (red text, trash icon)
- Confirmation dialog should appear asking "Are you sure?"
- After confirming, the file should be removed from the list
- Success toast should appear

---

### 📧 Test 5: Email Validation for Notifications

**Objective**: Verify email validation in bot settings

**Steps**:
1. Create a bot (or edit existing one)
2. In bot settings, toggle "Email Notifications" ON
3. Try entering invalid emails in the email field:
   - `notanemail`
   - `test@`
   - `@example.com`
4. Then enter a valid email: `user@example.com`
5. Click "Update Bot"

**Expected Result**:
- Invalid emails should trigger error: "Please enter a valid email address"
- Valid email should be accepted
- Field should show red asterisk (*) indicating required

---

### ⚠️ Test 6: Confirmation Dialogs

**Objective**: Verify delete confirmations appear

**Steps**:
1. Edit an existing bot that has documents
2. Scroll to "Training Documents" section
3. Click "Remove" button on any document

**Expected Result**:
- Beautiful modal dialog appears
- Shows document name in message
- Has red warning icon
- Message says "This action cannot be undone"
- Has "Delete" (red) and "Cancel" buttons
- Clicking backdrop or Cancel closes without deleting
- Clicking Delete removes the document

---

### ⏰ Test 7: Session Expiry Warning

**Objective**: Verify session warnings appear before expiry

**Note**: This test requires waiting or manually setting a short JWT expiry.

**Steps**:
1. Login to application
2. Keep the app open for 10+ minutes
3. Watch for warning in bottom-right corner

**Expected Result**:
- Warning appears when session has < 10 minutes remaining
- Shows countdown: "Your session will expire in approximately X minute(s)"
- Has yellow warning icon
- Provides "Reload Page" and "Logout" buttons
- Can be dismissed with X button

**Manual Testing** (faster):
1. Shorten JWT expiry in `backend/routes/auth.js` temporarily:
   ```javascript
   // Change from '7d' to '2m' for testing
   return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '2m' });
   ```
2. Restart backend
3. Login and wait ~1 minute
4. Warning should appear

Don't forget to change it back to `'7d'` after testing!

---

### 🔌 Test 8: Offline Detection

**Objective**: Verify offline/online detection works

**Steps**:
1. Login to application (any authenticated page)
2. Disconnect from internet:
   - Turn off Wi-Fi, OR
   - Unplug ethernet cable, OR
   - In Chrome DevTools: F12 → Network tab → Throttling dropdown → "Offline"
3. Wait 1-2 seconds
4. Reconnect internet
5. Wait for confirmation

**Expected Result**:
- **When offline**: Red banner appears at top with message "No Internet Connection - You're offline" with disconnected icon
- **When back online**: Green banner appears with "Back Online - Connection restored!" with checkmark icon
- Green banner auto-dismisses after 3 seconds
- Animations are smooth

---

### 💾 Test 9: Dashboard Caching

**Objective**: Verify dashboard data caching works

**Steps**:
1. Login to application → Dashboard
2. Open Browser DevTools (F12) → Console tab
3. Note the loading time
4. Refresh the page (F5)
5. Check console for cache messages
6. Note the faster loading time

**Expected Result**:
- First load: Fetches from API (normal speed)
- Second load (within 5 min): Loads from cache (instant)
- Console should show: "Cache read error" or cache hit
- Data should appear immediately on cached load
- After 5 minutes, should fetch fresh data again

**Verify Cache**:
1. F12 → Application tab → Local Storage → http://localhost:3000
2. Look for keys:
   - `dashboard_data`
   - `dashboard_time`
3. These should contain cached data

---

### 🏠 Test 10: No Fake Statistics

**Objective**: Verify homepage shows real features instead of fake stats

**Steps**:
1. Logout (if logged in)
2. Navigate to homepage: http://localhost:3000
3. Scroll through entire page
4. Look for any statistics or numbers

**Expected Result**:
- NO mentions of "12M+ Happy Users"
- NO mentions of "08Y+ Years Experience"  
- NO mentions of "1M+ Businesses"
- NO mentions of "$8,200 saved"
- NO mentions of "80+ Total Bots this month"

**Should See Instead**:
- "Fast Setup" - Create bots in minutes
- "Secure & Reliable" - Enterprise-grade security
- "Document Training" feature
- "Customizable" feature
- "Bot Performance" instead of fake savings
- Real feature descriptions and benefits

---

## 🎯 Quick Checklist

Use this to quickly verify all fixes:

- [ ] ✅ Strong password requirements enforced (8 chars, mixed case, number)
- [ ] ✅ Rate limiting blocks after 5 failed login attempts
- [ ] ✅ Loading messages show progress during bot creation
- [ ] ✅ File remove button works with confirmation
- [ ] ✅ Email validation works for notifications
- [ ] ✅ Confirmation dialog appears for document deletion
- [ ] ✅ Session warning appears before expiry
- [ ] ✅ Offline detection shows red banner
- [ ] ✅ Dashboard loads from cache on refresh
- [ ] ✅ Homepage shows features, not fake statistics

---

## 🐛 Troubleshooting

### Rate Limiting Not Working
- Check backend terminal for any errors
- Verify `express-rate-limit` is installed: `npm list express-rate-limit` in backend folder
- Clear browser cache and cookies
- Try from different browser or incognito mode

### Session Warning Not Appearing
- JWT tokens have 7-day expiry by default
- For testing, temporarily change expiry to 2 minutes (see Test 7)
- Ensure you're on an authenticated page (dashboard, builder, edit-bot)

### Offline Detection Not Working
- Try using Chrome DevTools method (most reliable)
- Ensure you're on an authenticated page
- Check browser console for any errors

### Cache Not Working
- Check browser console for errors
- Verify localStorage is enabled (not in private/incognito mode)
- Check Application → Local Storage in DevTools

### Files Not Removing
- Ensure you're confirming in the dialog
- Check network tab for API errors
- Verify you have permission to delete (your own bot)

---

## 📊 Expected API Response Codes

| Endpoint | Normal | Rate Limited | Invalid |
|----------|--------|--------------|---------|
| POST /api/auth/login | 200 | 429 | 401 |
| POST /api/auth/register | 201 | 429 | 400/409 |
| POST /api/chatbot/create | 201 | 429 | 400 |
| POST /api/chatbot/:id/chat | 200 | 429 | 400/404 |

---

## ✅ All Tests Passed?

If all tests pass, congratulations! 🎉 All fixes are working correctly.

If any test fails:
1. Check the FIXES_SUMMARY.md for implementation details
2. Verify both frontend and backend are running
3. Check browser and server console for errors
4. Ensure you ran `npm install` in both directories
5. Try clearing browser cache and localStorage

---

**Happy Testing! 🚀**
