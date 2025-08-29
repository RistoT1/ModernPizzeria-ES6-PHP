-- phpMyAdmin SQL Dump
-- version 5.2.1deb1+deb12u1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: 29.08.2025 klo 11:07
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
-- Rakenne taululle `Koko`
--

CREATE TABLE `Koko` (
  `KokoID` int(11) NOT NULL,
  `Koko` varchar(50) NOT NULL,
  `TilausrivitPizzaID` int(11) DEFAULT NULL,
  `TilausrivitLisaID` int(11) DEFAULT NULL
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
-- Rakenne taululle `Lisat`
--

CREATE TABLE `Lisat` (
  `LisaID` int(11) NOT NULL,
  `Nimi` varchar(100) NOT NULL,
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
  `Tiedot` varchar(100) DEFAULT NULL,
  `Hinta` decimal(8,2) DEFAULT NULL,
  `Kuva` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Vedos taulusta `Pizzat`
--

INSERT INTO `Pizzat` (`PizzaID`, `Nimi`, `Pohja`, `Tiedot`, `Hinta`, `Kuva`) VALUES
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
-- Indexes for table `Koko`
--
ALTER TABLE `Koko`
  ADD PRIMARY KEY (`KokoID`),
  ADD KEY `TilausrivitPizzaID` (`TilausrivitPizzaID`),
  ADD KEY `TilausrivitLisaID` (`TilausrivitLisaID`);

--
-- Indexes for table `Kuljettaja`
--
ALTER TABLE `Kuljettaja`
  ADD PRIMARY KEY (`KuljettajaID`);

--
-- Indexes for table `Lisat`
--
ALTER TABLE `Lisat`
  ADD PRIMARY KEY (`LisaID`);

--
-- Indexes for table `Pizzat`
--
ALTER TABLE `Pizzat`
  ADD PRIMARY KEY (`PizzaID`);

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
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Aineosat`
--
ALTER TABLE `Aineosat`
  MODIFY `AinesosaID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Asiakkaat`
--
ALTER TABLE `Asiakkaat`
  MODIFY `AsiakasID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Koko`
--
ALTER TABLE `Koko`
  MODIFY `KokoID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Kuljettaja`
--
ALTER TABLE `Kuljettaja`
  MODIFY `KuljettajaID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Lisat`
--
ALTER TABLE `Lisat`
  MODIFY `LisaID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Pizzat`
--
ALTER TABLE `Pizzat`
  MODIFY `PizzaID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `Pizza_Aineosat`
--
ALTER TABLE `Pizza_Aineosat`
  MODIFY `palID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Tilaus`
--
ALTER TABLE `Tilaus`
  MODIFY `TilausID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Tilausrivit`
--
ALTER TABLE `Tilausrivit`
  MODIFY `TilausrivitID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Tilausrivit_Lisa`
--
ALTER TABLE `Tilausrivit_Lisa`
  MODIFY `TilausrivitLisaID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Tilausrivit_Pizza`
--
ALTER TABLE `Tilausrivit_Pizza`
  MODIFY `TilausrivitPizzaID` int(11) NOT NULL AUTO_INCREMENT;

--
-- Rajoitteet vedostauluille
--

--
-- Rajoitteet taululle `Koko`
--
ALTER TABLE `Koko`
  ADD CONSTRAINT `Koko_ibfk_1` FOREIGN KEY (`TilausrivitPizzaID`) REFERENCES `Tilausrivit_Pizza` (`TilausrivitPizzaID`),
  ADD CONSTRAINT `Koko_ibfk_2` FOREIGN KEY (`TilausrivitLisaID`) REFERENCES `Tilausrivit_Lisa` (`TilausrivitLisaID`);

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
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
