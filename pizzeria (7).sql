-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: 16.09.2025 klo 17:02
-- Palvelimen versio: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pizzeria`
--

-- --------------------------------------------------------

--
-- Rakenne taululle `aineosat`
--

CREATE TABLE `aineosat` (
  `AinesosaID` smallint(5) UNSIGNED NOT NULL,
  `Nimi` varchar(100) NOT NULL,
  `Tyyppi` enum('pizza','extra','both') DEFAULT 'both',
  `Hinta` decimal(6,2) DEFAULT 0.00,
  `Yksikko` varchar(20) DEFAULT 'kpl',
  `Kuvaus` varchar(200) DEFAULT NULL,
  `Kuva` varchar(255) DEFAULT NULL,
  `Aktiivinen` tinyint(1) DEFAULT 1,
  `Jarjestys` smallint(5) UNSIGNED DEFAULT 999
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Vedos taulusta `aineosat`
--

INSERT INTO `aineosat` (`AinesosaID`, `Nimi`, `Tyyppi`, `Hinta`, `Yksikko`, `Kuvaus`, `Kuva`, `Aktiivinen`, `Jarjestys`) VALUES
(1, 'Mozzarella', 'pizza', 0.00, 'g', 'Klassinen pizzajuusto', NULL, 1, 1),
(2, 'Tomaattikastike', 'pizza', 0.00, 'ml', 'Perinteinen pizzapohja', NULL, 1, 2),
(3, 'Pepperoni', 'pizza', 0.00, 'g', 'Maukas makkaratäyte', NULL, 1, 10),
(4, 'Herkkusieni', 'pizza', 0.00, 'g', 'Tuoreita sieniä', NULL, 1, 20),
(5, 'Sipuli', 'pizza', 0.00, 'g', 'Kuutioitua sipulia', NULL, 1, 21),
(6, 'Vihreä paprika', 'pizza', 0.00, 'g', 'Raikasta paprikaa', NULL, 1, 22),
(7, 'Mustat oliivit', 'pizza', 0.00, 'g', 'Välimerellisiä makuja', NULL, 1, 23),
(8, 'Basilika', 'pizza', 0.00, 'g', 'Tuoretta basilikaa', NULL, 1, 3),
(9, 'Oregano', 'pizza', 0.00, 'g', 'Kuivattua oreganoa', NULL, 1, 4),
(10, 'Parmesaani', 'pizza', 0.00, 'g', 'Raastettua parmesaania', NULL, 1, 5),
(11, 'Kinkku', 'pizza', 0.00, 'g', 'Hienoa kinkkua', NULL, 1, 11),
(12, 'Ananas', 'pizza', 0.00, 'g', 'Makeaa ananasta', NULL, 1, 24),
(13, 'Pinaatti', 'pizza', 0.00, 'g', 'Tuoretta pinaattia', NULL, 1, 25),
(14, 'Valkosipuli', 'pizza', 0.00, 'g', 'Aromikasta valkosipulia', NULL, 1, 6),
(15, 'Anjovis', 'pizza', 0.00, 'g', 'Suolaista anjovista', NULL, 1, 26),
(16, 'Makkara', 'pizza', 0.00, 'g', 'Grillimakkaraa', NULL, 1, 12),
(17, 'Kirsikkatomaatti', 'pizza', 0.00, 'g', 'Pieniä kirsikkatomaatteja', NULL, 1, 27),
(18, 'Latva-artisokka', 'pizza', 0.00, 'g', 'Gourmet-täytettä', NULL, 1, 28),
(19, 'Ricotta', 'pizza', 0.00, 'g', 'Pehmeää ricotta-juustoa', NULL, 1, 7),
(20, 'Chilihiutaleet', 'pizza', 0.00, 'g', 'Tulista chiliä', NULL, 1, 8),
(100, 'Coca-Cola 0,5l', 'extra', 2.50, 'kpl', 'Virvoke', 'coca_cola.jpg', 1, 100),
(101, 'Vesi 0,5l', 'extra', 1.50, 'kpl', 'Kivennäisvesi', 'water.jpg', 1, 101),
(102, 'Valkosipulileipä', 'extra', 4.00, 'kpl', 'Tuoretta leipää valkosipulivoidetta', 'garlic_bread.jpg', 1, 102),
(103, 'Salaatti', 'extra', 3.50, 'kpl', 'Sekavihannes salaatti', 'salad.jpg', 1, 103),
(104, 'Tiramisu', 'extra', 5.50, 'kpl', 'Klassinen italialainen jälkiruoka', 'tiramisu.jpg', 1, 104),
(105, 'Ranskalaiset perunat', 'extra', 3.00, 'kpl', 'Rapeat ranskalaiset', 'fries.jpg', 1, 105),
(106, 'Sipulirenkaat', 'extra', 3.50, 'kpl', 'Paneroidut sipulirenkaat', 'onion_rings.jpg', 1, 106),
(107, 'Mozzarella sticks', 'extra', 4.50, 'kpl', 'Friteerattuja juustotikkuja', 'mozzarella_sticks.jpg', 1, 107),
(108, 'Chicken wings', 'extra', 6.00, 'kpl', 'BBQ-marinoidut siivet', 'chicken_wings.jpg', 1, 108);

-- --------------------------------------------------------

--
-- Rakenne taululle `asiakkaat`
--

CREATE TABLE `asiakkaat` (
  `AsiakasID` int(10) UNSIGNED NOT NULL,
  `Enimi` varchar(50) DEFAULT NULL,
  `Snimi` varchar(50) DEFAULT NULL,
  `Puh` varchar(20) DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `Osoite` varchar(200) DEFAULT NULL,
  `PostiNum` char(5) DEFAULT NULL,
  `PostiTp` varchar(50) DEFAULT NULL,
  `LiitymisPvm` date DEFAULT curdate(),
  `MuokattuvPvm` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `Aktiivinen` tinyint(1) DEFAULT 1,
  `PasswordHash` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Vedos taulusta `asiakkaat`
--

INSERT INTO `asiakkaat` (`AsiakasID`, `Enimi`, `Snimi`, `Puh`, `Email`, `Osoite`, `PostiNum`, `PostiTp`, `LiitymisPvm`, `MuokattuvPvm`, `Aktiivinen`, `PasswordHash`) VALUES
(1, 'Testi', 'Käyttäjä', '+358401234567', 'testi@example.com', 'Testikatu 1', '48100', 'Kotka', '2025-08-31', '2025-08-31 15:38:11', 1, NULL),
(4, 'Risto', 'Toivanen', '0449787395', 'risto.toivanen@gmail.com', 'Huuhankatu 9 A 10', '70600', 'Kuopio', '2025-09-02', '2025-09-02 04:20:08', 1, '$2y$10$example_hash_here'),
(15, 'Marja', 'Virtanen', '0401234567', 'marja.virtanen@gmail.com', 'Keskuskatu 5', '00100', 'Helsinki', '2025-09-02', '2025-09-02 13:20:51', 1, '$2y$10$example_hash_here2'),
(26, NULL, NULL, NULL, 'ristotoiva.rt@gmail.com', NULL, NULL, NULL, '2025-09-10', '2025-09-16 11:12:19', 1, '$2y$10$SGbCNUqW6q8uJmixiTm74ezsWzVaLPabvbIDjqksYKuzfi3CWdlI2'),
(27, 'nimi', 'Toivanen', '0449787395', 'ristotoiv.rt@gmail.com', 'Huuhankatu 9 A 10', '70600', 'Kuopio', '2025-09-15', '2025-09-15 10:33:20', 1, NULL),
(34, NULL, NULL, NULL, 'ristotoivaa.rt@gmail.com', NULL, NULL, NULL, '2025-09-16', '2025-09-16 14:46:52', 1, '$2y$10$1enjkD7KW2c494zzEEVJyete9EwTdy4u5q2VX2/4J5Xar9C83kTIu'),
(35, NULL, NULL, NULL, 'ristotoivaaa.rt@gmail.com', NULL, NULL, NULL, '2025-09-16', '2025-09-16 14:47:31', 1, '$2y$10$gKaKlNDqSVFd7MhgRIY7oOLmhXCUezY6nhs1OTA4lmKOJQo65TovK');

-- --------------------------------------------------------

--
-- Rakenne taululle `koot`
--

CREATE TABLE `koot` (
  `KokoID` tinyint(3) UNSIGNED NOT NULL,
  `Koko` varchar(50) NOT NULL,
  `HintaKerroin` decimal(3,2) NOT NULL DEFAULT 1.00,
  `Aktiivinen` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Vedos taulusta `koot`
--

INSERT INTO `koot` (`KokoID`, `Koko`, `HintaKerroin`, `Aktiivinen`) VALUES
(1, 'Pieni', 0.80, 1),
(2, 'Keskikoko', 1.00, 1),
(3, 'Iso', 1.30, 1);

-- --------------------------------------------------------

--
-- Rakenne taululle `kuljettajat`
--

CREATE TABLE `kuljettajat` (
  `KuljettajaID` smallint(5) UNSIGNED NOT NULL,
  `Enimi` varchar(100) NOT NULL,
  `Snimi` varchar(50) DEFAULT NULL,
  `Puh` varchar(20) DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `Osoite` varchar(200) DEFAULT NULL,
  `PostiNum` char(5) DEFAULT NULL,
  `PostiTp` varchar(50) DEFAULT NULL,
  `LiitymisPvm` date DEFAULT curdate(),
  `MuokattuvPvm` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `Status` enum('vapaana','kiireinen','tauolla') DEFAULT 'vapaana',
  `Aktiivinen` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Vedos taulusta `kuljettajat`
--

INSERT INTO `kuljettajat` (`KuljettajaID`, `Enimi`, `Snimi`, `Puh`, `Email`, `Osoite`, `PostiNum`, `PostiTp`, `LiitymisPvm`, `MuokattuvPvm`, `Status`, `Aktiivinen`) VALUES
(1, 'Kuljetus', 'Kaveri', '+358409876543', 'kuljettaja@example.com', NULL, NULL, NULL, '2025-08-31', '2025-08-31 15:38:11', 'vapaana', 1);

-- --------------------------------------------------------

--
-- Rakenne taululle `ostoskori`
--

CREATE TABLE `ostoskori` (
  `OstoskoriID` int(10) UNSIGNED NOT NULL,
  `GuestToken` varchar(64) DEFAULT NULL,
  `AsiakasID` int(10) UNSIGNED DEFAULT NULL,
  `CreatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `UpdatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Vedos taulusta `ostoskori`
--

INSERT INTO `ostoskori` (`OstoskoriID`, `GuestToken`, `AsiakasID`, `CreatedAt`, `UpdatedAt`) VALUES
(20, NULL, 1, '2025-09-03 03:31:06', '2025-09-03 03:31:06'),
(38, NULL, 4, '2025-09-03 16:00:19', '2025-09-03 16:00:42'),
(48, 'e4b5c3a2a8ae17304e8ce3a6fa8a1375', NULL, '2025-09-11 11:16:43', '2025-09-11 11:17:25'),
(52, 'ba5c84f904f940de6244cb21d9f2ab16', NULL, '2025-09-12 09:26:27', '2025-09-12 09:26:27'),
(54, NULL, 27, '2025-09-15 10:33:22', '2025-09-15 10:33:22'),
(56, '7367213cd89a841844bb424d4d2a232c', NULL, '2025-09-15 10:33:50', '2025-09-15 10:33:50'),
(70, NULL, 26, '2025-09-16 14:39:47', '2025-09-16 14:39:47'),
(73, NULL, 34, '2025-09-16 14:48:03', '2025-09-16 14:48:06');

-- --------------------------------------------------------

--
-- Rakenne taululle `ostoskori_rivit`
--

CREATE TABLE `ostoskori_rivit` (
  `OstoskoriRivitID` int(10) UNSIGNED NOT NULL,
  `OstoskoriID` int(10) UNSIGNED NOT NULL,
  `PizzaID` smallint(5) UNSIGNED DEFAULT NULL,
  `AinesosaID` smallint(5) UNSIGNED DEFAULT NULL,
  `KokoID` tinyint(3) UNSIGNED DEFAULT NULL,
  `Maara` tinyint(3) UNSIGNED NOT NULL DEFAULT 1,
  `Hinta` decimal(10,2) NOT NULL DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Vedos taulusta `ostoskori_rivit`
--

INSERT INTO `ostoskori_rivit` (`OstoskoriRivitID`, `OstoskoriID`, `PizzaID`, `AinesosaID`, `KokoID`, `Maara`, `Hinta`) VALUES
(53, 48, 2, NULL, 2, 2, 18.00),
(72, 73, 2, NULL, 2, 1, 9.00);

-- --------------------------------------------------------

--
-- Rakenne taululle `pizzat`
--

CREATE TABLE `pizzat` (
  `PizzaID` smallint(5) UNSIGNED NOT NULL,
  `Nimi` varchar(100) NOT NULL,
  `Pohja` varchar(50) DEFAULT NULL,
  `Tiedot` varchar(100) DEFAULT NULL,
  `Hinta` decimal(8,2) DEFAULT NULL,
  `Kuva` varchar(255) DEFAULT NULL,
  `Aktiivinen` tinyint(1) DEFAULT 1,
  `Suosio` smallint(5) UNSIGNED DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Vedos taulusta `pizzat`
--

INSERT INTO `pizzat` (`PizzaID`, `Nimi`, `Pohja`, `Tiedot`, `Hinta`, `Kuva`, `Aktiivinen`, `Suosio`) VALUES
(1, 'Margherita', 'Ohut', 'Tomaatin ja juuston klassikko', 7.50, 'margherita.jpg', 1, 0),
(2, 'Pepperoni', 'Ohut', 'Pepperoni, juusto ja tomaattikastike', 9.00, 'pepperoni.jpg', 1, 0),
(3, 'Hawaii', 'Paksu', 'Kinkku ja ananas', 8.50, 'hawaii.jpg', 1, 0),
(4, 'Veggie', 'Ohut', 'Kasviksia ja juustoa', 8.00, 'veggie.jpg', 1, 0),
(5, 'BBQ Chicken', 'Paksu', 'BBQ-kanaa ja juustoa', 10.00, 'bbq_chicken.jpg', 1, 0),
(6, 'Four Cheese', 'Ohut', 'Neljä erilaista juustoa', 9.50, 'four_cheese.jpg', 1, 0),
(7, 'Meat Lovers', 'Paksu', 'Sekoitus lihaa', 11.00, 'meat_lovers.jpg', 1, 0),
(8, 'Seafood', 'Ohut', 'Katkarapuja ja tonnikalaa', 12.00, 'seafood.jpg', 1, 0),
(9, 'Mushroom', 'Ohut', 'Sieniä ja juustoa', 8.00, 'mushroom.jpg', 1, 0),
(10, 'Spicy Italian', 'Paksu', 'Tulinen salami ja paprika', 9.50, 'spicy_italian.jpg', 1, 0);

-- --------------------------------------------------------

--
-- Rakenne taululle `pizza_aineosat`
--

CREATE TABLE `pizza_aineosat` (
  `palID` int(10) UNSIGNED NOT NULL,
  `PizzaID` smallint(5) UNSIGNED NOT NULL,
  `AinesosaID` smallint(5) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Vedos taulusta `pizza_aineosat`
--

INSERT INTO `pizza_aineosat` (`palID`, `PizzaID`, `AinesosaID`) VALUES
(1, 1, 1),
(2, 1, 2),
(3, 1, 8),
(4, 1, 9),
(5, 2, 1),
(6, 2, 2),
(7, 2, 3),
(8, 3, 1),
(9, 3, 2),
(10, 3, 11),
(11, 3, 12),
(12, 4, 1),
(13, 4, 2),
(14, 4, 4),
(15, 4, 5),
(16, 4, 6),
(17, 4, 7),
(18, 5, 1),
(19, 5, 2),
(20, 5, 5),
(21, 5, 6),
(22, 6, 1),
(23, 6, 2),
(24, 6, 10),
(25, 6, 19),
(26, 7, 1),
(27, 7, 2),
(28, 7, 3),
(29, 7, 11),
(30, 7, 16),
(31, 8, 1),
(32, 8, 2),
(34, 8, 7),
(33, 8, 15),
(35, 9, 1),
(36, 9, 2),
(37, 9, 4),
(38, 10, 1),
(39, 10, 2),
(40, 10, 3),
(41, 10, 6),
(42, 10, 20);

-- --------------------------------------------------------

--
-- Rakenne taululle `tilaukset`
--

CREATE TABLE `tilaukset` (
  `TilausID` int(10) UNSIGNED NOT NULL,
  `AsiakasID` int(10) UNSIGNED NOT NULL,
  `KuljettajaID` smallint(5) UNSIGNED DEFAULT NULL,
  `TilausPvm` timestamp NOT NULL DEFAULT current_timestamp(),
  `Status` enum('Odottaa','Vahvistettu','Valmistuksessa','Kuljetuksessa','Toimitettu','Peruutettu') DEFAULT 'Odottaa',
  `Kokonaishinta` decimal(8,2) NOT NULL DEFAULT 0.00,
  `Kommentit` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Vedos taulusta `tilaukset`
--

INSERT INTO `tilaukset` (`TilausID`, `AsiakasID`, `KuljettajaID`, `TilausPvm`, `Status`, `Kokonaishinta`, `Kommentit`) VALUES
(30, 27, NULL, '2025-09-16 12:00:09', 'Odottaa', 9.00, NULL),
(31, 27, NULL, '2025-09-16 12:01:53', 'Odottaa', 76.80, NULL),
(32, 26, NULL, '2025-09-16 14:39:46', 'Odottaa', 8.50, NULL),
(33, 34, NULL, '2025-09-16 14:48:02', 'Odottaa', 9.00, NULL);

-- --------------------------------------------------------

--
-- Rakenne taululle `tilausrivit_aineosat`
--

CREATE TABLE `tilausrivit_aineosat` (
  `TilausrivitAinesosaID` int(10) UNSIGNED NOT NULL,
  `TilausID` int(10) UNSIGNED NOT NULL,
  `AinesosaID` smallint(5) UNSIGNED NOT NULL,
  `Maara` tinyint(3) UNSIGNED NOT NULL,
  `Hinta` decimal(6,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Rakenne taululle `tilausrivit_pizzat`
--

CREATE TABLE `tilausrivit_pizzat` (
  `TilausrivitPizzaID` int(10) UNSIGNED NOT NULL,
  `TilausID` int(10) UNSIGNED NOT NULL,
  `PizzaID` smallint(5) UNSIGNED NOT NULL,
  `KokoID` tinyint(3) UNSIGNED NOT NULL,
  `Maara` tinyint(3) UNSIGNED NOT NULL,
  `Hinta` decimal(6,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Vedos taulusta `tilausrivit_pizzat`
--

INSERT INTO `tilausrivit_pizzat` (`TilausrivitPizzaID`, `TilausID`, `PizzaID`, `KokoID`, `Maara`, `Hinta`) VALUES
(34, 30, 2, 2, 1, 9.00),
(35, 31, 1, 2, 4, 30.00),
(36, 31, 2, 3, 4, 46.80),
(37, 32, 3, 2, 1, 8.50),
(38, 33, 2, 2, 1, 9.00);

-- --------------------------------------------------------

--
-- Näkymän vararakenne `v_aineosat_tyypeittain`
-- (See below for the actual view)
--
CREATE TABLE `v_aineosat_tyypeittain` (
`AinesosaID` smallint(5) unsigned
,`Nimi` varchar(100)
,`Tyyppi` enum('pizza','extra','both')
,`Hinta` decimal(6,2)
,`Yksikko` varchar(20)
,`Kuvaus` varchar(200)
,`Kuva` varchar(255)
,`Aktiivinen` tinyint(1)
,`Jarjestys` smallint(5) unsigned
,`TyyppiKuvaus` varchar(14)
);

-- --------------------------------------------------------

--
-- Näkymän vararakenne `v_pizzat_aineosat`
-- (See below for the actual view)
--
CREATE TABLE `v_pizzat_aineosat` (
`PizzaID` smallint(5) unsigned
,`PizzaNimi` varchar(100)
,`Pohja` varchar(50)
,`Tiedot` varchar(100)
,`Hinta` decimal(8,2)
,`Kuva` varchar(255)
,`Aktiivinen` tinyint(1)
,`Aineosat` mediumtext
,`AinesosaMaara` bigint(21)
);

-- --------------------------------------------------------

--
-- Näkymän vararakenne `v_tilaukset_yhteenveto`
-- (See below for the actual view)
--
CREATE TABLE `v_tilaukset_yhteenveto` (
`TilausID` int(10) unsigned
,`TilausPvm` timestamp
,`Status` enum('Odottaa','Vahvistettu','Valmistuksessa','Kuljetuksessa','Toimitettu','Peruutettu')
,`AsiakasNimi` varchar(101)
,`AsiakasPuh` varchar(20)
,`AsiakasEmail` varchar(100)
,`KuljettajaNimi` varchar(151)
,`Kokonaishinta` decimal(8,2)
,`TuoteMaara` bigint(22)
);

-- --------------------------------------------------------

--
-- Näkymän rakenne `v_aineosat_tyypeittain`
--
DROP TABLE IF EXISTS `v_aineosat_tyypeittain`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_aineosat_tyypeittain`  AS SELECT `aineosat`.`AinesosaID` AS `AinesosaID`, `aineosat`.`Nimi` AS `Nimi`, `aineosat`.`Tyyppi` AS `Tyyppi`, `aineosat`.`Hinta` AS `Hinta`, `aineosat`.`Yksikko` AS `Yksikko`, `aineosat`.`Kuvaus` AS `Kuvaus`, `aineosat`.`Kuva` AS `Kuva`, `aineosat`.`Aktiivinen` AS `Aktiivinen`, `aineosat`.`Jarjestys` AS `Jarjestys`, CASE WHEN `aineosat`.`Tyyppi` = 'pizza' THEN 'Pizza-aineosat' WHEN `aineosat`.`Tyyppi` = 'extra' THEN 'Lisätuotteet' ELSE 'Molemmat' END AS `TyyppiKuvaus` FROM `aineosat` WHERE `aineosat`.`Aktiivinen` = 1 ORDER BY `aineosat`.`Tyyppi` ASC, `aineosat`.`Jarjestys` ASC, `aineosat`.`Nimi` ASC ;

