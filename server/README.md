# Business Directory API

Express + MongoDB API backing the Local Business Directory frontend.

## Routes

| Route | What it does |
|---|---|
| `GET /api/businesses` | All businesses, newest first. `?q=bakery` searches name/tagline/city, `?category=Food` filters. |
| `GET /api/businesses/stats` | `{ total, cities, categories }` counts for the home page. |
| `POST /api/businesses` | Create a business. Returns the saved doc, or `400` with a `fields` object naming what's wrong. |

## Local setup

1. **Install dependencies**

   ```bash
   cd server
   npm install
   ```

2. **Create a free MongoDB Atlas cluster**
   - Go to https://www.mongodb.com/cloud/atlas/register and create a free (M0) cluster.
   - Under **Database Access**, create a database user with a username/password.
   - Under **Network Access**, add `0.0.0.0/0` (allow from anywhere) so Render can connect.
   - Click **Connect > Drivers**, copy the connection string. It looks like:
     `mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
   - Add a database name to the path, e.g. `.../business-directory?retryWrites=true...`

3. **Set up your `.env`**

   ```bash
   cp .env.example .env
   ```

   Paste your connection string into `MONGODB_URI`. **Never commit `.env`** — it's already in `.gitignore`.

4. **Seed sample data** (run once)

   ```bash
   npm run seed
   ```

   This clears the `businesses` collection and inserts 10 sample businesses.

5. **Run the server**

   ```bash
   npm start
   ```

   Open http://localhost:5000/api/businesses in your browser — you should see the 10 seeded businesses as JSON.

## Deploying to Render

1. Push this repo to GitHub (see the root README).
2. On https://render.com, create a **New Web Service** from your GitHub repo.
3. Set:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variable**: `MONGODB_URI` = your Atlas connection string
4. Deploy. Render gives you a URL like `https://business-directory-api.onrender.com`.
5. Paste that URL into `client/js/config.js` as `API_BASE_URL` (with `/api` appended).

Free tier sleeps after 15 minutes idle — the first request after a break can take 30-50 seconds. The frontend shows a loading state to account for this.
