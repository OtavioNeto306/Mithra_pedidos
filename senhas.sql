-- --------------------------------------------------------
-- Servidor:                     127.0.0.1
-- Versão do servidor:           10.11.10-MariaDB - mariadb.org binary distribution
-- OS do Servidor:               Win64
-- HeidiSQL Versão:              12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Copiando estrutura do banco de dados para emporio
CREATE DATABASE IF NOT EXISTS `emporio` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `emporio`;

-- Copiando estrutura para tabela emporio.senhas
CREATE TABLE IF NOT EXISTS `senhas` (
  `USUARIO` varchar(16) NOT NULL DEFAULT '',
  `SENHA` varchar(60) NOT NULL DEFAULT '',
  `GRAU` varchar(1) NOT NULL DEFAULT '',
  `LOJAS` varchar(50) NOT NULL DEFAULT '',
  `MODULO` varchar(70) NOT NULL DEFAULT '',
  `NOME` varchar(30) NOT NULL DEFAULT '',
  `BANCOS` varchar(30) NOT NULL DEFAULT '',
  `LIMICP` varchar(13) NOT NULL DEFAULT '',
  `CCUSTO` varchar(60) NOT NULL DEFAULT '',
  `ARMAZEN` varchar(40) NOT NULL DEFAULT '',
  `ARMDES` varchar(40) NOT NULL DEFAULT '',
  `GRUPOS` varchar(200) NOT NULL DEFAULT '',
  `COMPRADOR` varchar(6) NOT NULL DEFAULT '',
  `EMAIL` varchar(70) NOT NULL DEFAULT '',
  `NVL_CAIXA` char(1) NOT NULL DEFAULT '',
  `GESTOR` char(16) NOT NULL DEFAULT '',
  PRIMARY KEY (`USUARIO`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Exportação de dados foi desmarcado.

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
