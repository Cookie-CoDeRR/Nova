# Frontend Updates - Study Pulse Dashboard & Progress Tracking

This document outlines the recent frontend UI/UX changes and new features added to the Nova application.

## 1. UI Polish: Avatar Dropdown
*   **Restyled Dropdown**: Updated the avatar dropdown menu in the top header (`TopHeader.tsx`) to match the application's clean, light theme.
*   **Design Details**: Removed the dark theme and applied a white background with gray borders. Added a purple accent for the "Edit Profile" button and a red accent for the "Log Out" button, improving visual hierarchy and consistency with other modals.

## 2. Interactive Dashboard Metrics & Progress Page
*   **Clickable Stat Cards**: The four key metric cards on the dashboard (Focus Time, Streak, Milestones, Accuracy) have been converted into interactive buttons with hover states (`View progress →`).
*   **New `/progress` Route**: Created a dedicated progress tracking page (`src/app/progress/page.tsx`).
*   **Dynamic Charts**: The progress page features interactive area and bar charts (using `recharts`) with a toggle between Weekly and Monthly views.
*   **Tabbed Navigation**: Clicking a stat card on the dashboard directly navigates to the `/progress` page with the corresponding stat tab active.
*   **AI Insights**: Added contextual "AI Insights" below the charts for each metric.

## 3. Automated Syllabus Synthesis from Specializations
*   **Interactive Specialization Tags**: The specialization tags under the user profile on the dashboard are now clickable buttons.
*   **Routing to Knowledge Base**: Clicking a specialization tag routes the user to the `/brain` page with the specialization name as a URL query parameter (`/brain?specialization=...`).
*   **Mock Syllabus Mapping**: Added a `SPECIALIZATION_SYLLABI` dictionary in `src/lib/constants.ts` to map specialization names to sample syllabus text.
*   **Auto-Synthesis**: Updated `BrainPage` to detect the `specialization` query parameter via `useSearchParams`. If present, it automatically populates the text area with the mapped syllabus and triggers the AI synthesis process to generate a study roadmap.
*   **Next.js Best Practices**: Wrapped the `BrainPageContent` in a `<Suspense>` boundary to ensure compatibility with Next.js static generation when using `useSearchParams`.

## 4. Navigation Visibility Management
*   **Global CSS Updates**: Ensured that floating navigation and top headers are smoothly hidden when overlapping modals (like the profile editor) are active, improving focus and reducing visual clutter.
