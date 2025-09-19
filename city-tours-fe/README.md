# City Tours Frontend

A modern Angular web application for managing and exploring city tours, districts, points of interest, and news content. This application provides both public-facing features for tourists and administrative tools for content management.

## 📋 Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Development](#development)
- [Building](#building)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## 🌟 About the Project

The City Tours Frontend is a comprehensive Angular application designed to showcase city districts, points of interest (POIs), and manage tourism-related content. The application serves multiple user roles and provides both public and administrative interfaces.

### Project Scope

- **Public Interface**: Browse districts, POIs, news, and tour information
- **Administrative Panel**: Content management for districts, POIs, news, and users
- **Interactive Maps**: Leaflet-based mapping with marker clustering
- **Multilingual Support**: Internationalization with ngx-translate
- **Content Management**: Rich text editing with CKEditor
- **User Authentication**: JWT-based authentication system
- **Responsive Design**: Mobile-first approach with Angular Material and Bootstrap

### Key Functionality

- **District Management**: Create, edit, and manage city districts
- **POI Management**: Handle points of interest with location data
- **News System**: Comprehensive news management with rich content
- **User Management**: Role-based user administration
- **Search Functionality**: Advanced search across content types
- **Interactive Maps**: Leaflet integration with clustering support
- **Content Publishing**: Deploy and manage published content

## ✨ Features

### Public Features
- Browse city districts and points of interest
- View detailed information about locations
- Read news and updates
- Interactive map navigation
- Search functionality
- Responsive design for all devices

### Administrative Features
- District and POI management
- News creation and editing with rich text editor
- User management with role-based access
- Content moderation and publishing
- Search and filtering tools
- Profile management
- Deployment controls

### Technical Features
- JWT authentication
- Internationalization (i18n)
- Lazy loading for performance
- Interactive maps with Leaflet
- Material Design components
- Rich text editing
- Image upload and management
- Real-time content updates

## 🛠 Technology Stack

### Core Framework
- **Angular 12.0.5** - Main framework
- **TypeScript 4.2.3** - Programming language
- **RxJS 6.6.0** - Reactive programming

### UI/UX
- **Angular Material 12.1.4** - Material Design components
- **Bootstrap 4.6.2** - CSS framework
- **Angular Flex Layout 12.0.0** - Layout system
- **FontAwesome** - Icon library

### Maps & Location
- **Leaflet 1.7.1** - Interactive maps
- **Leaflet MarkerCluster** - Marker clustering
- **Leaflet Editable** - Map editing capabilities

### Rich Content
- **CKEditor 5** - Rich text editing
- **ng-lazyload-image** - Lazy image loading
- **ngx-owl-carousel-o** - Image carousels

### Utilities
- **ngx-translate** - Internationalization
- **Moment.js** - Date manipulation
- **Flatpickr** - Date picker
- **ngx-ui-loader** - Loading indicators

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js**: Version 16.16.0 (recommended)
- **Yarn**: Package manager
- **Angular CLI**: Version 12.0.5 or compatible

### Verify Installation

```bash
node --version    # Should output v16.16.0
npm --version     # Should output compatible version
ng --version      # Should output Angular CLI 12.x.x
```

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd city-tours-fe
```

### 2. Install Dependencies

Using Yarn:
```bash
yarn install
```

### 3. Environment Configuration

Copy the example environment files and configure them for your setup:

```bash
# Create environment files based on examples
cp src/environments/environment.ts src/environments/environment.local.ts
```

## ⚙️ Configuration

### Environment Files

The application uses different environment configurations for different deployment stages:

#### `src/environments/environment.ts` (Default/Development)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8083/tours'
};
```

#### `src/environments/environment.dev.ts` (Development Server)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://127.0.0.1:8080/tours'
};
```

#### `src/environments/environment.prod.ts` (Production)
```typescript
export const environment = {
  production: true,
  apiUrl: 'http://127.0.0.1:8080/tours'
};
```

### Configuration Options

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `production` | Enable production mode | `false` |
| `apiUrl` | Backend API base URL | `http://localhost:8083/tours` |

### API Configuration

Make sure your backend API is running and accessible at the configured URL. The application expects the following API endpoints:

- Authentication endpoints
- District management endpoints
- POI management endpoints  
- News management endpoints
- User management endpoints
- File upload endpoints

## 🔧 Development

### Development Server

Start the development server:

```bash
yarn start
# or
ng serve
```

