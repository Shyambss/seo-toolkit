---

# SEO Toolkit

Welcome! This project is your all-in-one solution for managing SEO on any website, offering both a powerful backend API and a user-friendly frontend dashboard.

---

## Overview

The SEO Toolkit project consists of two main parts:

1. **SEO Toolkit Backend:** A robust Node.js and Express API that centralizes various SEO functionalities, from sitemap management to performance analytics and structured data.
2. **SEO Dashboard Frontend:** A React.js application that provides an intuitive graphical interface to interact with the backend, visualize SEO data, and manage website SEO settings.

---

## Backend: SEO Toolkit API

This is your all-in-one backend for managing SEO on any website. Built with **Node.js** and **Express**, it brings together everything you need—from sitemaps and meta tags to analytics and structured data—in a single, modular API.

### What’s Included

* **Sitemap Module 🗺️**
  Keep your XML sitemaps fresh and accurate. Add, update, or remove pages via REST APIs, with **MongoDB** handling the data. The module can even crawl your site using **Puppeteer** to discover new pages, and you’ll find handy links to submit your sitemap to Google and Bing.
* **Performance Module 🚀**
  Check your site’s speed and health using **Google PageSpeed Insights** and **Gemini AI**. Run checks on demand or schedule them, and store results (LCP, CLS, TTFB, and more) in **MongoDB**. Gemini AI also suggests ways to improve your site’s performance.
* **Analytics & Event Tracking 📊**
  Integrate **Google Analytics 4** and **Google Tag Manager** for deep insights. Secure authentication, traffic reports, and custom event management are all handled for you—no more wrestling with OAuth or GTM workspaces.
* **Meta Tags Module 🏷️**
  Easily manage SEO metadata (title, description, keywords) for every page. Generate keyword ideas with **Gemini AI**, and keep everything organized with timestamps and URL associations.
* **Open Graph Module 📣**
  Take control of how your links appear on social media. Update Open Graph tags, prevent duplicates, and make sure your site always looks great when shared.
* **Robots.txt Module 🤖**
  Configure your robots.txt file from a simple backend interface. Set rules for different bots, include your sitemap, and skip manual file edits.
* **Structured Data Module 🧠**
  Add **Schema.org-compliant JSON-LD structured data** to your pages. Support for articles, FAQs, testimonials, and more—helping you stand out in search results with rich snippets.

### Tech Stack 🛠️

* **Node.js & Express** for the backend
* **MongoDB** for data storage
* **Integrations:** Google PageSpeed, Gemini AI, GA4, GTM, Puppeteer

---

## Frontend: SEO Dashboard

This repository contains the frontend application for the SEO Dashboard, providing a user-friendly interface to visualize and interact with SEO data.

### Features

* **Data Visualization:** Interactive charts and graphs to display key SEO metrics (e.g., traffic, keywords, rankings).
* **User-Friendly Interface:** Intuitive navigation and clear presentation of data for easy analysis.
* **Integration with Backend:** Connects with the SEO Toolkit backend to fetch and display data.
* **Comprehensive SEO Management:** Interact with all backend modules (Sitemap, Performance, Analytics, Meta Tags, Open Graph, Robots.txt, Structured Data) through a graphical interface.

### Technologies Used

* **Frontend Framework:** React.js
* **Build Tool:** Vite
* **HTTP Client:** Axios
* **Package Manager:** npm

### Configuration

The frontend application uses environment variables for configuration. Create a `.env` file in the root of the `seo-dashboard` directory:

```dotenv
# Example .env file for frontend
VITE_REACT_APP_API_BASE_URL=http://localhost:5000/api # Replace with your backend API URL
# Note: For Vite, environment variables should be prefixed with VITE_ by default.
```

---

## Instructions to Run the SEO Toolkit

### Clone the repository

```bash
git clone https://github.com/Shyambss/seo-toolkit.git
```

### Install dependencies

Navigate to both frontend and backend directories and install dependencies:

```bash
cd seo-toolkit/seo-dashboard
npm install

cd ../seo-integrated-backend # Go back to seo-toolkit and then into seo-integrated-backend
npm install
```

### Enable Google APIs

Enable the following APIs in your Google Cloud project from `https://console.cloud.google.com/`:

* Google Analytics Data API
* Google Tag Manager API
* Gemini API

#### 🔑 Getting the Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey).

2. Sign in with your Google account and create a new API key.

3. (Optional but recommended) Link the key to a Google Cloud Project in your [Google Cloud Console](https://console.cloud.google.com/):

   * Create a new project (or use an existing one).
   * Enable the **Generative Language API** (`generativelanguage.googleapis.com`).
   * Associate your API key with this project for quota and billing management.

4. Copy the generated API key and add it to your backend `.env` file as:

   ```dotenv
   GEMINI_API_KEY=<YOUR_GEMINI_API_KEY>
   ```

5. Your backend can now make authenticated requests to the Gemini API.

### Create OAuth Credentials

1. Go to Google Cloud Console → APIs & Services → Credentials.
2. Create OAuth 2.0 Client ID (for a web application).
3. Download the `.json` file.
4. Then:

   * Rename the file to `oauth.json`.
   * Place it inside the backend config directory:
     `seo-integrated-backend/config/oauth.json`

### Set up .env files

#### 📦 Backend .env file (`seo-integrated-backend/.env`)

```dotenv
PORT=5000
MONGO_URI=<YOUR_MONGO_URI>
API_KEY=<YOUR_GOOGLE_API_KEY>
GEMINI_API_KEY=<YOUR_GEMINI_API_KEY>
GTM_ACCOUNT_ID=<YOUR_GTM_ACCOUNT_ID>
GTM_CONTAINER_ID=<YOUR_GTM_CONTAINER_ID>
GA4_MEASUREMENT_ID=<YOUR_GA4_MEASUREMENT_ID>
FRONTEND_URL="Frontend url of the SEO-Toolkit"
```

#### 💻 Frontend .env file (`seo-dashboard/.env`)

```dotenv
VITE_API_BASE_URL="backend url of the SEO-Toolkit"
```

*Replace the URLs as needed for production setup.*

### Run the project

Run frontend and backend separately:

#### In `seo-integrated-backend`

```bash
npm start
# or yarn start
```

#### In `seo-dashboard`

```bash
npm run dev
# or yarn dev
```

### ⚠️ Important Notes

* Always use the full page URL (e.g., `http://example.com/page`) when fetching SEO data for a specific page.
* The website used in Performance and Sitemap modules must be public (not localhost).
* The Performance module URL is also used by the Sitemap Generator to crawl pages.
* You can manually add pages to the Sitemap module as well.


### 🔐 Google Analytics Module

* The GA module requires initial OAuth authentication.
* After successful authentication, GA4 data will be available.

### 🧩 Integration Notes

* Use Loader components to inject:

  * Meta Tags
  * Open Graph Tags
  * Structured Data

* Inject these loaders into every page, passing the page URL as a prop.

* Add GTM scripts:

  * Paste the `<script>` tag inside the `<head>` of `index.html`.
  * Paste the `<iframe>` inside the `<body>` of `index.html`.

---

