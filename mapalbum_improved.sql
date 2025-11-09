-- Improved Map Album Database Schema
-- Adds support for file uploads, notes, and audio recordings

-- Table structure for table `users`
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `idUser` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idUser`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table structure for table `maps`
DROP TABLE IF EXISTS `maps`;
CREATE TABLE `maps` (
  `idMap` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `privacy` enum('public','private') NOT NULL DEFAULT 'private',
  `idUser` int NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idMap`),
  KEY `idUser_idx` (`idUser`),
  CONSTRAINT `fk_maps_users` FOREIGN KEY (`idUser`) REFERENCES `users` (`idUser`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table structure for table `markers`
DROP TABLE IF EXISTS `markers`;
CREATE TABLE `markers` (
  `idMarker` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `latitude` decimal(9,6) NOT NULL,
  `longitude` decimal(9,6) NOT NULL,
  `idMap` int NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idMarker`),
  KEY `idMap_idx` (`idMap`),
  CONSTRAINT `fk_markers_maps` FOREIGN KEY (`idMap`) REFERENCES `maps` (`idMap`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table structure for table `multimedia` (IMPROVED VERSION)
DROP TABLE IF EXISTS `multimedia`;
CREATE TABLE `multimedia` (
  `idMultimedia` int NOT NULL AUTO_INCREMENT,
  `type` enum('photo_file','video_file','text_note','audio_note') NOT NULL,
  `idMarker` int NOT NULL,
  `filename` varchar(255) DEFAULT NULL COMMENT 'Original filename',
  `filepath` varchar(500) DEFAULT NULL COMMENT 'Relative path to stored file',
  `mimetype` varchar(100) DEFAULT NULL COMMENT 'File MIME type (image/jpeg, video/mp4, etc.)',
  `filesize` bigint DEFAULT NULL COMMENT 'File size in bytes',
  `notes` text COMMENT 'Text notes for this multimedia entry',
  `thumbnail_path` varchar(500) DEFAULT NULL COMMENT 'Path to thumbnail for videos/images',
  `duration` int DEFAULT NULL COMMENT 'Duration in seconds for video/audio files',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idMultimedia`),
  KEY `idMarker_idx` (`idMarker`),
  KEY `type_idx` (`type`),
  CONSTRAINT `fk_multimedia_markers` FOREIGN KEY (`idMarker`) REFERENCES `markers` (`idMarker`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Sample data for users
INSERT INTO `users` (`name`, `email`, `password`) VALUES
('Demo User', 'demo@mapalbum.com', '$2a$10$demo_hashed_password');

-- Sample data for maps
INSERT INTO `maps` (`name`, `description`, `privacy`, `idUser`) VALUES
('Viaje a Japón 2024', 'Fotos y videos del viaje a Japón', 'private', 1),
('Vacaciones en Europa', 'Recorrido por varias ciudades europeas', 'private', 1);
