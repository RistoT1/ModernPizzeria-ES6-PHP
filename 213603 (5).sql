-- phpMyAdmin SQL Dump
-- version 5.2.1deb1+deb12u1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: 28.08.2025 klo 12:08
-- Palvelimen versio: 10.11.11-MariaDB-0+deb12u1
-- PHP Version: 8.2.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `213603`
--

-- --------------------------------------------------------

--
-- Rakenne taululle `Aineosat`
--

CREATE TABLE `Aineosat` (
  `AinesosaID` int(11) NOT NULL,
  `Nimi` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Rakenne taululle `Asiakkaat`
--

CREATE TABLE `Asiakkaat` (
  `AsiakasID` int(11) NOT NULL,
  `Enimi` varchar(100) NOT NULL,
  `Snimi` varchar(50) DEFAULT NULL,
  `Puh` varchar(20) DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `Osoite` varchar(200) DEFAULT NULL,
  `PostiNum` varchar(10) DEFAULT NULL,
  `PostiTp` varchar(50) DEFAULT NULL,
  `LiitymisPvm` date DEFAULT NULL,
  `MuokattuvPvm` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Rakenne taululle `Elokuva`
--

CREATE TABLE `Elokuva` (
  `ElokuvaID` int(11) NOT NULL,
  `Nimi` varchar(100) NOT NULL,
  `Julkaisuvuosi` int(11) NOT NULL,
  `Vuokrahinta` decimal(5,2) NOT NULL,
  `Arvio` int(11) NOT NULL CHECK (`Arvio` between 1 and 5),
  `LajityyppiID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Vedos taulusta `Elokuva`
--

INSERT INTO `Elokuva` (`ElokuvaID`, `Nimi`, `Julkaisuvuosi`, `Vuokrahinta`, `Arvio`, `LajityyppiID`) VALUES
(34, 'What women want', 2001, 3.00, 5, 1),
(35, 'Chocolat', 1999, 3.00, 5, 1),
(36, 'Enemy at the Gates', 2001, 3.00, 4, 2),
(37, 'Almost Famous', 2000, 3.00, 4, 3),
(38, 'Proof of life', 1999, 3.00, 4, 3),
(39, 'Crouching tiger, hidden dragon', 2002, 5.00, 5, 2),
(40, 'Gladiator', 2002, 5.00, 5, 2),
(41, 'Traffic', 2001, 5.00, 4, 3),
(42, 'Hannibal', 2002, 5.00, 5, 4),
(43, 'Remember the Titans', 2001, 3.00, 5, 3),
(44, 'Clockwork Orange', 1980, 3.00, 4, 3);

-- --------------------------------------------------------

--
-- Rakenne taululle `Jasen`
--

CREATE TABLE `Jasen` (
  `JasenID` int(11) NOT NULL,
  `Nimi` varchar(100) DEFAULT NULL,
  `Osoite` varchar(150) DEFAULT NULL,
  `LiittymisPVM` date DEFAULT NULL,
  `Syntymavuosi` int(11) DEFAULT NULL,
  `Kayttajatunnus` varchar(100) DEFAULT NULL,
  `SalasanaHash` varchar(255) DEFAULT NULL,
  `is_admin` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Vedos taulusta `Jasen`
--

INSERT INTO `Jasen` (`JasenID`, `Nimi`, `Osoite`, `LiittymisPVM`, `Syntymavuosi`, `Kayttajatunnus`, `SalasanaHash`, `is_admin`) VALUES
(1, 'a', NULL, '2025-08-28', NULL, 'a', '$2y$10$azKW33rhV5AJZhzmb4E2geaBkrJ8Adzz7B/tdiB/Jlu0ynXKXy/tm', 1);

-- --------------------------------------------------------

--
-- Rakenne taululle `Koko`
--

CREATE TABLE `Koko` (
  `KokoID` int(11) NOT NULL,
  `Koko` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Rakenne taululle `Kuljettaja`
--

CREATE TABLE `Kuljettaja` (
  `KuljettajaID` int(11) NOT NULL,
  `Enimi` varchar(100) NOT NULL,
  `Snimi` varchar(50) DEFAULT NULL,
  `Puh` varchar(20) DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `Osoite` varchar(200) DEFAULT NULL,
  `PostiNum` varchar(10) DEFAULT NULL,
  `PostiTp` varchar(50) DEFAULT NULL,
  `LiitymisPvm` date DEFAULT NULL,
  `MuokattuvPvm` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Rakenne taululle `Lajityyppi`
--

CREATE TABLE `Lajityyppi` (
  `LajityyppiID` int(11) NOT NULL,
  `Tyypinnimi` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Vedos taulusta `Lajityyppi`
--

INSERT INTO `Lajityyppi` (`LajityyppiID`, `Tyypinnimi`) VALUES
(1, 'Komedia'),
(2, 'Toiminta'),
(3, 'Draama'),
(4, 'Kauhu');

-- --------------------------------------------------------

--
-- Rakenne taululle `Lisat`
--

CREATE TABLE `Lisat` (
  `LisaID` int(11) NOT NULL,
  `Nimi` varchar(100) NOT NULL,
  `KokoID` int(11) DEFAULT NULL,
  `Hinta` decimal(8,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Rakenne taululle `Pizzat`
--

CREATE TABLE `Pizzat` (
  `PizzaID` int(11) NOT NULL,
  `Nimi` varchar(100) NOT NULL,
  `Pohja` varchar(50) DEFAULT NULL,
  `Taydot` text DEFAULT NULL,
  `KokoID` int(11) DEFAULT NULL,
  `Hinta` decimal(8,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Rakenne taululle `Pizza_Aineosat`
--

CREATE TABLE `Pizza_Aineosat` (
  `palID` int(11) NOT NULL,
  `PizzaID` int(11) NOT NULL,
  `AinesosaID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Rakenne taululle `Tilaus`
--

CREATE TABLE `Tilaus` (
  `TilausID` int(11) NOT NULL,
  `AsiakasID` int(11) NOT NULL,
  `KuljettajaID` int(11) DEFAULT NULL,
  `TilausPvm` datetime NOT NULL,
  `Kuljetetttu` varchar(20) DEFAULT 'Odottaa'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Rakenne taululle `Tilausrivit`
--

CREATE TABLE `Tilausrivit` (
  `TilausrivitID` int(11) NOT NULL,
  `TilausID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Rakenne taululle `Tilausrivit_Lisa`
--

CREATE TABLE `Tilausrivit_Lisa` (
  `TilausrivitLisaID` int(11) NOT NULL,
  `TilausrivitID` int(11) NOT NULL,
  `LisaID` int(11) NOT NULL,
  `Maara` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Rakenne taululle `Tilausrivit_Pizza`
--

CREATE TABLE `Tilausrivit_Pizza` (
  `TilausrivitPizzaID` int(11) NOT NULL,
  `TilausrivitID` int(11) NOT NULL,
  `PizzaID` int(11) NOT NULL,
  `Maara` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Rakenne taululle `Vuokraus`
--

CREATE TABLE `Vuokraus` (
  `JasenID` int(11) NOT NULL,
  `ElokuvaID` int(11) NOT NULL,
  `VuokrausPVM` date NOT NULL,
  `PalautusPVM` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Vedos taulusta `Vuokraus`
--

INSERT INTO `Vuokraus` (`JasenID`, `ElokuvaID`, `VuokrausPVM`, `PalautusPVM`) VALUES
(1, 44, '2025-08-28', '2025-09-04');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Aineosat`
--
ALTER TABLE `Aineosat`
  ADD PRIMARY KEY (`AinesosaID`);

--
-- Indexes for table `Asiakkaat`
--
ALTER TABLE `Asiakkaat`
  ADD PRIMARY KEY (`AsiakasID`),
  ADD KEY `idx_asiakkaat_email` (`Email`),
  ADD KEY `idx_asiakkaat_puh` (`Puh`);

--
-- Indexes for table `Elokuva`
--
ALTER TABLE `Elokuva`
  ADD PRIMARY KEY (`ElokuvaID`),
  ADD KEY `LajityyppiID` (`LajityyppiID`);

--
-- Indexes for table `Jasen`
--
ALTER TABLE `Jasen`
  ADD PRIMARY KEY (`JasenID`),
  ADD UNIQUE KEY `Kayttajatunnus` (`Kayttajatunnus`);

--
-- Indexes for table `Koko`
--
ALTER TABLE `Koko`
  ADD PRIMARY KEY (`KokoID`);

--
-- Indexes for table `Kuljettaja`
--
ALTER TABLE `Kuljettaja`
  ADD PRIMARY KEY (`KuljettajaID`);

--
-- Indexes for table `Lajityyppi`
--
ALTER TABLE `Lajityyppi`
  ADD PRIMARY KEY (`LajityyppiID`);

--
-- Indexes for table `Lisat`
--
ALTER TABLE `Lisat`
  ADD PRIMARY KEY (`LisaID`),
  ADD KEY `KokoID` (`KokoID`);

--
-- Indexes for table `Pizzat`
--
ALTER TABLE `Pizzat`
  ADD PRIMARY KEY (`PizzaID`),
  ADD KEY `KokoID` (`KokoID`);

--
-- Indexes for table `Pizza_Aineosat`
--
ALTER TABLE `Pizza_Aineosat`
  ADD PRIMARY KEY (`palID`),
  ADD KEY `idx_pizza_aineosat_pizzaid` (`PizzaID`),
  ADD KEY `idx_pizza_aineosat_ainesosaid` (`AinesosaID`);

--
-- Indexes for table `Tilaus`
--
ALTER TABLE `Tilaus`
  ADD PRIMARY KEY (`TilausID`),
  ADD KEY `KuljettajaID` (`KuljettajaID`),
  ADD KEY `idx_tilaus_asiakasid` (`AsiakasID`),
  ADD KEY `idx_tilaus_tilauspvm` (`TilausPvm`);

--
-- Indexes for table `Tilausrivit`
--
ALTER TABLE `Tilausrivit`
  ADD PRIMARY KEY (`TilausrivitID`),
  ADD KEY `TilausID` (`TilausID`);

--
-- Indexes for table `Tilausrivit_Lisa`
--
ALTER TABLE `Tilausrivit_Lisa`
  ADD PRIMARY KEY (`TilausrivitLisaID`),
  ADD KEY `LisaID` (`LisaID`),
  ADD KEY `idx_tilausrivit_lisa_tilausrivitid` (`TilausrivitID`);

--
-- Indexes for table `Tilausrivit_Pizza`
--
ALTER TABLE `Tilausrivit_Pizza`
  ADD PRIMARY KEY (`TilausrivitPizzaID`),
  ADD KEY `PizzaID` (`PizzaID`),
  ADD KEY `idx_tilausrivit_pizza_tilausrivitid` (`TilausrivitID`);

--
-- Indexes for table `Vuokraus`
--
ALTER TABLE `Vuokraus`
  ADD PRIMARY KEY (`JasenID`,`ElokuvaID`,`VuokrausPVM`),
  ADD KEY `ElokuvaID` (`ElokuvaID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Elokuva`
--
ALTER TABLE `Elokuva`
  MODIFY `ElokuvaID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT for table `Jasen`
--
ALTER TABLE `Jasen`
  MODIFY `JasenID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `Lajityyppi`
--
ALTER TABLE `Lajityyppi`
  MODIFY `LajityyppiID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Rajoitteet vedostauluille
--

--
-- Rajoitteet taululle `Elokuva`
--
ALTER TABLE `Elokuva`
  ADD CONSTRAINT `Elokuva_ibfk_1` FOREIGN KEY (`LajityyppiID`) REFERENCES `Lajityyppi` (`LajityyppiID`) ON UPDATE CASCADE;

--
-- Rajoitteet taululle `Lisat`
--
ALTER TABLE `Lisat`
  ADD CONSTRAINT `Lisat_ibfk_1` FOREIGN KEY (`KokoID`) REFERENCES `Koko` (`KokoID`);

--
-- Rajoitteet taululle `Pizzat`
--
ALTER TABLE `Pizzat`
  ADD CONSTRAINT `Pizzat_ibfk_1` FOREIGN KEY (`KokoID`) REFERENCES `Koko` (`KokoID`);

--
-- Rajoitteet taululle `Pizza_Aineosat`
--
ALTER TABLE `Pizza_Aineosat`
  ADD CONSTRAINT `Pizza_Aineosat_ibfk_1` FOREIGN KEY (`PizzaID`) REFERENCES `Pizzat` (`PizzaID`),
  ADD CONSTRAINT `Pizza_Aineosat_ibfk_2` FOREIGN KEY (`AinesosaID`) REFERENCES `Aineosat` (`AinesosaID`);

--
-- Rajoitteet taululle `Tilaus`
--
ALTER TABLE `Tilaus`
  ADD CONSTRAINT `Tilaus_ibfk_1` FOREIGN KEY (`AsiakasID`) REFERENCES `Asiakkaat` (`AsiakasID`),
  ADD CONSTRAINT `Tilaus_ibfk_2` FOREIGN KEY (`KuljettajaID`) REFERENCES `Kuljettaja` (`KuljettajaID`);

--
-- Rajoitteet taululle `Tilausrivit`
--
ALTER TABLE `Tilausrivit`
  ADD CONSTRAINT `Tilausrivit_ibfk_1` FOREIGN KEY (`TilausID`) REFERENCES `Tilaus` (`TilausID`);

--
-- Rajoitteet taululle `Tilausrivit_Lisa`
--
ALTER TABLE `Tilausrivit_Lisa`
  ADD CONSTRAINT `Tilausrivit_Lisa_ibfk_1` FOREIGN KEY (`TilausrivitID`) REFERENCES `Tilausrivit` (`TilausrivitID`),
  ADD CONSTRAINT `Tilausrivit_Lisa_ibfk_2` FOREIGN KEY (`LisaID`) REFERENCES `Lisat` (`LisaID`);

--
-- Rajoitteet taululle `Tilausrivit_Pizza`
--
ALTER TABLE `Tilausrivit_Pizza`
  ADD CONSTRAINT `Tilausrivit_Pizza_ibfk_1` FOREIGN KEY (`TilausrivitID`) REFERENCES `Tilausrivit` (`TilausrivitID`),
  ADD CONSTRAINT `Tilausrivit_Pizza_ibfk_2` FOREIGN KEY (`PizzaID`) REFERENCES `Pizzat` (`PizzaID`);

--
-- Rajoitteet taululle `Vuokraus`
--
ALTER TABLE `Vuokraus`
  ADD CONSTRAINT `Vuokraus_ibfk_1` FOREIGN KEY (`JasenID`) REFERENCES `Jasen` (`JasenID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Vuokraus_ibfk_2` FOREIGN KEY (`ElokuvaID`) REFERENCES `Elokuva` (`ElokuvaID`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
