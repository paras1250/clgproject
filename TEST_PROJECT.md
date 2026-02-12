# 🧪 Complete Project Test Guide

## 🚀 Quick Access

### Your Application URLs:
- **Frontend (Main App)**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Backend Health Check**: http://localhost:5000/health

---

## ✅ Pre-Test Checklist

### 1. Verify Servers Are Running

**Check Backend:**
- Open: http://localhost:5000/health
- Should see: `{"status":"OK","message":"Server is running","database":"Supabase connected successfully"}`

**Check Frontend:**
- Open: http://localhost:3000
- Should see: Purple-themed landing page

---

## 🧪 Testing Checklist

### Phase 1: Landing Page & Navigation

- [ ] **Landing Page**
  - Open http://localhost:3000
  - Verify purple theme is applied
  - Check all sections are visible:
    - Hero section with "10x Faster" messaging
    - Trusted by section
    - AI-driven solutions cards
    - Smart chatbot templates
    - About us section
    - Analytics dashboard preview
    - Pricing plans section

- [ ] **Navigation**
  - Click "Sign Up" or "Get Started" button
  - Verify navigation works smoothly

---

### Phase 2: Authentication

- [ ] **Registration**
  - Go to registration page
  - Create a new account with:
    - Email: `test@example.com`
    - Password: `testpassword123`
    - Name: `Test User`
  - Verify success message/redirect

- [ ] **Login**
  - Log in with created credentials
  - Verify redirect to dashboard
  - Check authentication token is saved

- [ ] **Logout**
  - Click logout button
  - Verify redirect to home page
  - Verify token is cleared

---

### Phase 3: Dashboard

- [ ] **Dashboard Display**
  - Verify dashboard loads after login
  - Check analytics cards are visible:
    - Total Bots
    - Active Bots
    - Total Chats
  - Verify text is readable and well-styled
  - Check empty state if no bots exist

- [ ] **Create Bot Button**
  - Click "Create New Bot" button
  - Verify redirect to builder page

---

### Phase 4: Chatbot Builder

- [ ] **Bot Creation Form**
  - Fill out bot creation form:
    - Bot Name: `Test Bot`
    - Bot Description: `This is a test bot`
    - Upload a document (PDF or text file)
    - Select AI model (if option available)
  - Submit the form

- [ ] **Bot Processing**
  - Verify upload success
  - Wait for processing to complete
  - Check for success message

- [ ] **Bot Preview**
  - Verify chatbot preview appears
  - Check purple theme in preview
  - Verify bot name and description display correctly

---

### Phase 5: Chatbot Interaction

- [ ] **Chat Interface**
  - Type a test message in the chat
  - Send the message
  - Verify AI response appears
  - Check message styling and readability

- [ ] **Chat History**
  - Send multiple messages
  - Verify chat history is maintained
  - Check messages are properly formatted

---

### Phase 6: Bot Management

- [ ] **Bot List**
  - Return to dashboard
  - Verify newly created bot appears in list
  - Check bot details are correct

- [ ] **Bot Actions**
  - Click on a bot card
  - Verify bot details page loads (if available)
  - Test edit functionality (if available)
  - Test delete functionality (if available)

---

### Phase 7: Analytics

- [ ] **Dashboard Analytics**
  - Verify analytics cards update with actual data
  - Check charts/graphs display correctly (if present)
  - Verify recent activity section (if present)

- [ ] **Bot Analytics**
  - Navigate to individual bot analytics (if available)
  - Verify bot-specific metrics display
  - Check data accuracy

---

## 🔍 Common Issues & Solutions

### Issue: "Cannot GET /" on Backend
**Solution**: This is normal. Backend is an API server. Use:
- `/health` for health check
- `/api/*` for API endpoints

### Issue: Dashboard Shows Empty State
**Solution**: This is normal if you haven't created any bots yet. Create a bot first.

### Issue: Authentication Errors
**Solution**: 
- Check backend is running on port 5000
- Verify Supabase is connected (check `/health` endpoint)
- Clear browser cookies and try again

### Issue: File Upload Fails
**Solution**:
- Check file size (should be reasonable)
- Verify file format is supported (PDF, TXT, etc.)
- Check backend uploads directory exists

### Issue: Chat Not Responding
**Solution**:
- Check Hugging Face API key is configured (if used)
- Verify backend logs for errors
- Check bot is properly created and processed

---

## 🎯 Expected Behavior Summary

### ✅ Working Features:
1. **Landing Page**: Purple theme, all sections visible
2. **Authentication**: Register, Login, Logout working
3. **Dashboard**: Analytics cards, bot list, readable text
4. **Bot Builder**: Create bots, upload documents
5. **Chat Interface**: Interactive chat with AI responses
6. **Analytics**: Dashboard metrics and statistics

### 🔧 Technical Stack:
- **Frontend**: Next.js (React) on port 3000
- **Backend**: Express.js on port 5000
- **Database**: Supabase (Cloud)
- **Styling**: Tailwind CSS with purple theme

---

## 📝 Test Results Template

```
Date: ___________
Tester: ___________

✅ Landing Page: Pass / Fail
✅ Authentication: Pass / Fail
✅ Dashboard: Pass / Fail
✅ Bot Builder: Pass / Fail
✅ Chat Interface: Pass / Fail
✅ Analytics: Pass / Fail

Notes:
_________________________________________________
_________________________________________________
_________________________________________________
```

---

## 🚀 Next Steps After Testing

1. **If All Tests Pass**: You're ready to deploy!
2. **If Issues Found**: Document them and check logs
3. **Backend Logs**: Check the backend terminal window
4. **Frontend Logs**: Check browser console (F12)
5. **Database**: Check Supabase dashboard for data

---

## 📞 Quick Commands

**Restart Backend:**
```bash
cd backend
npm start
```

**Restart Frontend:**
```bash
cd frontend
npm run dev
```

**Check Server Status:**
```powershell
netstat -ano | findstr ":3000 :5000"
```

**Stop Servers:**
- Press `Ctrl+C` in each server terminal window

---

Happy Testing! 🎉

