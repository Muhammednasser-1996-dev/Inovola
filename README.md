# Inovola Expense Tracker

## Overview of the Architecture and Structure

This Angular app is structured for maintainability, scalability, and modern best practices:

- **src/app/**
  - **dashboard/**: Dashboard component for listing, filtering, and summarizing expenses.
  - **add-expense/**: Add Expense component with a modern form, drag-and-drop receipt upload, and category selection.
  - **services/**
    - `expense.service.ts`: Handles local storage CRUD and pagination.
    - `currency.service.ts`: Integrates with a public currency conversion API.
  - **model/**
    - `expense.model.ts`: Defines the `Expense` interface.
  - **app.routes.ts**: Sets up lazy-loaded routes for dashboard and add-expense.
  - **app.config.ts**: App-wide configuration.
- **src/assets/**: Contains translation files for i18n (English and Arabic).
- **src/styles.scss**: Global styles, variables, mixins, and RTL support.

## How API Integration Was Implemented

- **Currency Conversion**:  
  - Implemented in `currency.service.ts` using Angular's `HttpClient`.
  - Fetches rates from [open.er-api.com](https://open.er-api.com/v6/latest/USD).
  - Caches rates in memory for the session.
  - All expenses are stored with both their original currency and the USD equivalent.

## Pagination Strategy (Local vs. API)

- **Local Pagination**:  
  - All expenses are stored in browser local storage.
  - Pagination is handled in `expense.service.ts` by slicing the array of expenses.
  - The dashboard requests a page at a time, with filtering applied before pagination.
  - No server/API pagination is used, as all data is local.

## UI Screenshots

> **Add screenshots here!**  
> You can use your OS's screenshot tool and save images in the `src/assets/` or `public/` folder, then reference them in the README:

```
![Dashboard](src/assets/dashboard-screenshot.png)
![Add Expense](src/assets/add-expense-screenshot.png)
```

## Trade-offs or Assumptions

- **Local Storage**: Chosen for simplicity and offline support. Not suitable for multi-user or large-scale use.
- **API Integration**: Only for currency rates; all expense data is local.
- **Pagination**: Local only, as there's no backend.
- **Security**: No authentication or backend validation.
- **Receipts**: Images are stored as base64 URLs in local storage, which may not scale for many/large images.
- **Design**: UI is responsive and RTL-aware, but may need further tweaks for full accessibility.

## How to Run the Project

1. **Install dependencies**:
   ```
   npm install
   ```
2. **Run the app**:
   ```
   npm start
   ```
   The app will be available at `http://localhost:4200`.

3. **Run tests**:
   ```
   npm test
   ```

## Known Bugs or Unimplemented Features

- **Known Bugs**:
  - Large receipt images may slow down the app due to local storage limits.
  - Currency rates are cached for the session; no manual refresh.
  - No user authentication or multi-user support.
- **Unimplemented Features**:
  - No backend/API for expense data.
  - No export/import of expenses.
  - No advanced analytics or charts.
  - No PWA install prompt (offline works via local storage only).