The application will be available at `http://localhost:4200`. The app will automatically reload when you make changes to the source files.

### Development with Specific Environment

```bash
# Development environment
ng serve --configuration=development

# Dev server environment  
ng build --configuration=dev
ng serve --configuration=dev
```

### Development Features

- Hot module replacement
- Source maps enabled
- Debugging tools
- Live reload
- Development-specific configurations

## 🏗 Building

### Development Build

```bash
ng build
```

### Production Build

```bash
ng build --configuration=production
```

### Environment-Specific Builds

```bash
# Development build
ng build --configuration=dev

# Staging/Testing build
ng build --configuration=staging

# Production build
ng build --configuration=production
```

### Build Configurations

The application supports multiple build configurations:

- **development**: Source maps, no optimization
- **dev**: Development server configuration
- **staging**: Staging/testing environment
- **production**: Optimized, minified build

### Build Output

Build artifacts will be stored in the `dist/tours/` directory. The built files are optimized for production and can be deployed to any web server.

### Build Optimization

Production builds include:
- Dead code elimination
- Minification
- Bundle optimization
- Asset optimization
- Cache busting with file hashing

## 🧪 Testing

### Unit Tests

Run unit tests with Karma:

```bash
npm run test
# or
ng test
```

### Test Configuration

- **Testing Framework**: Jasmine
- **Test Runner**: Karma
- **Browser**: Chrome (headless available)
- **Coverage**: Included in test reports

### Writing Tests

Tests are located alongside their corresponding components and services:
- `*.spec.ts` files contain unit tests
- Follow Angular testing best practices
- Mock external dependencies
- Test components, services, and utilities

## 📁 Project Structure

```
city-tours-fe/
├── src/
│   ├── app/
│   │   ├── _guards/              # Route guards (auth, role, active)
│   │   ├── _interceptors/        # HTTP interceptors (JWT, language, error)
│   │   ├── dto/                  # Data transfer objects
│   │   ├── enum/                 # Enumerations
│   │   ├── header/               # Header component
│   │   ├── model/                # Data models
│   │   ├── modules/              # Feature modules
│   │   ├── pages/                # Page components
│   │   │   ├── district-home/    # District management
│   │   │   ├── home/             # Public home pages
│   │   │   ├── news/             # News management
│   │   │   ├── poi-home/         # POI management
│   │   │   ├── profile/          # User profiles
│   │   │   ├── search/           # Search functionality
│   │   │   └── user/             # User management
│   │   ├── shared/               # Shared utilities and services
│   │   ├── app-routing.module.ts # Main routing configuration
│   │   ├── app.component.*       # Root component
│   │   └── app.module.ts         # Main module
│   ├── assets/                   # Static assets
│   │   ├── css/                  # Custom styles
│   │   ├── img/                  # Images
│   │   └── themes/               # Angular Material themes
│   ├── environments/             # Environment configurations
│   ├── favicon.ico              # Favicon
│   ├── index.html               # Main HTML file
│   ├── main.ts                  # Application bootstrap
│   ├── polyfills.ts             # Browser polyfills
│   ├── styles.css               # Global styles
│   └── test.ts                  # Test configuration
├── angular.json                  # Angular CLI configuration
├── karma.conf.js                # Test runner configuration
├── package.json                 # Dependencies and scripts
├── tsconfig.json                # TypeScript configuration
├── tsconfig.app.json            # App-specific TypeScript config
├── tsconfig.spec.json           # Test-specific TypeScript config
├── yarn.lock                    # Dependency lock file
└── README.md                    # This file
```

### Key Directories

- **`src/app/pages/`**: Main application pages and features
- **`src/app/shared/`**: Reusable components, services, and utilities
- **`src/app/_guards/`**: Route protection and access control
- **`src/app/_interceptors/`**: HTTP request/response handling
- **`src/assets/`**: Static files, images, and custom styles
- **`src/environments/`**: Environment-specific configurations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow Angular style guide
- Write unit tests for new features
- Update documentation as needed
- Follow existing code patterns and conventions
- Use meaningful commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### MIT License Summary

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files, to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software.

---

## 📞 Support

For support and questions:

- Create an issue in the repository
- Check existing documentation
- Review Angular and related library documentation

## 🔄 Version History

- **v0.0.1** - Initial version
  - Basic Angular setup
  - Core functionality implementation
  - District and POI management
  - News system
  - User authentication

---

**Built with ❤️ using Angular and modern web technologies.**
