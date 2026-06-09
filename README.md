# Web Application - Next.js Workshop (Sections 3 and 4)

This is a Next.js project developed with create-next-app.

[https://nextjs.org/docs/app/api-reference/cli/create-next-app]. ## How to Run the Code

### Prerequisites

Before running the application, make sure you have the following installed:

- **Node.js**: version 18.0 or higher (download here: https://nodejs.org/)
- **npm** or **yarn** (included with Node.js)
- **Git** (to clone the repository)

### Installation

1. **Clone the repository:**

``bash
git clone <repository-url>
cd taller-next-corte-3-y-4-los-ingeniebrios
```

2. **Install dependencies:**
```bash
npm install
# or
yarn install
```

### Running in Development

To start the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be available at [http://localhost:3001](http://localhost:3001). The server will automatically reload when you make changes to the files.

### Production Build

To generate a production-optimized version:

```bash
npm run build
npm run start
```

---

## Project Evaluation Criteria

### 1. Application Mockups (20%)

The application was previously designed in Figma with a consistent visual identity across all screens. A consistent color palette was defined using the Icesi University brand colors, which is applied throughout the interface, from action buttons to backgrounds and interactive elements. The visual guidelines ensure uniformity in spacing, typography, and reusable components.

📌 **Figma Mockups:** [https://www.figma.com/design/yRYvICuvOsVzCOAHwCNzTX/IcesiConnect?node-id=0-1&t=dZDkJyba3W1jke9y-1]

### 2. User Interface (30%)

The interface was built using **modular React components** in Next.js. Each section has its own component:

- **Authentication:** Login and Register pages (`/src/app/(public)/login`, `/src/app/(public)/register`) with real-time validation of fields (institutional email, secure password, field confirmation)
- **Main Feed:** Components such as `PostCard`, `FeedFilters`, and `PostList` that allow filtering posts by category (Programming, Design, Mathematics, etc.)
- **Navigation:** Navigation bar (`Navbar`) that facilitates movement between sections
- **Filter System:** Users can filter content by category with an intuitive and responsive interface

The design is **attractive and functional** with the use of SVG icons, user avatars, experience levels displayed in each post, and custom error messages (instead of `window.alert`).

### 3. State Management (10%)

State is managed using **React Hooks** (useState). The application maintains:

- **Selected Category State** in the Feed: Users can change the filtered category, and this state is updated in real time, automatically filtering the displayed posts.
- **Authentication State:** Login and registration management with tokens stored in localStorage, including the user's email and loading status during server requests.

### 4. Functionalities (20%)

Key implemented functionalities include:

- **Authentication System:** Login with institutional email (@u.icesi.edu.co) and registration with secure password validation.

- **Question and Answer Feed:** Display of categorized posts with author information.

- **Category Filtering:** Users can explore specific content of interest (6 categories available)
- **Form Validation:** Client-side validation of required fields, email formats, password strength, and password matching

### 5. Testing (10%)

**Automated E2E tests** were implemented with Cypress to validate:

- Authentication flows (successful login and registration)
- Feed interaction and category filtering
- Responsive behavior on different screen sizes
- Error handling and validation messages

### 6. Deployment (10%)

The application is ready to be **deployed to Vercel** for the frontend, with backend integration. Deployment requirements include:

- **Frontend on Vercel:** Automatic connection to GitHub for continuous deployments
- **Backend:** Deployed on Railway or an alternative platform
- **Environment variables:** Secure configuration of API endpoints and credentials
- **Production testing:** Validation that the application functions correctly in the deployed environment

---

## Project Structure

```
src/
├── app/ # Next.js routes and layouts
├── common/ # Reusable components
└── lib/ # Utilities and configurations
```

---

## Learn More

To learn more about Next.js, check out the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - Next.js features and APIs
- [Learn Next.js](https://nextjs.org/learn) - interactive tutorial
- [Next.js GitHub Repository](https://github.com/vercel/next.js)

---