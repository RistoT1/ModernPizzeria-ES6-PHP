-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: 31.08.2025 klo 18:50
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
  `Hinta` decimal(4,2) DEFAULT 0.00,
  `Aktiivinen` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Vedos taulusta `aineosat`
--

INSERT INTO `aineosat` (`AinesosaID`, `Nimi`, `Hinta`, `Aktiivinen`) VALUES
(1, 'Mozzarella', 0.00, 1),
(2, 'Tomaattikastike', 0.00, 1),
(3, 'Pepperoni', 0.00, 1),
(4, 'Herkkusieni', 0.00, 1),
(5, 'Sipuli', 0.00, 1),
(6, 'Vihreä paprika', 0.00, 1),
(7, 'Mustat oliivit', 0.00, 1),
(8, 'Basilika', 0.00, 1),
(9, 'Oregano', 0.00, 1),
(10, 'Parmesaani', 0.00, 1),
(11, 'Kinkku', 0.00, 1),
(12, 'Ananas', 0.00, 1),
(13, 'Pinaatti', 0.00, 1),
(14, 'Valkosipuli', 0.00, 1),
(15, 'Anjovis', 0.00, 1),
(16, 'Makkara', 0.00, 1),
(17, 'Kirsikkatomaatti', 0.00, 1),
(18, 'Latva-artisokka', 0.00, 1),
(19, 'Ricotta', 0.00, 1),
(20, 'Chilihiutaleet', 0.00, 1);

-- --------------------------------------------------------

--
-- Rakenne taululle `asiakkaat`
--

