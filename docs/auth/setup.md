# Clerk Authentication Setup

This document describes the integration of Clerk authentication into the Auto Bhaiya Partner App and the steps required to fully activate it.

## 🛠 How Authentication Was Implemented

The integration followed the official Clerk + React (Vite) pattern to ensure a secure and modern authentication flow.

### 1. SDK Installation
Installed the official Clerk React SDK:
```bash
npm install @clerk/react@latest
```

### 2. Application Wrapper
The entire application was wrapped in the `ClerkProvider` in `src/main.jsx`. This provides the authentication context to all components in the component tree.

**File:** `src/main.jsx`
- Wrapped `<BrowserRouter>` inside `<ClerkProvider afterSignOutUrl="/">`.

### 3. UI Integration
The `Header` component was updated to dynamically show authentication controls based on the user's state.

**File:** `src/components/Shared/Header.jsx`
- **Signed-out state**: Added `<SignInButton>` and `<SignUpButton>` (using modal mode for a better UX).
- **Signed-in state**: Added `<UserButton />` which provides a built-in account management menu and sign-out functionality.
- Used the `<Show>` component to handle conditional rendering of these elements.

---

## 🚀 Next Steps for Setup

To make the authentication system functional, follow these steps:

### 1. Create a Clerk Project
1. Go to the [Clerk Dashboard](https://dashboard.clerk.com/).
2. Create a new application.
3. Select **React** as your framework.

### 2. Configure Environment Variables
Clerk requires a Publishable Key to identify your application.

1. In the Clerk Dashboard, navigate to **API Keys**.
2. Copy the **Publishable Key**.
3. Create or open the `.env.local` file in the root of the project.
4. Add the key using the following exact variable name:

```bash
VITE_CLERK_PUBLISHABLE_KEY=your_publishable_key_here
```

> **Important:** The `VITE_` prefix is required for Vite to expose the variable to the browser.

### 3. Verification
1. Restart your development server (`npm run dev`).
2. Open the app in your browser.
3. You should now see the "Sign In" and "Sign Up" buttons in the header.
4. Test the sign-in flow to ensure it redirects correctly and displays the user profile button.

## 📖 Additional Resources
- [Clerk React Quickstart](https://clerk.com/docs/react/getting-started/quickstart)
- [Clerk Documentation](https://clerk.com/docs)