-- --------------------------------------------------------

--
-- Näkymän rakenne `v_pizzat_aineosat`
--
DROP TABLE IF EXISTS `v_pizzat_aineosat`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_pizzat_aineosat`  AS SELECT `p`.`PizzaID` AS `PizzaID`, `p`.`Nimi` AS `PizzaNimi`, `p`.`Pohja` AS `Pohja`, `p`.`Tiedot` AS `Tiedot`, `p`.`Hinta` AS `Hinta`, `p`.`Kuva` AS `Kuva`, `p`.`Aktiivinen` AS `Aktiivinen`, group_concat(`a`.`Nimi` order by `a`.`Jarjestys` ASC,`a`.`Nimi` ASC separator ', ') AS `Aineosat`, count(`pa`.`AinesosaID`) AS `AinesosaMaara` FROM ((`pizzat` `p` left join `pizza_aineosat` `pa` on(`p`.`PizzaID` = `pa`.`PizzaID`)) left join `aineosat` `a` on(`pa`.`AinesosaID` = `a`.`AinesosaID` and `a`.`Aktiivinen` = 1)) WHERE `p`.`Aktiivinen` = 1 GROUP BY `p`.`PizzaID` ;

-- --------------------------------------------------------

--
-- Näkymän rakenne `v_tilaukset_yhteenveto`
--
DROP TABLE IF EXISTS `v_tilaukset_yhteenveto`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_tilaukset_yhteenveto`  AS SELECT `t`.`TilausID` AS `TilausID`, `t`.`TilausPvm` AS `TilausPvm`, `t`.`Status` AS `Status`, concat(`a`.`Enimi`,coalesce(concat(' ',`a`.`Snimi`),'')) AS `AsiakasNimi`, `a`.`Puh` AS `AsiakasPuh`, `a`.`Email` AS `AsiakasEmail`, coalesce(concat(`k`.`Enimi`,' ',`k`.`Snimi`),'Ei määritetty') AS `KuljettajaNimi`, `t`.`Kokonaishinta` AS `Kokonaishinta`, (select count(0) from `tilausrivit_pizzat` `tp` where `tp`.`TilausID` = `t`.`TilausID`) + (select count(0) from `tilausrivit_aineosat` `ta` where `ta`.`TilausID` = `t`.`TilausID`) AS `TuoteMaara` FROM ((`tilaukset` `t` join `asiakkaat` `a` on(`t`.`AsiakasID` = `a`.`AsiakasID`)) left join `kuljettajat` `k` on(`t`.`KuljettajaID` = `k`.`KuljettajaID`)) ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `aineosat`
--
ALTER TABLE `aineosat`
  ADD PRIMARY KEY (`AinesosaID`),
  ADD UNIQUE KEY `uk_aineosat_nimi` (`Nimi`),
  ADD KEY `idx_aineosat_tyyppi` (`Tyyppi`),
  ADD KEY `idx_aineosat_aktiivinen` (`Aktiivinen`),
  ADD KEY `idx_aineosat_jarjestys` (`Jarjestys`);

