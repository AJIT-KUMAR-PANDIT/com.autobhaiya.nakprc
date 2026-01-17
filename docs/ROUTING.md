# Routing Setup

This project uses `react-router-dom` for client-side routing.

## Configuration

- **Router**: The app is wrapped in `<BrowserRouter>` in `src/main.jsx`.
- **Routes**: Defined in `src/App.jsx` using `<Routes>` and `<Route>` components.

## Links

Use the `<Link>` component for navigation to avoid page reloads:

```jsx
import { Link } from "react-router-dom";

<Link to="/profile">Go to Profile</Link>;
```
