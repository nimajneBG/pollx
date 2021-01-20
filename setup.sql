SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;

CREATE DATABASE IF NOT EXISTS `pollx` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `pollx`;

DROP TABLE IF EXISTS `polls`;
CREATE TABLE `polls` (
    `title` text COLLATE utf8mb4_unicode_ci NOT NULL,
    `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
    `id` int(11) NOT NULL,
    `public` tinyint(1) NOT NULL,
    `answers` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`answers`)),
    `email` text COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `results`;
CREATE TABLE `results` (
    `poll_id` int(11) NOT NULL,
    `opt0` int(11) NOT NULL,
    `opt1` int(11),
    `opt2` int(11),
    `opt3` int(11),
    `opt4` int(11),
    `opt5` int(11),
    `opt6` int(11),
    `opt7` int(11),
    `opt8` int(11),
    `opt9` int(11)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `users` (
    `id` int(11) NOT NULL,
    `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
    `email` text COLLATE utf8mb4_unicode_ci NOT NULL,
    `password` text COLLATE utf8mb4_unicode_ci NOT NULL,
    `voted_polls` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`voted_polls`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


ALTER TABLE `polls`
    ADD PRIMARY KEY (`id`);

ALTER TABLE `results`
    ADD PRIMARY KEY (`poll_id`);

ALTER TABLE `users`
    ADD PRIMARY KEY (`id`);

ALTER TABLE `polls`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

ALTER TABLE `users`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;


COMMIT;
