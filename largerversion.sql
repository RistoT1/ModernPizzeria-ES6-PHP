-- Optimized Pizza Ordering System Database
-- Version: 2.0 - Production Ready
-- Character set and collation optimized for Finnish content

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- ========================================
-- DROP EXISTING TABLES (if recreating)
-- ========================================

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `ostoskori_rivit`;
DROP TABLE IF EXISTS `ostoskori`;
DROP TABLE IF EXISTS `tilausrivit_pizza`;
DROP TABLE IF EXISTS `tilausrivit_lisa`;
DROP TABLE IF EXISTS `pizza_aineosat`;
DROP TABLE IF EXISTS `tilaus`;
DROP TABLE IF EXISTS `asiakkaat`;
DROP TABLE IF EXISTS `kuljettajat`;
DROP TABLE IF EXISTS `pizzat`;
DROP TABLE IF EXISTS `aineosat`;
DROP TABLE IF EXISTS `lisat`;
DROP TABLE IF EXISTS `koot`;
DROP TABLE IF EXISTS `kategoriat`;
DROP TABLE IF EXISTS `alueet`;
DROP TABLE IF EXISTS `tarjoukset`;
DROP TABLE IF EXISTS `arvostelut`;
DROP TABLE IF EXISTS `maksutavat`;
DROP TABLE IF EXISTS `tilaus_historia`;

SET FOREIGN_KEY_CHECKS = 1;

-- ========================================
-- LOOKUP TABLES (Master Data)
-- ========================================

