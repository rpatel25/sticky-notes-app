# Sticky-Notes

Sticky-Notes app is a basic application with CRUD capabilities

## Architecture

This application is built using a component-based architecture with React and TypeScript. The core components are the main **App** canvas, the **StickyNote** component, and a **TrashZone** component. State management is centralized, with the `App` component acting as the **single source of truth**, holding an **array of all note objects**. This approach simplifies data handling and ensures consistency across the application.

The project follows a **unidirectional data flow**. The `App` component passes note data down to each `StickyNote` as props. When a user interacts with a note (e.g., to _move_ or _resize_ it), the `StickyNote` component uses **callback functions** to notify the parent `App` component of the change. `App` then updates its state, triggering a re-render of the necessary components. This ensures a predictable and maintainable state flow.

User interactions like dragging are handled efficiently by attaching **event listeners** to the `window` object only during the _drag operation_. For persistence, the application's state is automatically saved to the **browser's Local Storage** and reloaded on page start, providing a seamless user experience across sessions. Styling is managed with **CSS Modules** to keep component styles scoped and prevent conflicts.

## Getting Started

Follow these instructions to get the project running on your local machine.

### Prerequisites

You need to have **Node.js** and **npm (or yarn)** installed on your system.

### Installation & Running

1. **Clone** the repository (or **download** the source code).

2. **Navigate** to the project directory in your terminal:

```Bash
cd sticky-notes-app
```

3. **Install dependencies**:

```Bash
npm install
```

4. **Run** the application in development mode:

```Bash
npm start
```

This will open the app in your browser at `http://localhost:3000`. The page will automatically reload if you make changes to the code.

### Building for Production

To create an optimized production build of the app, run:

```Bash
npm run build
```

This command creates a `build` folder in the project directory with all the static files needed for deployment.
