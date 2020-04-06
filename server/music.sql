CREATE DATABASE IF NOT EXISTS music;
USE music;
CREATE TABLE IF NOT EXISTS `favorite_music`(
    `id` VARCHAR(30) NOT NULL,
    `albumPic` VARCHAR(150) NOT NULL,
    `songname` VARCHAR(50) NOT NULL,
    `artist` VARCHAR(30) NOT NULL,
    PRIMARY KEY(`id`)
);