--
-- Indexes for table `asiakkaat`
--
ALTER TABLE `asiakkaat`
  ADD PRIMARY KEY (`AsiakasID`),
  ADD UNIQUE KEY `uk_asiakkaat_email` (`Email`),
  ADD KEY `idx_asiakkaat_puh` (`Puh`),
  ADD KEY `idx_asiakkaat_postinum` (`PostiNum`),
  ADD KEY `idx_asiakkaat_aktiivinen` (`Aktiivinen`);

--
-- Indexes for table `koot`
--
ALTER TABLE `koot`
  ADD PRIMARY KEY (`KokoID`),
  ADD UNIQUE KEY `uk_koot_koko` (`Koko`);

--
-- Indexes for table `kuljettajat`
--
ALTER TABLE `kuljettajat`
  ADD PRIMARY KEY (`KuljettajaID`),
  ADD KEY `idx_kuljettajat_puh` (`Puh`),
  ADD KEY `idx_kuljettajat_status` (`Status`),
  ADD KEY `idx_kuljettajat_aktiivinen` (`Aktiivinen`);

--
-- Indexes for table `ostoskori`
--
ALTER TABLE `ostoskori`
  ADD PRIMARY KEY (`OstoskoriID`),
  ADD UNIQUE KEY `uk_ostoskori_guest` (`GuestToken`),
  ADD KEY `idx_ostoskori_asiakas` (`AsiakasID`),
  ADD KEY `idx_ostoskori_updated` (`UpdatedAt`);