CREATE TABLE `asiakkaat` (
  `AsiakasID` int(10) UNSIGNED NOT NULL,
  `Enimi` varchar(100) NOT NULL,
  `Snimi` varchar(50) DEFAULT NULL,
  `Puh` varchar(20) DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `Osoite` varchar(200) DEFAULT NULL,
  `PostiNum` char(5) DEFAULT NULL,
  `PostiTp` varchar(50) DEFAULT NULL,
  `LiitymisPvm` date DEFAULT curdate(),
  `MuokattuvPvm` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `Aktiivinen` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Vedos taulusta `asiakkaat`
--

INSERT INTO `asiakkaat` (`AsiakasID`, `Enimi`, `Snimi`, `Puh`, `Email`, `Osoite`, `PostiNum`, `PostiTp`, `LiitymisPvm`, `MuokattuvPvm`, `Aktiivinen`) VALUES
(1, 'Testi', 'Käyttäjä', '+358401234567', 'testi@example.com', 'Testikatu 1', '48100', 'Kotka', '2025-08-31', '2025-08-31 15:38:11', 1);

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
-- Rakenne taululle `lisat`
--

CREATE TABLE `lisat` (
  `LisaID` smallint(5) UNSIGNED NOT NULL,
  `Nimi` varchar(100) NOT NULL,
  `Hinta` decimal(8,2) DEFAULT NULL,
  `Aktiivinen` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Vedos taulusta `lisat`
--

INSERT INTO `lisat` (`LisaID`, `Nimi`, `Hinta`, `Aktiivinen`) VALUES
(1, 'Coca-Cola 0,5l', 2.50, 1),
(2, 'Vesi 0,5l', 1.50, 1),
(3, 'Valkosipulileipä', 4.00, 1),
(4, 'Salaatti', 3.50, 1),
(5, 'Tiramisu', 5.50, 1);

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
(2, '2b7cbb608fe25a6b3f2eff1d672b1756', NULL, '2025-08-31 16:05:54', '2025-08-31 16:18:24');

-- --------------------------------------------------------

--
-- Rakenne taululle `ostoskori_rivit`
--

CREATE TABLE `ostoskori_rivit` (
  `OstoskoriRivitID` int(10) UNSIGNED NOT NULL,
  `OstoskoriID` int(10) UNSIGNED NOT NULL,
  `PizzaID` smallint(5) UNSIGNED DEFAULT NULL,
  `LisaID` smallint(5) UNSIGNED DEFAULT NULL,
  `KokoID` tinyint(3) UNSIGNED DEFAULT NULL,
  `Maara` tinyint(3) UNSIGNED NOT NULL DEFAULT 1,
  `Hinta` decimal(10,2) NOT NULL DEFAULT 0.00
) ;

--
-- Vedos taulusta `ostoskori_rivit`
--

INSERT INTO `ostoskori_rivit` (`OstoskoriRivitID`, `OstoskoriID`, `PizzaID`, `LisaID`, `KokoID`, `Maara`, `Hinta`) VALUES
(2, 2, 1, NULL, 2, 6, 0.00),
(3, 2, 1, NULL, 3, 4, 9.75);

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
(2, 'Pepperoni', 'Ohut', 'Pepperoni, juusto ja tomaattikastike', 9.00, 'margherita.jpg', 1, 0),
(3, 'Hawaii', 'Paksu', 'Kinkku ja ananas', 8.50, 'margherita.jpg', 1, 0),
(4, 'Veggie', 'Ohut', 'Kasviksia ja juustoa', 8.00, 'margherita.jpg', 1, 0),
(5, 'BBQ Chicken', 'Paksu', 'BBQ-kanaa ja juustoa', 10.00, 'margherita.jpg', 1, 0),
(6, 'Four Cheese', 'Ohut', 'Neljä erilaista juustoa', 9.50, 'margherita.jpg', 1, 0),
(7, 'Meat Lovers', 'Paksu', 'Sekoitus lihaa', 11.00, 'margherita.jpg', 1, 0),
(8, 'Seafood', 'Ohut', 'Katkarapuja ja tonnikalaa', 12.00, 'margherita.jpg', 1, 0),
(9, 'Mushroom', 'Ohut', 'Sieniä ja juustoa', 8.00, 'margherita.jpg', 1, 0),
(10, 'Spicy Italian', 'Paksu', 'Tulinen salami ja paprika', 9.50, 'margherita.jpg', 1, 0);

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
(20, 5, 7),
(21, 5, 8),
(19, 5, 9),
(22, 6, 1),
(25, 6, 2),
(23, 6, 10),
(24, 6, 11),
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
(41, 10, 8),
(40, 10, 12),
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
(1, 1, 1, '2025-08-31 15:38:11', 'Odottaa', 19.40, NULL);

-- --------------------------------------------------------

--
-- Rakenne taululle `tilausrivit_lisat`
--

CREATE TABLE `tilausrivit_lisat` (
  `TilausrivitLisaID` int(10) UNSIGNED NOT NULL,
  `TilausID` int(10) UNSIGNED NOT NULL,
  `LisaID` smallint(5) UNSIGNED NOT NULL,
  `Maara` tinyint(3) UNSIGNED NOT NULL,
  `Hinta` decimal(6,2) NOT NULL
) ;

--
-- Vedos taulusta `tilausrivit_lisat`
--

INSERT INTO `tilausrivit_lisat` (`TilausrivitLisaID`, `TilausID`, `LisaID`, `Maara`, `Hinta`) VALUES
(1, 1, 1, 1, 2.50);

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
) ;

--
-- Vedos taulusta `tilausrivit_pizzat`
--

INSERT INTO `tilausrivit_pizzat` (`TilausrivitPizzaID`, `TilausID`, `PizzaID`, `KokoID`, `Maara`, `Hinta`) VALUES
(1, 1, 1, 3, 1, 9.75),
(2, 1, 2, 2, 1, 9.00);

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
,`AsiakasNimi` varchar(151)
,`AsiakasPuh` varchar(20)
,`AsiakasEmail` varchar(100)
,`KuljettajaNimi` varchar(151)
,`Kokonaishinta` decimal(8,2)
,`TuoteMaara` bigint(22)
);

-- --------------------------------------------------------

