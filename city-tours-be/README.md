# City Tours - Backend

A comprehensive **Spring Boot 3.4.6** backend application for managing tourism ("City Tours"). This system provides REST APIs for managing tourist districts, points of interest (POI), news, users, and geographic data with full audit trails and multilingual support.

## 📋 Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Technologies](#technologies)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Building and Running](#building-and-running)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Contributing](#contributing)
- [Future TODOs](#future-todos)

## 🎯 About the Project

The **City Tours** backend is designed to manage the complex ecosystem of tourism, providing a centralized platform for:

- **District Management**: Creation, approval, and management of tourist districts
- **Points of Interest**: Geographic and cultural points of interest within districts
- **News & Content**: Multilingual news and content management
- **User Management**: Role-based access control for administrators, redactors, and users
- **Geographic Data**: GeoJSON support for district boundaries and POI locations
- **File Management**: Upload and management of district images, logos, and documents

### Project Scope

This application serves as the backend API for tourist district management systems, enabling:

- **Government Agencies** to oversee and approve tourist districts
- **Regional Authorities** to manage local tourist attractions and content
- **Tourism Operators** to access standardized information about districts and POIs
- **Public Users** to discover tourist information through connected frontend applications

## ✨ Features

### Core Functionality
- **Multi-tenant District Management** with approval workflows
- **Hierarchical User System** (Administrator, Redactor, User roles)
- **Geographic Information System** with GeoJSON support
- **Multilingual Content** (Italian/English)
- **File Upload System** for images and documents
- **Audit Trail** with Hibernate Envers
- **RESTful API** with comprehensive endpoint coverage

### Technical Features
- **JWT Authentication** with configurable expiration
- **Profile-based Configuration** (dev, staging, production)
- **Database Auditing** with automatic change tracking
- **CORS Support** for frontend integration
- **Email Notifications** via SMTP
- **Hot Reload** development support with Spring Boot DevTools

## 🛠 Technologies

### Backend Framework
- **Java 17** - Programming language
- **Spring Boot 3.4.6** - Application framework
- **Spring Security** - Authentication and authorization
- **Spring Data JPA** - Data persistence layer
- **Hibernate + Envers** - ORM with audit trails

### Database
- **PostgreSQL** - Primary database
- **Hibernate** - ORM with CamelCase to snake_case mapping
- **Flyway/Liquibase** ready structure

### Additional Libraries
- **Lombok** - Boilerplate code reduction
- **JWT (jsonwebtoken)** - Token-based authentication
- **Jackson** - JSON processing with JSR-310 support
- **Commons FileUpload** - File handling capabilities
- **Zip4j** - Archive file processing
- **Maven** - Dependency management and build tool

## 🏗 Architecture

### Layered Architecture
```
┌─────────────────────────────────────────┐
│               Controllers               │
│          (REST API Layer)              │
├─────────────────────────────────────────┤
│                Services                 │
│           (Business Logic)              │
├─────────────────────────────────────────┤
│              Repositories               │
│            (Data Access)               │
├─────────────────────────────────────────┤
│                Models                   │
│         (JPA Entities)                 │
└─────────────────────────────────────────┘
```

### Key Design Patterns
- **Generic Base Service**: `BaseService<T, ID>` with complex multi-entity persistence
- **Generic Base Repository**: `BaseRepository<T, ID>` with common query methods
- **Base Entity Inheritance**: Common functionality across all entities
- **Controller Services**: Specialized services for controller-specific logic
- **Environment Abstraction**: Interface-based environment-specific implementations

## 🚀 Getting Started

### Prerequisites
- **Java 17** or higher
- **PostgreSQL 12+** database
- **Maven 3.6+** for dependency management
- **SMTP Server** for email functionality (optional)

### Database Setup
1. Install and start PostgreSQL
2. Create a database named `tours` or whatever you like
3. Create a user with appropriate permissions

### Environment Configuration
1. Copy the example configuration file:
   ```bash
   cp src/main/resources/application-dev.properties.example src/main/resources/application-dev.properties
   ```

2. Edit `application-dev.properties` and configure:
   ```properties
   # Database Configuration
   spring.datasource.url=jdbc:postgresql://localhost:5433/tours
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   
   # JWT Configuration
   jwtSecret=your-256-bit-secret-key-here
   jwtExpiration=86400
   
   # Email Configuration (optional)
   spring.mail.host=smtp.gmail.com
   spring.mail.username=your-email@gmail.com
   spring.mail.password=your-app-password
   
   # CORS Configuration
   cors.allowed-origins=http://localhost:3000,https://yourdomain.com
   
   # Application Configuration
   app.mail.sender=noreply@yourcompany.com
   app.upload-resource=upload
   app.host=http://localhost:3000/home
   ```

### Quick Start
1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd distretti-turistici-be
   ```

2. Configure the database and properties (see above)

3. Build and run:
   ```bash
   ./mvnw clean install
   ./mvnw spring-boot:run
   ```

4. The application will start on `http://localhost:8083/tours`

## ⚙️ Configuration

### Application Profiles

The application supports multiple environments through Spring profiles:

- **dev** (default): Development environment with full testing support
- **staging**: Pre-production environment
- **prod**: Production environment

### Profile-Specific Properties
Each environment requires its own configuration file:
- `application-dev.properties`
- `application-staging.properties`
- `application-prod.properties`

### Environment Variables
Key configuration options:
- `spring.profiles.active`: Active profile
- `server.port`: Server port (default: 8083)
- `server.servlet.context-path`: Context path (/tours)

## 🔨 Building and Running

### Development Mode
```bash
# Run with default dev profile
./mvnw spring-boot:run

# Run with hot reload (DevTools enabled by default)
./mvnw spring-boot:run -Pdev
```

### Production Build
```bash
# Build WAR file
./mvnw clean package

# Build without tests
./mvnw clean package -DskipTests

# Build with specific profile
./mvnw clean package -Pprod
```

### Testing
```bash
# Run all tests (only available in dev profile)
./mvnw test

# Run specific test class
./mvnw test -Dtest=CityToursApplicationTests
```

### Database Management
```bash
# Create database schema (handled automatically)
# Schema creation is managed by Hibernate with create strategy in dev

# Initial data is loaded from src/main/resources/import.sql
```

## 📚 API Documentation

### Base URL
```
http://localhost:8083/tours
```

### Authentication Endpoints
- `POST /auth/login` - User authentication
- `POST /auth/refresh` - Token refresh

### Public Endpoints
- `GET /district/` - List all districts
- `GET /district/approved` - List approved districts
- `GET /district/{id}` - Get district details
- `GET /poi/` - List points of interest
- `GET /news/` - List news articles

### Protected Endpoints (require `/auth/` prefix)
- `POST /auth/district/` - Create district
- `PUT /auth/district/{id}` - Update district
- `DELETE /auth/district/{id}` - Delete district
- `POST /auth/district/upload/{id}/{logo}` - Upload district files

### Default Users (from import.sql)
- **system@admin.com** / **admin@email.com** - Administrator role
- **redactor@email.com** - Redactor role
- Default password: `123`

## 🗄️ Database Schema

### Core Entities
- **districts**: Tourist district information
- **users**: System users with roles
- **roles**: User role definitions
- **pois**: Points of interest
- **news**: News articles
- **geos**: Geographic boundary data
- **cities**: cities reference data

### Key Relationships
- Districts → Users (many-to-one, redactor relationship)
- Districts → POIs (one-to-many)
- Districts → Geos (one-to-many)
- POIs → Geos (many-to-one)
- Users → Roles (many-to-one)

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Configure your development environment
4. Make your changes following the existing patterns
5. Write or update tests
6. Submit a pull request

### Code Style Guidelines
- Use Lombok annotations for boilerplate reduction
- Follow Spring Boot best practices
- Extend base classes (`BaseEntity`, `BaseService`, `BaseRepository`)
- Use constructor injection with `@RequiredArgsConstructor`
- Handle exceptions with `AppException` for consistent error responses

## 📋 Future TODOs

### High Priority
- [ ] **Enhanced Data Validation**
  - Add comprehensive field validation annotations
  - Implement custom validators for business rules
  - Add request/response DTOs with validation
  - Implement API rate limiting

- [ ] **Cloud File Storage Integration**
  - Replace local file storage with AWS S3 or similar
  - Implement CDN integration for better performance
  - Add file compression and optimization
  - Implement secure file access with signed URLs

### Medium Priority  
- [ ] **Comprehensive Testing Suite**
  - Unit tests for all service classes
  - Integration tests for API endpoints
  - Performance tests for database operations
  - End-to-end feature tests
  - Mock external dependencies

### Additional Enhancements
- [ ] API versioning strategy
- [ ] GraphQL endpoint support
- [ ] Real-time notifications with WebSockets
- [ ] Advanced search and filtering capabilities
- [ ] Caching layer implementation (Redis)
- [ ] Monitoring and metrics integration
- [ ] Docker containerization
- [ ] CI/CD pipeline setup

---

**Built with ❤️ for Tourism**

For support or questions, please open an issue in the repository.