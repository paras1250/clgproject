# 🧪 Authentication Testing Guide

## ✅ Quick Test Checklist

### Test 1: Access Protected Pages Without Login
- [ ] **Dashboard Test**
  1. Open browser in Incognito/Private mode (or clear cookies)
  2. Navigate to: `http://localhost:3000/dashboard`
  3. **Expected**: Should redirect to `/login` immediately
  4. **Result**: _______________

- [ ] **Builder Test**
  1. Still in incognito mode
  2. Navigate to: `http://localhost:3000/builder`
  3. **Expected**: Should show loading, then redirect to `/login`
  4. **Result**: _______________

---

### Test 2: User Registration & Login
- [ ] **Registration**
  1. Go to: `http://localhost:3000/login`
  2. Click "Sign Up" or switch to registration form
  3. Enter:
     - Name: `Test User`
     - Email: `test@example.com`
     - Password: `testpassword123`
  4. Submit registration
  5. **Expected**: Should redirect to dashboard
  6. **Result**: _______________

- [ ] **Login**
  1. Logout (if logged in)
  2. Go to: `http://localhost:3000/login`
  3. Enter credentials:
     - Email: `test@example.com`
     - Password: `testpassword123`
  4. Submit login
  5. **Expected**: Should redirect to dashboard
  6. **Result**: _______________

---

### Test 3: Authenticated Access
- [ ] **Dashboard Access (Logged In)**
  1. While logged in, go to: `http://localhost:3000/dashboard`
  2. **Expected**: Should show dashboard with analytics cards
  3. **Expected**: Should NOT redirect to login
  4. **Result**: _______________

- [ ] **Builder Access (Logged In)**
  1. While logged in, go to: `http://localhost:3000/builder`
  2. **Expected**: Should show bot builder interface
  3. **Expected**: Should NOT redirect to login
  4. **Result**: _______________

---

### Test 4: Token Expiration Handling
- [ ] **Simulate Expired Token**
  1. While logged in, open browser DevTools (F12)
  2. Go to Application/Storage → Cookies
  3. Delete or modify the `token` cookie value
  4. Try to access: `http://localhost:3000/dashboard`
  5. **Expected**: Should redirect to login with error
  6. **Result**: _______________

---

### Test 5: API Calls with Invalid Token
- [ ] **Test API Response**
  1. With invalid token, try to create a bot or access dashboard
  2. **Expected**: API should return 401
  3. **Expected**: Frontend should redirect to login
  4. **Result**: _______________

---

## 🔍 Manual Testing Steps

### Step-by-Step Authentication Flow Test

#### 1. Test Unauthorized Access
```bash
# Open browser DevTools Console
# Navigate to: http://localhost:3000/dashboard
# Watch for:
# - Immediate redirect to /login
# - No dashboard content visible
# - Console should show redirect
```

#### 2. Test Registration Flow
```
1. Navigate to http://localhost:3000/login
2. Switch to registration tab
3. Fill form and submit
4. Verify:
   - Success message or redirect
   - Token stored in cookies
   - Redirected to dashboard
```

#### 3. Test Login Flow
```
1. Navigate to http://localhost:3000/login
2. Enter credentials
3. Submit
4. Verify:
   - Token stored in cookies
   - Redirected to dashboard
   - Dashboard loads with user data
```

#### 4. Test Protected Route Access
```
1. While logged in:
   - Access /dashboard → Should work
   - Access /builder → Should work
   - Access / → Should work (public page)
```

#### 5. Test Logout Flow
```
1. Click logout button
2. Verify:
   - Cookies removed
   - Redirected to home/login
   - Cannot access /dashboard anymore
```

---

## 🐛 Common Issues to Check

### Issue: Dashboard Still Accessible Without Login
**Check:**
- Open browser DevTools Network tab
- Clear cookies
- Navigate to /dashboard
- Should see redirect in Network tab
- Should NOT see dashboard content

### Issue: Token Not Being Validated
**Check:**
- Login successfully
- Open DevTools Console
- Modify token cookie: `document.cookie = "token=invalid"`
- Try to access dashboard
- Should get 401 error and redirect

### Issue: Content Flash Before Redirect
**Check:**
- Open /dashboard without login
- Should see loading screen only
- Should NOT see any dashboard content
- Should redirect immediately

---

## 📊 Test Results Template

```
Date: ___________
Tester: ___________

Test 1: Unauthorized Dashboard Access
Status: ✅ Pass / ❌ Fail
Notes: _________________________________

Test 2: Unauthorized Builder Access
Status: ✅ Pass / ❌ Fail
Notes: _________________________________

Test 3: Registration
Status: ✅ Pass / ❌ Fail
Notes: _________________________________

Test 4: Login
Status: ✅ Pass / ❌ Fail
Notes: _________________________________

Test 5: Authenticated Dashboard
Status: ✅ Pass / ❌ Fail
Notes: _________________________________

Test 6: Authenticated Builder
Status: ✅ Pass / ❌ Fail
Notes: _________________________________

Test 7: Token Expiration
Status: ✅ Pass / ❌ Fail
Notes: _________________________________

Overall Status: ✅ All Pass / ⚠️ Some Issues / ❌ Major Issues
```

---

## 🚀 Quick Test Commands

### Check Cookies (Browser Console)
```javascript
// Check if token exists
document.cookie.includes('token')

// View all cookies
document.cookie

// Remove token manually (for testing)
document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
```

### Test API Directly
```bash
# Test health endpoint (no auth needed)
curl http://localhost:5000/health

# Test protected endpoint (should fail without token)
curl http://localhost:5000/api/bots/list

# Test with invalid token (should return 401)
curl -H "Authorization: Bearer invalid_token" http://localhost:5000/api/bots/list
```

---

## ✅ Success Criteria

All tests pass when:
1. ✅ Unauthorized users cannot access protected pages
2. ✅ No content flash before redirect
3. ✅ Registration and login work correctly
4. ✅ Authenticated users can access protected pages
5. ✅ Invalid/expired tokens trigger automatic logout
6. ✅ API requests with invalid tokens return 401
7. ✅ Frontend handles 401 errors gracefully

---

## 🎯 Next Steps After Testing

If all tests pass:
- ✅ Authentication is secure
- ✅ Ready for further feature testing
- ✅ Can proceed with full application testing

If any tests fail:
- Check browser console for errors
- Check backend logs for issues
- Verify environment variables are set
- Check Supabase connection

---

Happy Testing! 🧪

