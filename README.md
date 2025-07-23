**TaskFlow - Task Management Application** <br>
TaskFlow is a responsive, React-based web application designed for efficient task management and scheduling. It allows users to create, edit, delete, and filter tasks, visualize task statistics, and manage events through an integrated calendar. The application supports light and dark themes, persists data in local storage, and features a drag-and-drop interface for task reordering.
This project was developed as part of an assessment for a frontend role, showcasing proficiency in React, TypeScript, Tailwind CSS, and modern web development practices.

## Features

- **Task Management**: Create, edit, delete, and mark tasks as completed or pending with priority levels (low, medium, high) and due dates.
- **Calendar Integration**: View and manage tasks as events in day, week, or month views, with support for event categories (work, personal, breaks, meetings).
- **Task Filtering and Search**: Filter tasks by status (all, pending, completed, overdue) and search by title or description.
- **Task Statistics**: Visualize task completion status with a doughnut chart and summary cards.
- **Theme Support**: Toggle between light and dark modes, with preferences saved in local storage.
- **Responsive Design**: Optimized for both mobile and desktop devices, with a collapsible sidebar for mobile users.
- **Drag-and-Drop**: Reorder tasks via drag-and-drop functionality with support for keyboard navigation and touch devices.
- **Form Validation**: Client-side validation for task and event forms to ensure data integrity.
- **Local Storage**: Persist tasks and events in the browser's local storage for data retention.

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher) or yarn
- A modern web browser (Chrome, Firefox, Safari, etc.)

