# Map Album Backend

Backend API for the Map Album photo/video geolocation organizer.

## Features

- Upload and manage photos, videos, and audio files
- Associate multimedia content with map markers
- Add text and audio notes to locations
- RESTful API with pagination
- File storage with automatic type detection

## Setup

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env` and update with your MySQL credentials:

```bash
cp .env.example .env
```

Edit `.env`:
```
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASS=your_password
MYSQL_SCHEMA=mapalbum
PORT=3000
NODE_ENV=development
```

### 3. Create database

Run the improved SQL schema:

```bash
mysql -u root -p < ../mapalbum_improved.sql
```

Or manually:
```sql
CREATE DATABASE mapalbum;
USE mapalbum;
SOURCE ../mapalbum_improved.sql;
```

### 4. Start the server

```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

Server will run at: `http://localhost:3000`

## API Endpoints

### Maps `/maps`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/maps?page=1&limit=10` | Get paginated maps |
| GET | `/maps/:idMap` | Get single map |
| POST | `/maps` | Create new map |
| PUT | `/maps/:idMap` | Update map |
| DELETE | `/maps/:idMap` | Delete map |

### Markers `/markers`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/markers?page=1&limit=10` | Get paginated markers |
| GET | `/markers/:idMarker` | Get single marker |
| POST | `/markers` | Create new marker |
| PUT | `/markers/:idMarker` | Update marker |
| DELETE | `/markers/:idMarker` | Delete marker |

### Multimedia `/multimedia`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/multimedia?page=1&limit=10` | Get paginated multimedia |
| GET | `/multimedia/:idMultimedia` | Get single multimedia entry |
| GET | `/multimedia/marker/:idMarker` | Get all multimedia for a marker |
| POST | `/multimedia/upload` | Upload files (photos/videos/audio) |
| POST | `/multimedia/note` | Add text note to marker |
| PUT | `/multimedia/:idMultimedia` | Update multimedia notes |
| DELETE | `/multimedia/:idMultimedia` | Delete multimedia entry |

## Upload Examples

### Upload Photos/Videos

```bash
curl -X POST http://localhost:3000/multimedia/upload \
  -F "idMarker=1" \
  -F "notes=Beautiful sunset" \
  -F "files=@photo1.jpg" \
  -F "files=@video1.mp4"
```

### Add Text Note

```bash
curl -X POST http://localhost:3000/multimedia/note \
  -H "Content-Type: application/json" \
  -d '{
    "idMarker": 1,
    "notes": "This was an amazing day!"
  }'
```

### Upload Audio Note

```bash
curl -X POST http://localhost:3000/multimedia/upload \
  -F "idMarker=1" \
  -F "notes=Voice memo" \
  -F "files=@voice_note.mp3"
```

## File Types Supported

- **Images**: JPEG, PNG, GIF, WebP, HEIC
- **Videos**: MP4, MPEG, QuickTime, AVI, WebM
- **Audio**: MP3, WAV, WebM, OGG

## File Storage

Uploaded files are stored in:
- `/backend/uploads/photos/` - Image files
- `/backend/uploads/videos/` - Video files
- `/backend/uploads/audio/` - Audio files
- `/backend/uploads/thumbnails/` - Video/image thumbnails (future)

Files are accessible via: `http://localhost:3000/uploads/photos/filename.jpg`

## Database Schema

### multimedia table (improved)

```sql
CREATE TABLE multimedia (
  idMultimedia INT PRIMARY KEY AUTO_INCREMENT,
  type ENUM('photo_file', 'video_file', 'text_note', 'audio_note'),
  idMarker INT NOT NULL,
  filename VARCHAR(255),           -- Original filename
  filepath VARCHAR(500),            -- Stored file path
  mimetype VARCHAR(100),            -- File MIME type
  filesize BIGINT,                  -- File size in bytes
  notes TEXT,                       -- Text notes
  thumbnail_path VARCHAR(500),      -- Thumbnail path (future)
  duration INT,                     -- Media duration (future)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (idMarker) REFERENCES markers(idMarker) ON DELETE CASCADE
);
```

## Testing

```bash
npm test
```

## Tech Stack

- Node.js + Express
- MySQL with mysql2
- Multer for file uploads
- CORS enabled
- Jest + Supertest for testing
