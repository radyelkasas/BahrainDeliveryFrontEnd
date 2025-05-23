# Bahrain Delivery - Water Delivery Service Frontend

This is the frontend application for Bahrain Delivery, a water delivery service company in Bahrain. The application is built with React, Vite, Tailwind CSS, and other modern technologies.

## Features

- 🔐 Authentication (Login, Register, Forgot Password)
- 🌐 Multilingual support (English, Arabic)
- 📱 Responsive design (Mobile, Tablet, Desktop)
- 🎨 Modern and clean UI with animations
- 🔄 RTL support for Arabic language
- 📊 Dashboard with statistics and user profile
- 🛠️ Form validation with Zod
- 🚀 Fast development with Vite
- 🎭 Smooth animations with Framer Motion

## Prerequisites

- Node.js (v14 or later)
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/bahrain-delivery-frontend.git
cd bahrain-delivery-frontend
```

2. Install dependencies:

```bash
npm install
# or
yarn
```

3. Create a `.env` file in the root directory:

```
VITE_API_URL=http://localhost:5000/api
```

## Development

To start the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`.

## Building for Production

To build the application for production:

```bash
npm run build
# or
yarn build
```

The built files will be available in the `dist` folder.

## Project Structure

```
src/
├── assets/              # Static assets (images, fonts, etc.)
├── components/          # Reusable components
│   ├── common/          # Common components used across the application
│   └── ui/              # UI components (buttons, inputs, etc.)
├── context/             # React context providers
├── hooks/               # Custom React hooks
├── layouts/             # Page layout components
├── locales/             # Translation files
├── pages/               # Page components
│   ├── auth/            # Authentication pages
│   └── dashboard/       # Dashboard pages
├── services/            # API services
├── utils/               # Utility functions
├── App.jsx              # Main application component
├── index.css            # Global styles
├── main.jsx             # Entry point
└── routes.jsx           # Application routes
```

## Authentication

The application uses JSON Web Tokens (JWT) for authentication. When a user logs in, a token is stored in localStorage and used for subsequent API requests.

## Internationalization

The application supports both English and Arabic languages. The language can be changed from the top right corner of the application. The application also supports RTL layout for Arabic language.

## API Integration

The application connects to a RESTful API for data retrieval and manipulation. The API endpoints are defined in the `services/api.js` file.

## Form Validation

The application uses Zod for form validation. The validation schemas are defined in the `utils/validationSchemas.js` file.

## License

[MIT](LICENSE)
#   B a h r a i n D e l i v e r y F r o n t E n d  
 #   B a h r a i n D e l i v e r y _ F r o n t E n d  
 