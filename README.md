# City Tours - Full Stack Application

A comprehensive tourism management platform built with **Spring Boot** backend and **Angular** frontend for managing city districts, points of interest, news, and user administration.

## 🌟 Overview

This full-stack application enables tourism authorities, content managers, and the public to interact with city tourism data through a modern web interface backed by a robust REST API.

### Architecture
```
┌─────────────────────────────────────┐
│        Angular Frontend             │
│    (city-tours-fe)                  │
│  Port: 4200 | Node.js 16.16.0       │
├─────────────────────────────────────┤
│            REST API                 │
├─────────────────────────────────────┤
│      Spring Boot Backend           │
│    (city-tours-be)                  │
│  Port: 8083 | Java 17               │
├─────────────────────────────────────┤
│       PostgreSQL Database          │
│         Port: 5432                  │
└─────────────────────────────────────┘
```

## 🎯 Key Features

### 🏛️ District Management
- Create, edit, and approve tourist districts
- Geographic boundary management with GeoJSON
- Image and logo uploads
- Multi-level approval workflows

### 📍 Points of Interest (POI)
- Interactive map-based POI management
- Location data with coordinates
- Rich content descriptions
- Category and type classification

### 📰 News & Content
- Rich text editor (CKEditor) for content creation
- Multilingual support (Italian/English)
- Content moderation and publishing
- News categorization and filtering

### 👥 User Management
- Role-based access control (Admin, Redactor, User)
- JWT authentication system
- Profile management
- Audit trails for all changes

### 🗺️ Interactive Maps
- Leaflet-based mapping with marker clustering
- District boundary visualization
- POI location mapping
- Editable geographic features

## 🛠️ Technology Stack

### Backend (`city-tours-be/`)
- **Framework**: Spring Boot 3.4.6
- **Language**: Java 17
- **Database**: PostgreSQL
- **Security**: Spring Security + JWT
- **ORM**: Hibernate + Envers (auditing)
- **Build**: Maven

### Frontend (`city-tours-fe/`)
- **Framework**: Angular 12.0.5
- **Language**: TypeScript 4.2.3
- **UI**: Angular Material + Bootstrap 4.6.2
- **Maps**: Leaflet 1.7.1
- **Rich Text**: CKEditor 5
- **Build**: Angular CLI + Yarn

## 🚀 Quick Start

### Prerequisites
- **Java 17** or higher
- **Node.js 16.16.0** (recommended)
- **PostgreSQL 12+**
- **Maven 3.6+**
- **Angular CLI 12.x**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### MIT License Summary
- ✅ Commercial use allowed
- ✅ Modification allowed
- ✅ Distribution allowed
- ✅ Private use allowed
- ❌ No liability
- ❌ No warranty

## 📞 Support

For support:
- Check individual README files in `city-tours-be/` and `city-tours-fe/`
- Open issues in the repository
- Review API documentation

---

**🌟 A complete tourism management solution built with modern technologies**