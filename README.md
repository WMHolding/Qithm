# Qithm

> Front‑end prototype of the Qithm fitness challenges platform.

This repository contains the **front‑end** prototype for Qithm. It showcases key pages and layouts without a backing API or database connection.

---

## 📁 Repository Structure

```
qithm/                # root of the project
├── front-end/         # React app (prototype)
│   ├── public/        # static assets
│   ├── src/           # React source code
│   └── package.json   # front‑end dependencies & scripts
└── README.md          # this file
```


---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/)

### Installation & Run

1. **Clone the repository**
   ```bash
   git clone https://github.com/WMHolding/Qithm.git
   ```
2. **Enter the project folder**
   ```bash
   cd Qithm
   ```
3. **Navigate into the front‑end**
   ```bash
   cd front-end
   ```
4. **Install dependencies**
   ```bash
   npm install
   ```
5. **Start the development server**
   ```bash
   npm run dev
   ```

   By default, the React app will be available at:
   ```
   http://localhost:5137
   ```

---

## 🎯 Seperate Pages (Prototypes)

These pages are currently **not** hooked up to the main web app as it would require back‑end implementation. 
Therefore, we have provided them seperately! They can only be accessed directly by URL:

| Page              | URL Path                   | Description                           |
| ----------------- | -------------------------- | ------------------------------------- |
| Coach View        | `/coach`                   | Prototype of the coach’s view page.   |
| Coach Dashboard   | `/coach-dashboard`         | Prototype of the coach dashboard.     |
| Admin Dashboard   | `/admin`                   | Prototype of the admin dashboard.     |

> **Example:**
> ```
> http://localhost:3000/coach
> http://localhost:3000/coach-dashboard
> http://localhost:3000/admin
> ```

---