-- Pizza categories for better organization
CREATE TABLE `kategoriat` (
  `KategoriaID` TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `Nimi` VARCHAR(50) NOT NULL,
  `Kuvaus` TEXT,
  `Jarjestys` TINYINT UNSIGNED DEFAULT 0,
  `Aktiivinen` BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (`KategoriaID`),
  UNIQUE KEY `uk_kategoriat_nimi` (`Nimi`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Delivery areas with pricing zones
CREATE TABLE `alueet` (
  `AlueID` SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `Nimi` VARCHAR(100) NOT NULL,
  `PostiNumeroAlku` CHAR(5) NOT NULL,
  `PostiNumeroLoppu` CHAR(5) NOT NULL,
  `ToimitusKulut` DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  `MinTilaus` DECIMAL(6,2) DEFAULT 0.00,
  `ToimitusAika` SMALLINT UNSIGNED DEFAULT 30, -- minutes
  `Aktiivinen` BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (`AlueID`),
  KEY `idx_alueet_postiinumero` (`PostiNumeroAlku`, `PostiNumeroLoppu`),
  KEY `idx_alueet_aktiivinen` (`Aktiivinen`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Pizza sizes with proper pricing structure
CREATE TABLE `koot` (
  `KokoID` TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `Nimi` VARCHAR(20) NOT NULL, -- Pieni, Keskikoko, Iso
  `Koko_cm` TINYINT UNSIGNED, -- diameter in cm
  `HintaKerroin` DECIMAL(3,2) NOT NULL DEFAULT 1.00, -- multiplier for base price
  `Jarjestys` TINYINT UNSIGNED DEFAULT 0,
  `Aktiivinen` BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (`KokoID`),
  UNIQUE KEY `uk_koot_nimi` (`Nimi`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Payment methods
CREATE TABLE `maksutavat` (
  `MaksutapaID` TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `Nimi` VARCHAR(50) NOT NULL, -- Käteinen, Kortti, MobilePay, etc.
  `Tyyppi` ENUM('kateinen', 'kortti', 'verkkomaksu', 'muu') NOT NULL,
  `Aktiivinen` BOOLEAN DEFAULT TRUE,
  `Jarjestys` TINYINT UNSIGNED DEFAULT 0,
  PRIMARY KEY (`MaksutapaID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- PRODUCT TABLES
-- ========================================

-- Ingredients with allergen information
CREATE TABLE `aineosat` (
  `AinesosaID` SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `Nimi` VARCHAR(100) NOT NULL,
  `Allergeenit` JSON, -- ["gluten", "laktoosi", "kana"] etc.
  `Hinta` DECIMAL(4,2) DEFAULT 0.00, -- extra cost if any
  `Saatavuus` BOOLEAN DEFAULT TRUE,
  `Luotu` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`AinesosaID`),
  UNIQUE KEY `uk_aineosat_nimi` (`Nimi`),
  KEY `idx_aineosat_saatavuus` (`Saatavuus`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Extras/sides
CREATE TABLE `lisat` (
  `LisaID` SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `Nimi` VARCHAR(100) NOT NULL,
  `Kuvaus` TEXT,
  `Hinta` DECIMAL(5,2) NOT NULL,
  `KategoriaID` TINYINT UNSIGNED,
  `Saatavuus` BOOLEAN DEFAULT TRUE,
  `Suosio` SMALLINT UNSIGNED DEFAULT 0, -- for recommendations
  `Luotu` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `Paivitetty` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`LisaID`),
  KEY `idx_lisat_kategoria` (`KategoriaID`),
  KEY `idx_lisat_saatavuus` (`Saatavuus`),
  KEY `idx_lisat_suosio` (`Suosio` DESC),
  CONSTRAINT `fk_lisat_kategoria` FOREIGN KEY (`KategoriaID`) REFERENCES `kategoriat` (`KategoriaID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Pizzas with enhanced information
CREATE TABLE `pizzat` (
  `PizzaID` SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `Nimi` VARCHAR(100) NOT NULL,
  `Kuvaus` TEXT,
  `Pohja` ENUM('ohut', 'paksu', 'gluteeniton', 'vege') DEFAULT 'ohut',
  `PerusHinta` DECIMAL(5,2) NOT NULL, -- base price for default size
  `KategoriaID` TINYINT UNSIGNED,
  `Kuva` VARCHAR(255),
  `Suosio` SMALLINT UNSIGNED DEFAULT 0,
  `Saatavuus` BOOLEAN DEFAULT TRUE,
  `Uutuus` BOOLEAN DEFAULT FALSE,
  `Suositus` BOOLEAN DEFAULT FALSE, -- chef's recommendation
  `Luotu` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `Paivitetty` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`PizzaID`),
  KEY `idx_pizzat_kategoria` (`KategoriaID`),
  KEY `idx_pizzat_saatavuus` (`Saatavuus`),
  KEY `idx_pizzat_suosio` (`Suosio` DESC),
  KEY `idx_pizzat_suositus` (`Suositus`),
  FULLTEXT KEY `ft_pizzat_search` (`Nimi`, `Kuvaus`),
  CONSTRAINT `fk_pizzat_kategoria` FOREIGN KEY (`KategoriaID`) REFERENCES `kategoriat` (`KategoriaID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Pizza ingredients junction table
CREATE TABLE `pizza_aineosat` (
  `PizzaID` SMALLINT UNSIGNED NOT NULL,
  `AinesosaID` SMALLINT UNSIGNED NOT NULL,
  `Maara` ENUM('vahan', 'normaali', 'paljon') DEFAULT 'normaali',
  `Pakollinen` BOOLEAN DEFAULT TRUE, -- can this ingredient be removed
  PRIMARY KEY (`PizzaID`, `AinesosaID`),
  KEY `idx_pizza_aineosat_ainesosa` (`AinesosaID`),
  CONSTRAINT `fk_pizza_aineosat_pizza` FOREIGN KEY (`PizzaID`) REFERENCES `pizzat` (`PizzaID`) ON DELETE CASCADE,
  CONSTRAINT `fk_pizza_aineosat_ainesosa` FOREIGN KEY (`AinesosaID`) REFERENCES `aineosat` (`AinesosaID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- USER TABLES
-- ========================================

-- Customers with enhanced profile
CREATE TABLE `asiakkaat` (
  `AsiakasID` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `Etunimi` VARCHAR(50) NOT NULL,
  `Sukunimi` VARCHAR(50),
  `Puhelin` VARCHAR(20),
  `Email` VARCHAR(100),
  `Salasana` VARCHAR(255), -- hashed password
  `Osoite` VARCHAR(200),
  `Kaupunki` VARCHAR(50),
  `Postinumero` CHAR(5),
  `AlueID` SMALLINT UNSIGNED,
  `Syntymaaika` DATE,
  `Sukupuoli` ENUM('M', 'N', 'Muu'),
  `LiittymispaivaPvm` DATE DEFAULT (CURDATE()),
  `ViimeinenTilaus` DATETIME,
  `TilausMaara` SMALLINT UNSIGNED DEFAULT 0,
  `KokonaisOstot` DECIMAL(8,2) DEFAULT 0.00,
  `Aktiivinen` BOOLEAN DEFAULT TRUE,
  `EmailVahvistettu` BOOLEAN DEFAULT FALSE,
  `PuhelinVahvistettu` BOOLEAN DEFAULT FALSE,
  `SalliMarkkinointi` BOOLEAN DEFAULT FALSE,
  `Luotu` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `Paivitetty` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`AsiakasID`),
  UNIQUE KEY `uk_asiakkaat_email` (`Email`),
  KEY `idx_asiakkaat_puhelin` (`Puhelin`),
  KEY `idx_asiakkaat_postinumero` (`Postinumero`),
  KEY `idx_asiakkaat_alue` (`AlueID`),
  KEY `idx_asiakkaat_aktiivinen` (`Aktiivinen`),
  KEY `idx_asiakkaat_tilausmaara` (`TilausMaara` DESC),
  CONSTRAINT `fk_asiakkaat_alue` FOREIGN KEY (`AlueID`) REFERENCES `alueet` (`AlueID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Delivery drivers
CREATE TABLE `kuljettajat` (
  `KuljettajaID` SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `Etunimi` VARCHAR(50) NOT NULL,
  `Sukunimi` VARCHAR(50) NOT NULL,
  `Puhelin` VARCHAR(20) NOT NULL,
  `Email` VARCHAR(100),
  `Ajokortti` VARCHAR(20),
  `Auto` VARCHAR(100), -- car model/plate
  `Status` ENUM('vapaana', 'kiireinen', 'tauolla', 'pois') DEFAULT 'vapaana',
  `AlueID` SMALLINT UNSIGNED, -- preferred area
  `Palkka` DECIMAL(5,2) DEFAULT 0.00, -- per delivery
  `Aktiivinen` BOOLEAN DEFAULT TRUE,
  `Luotu` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `Paivitetty` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`KuljettajaID`),
  UNIQUE KEY `uk_kuljettajat_puhelin` (`Puhelin`),
  KEY `idx_kuljettajat_status` (`Status`),
  KEY `idx_kuljettajat_alue` (`AlueID`),
  KEY `idx_kuljettajat_aktiivinen` (`Aktiivinen`),
  CONSTRAINT `fk_kuljettajat_alue` FOREIGN KEY (`AlueID`) REFERENCES `alueet` (`AlueID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- SHOPPING CART SYSTEM
-- ========================================

-- Shopping cart (supports both guests and registered users)
CREATE TABLE `ostoskori` (
  `OstoskoriID` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `SessionToken` VARCHAR(64), -- for guest users
  `AsiakasID` INT UNSIGNED,
  `Luotu` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `Paivitetty` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `VanhentuuAt` TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL 24 HOUR),
  PRIMARY KEY (`OstoskoriID`),
  UNIQUE KEY `uk_ostoskori_session` (`SessionToken`),
  UNIQUE KEY `uk_ostoskori_asiakas` (`AsiakasID`),
  KEY `idx_ostoskori_vanhentuu` (`VanhentuuAt`),
  CONSTRAINT `fk_ostoskori_asiakas` FOREIGN KEY (`AsiakasID`) REFERENCES `asiakkaat` (`AsiakasID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Cart items
CREATE TABLE `ostoskori_rivit` (
  `RiviID` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `OstoskoriID` INT UNSIGNED NOT NULL,
  `PizzaID` SMALLINT UNSIGNED,
  `LisaID` SMALLINT UNSIGNED,
  `KokoID` TINYINT UNSIGNED,
  `Maara` TINYINT UNSIGNED NOT NULL DEFAULT 1,
  `Hinta` DECIMAL(5,2) NOT NULL, -- price at time of adding
  `Mukautettu` JSON, -- custom modifications {"remove": [1,2], "extra": [3]}
  `Lisatty` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`RiviID`),
  KEY `idx_ostoskori_rivit_kori` (`OstoskoriID`),
  KEY `idx_ostoskori_rivit_pizza` (`PizzaID`),
  KEY `idx_ostoskori_rivit_lisa` (`LisaID`),
  KEY `idx_ostoskori_rivit_koko` (`KokoID`),
  CONSTRAINT `fk_ostoskori_rivit_kori` FOREIGN KEY (`OstoskoriID`) REFERENCES `ostoskori` (`OstoskoriID`) ON DELETE CASCADE,
  CONSTRAINT `fk_ostoskori_rivit_pizza` FOREIGN KEY (`PizzaID`) REFERENCES `pizzat` (`PizzaID`),
  CONSTRAINT `fk_ostoskori_rivit_lisa` FOREIGN KEY (`LisaID`) REFERENCES `lisat` (`LisaID`),
  CONSTRAINT `fk_ostoskori_rivit_koko` FOREIGN KEY (`KokoID`) REFERENCES `koot` (`KokoID`),
  CHECK (`PizzaID` IS NOT NULL OR `LisaID` IS NOT NULL),
  CHECK (`Maara` > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- ORDER SYSTEM
-- ========================================

-- Main orders table
CREATE TABLE `tilaukset` (
  `TilausID` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `TilausNumero` VARCHAR(20) UNIQUE NOT NULL, -- customer-facing order number
  `AsiakasID` INT UNSIGNED NOT NULL,
  `KuljettajaID` SMALLINT UNSIGNED,
  `Status` ENUM('odottaa', 'vahvistettu', 'valmistuksessa', 'valmis', 'kuljetuksessa', 'toimitettu', 'peruutettu') DEFAULT 'odottaa',
  `Tyyppi` ENUM('nouto', 'kotiinkuljetus') DEFAULT 'kotiinkuljetus',
  `TilausAika` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `VahvistusAika` TIMESTAMP NULL,
  `ValmisAika` TIMESTAMP NULL,
  `ToimitusAika` TIMESTAMP NULL,
  `ToivottuToimitusAika` TIMESTAMP,
  
  -- Customer information (copied at order time)
  `ToimitusosoiteOsoite` VARCHAR(200),
  `ToimitusosoiteKaupunki` VARCHAR(50),
  `ToimitusosoitePostinumero` CHAR(5),
  `AsiakasEnimi` VARCHAR(50),
  `AsiakasSnini` VARCHAR(50),
  `AsiakasPuhelin` VARCHAR(20),
  `AsiakasEmail` VARCHAR(100),
  
  -- Pricing
  `TuotteidenSumma` DECIMAL(7,2) NOT NULL,
  `ToimitusKulu` DECIMAL(5,2) DEFAULT 0.00,
  `Alennus` DECIMAL(5,2) DEFAULT 0.00,
  `AlennusKoodi` VARCHAR(20),
  `Vero` DECIMAL(5,2) NOT NULL,
  `Kokonaishinta` DECIMAL(7,2) NOT NULL,
  
  -- Payment
  `MaksutapaID` TINYINT UNSIGNED,
  `Maksettu` BOOLEAN DEFAULT FALSE,
  `MaksuAika` TIMESTAMP NULL,
  `MaksuViite` VARCHAR(50),
  
  -- Additional info
  `Kommentit` TEXT,
  `SisaisetMuistiinpanot` TEXT, -- staff notes
  `PeruutusAika` TIMESTAMP NULL,
  `PeruutusSyy` TEXT,
  
  PRIMARY KEY (`TilausID`),
  UNIQUE KEY `uk_tilaukset_numero` (`TilausNumero`),
  KEY `idx_tilaukset_asiakas` (`AsiakasID`),
  KEY `idx_tilaukset_kuljettaja` (`KuljettajaID`),
  KEY `idx_tilaukset_status` (`Status`),
  KEY `idx_tilaukset_tyyppi` (`Tyyppi`),
  KEY `idx_tilaukset_tilausaika` (`TilausAika`),
  KEY `idx_tilaukset_toimitusaika` (`ToimitusAika`),
  KEY `idx_tilaukset_maksutapa` (`MaksutapaID`),
  KEY `idx_tilaukset_maksettu` (`Maksettu`),
  KEY `idx_tilaukset_postinumero` (`ToimitusosoitePostinumero`),
  
  CONSTRAINT `fk_tilaukset_asiakas` FOREIGN KEY (`AsiakasID`) REFERENCES `asiakkaat` (`AsiakasID`),
  CONSTRAINT `fk_tilaukset_kuljettaja` FOREIGN KEY (`KuljettajaID`) REFERENCES `kuljettajat` (`KuljettajaID`),
  CONSTRAINT `fk_tilaukset_maksutapa` FOREIGN KEY (`MaksutapaID`) REFERENCES `maksutavat` (`MaksutapaID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Order items (pizzas)
CREATE TABLE `tilausrivit_pizzat` (
  `RiviID` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `TilausID` INT UNSIGNED NOT NULL,
  `PizzaID` SMALLINT UNSIGNED NOT NULL,
  `KokoID` TINYINT UNSIGNED NOT NULL,
  `Maara` TINYINT UNSIGNED NOT NULL,
  `YksikkoHinta` DECIMAL(5,2) NOT NULL,
  `RiviSumma` DECIMAL(6,2) NOT NULL,
  `Mukautettu` JSON, -- custom modifications
  `PizzaNimi` VARCHAR(100) NOT NULL, -- snapshot of pizza name
  `KokoNimi` VARCHAR(20) NOT NULL, -- snapshot of size name
  PRIMARY KEY (`RiviID`),
  KEY `idx_tilausrivit_pizzat_tilaus` (`TilausID`),
  KEY `idx_tilausrivit_pizzat_pizza` (`PizzaID`),
  KEY `idx_tilausrivit_pizzat_koko` (`KokoID`),
  CONSTRAINT `fk_tilausrivit_pizzat_tilaus` FOREIGN KEY (`TilausID`) REFERENCES `tilaukset` (`TilausID`) ON DELETE CASCADE,
  CONSTRAINT `fk_tilausrivit_pizzat_pizza` FOREIGN KEY (`PizzaID`) REFERENCES `pizzat` (`PizzaID`),
  CONSTRAINT `fk_tilausrivit_pizzat_koko` FOREIGN KEY (`KokoID`) REFERENCES `koot` (`KokoID`),
  CHECK (`Maara` > 0),
  CHECK (`RiviSumma` = `YksikkoHinta` * `Maara`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Order items (extras/sides)
CREATE TABLE `tilausrivit_lisat` (
  `RiviID` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `TilausID` INT UNSIGNED NOT NULL,
  `LisaID` SMALLINT UNSIGNED NOT NULL,
  `Maara` TINYINT UNSIGNED NOT NULL,
  `YksikkoHinta` DECIMAL(5,2) NOT NULL,
  `RiviSumma` DECIMAL(5,2) NOT NULL,
  `LisaNimi` VARCHAR(100) NOT NULL, -- snapshot of extra name
  PRIMARY KEY (`RiviID`),
  KEY `idx_tilausrivit_lisat_tilaus` (`TilausID`),
  KEY `idx_tilausrivit_lisat_lisa` (`LisaID`),
  CONSTRAINT `fk_tilausrivit_lisat_tilaus` FOREIGN KEY (`TilausID`) REFERENCES `tilaukset` (`TilausID`) ON DELETE CASCADE,
  CONSTRAINT `fk_tilausrivit_lisat_lisa` FOREIGN KEY (`LisaID`) REFERENCES `lisat` (`LisaID`),
  CHECK (`Maara` > 0),
  CHECK (`RiviSumma` = `YksikkoHinta` * `Maara`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- PROMOTIONS & MARKETING
-- ========================================

-- Special offers and discounts
CREATE TABLE `tarjoukset` (
  `TarjousID` SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `Nimi` VARCHAR(100) NOT NULL,
  `Koodi` VARCHAR(20) UNIQUE,
  `Tyyppi` ENUM('prosentti', 'summa', 'ilmainen_toimitus', 'ostax_saay') NOT NULL,
  `Arvo` DECIMAL(5,2) NOT NULL, -- percentage or amount
  `MinTilausSumma` DECIMAL(6,2) DEFAULT 0.00,
  `MaxKayttoKerta` SMALLINT UNSIGNED DEFAULT 1,
  `MaxKayttoAsiakas` TINYINT UNSIGNED DEFAULT 1,
  `KayttoMaara` SMALLINT UNSIGNED DEFAULT 0,
  `VoimassaAlkaen` DATE NOT NULL,
  `VoimassaAsti` DATE NOT NULL,
  `AikaisinKaytetty` TIMESTAMP NULL,
  `ViimeksiKaytetty` TIMESTAMP NULL,
  `Aktiivinen` BOOLEAN DEFAULT TRUE,
  `Kuvaus` TEXT,
  `Luotu` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`TarjousID`),
  UNIQUE KEY `uk_tarjoukset_koodi` (`Koodi`),
  KEY `idx_tarjoukset_voimassa` (`VoimassaAlkaen`, `VoimassaAsti`),
  KEY `idx_tarjoukset_aktiivinen` (`Aktiivinen`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- ANALYTICS & FEEDBACK
-- ========================================

-- Customer reviews
CREATE TABLE `arvostelut` (
  `ArvosteluID` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `TilausID` INT UNSIGNED NOT NULL,
  `AsiakasID` INT UNSIGNED NOT NULL,
  `Arvosana` TINYINT UNSIGNED NOT NULL, -- 1-5 stars
  `Kommentti` TEXT,
  `RuoanLaatu` TINYINT UNSIGNED,
  `ToimitusNopeus` TINYINT UNSIGNED,
  `Asiakaspalvelu` TINYINT UNSIGNED,
  `Suosittelisi` BOOLEAN,
  `Luotu` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `Vastattu` TIMESTAMP NULL,
  `VastausKommentti` TEXT,
  `Julkinen` BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (`ArvosteluID`),
  UNIQUE KEY `uk_arvostelut_tilaus` (`TilausID`),
  KEY `idx_arvostelut_asiakas` (`AsiakasID`),
  KEY `idx_arvostelut_arvosana` (`Arvosana`),
  KEY `idx_arvostelut_luotu` (`Luotu`),
  KEY `idx_arvostelut_julkinen` (`Julkinen`),
  CONSTRAINT `fk_arvostelut_tilaus` FOREIGN KEY (`TilausID`) REFERENCES `tilaukset` (`TilausID`),
  CONSTRAINT `fk_arvostelut_asiakas` FOREIGN KEY (`AsiakasID`) REFERENCES `asiakkaat` (`AsiakasID`),
  CHECK (`Arvosana` BETWEEN 1 AND 5),
  CHECK (`RuoanLaatu` IS NULL OR `RuoanLaatu` BETWEEN 1 AND 5),
  CHECK (`ToimitusNopeus` IS NULL OR `ToimitusNopeus` BETWEEN 1 AND 5),
  CHECK (`Asiakaspalvelu` IS NULL OR `Asiakaspalvelu` BETWEEN 1 AND 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Order status history (audit trail)
CREATE TABLE `tilaus_historia` (
  `HistoriaID` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `TilausID` INT UNSIGNED NOT NULL,
  `VanhaStatus` VARCHAR(20),
  `UusiStatus` VARCHAR(20) NOT NULL,
  `Muuttaja` VARCHAR(50), -- staff member or system
  `Kommentti` TEXT,
  `Muutettu` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`HistoriaID`),
  KEY `idx_tilaus_historia_tilaus` (`TilausID`),
  KEY `idx_tilaus_historia_aika` (`Muutettu`),
  CONSTRAINT `fk_tilaus_historia_tilaus` FOREIGN KEY (`TilausID`) REFERENCES `tilaukset` (`TilausID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- INDEXES FOR PERFORMANCE
-- ========================================

-- Composite indexes for common queries
CREATE INDEX `idx_tilaukset_status_aika` ON `tilaukset` (`Status`, `TilausAika`);
CREATE INDEX `idx_tilaukset_asiakas_aika` ON `tilaukset` (`AsiakasID`, `TilausAika` DESC);
CREATE INDEX `idx_kuljettajat_status_alue` ON `kuljettajat` (`Status`, `AlueID`);

-- ========================================
-- TRIGGERS FOR DATA CONSISTENCY
-- ========================================

DELIMITER $$

-- Update customer statistics after order
CREATE TRIGGER `tr_tilaukset_after_insert`
AFTER INSERT ON `tilaukset`
FOR EACH ROW
BEGIN
    UPDATE `asiakkaat` 
    SET `ViimeinenTilaus` = NEW.`TilausAika`,
        `TilausMaara` = `TilausMaara` + 1,
        `KokonaisOstot` = `KokonaisOstot` + NEW.`Kokonaishinta`
    WHERE `AsiakasID` = NEW.`AsiakasID`;
END$$

-- Generate order number
CREATE TRIGGER `tr_tilaukset_before_insert`
BEFORE INSERT ON `tilaukset`
FOR EACH ROW
BEGIN
    IF NEW.`TilausNumero` IS NULL OR NEW.`TilausNumero` = '' THEN
        SET NEW.`TilausNumero` = CONCAT(
            DATE_FORMAT(NEW.`TilausAika`, '%Y%m%d'),
            '-',
            LPAD(
                (SELECT COALESCE(MAX(CAST(SUBSTRING(TilausNumero, -4) AS UNSIGNED)), 0) + 1
                 FROM tilaukset 
                 WHERE DATE(TilausAika) = DATE(NEW.TilausAika)
                ), 4, '0'
            )
        );
    END IF;
END$$

-- Track status changes
CREATE TRIGGER `tr_tilaukset_after_update`
AFTER UPDATE ON `tilaukset`
FOR EACH ROW
BEGIN
    IF OLD.`Status` != NEW.`Status` THEN
        INSERT INTO `tilaus_historia` (`TilausID`, `VanhaStatus`, `UusiStatus`, `Muuttaja`)
        VALUES (NEW.`TilausID`, OLD.`Status`, NEW.`Status`, 'SYSTEM');
    END IF;