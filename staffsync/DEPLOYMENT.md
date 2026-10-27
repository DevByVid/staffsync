# Getting Your GitHub Link and Live Demo Link

Total time: about 30–40 minutes. Everything here is free. Do the steps in order.

You will create:
1. **GitHub repo** → your GitHub link
2. **MongoDB Atlas** → the online database
3. **Render** → hosts the backend (Express API)
4. **Vercel** → hosts the frontend (React) → your Demo link

---

## Step 1 — Put the code on GitHub (≈5 min)

1. Unzip `staffsync.zip`. You'll have a `staffsync` folder containing `client`, `server`, `README.md`.
2. Go to https://github.com → sign in → click **New** (green button) → name it `staffsync` → keep it **Public** → do NOT tick "Add a README" → **Create repository**.
3. Open the `staffsync` folder in VS Code → open the terminal (Ctrl + `) and run:

```bash
git init
git add .
git commit -m "StaffSync HRM - MERN project"
git branch -M main
git remote add origin https://github.com/<your-username>/staffsync.git
git push -u origin main
```

If git asks you to log in, a browser window will open — approve it.

✅ **GitHub link:** `https://github.com/<your-username>/staffsync`

> The `.env` files are in `.gitignore`, so your passwords/secrets are not uploaded. That's correct.

---

## Step 2 — Create the database on MongoDB Atlas (≈10 min)

1. Go to https://www.mongodb.com/cloud/atlas/register and sign up (Google login is fine).
2. Create a cluster → choose the **Free (M0)** option → any region close to you (e.g. Mumbai) → **Create**.
3. **Database user:** Atlas asks you to create one. Use e.g. username `staffsync`, click **Autogenerate Secure Password** and **copy the password somewhere**. Create user.
4. **Network access:** go to *Security → Network Access* → **Add IP Address** → **Allow access from anywhere** (`0.0.0.0/0`) → Confirm. (Render's servers need this.)
5. Go to *Database → Connect → Drivers*. Copy the connection string. It looks like:
   ```
   mongodb+srv://staffsync:<db_password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   ```
6. Replace `<db_password>` with your password, and add the database name `staffsync` right after `.net/`:
   ```
   mongodb+srv://staffsync:YOURPASSWORD@cluster0.abcde.mongodb.net/staffsync?retryWrites=true&w=majority&appName=Cluster0
   ```
   This full string is your **MONGO_URI**. Keep it private.

### Load the demo accounts into Atlas
On your computer:
```bash
cd server
npm install
```
Open `server/.env` and set `MONGO_URI=` to your Atlas string from step 6. Then:
```bash
npm run seed
```
You should see "Demo data created" with the three logins. ✅

---

## Step 3 — Deploy the backend on Render (≈10 min)

1. Go to https://render.com → sign up **with GitHub**.
2. **New +** → **Web Service** → pick your `staffsync` repo.
3. Fill in:
   | Field | Value |
   |---|---|
   | Name | `staffsync-api` |
   | Root Directory | `server` |
   | Runtime | Node |
   | Build Command | `npm install` |
   | Start Command | `npm start` |
   | Instance Type | **Free** |
4. Under **Environment Variables** add:
   | Key | Value |
   |---|---|
   | `MONGO_URI` | your Atlas string |
   | `JWT_SECRET` | any long random text, e.g. `staffsync_9f8a7b6c5d4e3f2a1b0c` |
   | `JWT_EXPIRES_IN` | `7d` |
   | `CLIENT_URL` | leave empty for now (you'll fill it in Step 5) |
5. Click **Create Web Service**. Wait for "Your service is live".
6. Copy the URL at the top, e.g. `https://staffsync-api.onrender.com`. Open it in your browser — you should see **"StaffSync HRM Backend Running..."** ✅

---

## Step 4 — Deploy the frontend on Vercel (≈5 min)

1. Go to https://vercel.com → sign up **with GitHub**.
2. **Add New → Project** → import `staffsync`.
3. Settings:
   | Field | Value |
   |---|---|
   | Root Directory | click *Edit* → choose `client` |
   | Framework Preset | Vite (auto-detected) |
4. Open **Environment Variables** and add:
   | Key | Value |
   |---|---|
   | `VITE_API_URL` | `https://staffsync-api.onrender.com/api` ← your Render URL + `/api` |
5. Click **Deploy**. When done, you'll get a URL like `https://staffsync-xyz.vercel.app`.

✅ **Demo link:** `https://staffsync-xyz.vercel.app`

---

## Step 5 — Lock CORS to your frontend (1 min, recommended)

Back in Render → your service → **Environment** → set
`CLIENT_URL` = `https://staffsync-xyz.vercel.app` (your Vercel URL, no trailing slash) → **Save** (it redeploys automatically).

---

## Step 6 — Test before submitting

Open your Vercel link:
1. Click **Login / Register** → click the **HR** demo button → Login → you land on the HR Dashboard with sample data.
2. Log out, try **Manager** and **Employee** too.
3. As Employee: Attendance tab → **Check In**. Leaves tab → apply for a leave.
4. As Manager or HR: approve that leave. ✅

Then put the two links into your project's README (top section) and push:
```bash
git add README.md
git commit -m "Add demo links"
git push
```

---

## What to paste in the submission form

- **Demo link:** `https://staffsync-xyz.vercel.app`
- **GitHub link:** `https://github.com/<your-username>/staffsync`

Optional note for your mentor:
> Demo logins — HR: hr@staffsync.com / hr123456 · Manager: manager@staffsync.com / manager123 · Employee: employee@staffsync.com / employee123. The backend is on Render's free tier, so the first request may take ~50 seconds to wake up.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Login says "Network Error" | `VITE_API_URL` on Vercel is wrong (must end in `/api`) — fix it, then *Deployments → Redeploy*. Or the backend is waking up; wait 50s and retry. |
| "Not allowed by CORS" | `CLIENT_URL` on Render doesn't exactly match your Vercel URL (check https, no trailing `/`). |
| Render logs: "MongoDB connection error" | Wrong password in `MONGO_URI`, or you skipped Network Access → `0.0.0.0/0`. |
| Refreshing `/hr` on Vercel shows 404 | Make sure `client/vercel.json` is in the repo. |
| `npm run dev` fails in client with a Node version error | Install Node.js 20 LTS or newer from nodejs.org. |
| Login fails with correct demo password | You haven't run `npm run seed` against the Atlas database (Step 2). |
