# Project Setup & Restructuring

The project has been restructured to separate pages and components.

## Structure

- **src/components**: Reusable UI components.
- **src/pages**: Full page components representing routes.
- **src/app**: (Deprecated) Legacy Next.js-like structure.

## Configuration

`vite.config.js` has been updated to support `@` alias pointing to `src`.

```javascript
resolve: {
  alias: {
    '@': '/src',
  },
},
```
