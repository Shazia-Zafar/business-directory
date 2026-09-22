# Nearby & Known — Local Business Directory

A modern, high-craft web platform that connects community members with verified local businesses and empowers local business owners to publish their listings instantly.

Built with **HTML5, Custom CSS, JavaScript, jQuery, Bootstrap 5 CDN, Node.js, Express, and MongoDB**.

---

## 🌐 Live Deployments

| Component | Platform | URL / Configuration |
|---|---|---|
| **Frontend** | Netlify | `https://nearby-known-directory.netlify.app` *(or your Netlify site URL)* |
| **API Backend** | Render | `https://business-directory-api.onrender.com/api` *(or your Render web service URL)* |
| **Database** | MongoDB Atlas | Free M0 Cluster (`business-directory` database) |

---

## ✨ Features

### 1. Home Page (`index.html`)
- **Impactful Hero**: Editorial typography pairing (*Fraunces* serif display + *Inter* sans interface), call-to-action buttons (*Add Your Business* and *Browse Directory*).
- **Live Stat Counters**: Smooth numeric easing animation counting up from `0` to live metrics:
  - **Businesses Listed**
  - **Cities Covered**
  - **Categories Represented**
- **Sector Quick Explorer**: Instant category chips linking directly to filtered views in the directory.
- **Indie Community Perks**: Value highlights for neighborhood founders (Instant verification, Hyper-local reach, Direct inquiries with zero commissions).

### 2. Directory Page (`directory.html`)
- **Real-Time Search**: Instant jQuery `keyup` filtering across business names, taglines, and cities with one-click clear button (`✕`).
- **Category Filter**: Synchronized category dropdown and interactive tag chips (`Food`, `Fashion`, `Tech`, `Health`, `Education`, `Services`, `Retail`, `Other`).
- **Responsive Card Grid**: Elegant cards featuring semantic category badges, city location pins, owner attribution, and interactive hover lifts.
- **Detailed Modal**: Click any card or press Enter to trigger the modal dialog showing owner name, city, full tagline, external website link, and direct email actions.
- **Deep Linking**: Supports URL parameters (e.g. `directory.html?category=Food` or `directory.html?q=bakery`).

### 3. Business Submission (`submit.html`)
- **Split-Panel Experience**: Benefits checklist on the left and accessible form on the right.
- **Client-Side jQuery Validation**: Immediate feedback on blur and submit with visual indicators (`is-valid` / `is-invalid`).
- **Live Tagline Counter**: Real-time counter displaying character length up to the 140-character maximum.
- **API Error Mapping**: Surfaces 400 validation error messages from the backend under individual inputs.
- **Celebratory Success Banner**: Instant feedback with buttons to inspect the newly created listing in the directory or submit another.

### 4. Shared Experience
- **Theme Switching**: Built-in Dark Mode (Obsidian Luxe) and Light Mode (Alabaster Warmth) with preference persisted in `localStorage` (`bd-theme`).
- **Mobile Navigation**: Collapsible hamburger drawer ensuring a clean mobile experience on all screen sizes.
- **Render Cold-Start Detection**: Gentle status notice to inform visitors when a free-tier server is spinning up.

---

## 🚀 Local Development Setup

### Prerequisites
- **Node.js**: v18.0 or later
- **MongoDB**: Local MongoDB server or free MongoDB Atlas cluster

### 1. Clone & Setup Backend
```bash
# Navigate to the backend directory
cd server

# Install dependencies
npm install

# Configure environment variables
# Copy .env.example to .env
cp .env.example .env
```

Edit `server/.env` with your MongoDB connection string:
```env
# For Local MongoDB:
MONGODB_URI=mongodb://127.0.0.1:27017/business-directory

# Or MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/business-directory?retryWrites=true&w=majority

PORT=5000
```

### 2. Seed Sample Businesses
Populate 10 starter businesses across various categories and cities:
```bash
npm run seed
```

### 3. Start the API Server
```bash
npm start
```
The server will start at `http://localhost:5000`. You can verify by opening `http://localhost:5000/api/businesses` in your browser.

### 4. Serve the Frontend
In a new terminal window:
```bash
# From project root
npx -y serve client -l 3000
```
Open `http://localhost:3000` in your web browser.

---

## ☁️ Deployment Instructions

### Deploy API to Render (Free Tier)
1. Push this repository to GitHub.
2. Sign in to [Render](https://render.com) and click **New + > Web Service**.
3. Connect your GitHub repository.
4. Set the following settings:
   - **Name**: `business-directory-api`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. In **Environment Variables**, add:
   - `MONGODB_URI`: Your MongoDB Atlas connection string.
6. Click **Deploy Web Service**.
7. Copy the service URL (e.g. `https://business-directory-api.onrender.com`).
8. Update `client/js/config.js` with your Render URL (with `/api` suffix).

### Deploy Frontend to Netlify
1. Log in to [Netlify](https://www.netlify.com) and select **Add new site > Import an existing project**.
2. Connect your GitHub repository.
3. Configure build settings:
   - **Base directory**: *(leave empty)*
   - **Publish directory**: `client`
   - **Build command**: *(leave empty - static HTML/CSS/JS)*
4. Click **Deploy Site**.

---

## 📡 API Reference

| Method | Endpoint | Description | Query Parameters |
|---|---|---|---|
| `GET` | `/api/health` | Service uptime and health check | None |
| `GET` | `/api/businesses` | List all businesses (newest first) | `?q=searchterm`, `?category=Food` |
| `GET` | `/api/businesses/stats` | Counts of businesses, cities, categories | None |
| `POST` | `/api/businesses` | Create a new business profile | JSON body |

### POST Body Schema
```json
{
  "name": "Maple & Rye Bakery",
  "owner": "Dana Coelho",
  "category": "Food",
  "city": "Riverton",
  "tagline": "Sourdough baked fresh every morning, no exceptions.",
  "website": "https://mapleandrye.example.com",
  "email": "hello@mapleandrye.example.com"
}
```

---

## 📂 Repository Structure

```
business-directory/
├── client/
│   ├── css/
│   │   └── style.css          # Custom design system & theme tokens
│   ├── js/
│   │   ├── config.js         # API endpoint configuration
│   │   ├── directory.js      # Search, filter, modal logic
│   │   ├── home.js           # Animated stat counters
│   │   ├── shared.js         # Theme toggle & mobile navigation
│   │   └── submit.js         # Validation & POST submission
│   ├── directory.html        # Directory listing page
│   ├── index.html            # Home page & hero
│   └── submit.html           # Business submission form
├── server/
│   ├── models/
│   │   └── Business.js       # Mongoose schema and categories
│   ├── routes/
│   │   └── businesses.js     # API endpoints
│   ├── .env.example          # Environment variable template
│   ├── package.json          # Node dependencies and scripts
│   ├── README.md             # Server-specific documentation
│   ├── seed.js               # Database seeding script
│   └── server.js             # Express application entrypoint
├── .gitignore                # Git ignore configuration (.env, node_modules)
└── README.md                 # Complete project documentation
```

---

## 🛡️ License
MIT License. Created for the Neighborhood Business Initiative.
