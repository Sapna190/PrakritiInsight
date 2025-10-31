# AyurvediCure - Quick Start Cheat Sheet 🚀

## One-Line Commands (PowerShell)

### Start Everything
```powershell
# Terminal 1: MongoDB (if not auto-started)
mongod

# Terminal 2: Node Backend
cd backend; npm start

# Terminal 3: Python ML Service (Optional)
python app.py
```

### Access URLs
- **Main App**: http://localhost:5000
- **Sign Up**: http://localhost:5000/index.html
- **Sign In**: http://localhost:5000/sign-in.html
- **Dashboard**: http://localhost:5000/user-login.html
- **Profile**: http://localhost:5000/user-profile.html
- **Settings**: http://localhost:5000/user-settings.html

---

## Common Tasks

### Check if MongoDB is running
```powershell
mongo
# or
mongosh
```

### View MongoDB data
```powershell
mongosh
use ayurvedicure
db.users.find().pretty()
```

### Check backend logs
Look at terminal where `npm start` is running

### Clear localStorage (Browser Console)
```javascript
localStorage.clear()
// or specific items
localStorage.removeItem('authToken')
localStorage.removeItem('userEmail')
```

### Check if logged in (Browser Console)
```javascript
console.log(localStorage.authToken)
```

---

## API Quick Reference

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"test123"}'
```

### Login User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

### Get Profile (replace TOKEN)
```bash
curl http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer TOKEN"
```

### Update Profile
```bash
curl -X PUT http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Name","phone":"1234567890"}'
```

---

## Troubleshooting One-Liners

### Kill process on port 5000
```powershell
# Find PID
netstat -ano | findstr :5000
# Kill it (replace PID)
taskkill /PID <PID> /F
```

### Restart backend
```powershell
cd backend; npm start
```

### Reinstall dependencies
```powershell
cd backend; rm -r node_modules; npm install
```

### Reset database
```powershell
mongosh
use ayurvedicure
db.users.deleteMany({})
```

---

## Quick Testing Flow

1. **Start Backend**: `cd backend; npm start`
2. **Open Browser**: http://localhost:5000
3. **Sign Up**: Enter name, email, password
4. **Sign In**: Use same email/password
5. **View Profile**: Navigate to Profile page
6. **Edit Profile**: Go to Settings, update fields
7. **Logout**: Click logout link

---

## Environment Setup (.env)
```env
MONGODB_URI=mongodb://localhost:27017/ayurvedicure
JWT_SECRET=your_secret_key_here
PORT=5000
```

---

## Protected vs Public Pages

### Protected (Require Login)
- user-login.html
- user-profile.html
- user-settings.html
- ai-chat-bot.html
- human-doctor.html
- prakriti-analysis.html
- prakriti-result.html

### Public (No Login Required)
- index.html (Sign Up)
- sign-in.html (Login)
- about-us.html
- blogs.html
- contact.html
- faq.html
- documentation.html

---

## Default Credentials for Testing
Create via Sign Up page:
- **Email**: test@ayurvedic.com
- **Password**: Test@123
- **Name**: Test User

---

## Package Versions
- **Node.js**: v14+
- **MongoDB**: v4.4+
- **Express**: 5.1.0
- **Mongoose**: 8.19.2
- **Python**: 3.8+
- **Flask**: Latest

---

## File Locations
- **User Model**: `backend/models/User.js`
- **Auth Routes**: `backend/routes/auth.js`
- **Auth Middleware**: `backend/middleware/auth.js`
- **Auth Helper**: `js/auth.js`
- **Main Server**: `backend/server.js`
- **Environment**: `backend/.env`

---

## Quick Debug

### "Cannot connect to MongoDB"
→ Check MongoDB is running: `mongosh`

### "User already exists"
→ Email already registered, use different email or sign in

### "Session expired"
→ Token expired (1 hour), login again

### "Failed to fetch profile"
→ Check token in localStorage, backend running, network tab

### Page stuck on loading
→ Check browser console, check backend logs

---

## Pro Tips

1. **Keep terminals open**: Backend, MongoDB, Python (if needed)
2. **Check console**: Browser console shows client errors
3. **Check terminal**: Backend terminal shows server errors
4. **Use Network tab**: See API requests/responses
5. **Clear localStorage**: If stuck, clear tokens and re-login

---

**Quick Help**: See SETUP_GUIDE.md for detailed documentation

---

**Made with ❤️ by KryptoEtox Team**