### Installation

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd taskflow
   ```

2. **Install Dependencies**
   
   Using npm:
   ```bash
   npm install
   ```
   
   Or using yarn:
   ```bash
   yarn install
   ```

3. **Start the Development Server**
   
   Using npm:
   ```bash
   npm start
   ```
   
   Or using yarn:
   ```bash
   yarn start
   ```

   The application will be available at https://taskflowdashboard.vercel.app/

4. **Build for Production**
   
   To create an optimized production build:
   ```bash
   npm run build
   ```
   
   Or:
   ```bash
   yarn build
   ```

### Running the Application

1. Open https://taskflowdashboard.vercel.app/ in your browser to access the application.
2. Navigate to the Dashboard to manage tasks, Calendar to view events, Settings to configure preferences (no functionality added), or Help & Support for FAQs and contact information.

## Architectural Decisions

### 1. React with TypeScript

**Decision**: Used React for building a component-based UI and TypeScript for type safety.

**Reason**: React's component model enables reusable, modular code, while TypeScript ensures type safety, reducing runtime errors and improving maintainability. The Task and CalendarEvent interfaces (task.ts) enforce consistent data structures across the application.

**Impact**: Enhanced developer experience with autocompletion and early error detection, but increased initial setup complexity due to TypeScript configuration.

### 2. React Router for Navigation

**Decision**: Implemented React Router (App.tsx) for client-side routing.

**Reason**: Provides seamless navigation between pages (Dashboard, Calendar, Settings, Help) without full page reloads, improving user experience. Nested routes with DashboardLayout ensure a consistent layout with a sidebar and navbar.

**Impact**: Simplifies navigation logic but requires careful management of URL parameters (e.g., filter and search queries in TaskManagementDashboard).

### 3. Context API for Theme Management

**Decision**: Used React Context API (ThemeContext.tsx) to manage light/dark theme state globally.

**Reason**: Context API allows theme state to be shared across components without prop drilling. The useThemeContext hook provides easy access to theme state and toggle functionality.

**Impact**: Simplifies theme switching but may introduce performance overhead for deeply nested components if not optimized.

### 4. Local Storage for Data Persistence

**Decision**: Utilized a custom useLocalStorage hook (useLocalStorage.ts) to store tasks and events in the browser's local storage.

**Reason**: Enables data persistence without a backend, suitable for a frontend-focused assessment. The hook abstracts local storage operations, making it reusable across components (TaskManagementDashboard, Calendar).

**Impact**: Provides a simple persistence solution but lacks server-side synchronization and scalability for multi-user scenarios.

### 5. Tailwind CSS for Styling

**Decision**: Adopted Tailwind CSS for styling, with conditional classes for light/dark themes.

**Reason**: Tailwind's utility-first approach accelerates development and ensures consistent styling. Theme-specific classes (e.g., bg-gray-900 for dark mode) are dynamically applied based on the isDark state.

**Impact**: Reduces CSS boilerplate and supports rapid prototyping, but the inline class syntax can make components verbose.

### 6. @dnd-kit for Drag-and-Drop Task Reordering

**Decision**: Implemented drag-and-drop functionality using the @dnd-kit library in TaskManagementDashboard and TaskCard components.

**Reason**: @dnd-kit provides a modern, accessible drag-and-drop solution with built-in support for keyboard navigation, touch devices, and screen readers. It offers better performance and reliability compared to the HTML5 Drag and Drop API, with consistent behavior across different browsers and devices.

**Impact**: Enhances user experience with intuitive task reordering that works seamlessly on desktop, mobile, and for users with accessibility needs. The library adds a dependency but provides robust features like collision detection, auto-scrolling, and customizable sensors for different input methods (mouse, keyboard, touch).

### 7. Chart.js for Task Visualization

**Decision**: Used Chart.js with react-chartjs-2 (TaskCompletionChart.tsx) to display a doughnut chart of task statuses.

**Reason**: Provides a clear, visual representation of task completion metrics. Theme-aware colors ensure chart readability in both light and dark modes.

**Impact**: Enhances data visualization but adds a dependency (chart.js) and requires careful configuration for responsiveness.

### 8. Calendar with Multiple Views

**Decision**: Built a calendar component (Calendar.tsx) with day, week, and month views, syncing tasks as events.

**Reason**: Offers flexible event visualization, with tasks automatically mapped to events via useEffect. Category-based coloring improves clarity.

**Impact**: Increases complexity due to dynamic rendering and event positioning logic but provides a robust scheduling feature.

### 9. Form Validation

**Decision**: Implemented client-side validation in TaskForm and EventForm with real-time feedback.

**Reason**: Ensures data integrity (e.g., required fields, valid dates, time constraints) before saving. Real-time validation improves user experience by providing immediate error feedback.

**Impact**: Enhances form usability but adds complexity to form components with state management for errors and validity.

### 10. Responsive Design with Sidebar

**Decision**: Designed a responsive layout with a collapsible sidebar (Sidebar.tsx) for mobile devices and a fixed sidebar for desktop.

**Reason**: Ensures usability across devices. The DashboardLayout component centralizes layout logic, with isSidebarOpen state controlling mobile sidebar visibility.

**Impact**: Improves accessibility but requires additional state management and CSS transitions.

## Trade-offs

### 1. Local Storage vs. Backend

**Trade-off**: Chose local storage over a backend API to focus on frontend development.

**Pros**: Simplified development, no server setup required, suitable for assessment scope.

**Cons**: Lacks multi-device synchronization, user authentication, and data scalability. Data is tied to the user's browser and could be lost if storage is cleared.

### 2. @dnd-kit vs. HTML5 Drag and Drop API

**Trade-off**: Used @dnd-kit library instead of the native HTML5 Drag and Drop API.

**Pros**: Better accessibility support with keyboard navigation and screen reader compatibility, consistent behavior across browsers and devices, built-in touch device support, more reliable event handling, and extensive customization options.

**Cons**: Adds an external dependency to the project, slightly larger bundle size, requires learning library-specific APIs and concepts.

### 3. Context API vs. State Management Library

**Trade-off**: Opted for Context API over Redux or MobX for theme and state management.

**Pros**: Built-in to React, lightweight for simple state like theme toggling, avoids additional dependencies.

**Cons**: Less scalable for complex state management, potential performance issues with frequent updates in large component trees.

### 4. Tailwind CSS vs. CSS-in-JS

**Trade-off**: Used Tailwind CSS instead of CSS-in-JS libraries like Emotion or Styled-Components.

**Pros**: Rapid styling with utility classes, consistent design, no runtime CSS generation.

**Cons**: Verbose class names in JSX, learning curve for developers unfamiliar with Tailwind, potential for class bloat.

### 5. Single-Page Application vs. Multi-Page

**Trade-off**: Built a single-page application (SPA) with React Router instead of a multi-page setup.

**Pros**: Smooth navigation, faster page transitions, suitable for dynamic task management.

**Cons**: Initial load may be slower due to bundle size, SEO challenges (mitigated by client-side focus), and increased client-side complexity.

### 6. Chart.js vs. Custom Visualization

**Trade-off**: Used Chart.js for the task completion chart instead of a custom SVG-based solution.

**Pros**: Quick implementation, robust features (tooltips, legend), theme integration.

**Cons**: Adds a dependency, less control over custom rendering compared to raw SVG or Canvas.

### 7. Static FAQs vs. Dynamic Help

**Trade-off**: Implemented static FAQs in HelpAndSupportPage instead of a dynamic help system (e.g., API-driven or chatbot).

**Pros**: Simple to implement, sufficient for assessment scope, low maintenance.

**Cons**: Limited interactivity, cannot address user-specific queries, requires manual updates for new FAQs.

## Folder Structure

```
src/
├── components/
│   ├── EmptyState.tsx
│   ├── EventForm.tsx
│   ├── FilterBar.tsx
│   ├── Navbar.tsx
│   ├── Sidebar.tsx
│   ├── TaskCard.tsx
│   ├── TaskForm.tsx
│   ├── TaskStats.tsx
│   └── TaskCompletionChart.tsx
├── context/
│   └── ThemeContext.tsx
├── hooks/
│   └── useLocalStorage.ts
├── Layout/
│   └── DashboardLayout.tsx
├── Pages/
│   ├── Calendar.tsx
│   ├── HelpAndSupportPage.tsx
│   ├── SettingsPage.tsx
│   └── TaskManagementDashboard.tsx
├── types/
│   └── task.ts
├── utils/
│   └── taskUtils.ts
└── App.tsx
```

## Dependencies

- **React**: UI library for building components.
- **TypeScript**: Type safety and improved developer experience.
- **React Router**: Client-side routing.
- **@dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities**: Modern drag-and-drop functionality with accessibility support.
- **Chart.js & react-chartjs-2**: Task visualization.
- **lucide-react**: Icons for UI elements.
- **Tailwind CSS**: Utility-first styling.

## Future Improvements

- Integrate a backend API for persistent storage and user authentication.
- Add advanced filtering (e.g., by category or priority).
- Implement real-time collaboration features for shared tasks.
- Enhance calendar with drag-and-drop event rescheduling.
- Optimize performance with memoization and lazy loading.
- Add accessibility (a11y) improvements, such as ARIA labels and keyboard navigation.
- Implement task grouping and nested subtasks.
- Add bulk operations for multiple task selection.

## Notes

- The application assumes a modern browser environment and does not support older browsers like IE11.
- The calendar uses a fixed date (2025-07-22) as the initial state for consistency in the assessment context.
- The project is designed to be standalone, with all data stored in local storage to meet the assessment's frontend focus.
- Drag-and-drop functionality is fully accessible and supports keyboard navigation and screen readers through @dnd-kit implementation.
