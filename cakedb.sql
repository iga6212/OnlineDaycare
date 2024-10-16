-- phpMyAdmin SQL Dump
-- version 4.9.5deb2
-- https://www.phpmyadmin.net/
--
-- ホスト: localhost:3306
-- 生成日時: 2024 年 10 月 16 日 20:46
-- サーバのバージョン： 8.0.32-0ubuntu0.20.04.2
-- PHP のバージョン: 7.4.3-4ubuntu2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- データベース: `cakedb`
--

-- --------------------------------------------------------

--
-- テーブルの構造 `bbs_ress_table`
--

CREATE TABLE `bbs_ress_table` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `ress_num` int NOT NULL,
  `ress` varchar(256) NOT NULL,
  `created` datetime NOT NULL,
  `modified` datetime NOT NULL,
  `thread_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- テーブルのデータのダンプ `bbs_ress_table`
--

INSERT INTO `bbs_ress_table` (`id`, `user_id`, `ress_num`, `ress`, `created`, `modified`, `thread_id`) VALUES
(1, 2, 1, 'resstest', '2023-02-28 05:04:54', '2023-02-28 05:04:54', 1),
(2, 2, 2, 'rrrrr', '2023-03-05 23:09:30', '2023-03-05 23:09:30', 1);

-- --------------------------------------------------------

--
-- テーブルの構造 `bbs_thread_table`
--

CREATE TABLE `bbs_thread_table` (
  `id` int NOT NULL,
  `thread_name` varchar(256) NOT NULL,
  `thread_num` int NOT NULL,
  `created` datetime NOT NULL,
  `modified` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- テーブルのデータのダンプ `bbs_thread_table`
--

INSERT INTO `bbs_thread_table` (`id`, `thread_name`, `thread_num`, `created`, `modified`) VALUES
(1, 'test', 0, '2023-02-28 04:46:30', '2023-02-28 04:46:30');

-- --------------------------------------------------------

--
-- テーブルの構造 `event_data_table`
--

CREATE TABLE `event_data_table` (
  `id` int NOT NULL,
  `datetime` datetime NOT NULL,
  `event_id` int NOT NULL,
  `json_data` varchar(2048) NOT NULL,
  `user_id` int NOT NULL,
  `created` datetime NOT NULL,
  `modified` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- テーブルの構造 `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `password` varchar(2048) NOT NULL,
  `nickname` varchar(256) NOT NULL,
  `introduction` varchar(256) NOT NULL,
  `created` datetime NOT NULL,
  `modified` datetime NOT NULL,
  `username` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- テーブルのデータのダンプ `users`
--

INSERT INTO `users` (`id`, `password`, `nickname`, `introduction`, `created`, `modified`, `username`) VALUES
(2, '07eb64956e05838c7433323bc9742853d909c3df', 'debug_test', 'debug_test', '2023-02-28 02:26:57', '2023-02-28 02:26:57', 'test'),
(3, '910145b033ab646d5713fd65dc9442d53eb07983', 'debug_test', 'debug_test', '2024-10-16 15:17:32', '2024-10-16 15:17:32', 'guest1');

--
-- ダンプしたテーブルのインデックス
--

--
-- テーブルのインデックス `bbs_ress_table`
--
ALTER TABLE `bbs_ress_table`
  ADD PRIMARY KEY (`id`);

--
-- テーブルのインデックス `bbs_thread_table`
--
ALTER TABLE `bbs_thread_table`
  ADD PRIMARY KEY (`id`);

--
-- テーブルのインデックス `event_data_table`
--
ALTER TABLE `event_data_table`
  ADD PRIMARY KEY (`id`);

--
-- テーブルのインデックス `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- ダンプしたテーブルのAUTO_INCREMENT
--

--
-- テーブルのAUTO_INCREMENT `bbs_ress_table`
--
ALTER TABLE `bbs_ress_table`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- テーブルのAUTO_INCREMENT `bbs_thread_table`
--
ALTER TABLE `bbs_thread_table`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- テーブルのAUTO_INCREMENT `event_data_table`
--
ALTER TABLE `event_data_table`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- テーブルのAUTO_INCREMENT `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