--
-- Näkymän rakenne `v_pizzat_aineosat`
--
DROP TABLE IF EXISTS `v_pizzat_aineosat`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_pizzat_aineosat`  AS SELECT `p`.`PizzaID` AS `PizzaID`, `p`.`Nimi` AS `PizzaNimi`, `p`.`Pohja` AS `Pohja`, `p`.`Tiedot` AS `Tiedot`, `p`.`Hinta` AS `Hinta`, `p`.`Kuva` AS `Kuva`, `p`.`Aktiivinen` AS `Aktiivinen`, group_concat(`a`.`Nimi` order by `a`.`Nimi` ASC separator ', ') AS `Aineosat`, count(`pa`.`AinesosaID`) AS `AinesosaMaara` FROM ((`pizzat` `p` left join `pizza_aineosat` `pa` on(`p`.`PizzaID` = `pa`.`PizzaID`)) left join `aineosat` `a` on(`pa`.`AinesosaID` = `a`.`AinesosaID` and `a`.`Aktiivinen` = 1)) WHERE `p`.`Aktiivinen` = 1 GROUP BY `p`.`PizzaID` ;

-- --------------------------------------------------------

--
-- Näkymän rakenne `v_tilaukset_yhteenveto`
--
DROP TABLE IF EXISTS `v_tilaukset_yhteenveto`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_tilaukset_yhteenveto`  AS SELECT `t`.`TilausID` AS `TilausID`, `t`.`TilausPvm` AS `TilausPvm`, `t`.`Status` AS `Status`, concat(`a`.`Enimi`,coalesce(concat(' ',`a`.`Snimi`),'')) AS `AsiakasNimi`, `a`.`Puh` AS `AsiakasPuh`, `a`.`Email` AS `AsiakasEmail`, coalesce(concat(`k`.`Enimi`,' ',`k`.`Snimi`),'Ei määritetty') AS `KuljettajaNimi`, `t`.`Kokonaishinta` AS `Kokonaishinta`, (select count(0) from `tilausrivit_pizzat` `tp` where `tp`.`TilausID` = `t`.`TilausID`) + (select count(0) from `tilausrivit_lisat` `tl` where `tl`.`TilausID` = `t`.`TilausID`) AS `TuoteMaara` FROM ((`tilaukset` `t` join `asiakkaat` `a` on(`t`.`AsiakasID` = `a`.`AsiakasID`)) left join `kuljettajat` `k` on(`t`.`KuljettajaID` = `k`.`KuljettajaID`)) ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `aineosat`
--
ALTER TABLE `aineosat`
  ADD PRIMARY KEY (`AinesosaID`),
  ADD UNIQUE KEY `uk_aineosat_nimi` (`Nimi`),
  ADD KEY `idx_aineosat_aktiivinen` (`Aktiivinen`);

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
-- Indexes for table `lisat`
--
ALTER TABLE `lisat`
  ADD PRIMARY KEY (`LisaID`),
  ADD KEY `idx_lisat_aktiivinen` (`Aktiivinen`);

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
  ADD KEY `idx_ostoskori_rivit_lisa` (`LisaID`),
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
-- Indexes for table `tilausrivit_lisat`
--
ALTER TABLE `tilausrivit_lisat`
  ADD PRIMARY KEY (`TilausrivitLisaID`),
  ADD KEY `idx_tilausrivit_lisat_tilaus` (`TilausID`),
  ADD KEY `idx_tilausrivit_lisat_lisa` (`LisaID`);

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
  MODIFY `AinesosaID` smallint(5) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `asiakkaat`
--
ALTER TABLE `asiakkaat`
  MODIFY `AsiakasID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

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
-- AUTO_INCREMENT for table `lisat`
--
ALTER TABLE `lisat`
  MODIFY `LisaID` smallint(5) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `ostoskori`
--
ALTER TABLE `ostoskori`
  MODIFY `OstoskoriID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `ostoskori_rivit`
--
ALTER TABLE `ostoskori_rivit`
  MODIFY `OstoskoriRivitID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

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
  MODIFY `TilausID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tilausrivit_lisat`
--
ALTER TABLE `tilausrivit_lisat`
  MODIFY `TilausrivitLisaID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tilausrivit_pizzat`
--
ALTER TABLE `tilausrivit_pizzat`
  MODIFY `TilausrivitPizzaID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

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
  ADD CONSTRAINT `fk_ostoskori_rivit_koko` FOREIGN KEY (`KokoID`) REFERENCES `koot` (`KokoID`),
  ADD CONSTRAINT `fk_ostoskori_rivit_kori` FOREIGN KEY (`OstoskoriID`) REFERENCES `ostoskori` (`OstoskoriID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_ostoskori_rivit_lisa` FOREIGN KEY (`LisaID`) REFERENCES `lisat` (`LisaID`),
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
-- Rajoitteet taululle `tilausrivit_lisat`
--
ALTER TABLE `tilausrivit_lisat`
  ADD CONSTRAINT `fk_tilausrivit_lisat_lisa` FOREIGN KEY (`LisaID`) REFERENCES `lisat` (`LisaID`),
  ADD CONSTRAINT `fk_tilausrivit_lisat_tilaus` FOREIGN KEY (`TilausID`) REFERENCES `tilaukset` (`TilausID`) ON DELETE CASCADE;

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
