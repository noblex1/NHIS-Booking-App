# 🔒 Git Security Fix - .env File Removal

## ⚠️ Security Issue

The `.env` file containing sensitive credentials was committed to git history:
- MongoDB connection string with password
- JWT secret key
- Brevo SMTP credentials

## ✅ What Was Fixed

### 1. Removed .env from Latest Commit
- ✅ Removed `.env` from git tracking
- ✅ Added proper `.gitignore` rules
- ✅ Committed changes without `.env`

### 2. Current Status
- ✅ `.env` is now untracked
- ✅ `.gitignore` properly configured
- ✅ Ready to push (but see warning below)

---

## ⚠️ IMPORTANT: .env Still in Git History

The `.env` file was committed in previous commits that are already pushed to GitHub:
- Commit `0559a92` - "Refactor: Replace SMS OTP with Email OTP using Brevo"
- Commit `550b706` - "backend"

**This means your credentials are still visible in the git history on GitHub!**

---

## 🔐 Required Actions

### Option 1: Rotate All Credentials (RECOMMENDED)

Since the credentials are already in git history, you should rotate them:

#### 1. MongoDB Password
1. Go to MongoDB Atlas
2. Database Access → Edit User
3. Change password
4. Update `.env` with new password

#### 2. JWT Secret
1. Generate new secret:
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```
2. Update `JWT_SECRET` in `.env`

#### 3. Brevo API Key
1. Go to https://app.brevo.com
2. Settings → SMTP & API
3. Delete old SMTP key
4. Generate new SMTP key
5. Update `BREVO_SMTP_PASS` in `.env`

#### 4. After Rotating
```bash
# Test with new credentials
node test-email.js your-email@example.com

# If everything works, you're secure!
```

---

### Option 2: Remove from Git History (ADVANCED)

**⚠️ WARNING:** This rewrites git history and requires force push!

#### Using BFG Repo-Cleaner (Recommended)

1. **Install BFG:**
   ```bash
   # Download from: https://rtyley.github.io/bfg-repo-cleaner/
   ```

2. **Backup your repo:**
   ```bash
   git clone --mirror https://github.com/noblex1/NHIS-Booking-App.git
   ```

3. **Remove .env from history:**
   ```bash
   java -jar bfg.jar --delete-files .env NHIS-Booking-App.git
   cd NHIS-Booking-App.git
   git reflog expire --expire=now --all
   git gc --prune=now --aggressive
   ```

4. **Force push:**
   ```bash
   git push --force
   ```

#### Using git filter-branch (Alternative)

```bash
# Remove .env from all commits
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

# Force push
git push origin --force --all
```

**⚠️ IMPORTANT:** After rewriting history:
- All collaborators must re-clone the repository
- Any open pull requests will be affected
- Forks will still have the old history

---

## 📋 Current Git Status

```
On branch main
Your branch is ahead of 'origin/main' by 1 commit.

Untracked files:
  .env

Changes committed:
  - Removed .env from tracking
  - Added frontend-backend integration
  - Updated documentation
```

---

## 🚀 Safe to Push Now

Your current commit is safe to push because `.env` is no longer tracked:

```bash
git push origin main
```

**However:** The old commits with `.env` are still in GitHub history!

---

## ✅ Verification Checklist

After rotating credentials:

- [ ] MongoDB password changed
- [ ] JWT secret regenerated
- [ ] Brevo API key regenerated
- [ ] `.env` updated with new credentials
- [ ] Backend tested and working
- [ ] Email service tested
- [ ] `.env` is untracked in git
- [ ] `.gitignore` includes `.env`
- [ ] Pushed changes to GitHub

---

## 🔒 Best Practices Going Forward

### 1. Never Commit Secrets
- ✅ Always check `.gitignore` before committing
- ✅ Use `git status` to verify what's being committed
- ✅ Use `.env.example` for templates (without real values)

### 2. Use Environment Variables
- ✅ Keep `.env` local only
- ✅ Use different credentials for dev/staging/production
- ✅ Store production secrets in secure vaults (AWS Secrets Manager, etc.)

### 3. Pre-commit Hooks
Consider adding a pre-commit hook to prevent committing `.env`:

```bash
# .git/hooks/pre-commit
#!/bin/sh
if git diff --cached --name-only | grep -q "^.env$"; then
    echo "Error: Attempting to commit .env file!"
    echo "Please remove it from staging: git reset HEAD .env"
    exit 1
fi
```

### 4. GitHub Secret Scanning
- GitHub will detect exposed secrets
- You may receive security alerts
- Rotate credentials immediately if alerted

---

## 📞 Need Help?

### If You See Security Alerts
1. Rotate all credentials immediately
2. Update `.env` with new values
3. Test the application
4. Mark the alert as resolved in GitHub

### If Credentials Stop Working
1. Check if MongoDB password is correct
2. Verify Brevo API key is valid
3. Ensure JWT_SECRET is set
4. Check backend logs for errors

---

## 🎯 Recommended Action

**For maximum security:**

1. ✅ Rotate all credentials (MongoDB, JWT, Brevo)
2. ✅ Update `.env` with new values
3. ✅ Test the application
4. ✅ Push the current commit
5. ✅ Monitor for any security alerts

**This is the safest and easiest approach!**

---

## 📚 Additional Resources

- [GitHub: Removing sensitive data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
- [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/)
- [Git filter-branch](https://git-scm.com/docs/git-filter-branch)
- [MongoDB Atlas Security](https://www.mongodb.com/docs/atlas/security/)

---

## ✅ Summary

**Current Status:**
- ✅ `.env` removed from latest commit
- ✅ `.gitignore` properly configured
- ✅ Safe to push current changes
- ⚠️ Old commits still contain credentials

**Recommended Action:**
- 🔐 Rotate all credentials
- ✅ Update `.env`
- ✅ Test application
- ✅ Push changes

**Your repository will be secure once credentials are rotated! 🔒**
