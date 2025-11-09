# re-map

A geolocated photo and video organizer with interactive maps. Inspired by Apple iOS Photos, re-map allows you to organize your multimedia content by location, manually assign locations to photos taken without GPS, and add text or audio notes to each location.

## Project Structure

```
re-map/
├── backend/          # Node.js + Express API with MySQL
│   ├── config/       # Database and upload configuration
│   ├── routes/       # API endpoints (maps, markers, multimedia)
│   ├── uploads/      # File storage (photos, videos, audio)
│   └── tests/        # API tests
├── frontend/         # React + Vite application
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── styles/       # SCSS styles
│   │   └── services/     # API services
│   └── public/
└── README.md
```

## Features

- 🗺️ Interactive maps powered by Mapbox GL
- 📸 Organize photos and videos by location
- 📍 Manual location assignment for media without GPS data
- 📝 Add text notes to locations
- 🎤 Record and attach audio notes
- 🔍 Search locations with geocoding
- 📤 Drag & drop file upload
- 🎨 Clean, modern UI with SCSS styling

## Tech Stack

### Backend
- **Node.js** + **Express** - REST API
- **MySQL** - Database
- **Multer** - File upload handling
- **Jest** + **Supertest** - Testing

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Mapbox GL JS** - Interactive maps
- **React Router** - Navigation
- **SASS** - Styling

## Quick Start

### Prerequisites

- Node.js 18+
- MySQL 8.0+
- Mapbox API key

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your MySQL credentials

# Create database
mysql -u root -p < ../mapalbum_improved.sql

# Start server
npm start
# Or for development with auto-reload:
npm run dev
```

Backend will run at `http://localhost:3000`

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment variables
# Create .env file with:
# VITE_API_URL=http://localhost:3000
# VITE_MAPBOX_TOKEN=your_mapbox_token

# Start development server
npm run dev
```

Frontend will run at `http://localhost:5173`

## API Endpoints

### Maps
- `GET /maps` - Get all maps (paginated)
- `POST /maps` - Create new map
- `PUT /maps/:id` - Update map
- `DELETE /maps/:id` - Delete map

### Markers
- `GET /markers` - Get all markers (paginated)
- `POST /markers` - Create marker
- `PUT /markers/:id` - Update marker
- `DELETE /markers/:id` - Delete marker

### Multimedia
- `GET /multimedia/marker/:idMarker` - Get all media for a marker
- `POST /multimedia/upload` - Upload files (photos/videos/audio)
- `POST /multimedia/note` - Add text note
- `DELETE /multimedia/:id` - Delete media

## Development

### Run Tests

```bash
cd backend
npm test
```

### Build for Production

```bash
cd frontend
npm run build
```

## Database Schema

The application uses 4 main tables:
- `users` - User accounts
- `maps` - Photo albums/collections
- `markers` - Geographic locations on maps
- `multimedia` - Photos, videos, audio notes, and text notes

See `mapalbum_improved.sql` for complete schema.

## File Upload Support

- **Images**: JPEG, PNG, GIF, WebP, HEIC
- **Videos**: MP4, MPEG, QuickTime, AVI, WebM
- **Audio**: MP3, WAV, WebM, OGG
- **Max file size**: 100MB per file

## License

ISC

## Author

Bianca Dragan

---

Made with ❤️ for organizing life's memories