--
-- Indexes for table `ostoskori_rivit`
--
ALTER TABLE `ostoskori_rivit`
  ADD PRIMARY KEY (`OstoskoriRivitID`),
  ADD KEY `idx_ostoskori_rivit_kori` (`OstoskoriID`),
  ADD KEY `idx_ostoskori_rivit_pizza` (`PizzaID`),
  ADD KEY `idx_ostoskori_rivit_ainesosa` (`AinesosaID`),
  ADD KEY `idx_ostoskori_rivit_koko` (`KokoID`);

--
-- Indexes for table `pizzat`
--
ALTER TABLE `pizzat`
  ADD PRIMARY KEY (`PizzaID`),
  ADD KEY `idx_pizzat_aktiivinen` (`Aktiivinen`),
  ADD KEY `idx_pizzat_suosio` (`Suosio`);
ALTER TABLE `pizzat` ADD FULLTEXT KEY `ft_pizzat_search` (`Nimi`,`Tiedot`);

--
-- Indexes for table `pizza_aineosat`
--
ALTER TABLE `pizza_aineosat`
  ADD PRIMARY KEY (`palID`),
  ADD UNIQUE KEY `uk_pizza_aineosat` (`PizzaID`,`AinesosaID`),
  ADD KEY `idx_pizza_aineosat_pizza` (`PizzaID`),
  ADD KEY `idx_pizza_aineosat_ainesosa` (`AinesosaID`);

