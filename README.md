# Nuclear Messenger 🚀


This repository contains an educational project focused on developing the frontend for a messenger application. The core challenge of this project was to build a modern, client-side rendered Single Page Application (SPA) **from scratch, without using any third-party frameworks** like React, Vue, or Angular.

The application is built on a custom component-based architecture using TypeScript, meticulously translating a professional design prototype from Figma into a functional web application.

## ✨ Features

* **Custom Component Framework**: A lightweight, reactive component framework built from the ground up using a `Block` class and an Event Bus.
* **Client-Side Rendering**: Pages are rendered dynamically in the browser.
* **Component-Based Architecture**: The entire UI is broken down into reusable, encapsulated components (Buttons, Inputs, Forms, Layouts, etc.).
* **Form Validation**: A unified validation system for all forms, with checks on `blur` and `submit`.
* **Code Quality Assurance**: The project is fully configured with static analysis tools to ensure code consistency and quality:
  * **TypeScript** for strict type checking.
  * **ESLint** with Airbnb's style guide for code analysis.
  * **Stylelint** for SCSS linting, configured for BEM.
  * **EditorConfig** for consistent coding styles across different editors.

## ✨ Live Demo

You can view the live deployment of the pages implemented during the first sprint:

- [Login Page](https://stunning-toffee-252476.netlify.app/pages/auth/login)
- [Registration Page](https://stunning-toffee-252476.netlify.app/pages/auth/registration)
- [Chat / Home Page](https://stunning-toffee-252476.netlify.app/pages/home/home)
- [User Profile](https://stunning-toffee-252476.netlify.app/pages/profile/profile)
- [Edit Profile Data](https://stunning-toffee-252476.netlify.app/pages/profile/edit-data)
- [Change Password](https://stunning-toffee-252476.netlify.app/pages/profile/edit-password)
- [404 Not Found Page](https://stunning-toffee-252476.netlify.app/pages/errors/404)
- [500 Internal Server Error Page](https://stunning-toffee-252476.netlify.app/pages/errors/500)

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
    -   Starts the development server with hot-reloading.

-   **`npm run typecheck`**
    -   Runs the TypeScript compiler to check for any type errors in the project.

-   **`npm run lint`**
    -   Runs ESLint to check TypeScript files for style and syntax errors.

-   **`npm run lint:scss`**
    -   Runs Stylelint to check SCSS files for style errors.

-   **`npm run build`**
    -   Runs `typecheck`, `lint`, and `lint:scss` sequentially, and if all checks pass, compiles and builds the project for production in the `dist` folder.

-   **`npm run preview`**
    -   Starts a local server to preview the production build from the `dist` folder on `http://localhost:3000`.

-   **`npm run start`**
    -   A convenience script that runs `build` and then `preview`.
