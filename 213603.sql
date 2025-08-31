-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: 31.08.2025 klo 11:13
-- Palvelimen versio: 10.4.32-MariaDB
-- PHP Version: 8.2.12

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
-- Rakenne taululle `aineosat`
--

CREATE TABLE `aineosat` (
  `AinesosaID` int(11) NOT NULL,
  `Nimi` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Vedos taulusta `aineosat`
--

INSERT INTO `aineosat` (`AinesosaID`, `Nimi`) VALUES
(1, 'Mozzarella'),
(2, 'Tomaattikastike'),
(3, 'Pepperoni'),
(4, 'Herkkusieni'),
(5, 'Sipuli'),
(6, 'Vihreä paprika'),
(7, 'Mustat oliivit'),
(8, 'Basilika'),
(9, 'Oregano'),
(10, 'Parmesaani'),
(11, 'Kinkku'),
(12, 'Ananas'),
(13, 'Pinaatti'),
(14, 'Valkosipuli'),
(15, 'Anjovis'),
(16, 'Makkara'),
(17, 'Kirsikkatomaatti'),
(18, 'Latva-artisokka'),
(19, 'Ricotta'),
(20, 'Chilihiutaleet');

-- --------------------------------------------------------

--
-- Rakenne taululle `asiakkaat`
--

CREATE TABLE `asiakkaat` (
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
-- Rakenne taululle `koko`
--

CREATE TABLE `koko` (
  `KokoID` int(11) NOT NULL,
  `Koko` varchar(50) NOT NULL,
  `TilausrivitPizzaID` int(11) DEFAULT NULL,
  `TilausrivitLisaID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Rakenne taululle `kuljettaja`
--

CREATE TABLE `kuljettaja` (
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
-- Rakenne taululle `lisat`
--

CREATE TABLE `lisat` (
  `LisaID` int(11) NOT NULL,
  `Nimi` varchar(100) NOT NULL,
  `Hinta` decimal(8,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Rakenne taululle `pizzat`
--

CREATE TABLE `pizzat` (
  `PizzaID` int(11) NOT NULL,
  `Nimi` varchar(100) NOT NULL,
  `Pohja` varchar(50) DEFAULT NULL,
  `Tiedot` varchar(100) DEFAULT NULL,
  `Hinta` decimal(8,2) DEFAULT NULL,
  `Kuva` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Vedos taulusta `pizzat`
--

INSERT INTO `pizzat` (`PizzaID`, `Nimi`, `Pohja`, `Tiedot`, `Hinta`, `Kuva`) VALUES
(1, 'Margherita', 'Ohut', 'Tomaatin ja juuston klassikko', 7.50, 'margherita.jpg'),
(2, 'Pepperoni', 'Ohut', 'Pepperoni, juusto ja tomaattikastike', 9.00, 'margherita.jpg'),
(3, 'Hawaii', 'Paksu', 'Kinkku ja ananas', 8.50, 'margherita.jpg'),
(4, 'Veggie', 'Ohut', 'Kasviksia ja juustoa', 8.00, 'margherita.jpg'),
(5, 'BBQ Chicken', 'Paksu', 'BBQ-kanaa ja juustoa', 10.00, 'margherita.jpg'),
(6, 'Four Cheese', 'Ohut', 'Neljä erilaista juustoa', 9.50, 'margherita.jpg'),
(7, 'Meat Lovers', 'Paksu', 'Sekoitus lihaa', 11.00, 'margherita.jpg'),
(8, 'Seafood', 'Ohut', 'Katkarapuja ja tonnikalaa', 12.00, 'margherita.jpg'),
(9, 'Mushroom', 'Ohut', 'Sieniä ja juustoa', 8.00, 'margherita.jpg'),
(10, 'Spicy Italian', 'Paksu', 'Tulinen salami ja paprika', 9.50, 'margherita.jpg');

-- --------------------------------------------------------

--
-- Rakenne taululle `pizza_aineosat`
--

CREATE TABLE `pizza_aineosat` (
  `palID` int(11) NOT NULL,
  `PizzaID` int(11) NOT NULL,
  `AinesosaID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Vedos taulusta `pizza_aineosat`
--

INSERT INTO `pizza_aineosat` (`palID`, `PizzaID`, `AinesosaID`) VALUES
(1, 1, 1),
(2, 1, 2),
(3, 1, 18),
(4, 1, 19),
(5, 2, 1),
(6, 2, 2),
(7, 2, 3),
(8, 3, 1),
(9, 3, 2),
(10, 3, 4),
(11, 3, 5),
(12, 4, 1),
(13, 4, 2),
(14, 4, 6),
(15, 4, 7),
(16, 4, 8),
(17, 4, 16),
(18, 5, 1),
(19, 5, 9),
(20, 5, 7),
(21, 5, 8),
(22, 6, 1),
(23, 6, 10),
(24, 6, 11),
(25, 6, 2),
(26, 7, 1),
(27, 7, 2),
(28, 7, 3),
(29, 7, 4),
(30, 7, 12),
(31, 8, 1),
(32, 8, 2),
(33, 8, 13),
(34, 8, 14),
(35, 9, 1),
(36, 9, 2),
(37, 9, 6),
(38, 10, 1),
(39, 10, 2),
(40, 10, 12),
(41, 10, 8),
(42, 10, 20);

-- --------------------------------------------------------

--
-- Rakenne taululle `tilaus`
--

CREATE TABLE `tilaus` (
  `TilausID` int(11) NOT NULL,
  `AsiakasID` int(11) NOT NULL,
  `KuljettajaID` int(11) DEFAULT NULL,
  `TilausPvm` datetime NOT NULL,
  `Kuljetetttu` varchar(20) DEFAULT 'Odottaa'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Rakenne taululle `tilausrivit`
--

CREATE TABLE `tilausrivit` (
  `TilausrivitID` int(11) NOT NULL,
  `TilausID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Rakenne taululle `tilausrivit_lisa`
--

CREATE TABLE `tilausrivit_lisa` (
  `TilausrivitLisaID` int(11) NOT NULL,
  `TilausrivitID` int(11) NOT NULL,
  `LisaID` int(11) NOT NULL,
  `Maara` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Rakenne taululle `tilausrivit_pizza`
--

CREATE TABLE `tilausrivit_pizza` (
  `TilausrivitPizzaID` int(11) NOT NULL,
  `TilausrivitID` int(11) NOT NULL,
  `PizzaID` int(11) NOT NULL,
  `Maara` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `aineosat`
--
ALTER TABLE `aineosat`
  ADD PRIMARY KEY (`AinesosaID`);

--
-- Indexes for table `asiakkaat`
--
ALTER TABLE `asiakkaat`
  ADD PRIMARY KEY (`AsiakasID`),
  ADD KEY `idx_asiakkaat_email` (`Email`),
  ADD KEY `idx_asiakkaat_puh` (`Puh`);

--
-- Indexes for table `koko`
--
ALTER TABLE `koko`
  ADD PRIMARY KEY (`KokoID`),
  ADD KEY `TilausrivitPizzaID` (`TilausrivitPizzaID`),
  ADD KEY `TilausrivitLisaID` (`TilausrivitLisaID`);

--
-- Indexes for table `kuljettaja`
--
ALTER TABLE `kuljettaja`
  ADD PRIMARY KEY (`KuljettajaID`);

--
-- Indexes for table `lisat`
--
ALTER TABLE `lisat`
  ADD PRIMARY KEY (`LisaID`);

--
-- Indexes for table `pizzat`
--
ALTER TABLE `pizzat`
  ADD PRIMARY KEY (`PizzaID`);

--
-- Indexes for table `pizza_aineosat`
--
ALTER TABLE `pizza_aineosat`
  ADD PRIMARY KEY (`palID`),
  ADD KEY `idx_pizza_aineosat_pizzaid` (`PizzaID`),
  ADD KEY `idx_pizza_aineosat_ainesosaid` (`AinesosaID`);

--
-- Indexes for table `tilaus`
--
ALTER TABLE `tilaus`
  ADD PRIMARY KEY (`TilausID`),
  ADD KEY `KuljettajaID` (`KuljettajaID`),
  ADD KEY `idx_tilaus_asiakasid` (`AsiakasID`),
  ADD KEY `idx_tilaus_tilauspvm` (`TilausPvm`);

--
-- Indexes for table `tilausrivit`
--
ALTER TABLE `tilausrivit`
  ADD PRIMARY KEY (`TilausrivitID`),
  ADD KEY `TilausID` (`TilausID`);

--
-- Indexes for table `tilausrivit_lisa`
--
ALTER TABLE `tilausrivit_lisa`
  ADD PRIMARY KEY (`TilausrivitLisaID`),
  ADD KEY `LisaID` (`LisaID`),
  ADD KEY `idx_tilausrivit_lisa_tilausrivitid` (`TilausrivitID`);

--
-- Indexes for table `tilausrivit_pizza`
--
ALTER TABLE `tilausrivit_pizza`
  ADD PRIMARY KEY (`TilausrivitPizzaID`),
  ADD KEY `PizzaID` (`PizzaID`),
  ADD KEY `idx_tilausrivit_pizza_tilausrivitid` (`TilausrivitID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `aineosat`
--
ALTER TABLE `aineosat`
  MODIFY `AinesosaID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `asiakkaat`
--
ALTER TABLE `asiakkaat`
  MODIFY `AsiakasID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `koko`
--
ALTER TABLE `koko`
  MODIFY `KokoID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `kuljettaja`
--
ALTER TABLE `kuljettaja`
  MODIFY `KuljettajaID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `lisat`
--
ALTER TABLE `lisat`
  MODIFY `LisaID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pizzat`
--
ALTER TABLE `pizzat`
  MODIFY `PizzaID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `pizza_aineosat`
--
ALTER TABLE `pizza_aineosat`
  MODIFY `palID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `tilaus`
--
ALTER TABLE `tilaus`
  MODIFY `TilausID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tilausrivit`
--
ALTER TABLE `tilausrivit`
  MODIFY `TilausrivitID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tilausrivit_lisa`
--
ALTER TABLE `tilausrivit_lisa`
  MODIFY `TilausrivitLisaID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tilausrivit_pizza`
--
ALTER TABLE `tilausrivit_pizza`
  MODIFY `TilausrivitPizzaID` int(11) NOT NULL AUTO_INCREMENT;

--
-- Rajoitteet vedostauluille
--

--
-- Rajoitteet taululle `koko`
--
ALTER TABLE `koko`
  ADD CONSTRAINT `Koko_ibfk_1` FOREIGN KEY (`TilausrivitPizzaID`) REFERENCES `tilausrivit_pizza` (`TilausrivitPizzaID`),
  ADD CONSTRAINT `Koko_ibfk_2` FOREIGN KEY (`TilausrivitLisaID`) REFERENCES `tilausrivit_lisa` (`TilausrivitLisaID`);

--
-- Rajoitteet taululle `pizza_aineosat`
--
ALTER TABLE `pizza_aineosat`
  ADD CONSTRAINT `Pizza_Aineosat_ibfk_1` FOREIGN KEY (`PizzaID`) REFERENCES `pizzat` (`PizzaID`),
  ADD CONSTRAINT `Pizza_Aineosat_ibfk_2` FOREIGN KEY (`AinesosaID`) REFERENCES `aineosat` (`AinesosaID`);

--
-- Rajoitteet taululle `tilaus`
--
ALTER TABLE `tilaus`
  ADD CONSTRAINT `Tilaus_ibfk_1` FOREIGN KEY (`AsiakasID`) REFERENCES `asiakkaat` (`AsiakasID`),
  ADD CONSTRAINT `Tilaus_ibfk_2` FOREIGN KEY (`KuljettajaID`) REFERENCES `kuljettaja` (`KuljettajaID`);

--
-- Rajoitteet taululle `tilausrivit`
--
ALTER TABLE `tilausrivit`
  ADD CONSTRAINT `Tilausrivit_ibfk_1` FOREIGN KEY (`TilausID`) REFERENCES `tilaus` (`TilausID`);

--
-- Rajoitteet taululle `tilausrivit_lisa`
--
ALTER TABLE `tilausrivit_lisa`
  ADD CONSTRAINT `Tilausrivit_Lisa_ibfk_1` FOREIGN KEY (`TilausrivitID`) REFERENCES `tilausrivit` (`TilausrivitID`),
  ADD CONSTRAINT `Tilausrivit_Lisa_ibfk_2` FOREIGN KEY (`LisaID`) REFERENCES `lisat` (`LisaID`);

--
-- Rajoitteet taululle `tilausrivit_pizza`
--
ALTER TABLE `tilausrivit_pizza`
  ADD CONSTRAINT `Tilausrivit_Pizza_ibfk_1` FOREIGN KEY (`TilausrivitID`) REFERENCES `tilausrivit` (`TilausrivitID`),
  ADD CONSTRAINT `Tilausrivit_Pizza_ibfk_2` FOREIGN KEY (`PizzaID`) REFERENCES `pizzat` (`PizzaID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