--
-- Indexes for table `tilaukset`
--
ALTER TABLE `tilaukset`
  ADD PRIMARY KEY (`TilausID`),
  ADD KEY `idx_tilaukset_asiakas` (`AsiakasID`),
  ADD KEY `idx_tilaukset_kuljettaja` (`KuljettajaID`),
  ADD KEY `idx_tilaukset_status` (`Status`),
  ADD KEY `idx_tilaukset_pvm` (`TilausPvm`);

--
-- Indexes for table `tilausrivit_aineosat`
--
ALTER TABLE `tilausrivit_aineosat`
  ADD PRIMARY KEY (`TilausrivitAinesosaID`),
  ADD KEY `idx_tilausrivit_aineosat_tilaus` (`TilausID`),
  ADD KEY `idx_tilausrivit_aineosat_ainesosa` (`AinesosaID`);

--
-- Indexes for table `tilausrivit_pizzat`
--
ALTER TABLE `tilausrivit_pizzat`
  ADD PRIMARY KEY (`TilausrivitPizzaID`),
  ADD KEY `idx_tilausrivit_pizzat_tilaus` (`TilausID`),
  ADD KEY `idx_tilausrivit_pizzat_pizza` (`PizzaID`),
  ADD KEY `idx_tilausrivit_pizzat_koko` (`KokoID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `aineosat`
--
ALTER TABLE `aineosat`
  MODIFY `AinesosaID` smallint(5) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=110;

--
-- AUTO_INCREMENT for table `asiakkaat`
--
ALTER TABLE `asiakkaat`
  MODIFY `AsiakasID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `koot`
--
ALTER TABLE `koot`
  MODIFY `KokoID` tinyint(3) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `kuljettajat`
--
ALTER TABLE `kuljettajat`
  MODIFY `KuljettajaID` smallint(5) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `ostoskori`
--
ALTER TABLE `ostoskori`
  MODIFY `OstoskoriID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=75;

--
-- AUTO_INCREMENT for table `ostoskori_rivit`
--
ALTER TABLE `ostoskori_rivit`
  MODIFY `OstoskoriRivitID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=73;

--
-- AUTO_INCREMENT for table `pizzat`
--
ALTER TABLE `pizzat`
  MODIFY `PizzaID` smallint(5) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `pizza_aineosat`
--
ALTER TABLE `pizza_aineosat`
  MODIFY `palID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `tilaukset`
--
ALTER TABLE `tilaukset`
  MODIFY `TilausID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `tilausrivit_aineosat`
--
ALTER TABLE `tilausrivit_aineosat`
  MODIFY `TilausrivitAinesosaID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `tilausrivit_pizzat`
--
ALTER TABLE `tilausrivit_pizzat`
  MODIFY `TilausrivitPizzaID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- Rajoitteet vedostauluille
--

--
-- Rajoitteet taululle `ostoskori`
--
ALTER TABLE `ostoskori`
  ADD CONSTRAINT `fk_ostoskori_asiakas` FOREIGN KEY (`AsiakasID`) REFERENCES `asiakkaat` (`AsiakasID`) ON DELETE CASCADE;

--
-- Rajoitteet taululle `ostoskori_rivit`
--
ALTER TABLE `ostoskori_rivit`
  ADD CONSTRAINT `fk_ostoskori_rivit_ainesosa` FOREIGN KEY (`AinesosaID`) REFERENCES `aineosat` (`AinesosaID`),
  ADD CONSTRAINT `fk_ostoskori_rivit_koko` FOREIGN KEY (`KokoID`) REFERENCES `koot` (`KokoID`),
  ADD CONSTRAINT `fk_ostoskori_rivit_kori` FOREIGN KEY (`OstoskoriID`) REFERENCES `ostoskori` (`OstoskoriID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_ostoskori_rivit_pizza` FOREIGN KEY (`PizzaID`) REFERENCES `pizzat` (`PizzaID`);

--
-- Rajoitteet taululle `pizza_aineosat`
--
ALTER TABLE `pizza_aineosat`
  ADD CONSTRAINT `fk_pizza_aineosat_ainesosa` FOREIGN KEY (`AinesosaID`) REFERENCES `aineosat` (`AinesosaID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_pizza_aineosat_pizza` FOREIGN KEY (`PizzaID`) REFERENCES `pizzat` (`PizzaID`) ON DELETE CASCADE;

--
-- Rajoitteet taululle `tilaukset`
--
ALTER TABLE `tilaukset`
  ADD CONSTRAINT `fk_tilaukset_asiakas` FOREIGN KEY (`AsiakasID`) REFERENCES `asiakkaat` (`AsiakasID`),
  ADD CONSTRAINT `fk_tilaukset_kuljettaja` FOREIGN KEY (`KuljettajaID`) REFERENCES `kuljettajat` (`KuljettajaID`);

--
-- Rajoitteet taululle `tilausrivit_aineosat`
--
ALTER TABLE `tilausrivit_aineosat`
  ADD CONSTRAINT `fk_tilausrivit_aineosat_ainesosa` FOREIGN KEY (`AinesosaID`) REFERENCES `aineosat` (`AinesosaID`),
  ADD CONSTRAINT `fk_tilausrivit_aineosat_tilaus` FOREIGN KEY (`TilausID`) REFERENCES `tilaukset` (`TilausID`) ON DELETE CASCADE;

--
-- Rajoitteet taululle `tilausrivit_pizzat`
--
ALTER TABLE `tilausrivit_pizzat`
  ADD CONSTRAINT `fk_tilausrivit_pizzat_koko` FOREIGN KEY (`KokoID`) REFERENCES `koot` (`KokoID`),
  ADD CONSTRAINT `fk_tilausrivit_pizzat_pizza` FOREIGN KEY (`PizzaID`) REFERENCES `pizzat` (`PizzaID`),
  ADD CONSTRAINT `fk_tilausrivit_pizzat_tilaus` FOREIGN KEY (`TilausID`) REFERENCES `tilaukset` (`TilausID`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
