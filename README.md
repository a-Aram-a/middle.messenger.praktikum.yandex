# Nuclear Messenger 🚀


This repository contains an educational project focused on developing the frontend for a messenger application. The core challenge of this project was to build a modern, client-side rendered Single Page Application (SPA) **from scratch, without using any third-party frameworks** like React, Vue, or Angular.

The application is built on a custom component-based architecture using TypeScript, meticulously translating a professional design prototype from Figma into a functional web application.

## ✨ Features

### Core Functionality
* **User Authentication**: Complete authorization flow with registration, login, and logout functionality
* **User Profile Management**: View and edit profile data, change password, update avatar
* **Chat Management**: Create chats, view chat list, add/remove users to/from chats
* **Real-Time Messaging**: Send and receive messages in real-time using WebSocket connection
* **User Search**: Search for users by login to add them to chats
* **Client-Side Routing**: SPA routing with browser history support, URL persistence, and route protection

### Technical Features
* **Custom Component Framework**: A lightweight, reactive component framework built from the ground up using a `Block` class and an Event Bus
* **State Management**: Centralized reactive store with automatic component updates
* **Client-Side Rendering**: Pages are rendered dynamically in the browser
* **Component-Based Architecture**: The entire UI is broken down into reusable, encapsulated components (Buttons, Inputs, Forms, Modals, etc.)
* **Form Validation**: A unified validation system for all forms with regex-based rules, checks on `blur` and `submit`
* **HTTP Client**: Custom XMLHttpRequest-based HTTP client with credentials support and error handling
* **WebSocket Service**: Real-time bidirectional communication with automatic reconnection and ping/pong mechanism
* **Code Quality Assurance**: The project is fully configured with static analysis tools to ensure code consistency and quality:
  * **TypeScript** for strict type checking
  * **ESLint** with Airbnb's style guide for code analysis
  * **Stylelint** for SCSS linting, configured for BEM
  * **EditorConfig** for consistent coding styles across different editors

## 🛠️ Technologies & Tools

### Build & Development
* **Vite** - Fast build tool and development server with hot module replacement (HMR)
* **TypeScript** - Static type checking and enhanced developer experience
* **Handlebars** - Template engine for component rendering

### Styling
* **SCSS/Sass** - CSS preprocessor for maintainable styles
* **BEM Methodology** - Block-Element-Modifier naming convention for CSS classes
* **Stylelint** - SCSS code linting and style enforcement

### Code Quality
* **ESLint** - JavaScript/TypeScript linting with Airbnb configuration
* **TypeScript Compiler** - Type checking and compilation
* **EditorConfig** - Consistent coding styles across editors

### Communication & API
* **XMLHttpRequest** - Custom HTTP client for REST API communication
* **WebSocket** - Real-time bidirectional communication for messaging
* **Yandex Praktikum API** - Backend API at `ya-praktikum.tech`

### Architecture Patterns
* **Custom Component Framework** - Block-based reactive components
* **Event Bus** - Event-driven communication between components
* **State Management** - Centralized reactive store with observer pattern
* **Router** - Client-side routing with History API
* **MVC Pattern** - Controllers for business logic separation

## ✨ Live Demo

You can view the live deployment of the application:

- [Login Page](https://stunning-toffee-252476.netlify.app/)
- [Registration Page](https://stunning-toffee-252476.netlify.app/sign-up)
- [Messenger / Chat Page](https://stunning-toffee-252476.netlify.app/messenger)
- [User Profile](https://stunning-toffee-252476.netlify.app/settings)
- [Edit Profile Data](https://stunning-toffee-252476.netlify.app/profile-edit-data)
- [Change Password](https://stunning-toffee-252476.netlify.app/profile-edit-password)
- [404 Not Found Page](https://stunning-toffee-252476.netlify.app/404)
- [500 Internal Server Error Page](https://stunning-toffee-252476.netlify.app/500)

## 🎨 Figma Design

The visual design and component specifications for this project are based on the following Figma prototype:

- [**Practicum Messenger on Figma**](https://www.figma.com/design/dclLgMotSOROjYNRCruNGR/Practicum-Messenger?node-id=0-1&t=jao4AthM4dZrpS83-1)

## 🛠️ Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Ensure you have the following installed on your system:
- **Node.js**: `v22.0.0` or higher

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/a-Aram-a/middle.messenger.praktikum.yandex.git
   ```
2. Navigate to the project directory:
   ```sh
   cd your-repository-name
   ```
3. Install NPM packages:
   ```sh
   npm install
   ```

### Available Scripts

You can run the following commands from the project root:

-   **`npm run dev`**
    -   Starts the Vite development server with hot module replacement (HMR) on `http://localhost:3000`.

-   **`npm run typecheck`**
    -   Runs the TypeScript compiler to check for any type errors in the project.

-   **`npm run lint`**
    -   Runs ESLint to check TypeScript files for style and syntax errors.

-   **`npm run lint:scss`**
    -   Runs Stylelint to check SCSS files for style errors.

-   **`npm run build`**
    -   Runs `typecheck`, `lint`, and `lint:scss` sequentially, and if all checks pass, builds the project for production using Vite. The optimized output is placed in the `dist` folder.

-   **`npm run preview`**
    -   Starts a local server to preview the production build from the `dist` folder on `http://localhost:3000`.

-   **`npm run start`**
    -   A convenience script that runs `build` and then `preview`.
