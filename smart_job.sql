-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 24, 2026 at 02:50 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `smart_job`
--

-- --------------------------------------------------------

--
-- Table structure for table `applications`
--

CREATE TABLE `applications` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `job_id` bigint(20) UNSIGNED NOT NULL,
  `job_seeker_id` bigint(20) UNSIGNED NOT NULL,
  `ai_score` decimal(5,2) DEFAULT NULL,
  `missing_skills_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`missing_skills_json`)),
  `status` enum('applied','under_review','shortlisted','rejected') NOT NULL DEFAULT 'applied',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `applications`
--

INSERT INTO `applications` (`id`, `job_id`, `job_seeker_id`, `ai_score`, `missing_skills_json`, `status`, `created_at`, `updated_at`, `deleted_at`) VALUES
(6, 6, 5, 92.50, '[]', 'shortlisted', '2026-05-23 21:44:07', '2026-05-23 21:44:07', NULL),
(7, 7, 6, 88.00, '[]', 'under_review', '2026-05-23 21:44:07', '2026-05-23 21:44:07', NULL),
(8, 8, 7, 90.25, '[\"Power BI\"]', 'shortlisted', '2026-05-23 21:44:07', '2026-05-23 21:44:07', NULL),
(9, 9, 8, 76.00, '[\"Automation framework\"]', 'applied', '2026-05-23 21:44:07', '2026-05-23 21:44:07', NULL),
(10, 10, 5, 54.50, '[\"Kubernetes\",\"AWS\"]', 'rejected', '2026-05-23 21:44:07', '2026-05-23 21:44:07', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `application_status_history`
--

CREATE TABLE `application_status_history` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `application_id` bigint(20) UNSIGNED NOT NULL,
  `status` varchar(50) NOT NULL,
  `changed_by` bigint(20) UNSIGNED NOT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `application_status_history`
--

INSERT INTO `application_status_history` (`id`, `application_id`, `status`, `changed_by`, `notes`, `created_at`) VALUES
(10, 6, 'applied', 9, 'Demo application created for testing.', '2026-05-18 21:44:07'),
(11, 6, 'shortlisted', 10, 'Strong match. Ready for technical interview.', '2026-05-21 21:44:07'),
(12, 7, 'applied', 9, 'Demo application created for testing.', '2026-05-18 21:44:07'),
(13, 7, 'under_review', 11, 'Portfolio review in progress.', '2026-05-21 21:44:07'),
(14, 8, 'applied', 9, 'Demo application created for testing.', '2026-05-18 21:44:07'),
(15, 8, 'shortlisted', 12, 'Good analytics background.', '2026-05-21 21:44:07'),
(16, 9, 'applied', 9, 'Demo application created for testing.', '2026-05-18 21:44:07'),
(17, 10, 'applied', 9, 'Demo application created for testing.', '2026-05-18 21:44:07'),
(18, 10, 'rejected', 11, 'Missing core DevOps requirements.', '2026-05-21 21:44:07');

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `company_profiles`
--

CREATE TABLE `company_profiles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `company_name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `logo_url` varchar(500) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `industry` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `founded_year` varchar(255) DEFAULT NULL,
  `company_size` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `company_profiles`
--

INSERT INTO `company_profiles` (`id`, `user_id`, `company_name`, `description`, `logo_url`, `website`, `location`, `created_at`, `updated_at`, `industry`, `phone`, `founded_year`, `company_size`) VALUES
(4, 10, 'TechLabs Egypt', 'Product engineering company building SaaS platforms for regional clients.', 'https://placehold.co/160x160?text=TL', 'https://techlabs.test', 'Cairo, Egypt', '2026-05-23 21:44:06', '2026-05-23 21:44:06', 'Software Development', '+201000000101', '2018', '51-200'),
(5, 11, 'Nile Commerce', 'E-commerce marketplace focused on retail, payments, and logistics.', 'https://placehold.co/160x160?text=NC', 'https://nilecommerce.test', 'Alexandria, Egypt', '2026-05-23 21:44:06', '2026-05-23 21:44:06', 'E-Commerce', '+201000000202', '2020', '201-500'),
(6, 12, 'DataVision Analytics', 'Analytics consultancy helping companies turn operational data into decisions.', 'https://placehold.co/160x160?text=DV', 'https://datavision.test', 'Giza, Egypt', '2026-05-23 21:44:06', '2026-05-23 21:44:06', 'Data Analytics', '+201000000303', '2016', '11-50');

-- --------------------------------------------------------

--
-- Table structure for table `cv_parsed_data`
--

CREATE TABLE `cv_parsed_data` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `job_seeker_id` bigint(20) UNSIGNED NOT NULL,
  `parsed_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`parsed_json`)),
  `parsed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cv_parsed_data`
--

INSERT INTO `cv_parsed_data` (`id`, `job_seeker_id`, `parsed_json`, `parsed_at`, `created_at`, `updated_at`) VALUES
(5, 5, '{\"summary\":\"Backend developer with Laravel and API experience.\",\"skills\":[\"PHP\",\"Laravel\",\"MySQL\",\"REST API\",\"Git\",\"Docker\"],\"experience_years\":3,\"education\":\"Bachelor of Computer Science\"}', '2026-05-21 21:44:07', '2026-05-23 21:44:07', '2026-05-23 21:44:07'),
(6, 6, '{\"summary\":\"Frontend developer focused on React and TypeScript.\",\"skills\":[\"JavaScript\",\"TypeScript\",\"React\",\"Tailwind CSS\",\"REST API\",\"Git\"],\"experience_years\":2,\"education\":\"Bachelor of Information Systems\"}', '2026-05-21 21:44:07', '2026-05-23 21:44:07', '2026-05-23 21:44:07'),
(7, 7, '{\"summary\":\"Data analyst with Python, SQL, and dashboarding experience.\",\"skills\":[\"Python\",\"PostgreSQL\",\"MySQL\",\"Communication\",\"Problem Solving\",\"Presentation Skills\"],\"experience_years\":4,\"education\":\"Bachelor of Statistics\"}', '2026-05-21 21:44:07', '2026-05-23 21:44:07', '2026-05-23 21:44:07'),
(8, 8, '{\"summary\":\"Junior QA tester learning automation and CI\\/CD workflows.\",\"skills\":[\"JavaScript\",\"Git\",\"TDD\",\"Communication\",\"Attention to Detail\"],\"experience_years\":1,\"education\":\"Bachelor of Business Information Systems\"}', '2026-05-21 21:44:07', '2026-05-23 21:44:07', '2026-05-23 21:44:07');

-- --------------------------------------------------------

--
-- Table structure for table `email_verification_tokens`
--

CREATE TABLE `email_verification_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `token` varchar(64) NOT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_posts`
--

CREATE TABLE `job_posts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `company_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `category` varchar(255) DEFAULT NULL,
  `description` text NOT NULL,
  `responsibilities` text DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `work_mode` varchar(255) DEFAULT NULL,
  `job_type` enum('full_time','part_time','remote','contract','internship') NOT NULL,
  `experience_level` varchar(255) DEFAULT NULL,
  `education` varchar(255) DEFAULT NULL,
  `salary_range` varchar(100) DEFAULT NULL,
  `salary_min` bigint(20) DEFAULT NULL,
  `salary_max` bigint(20) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `status` varchar(255) NOT NULL DEFAULT 'active',
  `views` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `job_posts`
--

INSERT INTO `job_posts` (`id`, `company_id`, `title`, `category`, `description`, `responsibilities`, `location`, `work_mode`, `job_type`, `experience_level`, `education`, `salary_range`, `salary_min`, `salary_max`, `is_active`, `status`, `views`, `created_at`, `updated_at`, `deleted_at`) VALUES
(6, 4, 'Laravel Backend Developer', 'Backend Development', 'Build APIs, queues, and integrations for a growing SaaS platform.', 'Develop REST APIs, optimize MySQL queries, write tests, and review pull requests.', 'Cairo, Egypt', 'Hybrid', 'full_time', 'Mid Level', 'Bachelor degree preferred', '18000 - 28000 EGP', 18000, 28000, 1, 'active', 43, '2026-05-23 21:44:07', '2026-05-23 21:44:07', NULL),
(7, 5, 'React Frontend Engineer', 'Frontend Development', 'Create fast dashboards and storefront experiences for marketplace teams.', 'Build React components, integrate APIs, improve UX, and support responsive layouts.', 'Remote', 'Remote', 'remote', 'Junior to Mid Level', 'Relevant experience accepted', '16000 - 26000 EGP', 16000, 26000, 1, 'active', 61, '2026-05-23 21:44:07', '2026-05-23 21:44:07', NULL),
(8, 6, 'Data Analyst', 'Data', 'Analyze business data and create reports for product and operations teams.', 'Write SQL queries, clean datasets, prepare dashboards, and present insights.', 'Giza, Egypt', 'On-site', 'full_time', 'Mid Level', 'Statistics, Computer Science, or similar', '14000 - 22000 EGP', 14000, 22000, 1, 'active', 29, '2026-05-23 21:44:07', '2026-05-23 21:44:07', NULL),
(9, 4, 'QA Automation Intern', 'Quality Assurance', 'Join the QA team to test web applications and learn automation workflows.', 'Create test cases, report bugs, help maintain automated test suites.', 'Cairo, Egypt', 'On-site', 'internship', 'Entry Level', 'Student or fresh graduate', '4000 - 6000 EGP', 4000, 6000, 1, 'active', 18, '2026-05-23 21:44:07', '2026-05-23 21:44:07', NULL),
(10, 5, 'DevOps Engineer', 'Infrastructure', 'Support deployment pipelines, cloud infrastructure, and monitoring.', 'Maintain Docker images, CI/CD pipelines, Linux servers, and cloud resources.', 'Alexandria, Egypt', 'Hybrid', 'contract', 'Senior Level', 'Relevant experience accepted', '25000 - 38000 EGP', 25000, 38000, 1, 'active', 35, '2026-05-23 21:44:07', '2026-05-23 21:44:07', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `job_post_views`
--

CREATE TABLE `job_post_views` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `job_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_required_skills`
--

CREATE TABLE `job_required_skills` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `job_id` bigint(20) UNSIGNED NOT NULL,
  `skill_id` bigint(20) UNSIGNED NOT NULL,
  `is_mandatory` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `job_required_skills`
--

INSERT INTO `job_required_skills` (`id`, `job_id`, `skill_id`, `is_mandatory`) VALUES
(29, 6, 46, 1),
(30, 6, 47, 1),
(31, 6, 55, 1),
(32, 6, 62, 0),
(33, 6, 61, 0),
(34, 6, 59, 0),
(35, 7, 49, 1),
(36, 7, 50, 1),
(37, 7, 51, 1),
(38, 7, 71, 0),
(39, 7, 62, 0),
(40, 7, 61, 0),
(41, 8, 48, 1),
(42, 8, 56, 1),
(43, 8, 55, 1),
(44, 8, 78, 0),
(45, 8, 87, 0),
(46, 9, 49, 1),
(47, 9, 61, 1),
(48, 9, 68, 1),
(49, 9, 84, 0),
(50, 9, 76, 0),
(51, 10, 59, 1),
(52, 10, 60, 1),
(53, 10, 64, 1),
(54, 10, 66, 0),
(55, 10, 69, 0),
(56, 10, 67, 0);

-- --------------------------------------------------------

--
-- Table structure for table `job_seeker_profiles`
--

CREATE TABLE `job_seeker_profiles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `resume_file_url` varchar(500) DEFAULT NULL,
  `years_of_experience` tinyint(4) DEFAULT NULL,
  `education_level` text DEFAULT NULL,
  `contact_information` text DEFAULT NULL,
  `cv_parse_status` enum('pending','processing','completed','done','failed') DEFAULT 'pending',
  `phone` varchar(30) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `job_seeker_profiles`
--

INSERT INTO `job_seeker_profiles` (`id`, `user_id`, `resume_file_url`, `years_of_experience`, `education_level`, `contact_information`, `cv_parse_status`, `phone`, `address`, `created_at`, `updated_at`) VALUES
(5, 13, '/demo/cvs/nour-hassan.pdf', 3, 'Bachelor of Computer Science', '{\"firstName\":\"Nour\",\"lastName\":\"Hassan\",\"title\":\"Laravel Developer\"}', 'done', '+201111111111', 'Nasr City, Cairo', '2026-05-23 21:44:07', '2026-05-23 21:44:07'),
(6, 14, '/demo/cvs/omar-adel.pdf', 2, 'Bachelor of Information Systems', '{\"firstName\":\"Omar\",\"lastName\":\"Adel\",\"title\":\"Frontend Developer\"}', 'done', '+201222222222', 'Maadi, Cairo', '2026-05-23 21:44:07', '2026-05-23 21:44:07'),
(7, 15, '/demo/cvs/salma-mostafa.pdf', 4, 'Bachelor of Statistics', '{\"firstName\":\"Salma\",\"lastName\":\"Mostafa\",\"title\":\"Data Analyst\"}', 'done', '+201333333333', 'Dokki, Giza', '2026-05-23 21:44:07', '2026-05-23 21:44:07'),
(8, 16, '/demo/cvs/youssef-ali.pdf', 1, 'Bachelor of Business Information Systems', '{\"firstName\":\"Youssef\",\"lastName\":\"Ali\",\"title\":\"Junior QA Tester\"}', 'done', '+201444444444', 'Mansoura, Egypt', '2026-05-23 21:44:07', '2026-05-23 21:44:07');

-- --------------------------------------------------------

--
-- Table structure for table `job_seeker_skills`
--

CREATE TABLE `job_seeker_skills` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `job_seeker_id` bigint(20) UNSIGNED NOT NULL,
  `skill_id` bigint(20) UNSIGNED NOT NULL,
  `source` enum('cv','manual') NOT NULL DEFAULT 'cv',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `job_seeker_skills`
--

INSERT INTO `job_seeker_skills` (`id`, `job_seeker_id`, `skill_id`, `source`, `created_at`, `updated_at`) VALUES
(24, 5, 46, 'manual', '2026-05-23 21:44:07', '2026-05-23 21:44:07'),
(25, 5, 47, 'manual', '2026-05-23 21:44:07', '2026-05-23 21:44:07'),
(26, 5, 55, 'manual', '2026-05-23 21:44:07', '2026-05-23 21:44:07'),
(27, 5, 62, 'manual', '2026-05-23 21:44:07', '2026-05-23 21:44:07'),
(28, 5, 61, 'manual', '2026-05-23 21:44:07', '2026-05-23 21:44:07'),
(29, 5, 59, 'manual', '2026-05-23 21:44:07', '2026-05-23 21:44:07'),
(30, 6, 49, 'manual', '2026-05-23 21:44:07', '2026-05-23 21:44:07'),
(31, 6, 50, 'manual', '2026-05-23 21:44:07', '2026-05-23 21:44:07'),
(32, 6, 51, 'manual', '2026-05-23 21:44:07', '2026-05-23 21:44:07'),
(33, 6, 71, 'manual', '2026-05-23 21:44:07', '2026-05-23 21:44:07'),
(34, 6, 62, 'manual', '2026-05-23 21:44:07', '2026-05-23 21:44:07'),
(35, 6, 61, 'manual', '2026-05-23 21:44:07', '2026-05-23 21:44:07'),
(36, 7, 48, 'manual', '2026-05-23 21:44:07', '2026-05-23 21:44:07'),
(37, 7, 56, 'manual', '2026-05-23 21:44:07', '2026-05-23 21:44:07'),
(38, 7, 55, 'manual', '2026-05-23 21:44:07', '2026-05-23 21:44:07'),
(39, 7, 76, 'manual', '2026-05-23 21:44:07', '2026-05-23 21:44:07'),
(40, 7, 78, 'manual', '2026-05-23 21:44:07', '2026-05-23 21:44:07'),
(41, 7, 87, 'manual', '2026-05-23 21:44:07', '2026-05-23 21:44:07'),
(42, 8, 49, 'manual', '2026-05-23 21:44:07', '2026-05-23 21:44:07'),
(43, 8, 61, 'manual', '2026-05-23 21:44:07', '2026-05-23 21:44:07'),
(44, 8, 68, 'manual', '2026-05-23 21:44:07', '2026-05-23 21:44:07'),
(45, 8, 76, 'manual', '2026-05-23 21:44:07', '2026-05-23 21:44:07'),
(46, 8, 84, 'manual', '2026-05-23 21:44:07', '2026-05-23 21:44:07');

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `sender_id` bigint(20) UNSIGNED NOT NULL,
  `receiver_id` bigint(20) UNSIGNED NOT NULL,
  `job_id` bigint(20) UNSIGNED DEFAULT NULL,
  `content` text NOT NULL,
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `sender_id`, `receiver_id`, `job_id`, `content`, `read_at`, `created_at`, `updated_at`) VALUES
(8, 10, 13, 6, 'Hi Nour, your Laravel application looks strong. Can we schedule a technical interview?', '2026-05-23 15:44:07', '2026-05-23 09:44:07', '2026-05-23 09:44:07'),
(9, 13, 10, 6, 'Sure, I am available this week.', '2026-05-23 15:44:07', '2026-05-23 10:44:07', '2026-05-23 10:44:07'),
(10, 10, 13, 6, 'Interview scheduled for the Laravel Backend Developer role. Please prepare a recent API project.', NULL, '2026-05-23 11:44:07', '2026-05-23 11:44:07'),
(11, 11, 14, 7, 'Hi Omar, thanks for applying. Do you have a live React portfolio?', '2026-05-23 15:44:07', '2026-05-23 09:44:07', '2026-05-23 09:44:07'),
(12, 14, 11, 7, 'Yes, I can share two dashboards and a marketplace UI sample.', NULL, '2026-05-23 10:44:07', '2026-05-23 10:44:07'),
(13, 12, 15, 8, 'Hello Salma, we liked your SQL and Python background.', '2026-05-23 15:44:07', '2026-05-23 09:44:07', '2026-05-23 09:44:07'),
(14, 12, 15, 8, 'Interview scheduled for the Data Analyst role. The call will include a short case study.', NULL, '2026-05-23 10:44:07', '2026-05-23 10:44:07');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '0002_01_01_000004_create_skills_table', 1),
(5, '0002_01_01_000005_create_job_seeker_profiles_table', 1),
(6, '0002_01_01_000006_create_cv_parsed_data_table', 1),
(7, '0002_01_01_000007_create_company_profiles_table', 1),
(8, '0002_01_01_000008_create_job_seeker_skills_table', 1),
(9, '0002_01_01_000009_create_job_posts_table', 1),
(10, '0002_01_01_000010_create_job_required_skills_table', 1),
(11, '0002_01_01_000011_create_applications_table', 1),
(12, '0002_01_01_000012_create_application_status_history_table', 1),
(13, '0002_01_01_000013_create_notifications_table', 1),
(14, '2026_05_08_205608_create_personal_access_tokens_table', 1),
(15, '2026_05_14_000001_create_saved_jobs_table', 1),
(16, '2026_05_17_212919_add_industry_to_company_profiles_table', 1),
(17, '2026_05_17_215731_add_extra_fields_to_company_profiles_table', 1),
(18, '2026_05_18_163243_change_education_level_to_text_on_job_seeker_profiles_table', 1),
(19, '2026_05_18_214635_modify_cv_parse_status_enum_in_job_seeker_profiles', 1),
(20, '2026_05_19_000000_add_internship_to_job_posts_job_type_enum', 1),
(21, '2026_05_21_000001_add_is_active_index_to_job_posts', 1),
(22, '2026_05_21_191512_create_messages_table', 1),
(23, '2026_05_22_000654_add_category_to_job_posts_table', 1),
(24, '2026_05_22_162417_add_missing_columns_for_frontend_sync', 1),
(25, '2026_05_24_000001_create_job_post_views_table', 1);

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `type` varchar(100) NOT NULL,
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`data`)),
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `type`, `data`, `read_at`, `created_at`) VALUES
(3, 13, 'interview_scheduled', '{\"title\":\"Interview scheduled with TechLabs Egypt\",\"message\":\"Interview for Laravel Backend Developer on 2026-05-26 13:00:00.\",\"message_preview\":\"Interview scheduled for Laravel Backend Developer\",\"sender_id\":10,\"sender_name\":\"TechLabs Egypt\",\"company_name\":\"TechLabs Egypt\",\"job_id\":6,\"job_title\":\"Laravel Backend Developer\",\"interview_at\":\"2026-05-26 13:00:00\"}', NULL, '2026-05-23 19:44:07'),
(4, 15, 'interview_scheduled', '{\"title\":\"Interview scheduled with DataVision Analytics\",\"message\":\"Interview for Data Analyst on 2026-05-27 11:30:00.\",\"message_preview\":\"Interview scheduled for Data Analyst\",\"sender_id\":12,\"sender_name\":\"DataVision Analytics\",\"company_name\":\"DataVision Analytics\",\"job_id\":8,\"job_title\":\"Data Analyst\",\"interview_at\":\"2026-05-27 11:30:00\"}', NULL, '2026-05-23 19:44:07');

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `saved_jobs`
--

CREATE TABLE `saved_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `job_seeker_id` bigint(20) UNSIGNED NOT NULL,
  `job_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `saved_jobs`
--

INSERT INTO `saved_jobs` (`id`, `job_seeker_id`, `job_id`, `created_at`, `updated_at`) VALUES
(4, 5, 6, '2026-05-23 21:44:07', '2026-05-23 21:44:07'),
(5, 6, 7, '2026-05-23 21:44:07', '2026-05-23 21:44:07'),
(6, 7, 8, '2026-05-23 21:44:07', '2026-05-23 21:44:07');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `skills`
--

CREATE TABLE `skills` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `type` enum('technical','soft') NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `skills`
--

INSERT INTO `skills` (`id`, `name`, `type`, `created_at`, `updated_at`) VALUES
(46, 'PHP', 'technical', '2026-05-23 21:44:05', '2026-05-23 21:44:05'),
(47, 'Laravel', 'technical', '2026-05-23 21:44:05', '2026-05-23 21:44:05'),
(48, 'Python', 'technical', '2026-05-23 21:44:05', '2026-05-23 21:44:05'),
(49, 'JavaScript', 'technical', '2026-05-23 21:44:05', '2026-05-23 21:44:05'),
(50, 'TypeScript', 'technical', '2026-05-23 21:44:05', '2026-05-23 21:44:05'),
(51, 'React', 'technical', '2026-05-23 21:44:05', '2026-05-23 21:44:05'),
(52, 'Vue.js', 'technical', '2026-05-23 21:44:05', '2026-05-23 21:44:05'),
(53, 'Angular', 'technical', '2026-05-23 21:44:05', '2026-05-23 21:44:05'),
(54, 'Node.js', 'technical', '2026-05-23 21:44:05', '2026-05-23 21:44:05'),
(55, 'MySQL', 'technical', '2026-05-23 21:44:05', '2026-05-23 21:44:05'),
(56, 'PostgreSQL', 'technical', '2026-05-23 21:44:05', '2026-05-23 21:44:05'),
(57, 'Redis', 'technical', '2026-05-23 21:44:05', '2026-05-23 21:44:05'),
(58, 'MongoDB', 'technical', '2026-05-23 21:44:05', '2026-05-23 21:44:05'),
(59, 'Docker', 'technical', '2026-05-23 21:44:05', '2026-05-23 21:44:05'),
(60, 'Kubernetes', 'technical', '2026-05-23 21:44:05', '2026-05-23 21:44:05'),
(61, 'Git', 'technical', '2026-05-23 21:44:05', '2026-05-23 21:44:05'),
(62, 'REST API', 'technical', '2026-05-23 21:44:05', '2026-05-23 21:44:05'),
(63, 'GraphQL', 'technical', '2026-05-23 21:44:05', '2026-05-23 21:44:05'),
(64, 'AWS', 'technical', '2026-05-23 21:44:05', '2026-05-23 21:44:05'),
(65, 'Azure', 'technical', '2026-05-23 21:44:05', '2026-05-23 21:44:05'),
(66, 'Linux', 'technical', '2026-05-23 21:44:05', '2026-05-23 21:44:05'),
(67, 'Nginx', 'technical', '2026-05-23 21:44:05', '2026-05-23 21:44:05'),
(68, 'TDD', 'technical', '2026-05-23 21:44:05', '2026-05-23 21:44:05'),
(69, 'CI/CD', 'technical', '2026-05-23 21:44:05', '2026-05-23 21:44:05'),
(70, 'Elasticsearch', 'technical', '2026-05-23 21:44:05', '2026-05-23 21:44:05'),
(71, 'Tailwind CSS', 'technical', '2026-05-23 21:44:05', '2026-05-23 21:44:05'),
(72, 'Bootstrap', 'technical', '2026-05-23 21:44:05', '2026-05-23 21:44:05'),
(73, 'jQuery', 'technical', '2026-05-23 21:44:05', '2026-05-23 21:44:05'),
(74, 'Java', 'technical', '2026-05-23 21:44:05', '2026-05-23 21:44:05'),
(75, 'C++', 'technical', '2026-05-23 21:44:05', '2026-05-23 21:44:05'),
(76, 'Communication', 'soft', '2026-05-23 21:44:05', '2026-05-23 21:44:05'),
(77, 'Teamwork', 'soft', '2026-05-23 21:44:05', '2026-05-23 21:44:05'),
(78, 'Problem Solving', 'soft', '2026-05-23 21:44:05', '2026-05-23 21:44:05'),
(79, 'Leadership', 'soft', '2026-05-23 21:44:05', '2026-05-23 21:44:05'),
(80, 'Time Management', 'soft', '2026-05-23 21:44:05', '2026-05-23 21:44:05'),
(81, 'Critical Thinking', 'soft', '2026-05-23 21:44:05', '2026-05-23 21:44:05'),
(82, 'Adaptability', 'soft', '2026-05-23 21:44:05', '2026-05-23 21:44:05'),
(83, 'Creativity', 'soft', '2026-05-23 21:44:05', '2026-05-23 21:44:05'),
(84, 'Attention to Detail', 'soft', '2026-05-23 21:44:05', '2026-05-23 21:44:05'),
(85, 'Conflict Resolution', 'soft', '2026-05-23 21:44:05', '2026-05-23 21:44:05'),
(86, 'Mentoring', 'soft', '2026-05-23 21:44:05', '2026-05-23 21:44:05'),
(87, 'Presentation Skills', 'soft', '2026-05-23 21:44:05', '2026-05-23 21:44:05'),
(88, 'Negotiation', 'soft', '2026-05-23 21:44:05', '2026-05-23 21:44:05'),
(89, 'Emotional Intelligence', 'soft', '2026-05-23 21:44:05', '2026-05-23 21:44:05'),
(90, 'Self-Management', 'soft', '2026-05-23 21:44:05', '2026-05-23 21:44:05');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('job_seeker','company','admin') NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `is_banned` tinyint(1) NOT NULL DEFAULT 0,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `email_verified_at`, `is_banned`, `remember_token`, `created_at`, `updated_at`, `deleted_at`) VALUES
(9, 'Demo Admin', 'admin@test.com', '$2y$12$uiRRm17FoSs.PNo7ylweZe9xvu3PW5oKiwDw76lvvd2kl54S6x3yq', 'admin', '2026-05-23 21:44:05', 0, NULL, '2026-05-23 21:44:06', '2026-05-23 21:44:06', NULL),
(10, 'TechLabs Recruiter', 'company.techlabs@test.com', '$2y$12$umdXfeSUoFt5m4Bl0Bw0F.VgAEtSZkDG9PBVRAh12XDen47VT8896', 'company', '2026-05-23 21:44:06', 0, NULL, '2026-05-23 21:44:06', '2026-05-23 21:44:06', NULL),
(11, 'Nile Commerce HR', 'company.nile@test.com', '$2y$12$g.TC7BDcw9UPMh3f5DHQKOfCRLITFqyi8OGMov4dbd6kdJknLawWK', 'company', '2026-05-23 21:44:06', 0, NULL, '2026-05-23 21:44:06', '2026-05-23 21:44:06', NULL),
(12, 'DataVision Talent', 'company.datavision@test.com', '$2y$12$QTyIWC7v7PlKrTKPfVnFtO/0HwAlYaSi1j00L514Iwrh8qooISQea', 'company', '2026-05-23 21:44:06', 0, NULL, '2026-05-23 21:44:06', '2026-05-23 21:44:06', NULL),
(13, 'Nour Hassan', 'seeker.nour@test.com', '$2y$12$PgxrpqyJEMWRS8fnQFVMY.AQZCIUsYXdDYLd.ftoeGtDtm5twhU0C', 'job_seeker', '2026-05-23 21:44:06', 0, NULL, '2026-05-23 21:44:07', '2026-05-23 21:44:07', NULL),
(14, 'Omar Adel', 'seeker.omar@test.com', '$2y$12$ldzgmEYLHkIBfCsU5EaZbez.SFeO4pfqGdGAc5gswHd4vJqRjHdSi', 'job_seeker', '2026-05-23 21:44:07', 0, NULL, '2026-05-23 21:44:07', '2026-05-23 21:44:07', NULL),
(15, 'Salma Mostafa', 'seeker.salma@test.com', '$2y$12$UKJm4iTCkitL3OqxoBNOautUmzB1f4SKsDXxbz9QQXXgt5WHvuMCe', 'job_seeker', '2026-05-23 21:44:07', 0, NULL, '2026-05-23 21:44:07', '2026-05-23 21:44:07', NULL),
(16, 'Youssef Ali', 'seeker.youssef@test.com', '$2y$12$QF3OmRoSvXbPnSPL/W0Fe.68MDFKlqtapCzsMc2hYPMzO/Zme5nsy', 'job_seeker', '2026-05-23 21:44:07', 0, NULL, '2026-05-23 21:44:07', '2026-05-23 21:44:07', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `applications`
--
ALTER TABLE `applications`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `applications_job_id_job_seeker_id_unique` (`job_id`,`job_seeker_id`),
  ADD KEY `applications_job_seeker_id_foreign` (`job_seeker_id`);

--
-- Indexes for table `application_status_history`
--
ALTER TABLE `application_status_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `application_status_history_application_id_foreign` (`application_id`),
  ADD KEY `application_status_history_changed_by_foreign` (`changed_by`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `company_profiles`
--
ALTER TABLE `company_profiles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `company_profiles_user_id_unique` (`user_id`);

--
-- Indexes for table `cv_parsed_data`
--
ALTER TABLE `cv_parsed_data`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `cv_parsed_data_job_seeker_id_unique` (`job_seeker_id`);

--
-- Indexes for table `email_verification_tokens`
--
ALTER TABLE `email_verification_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email_verification_tokens_token_unique` (`token`),
  ADD KEY `email_verification_tokens_user_id_foreign` (`user_id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `job_posts`
--
ALTER TABLE `job_posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `job_posts_company_id_foreign` (`company_id`),
  ADD KEY `job_posts_is_active_index` (`is_active`);

--
-- Indexes for table `job_post_views`
--
ALTER TABLE `job_post_views`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `job_post_views_job_id_user_id_unique` (`job_id`,`user_id`),
  ADD KEY `job_post_views_user_id_foreign` (`user_id`);

--
-- Indexes for table `job_required_skills`
--
ALTER TABLE `job_required_skills`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `job_required_skills_job_id_skill_id_unique` (`job_id`,`skill_id`),
  ADD KEY `job_required_skills_skill_id_foreign` (`skill_id`);

--
-- Indexes for table `job_seeker_profiles`
--
ALTER TABLE `job_seeker_profiles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `job_seeker_profiles_user_id_unique` (`user_id`);

--
-- Indexes for table `job_seeker_skills`
--
ALTER TABLE `job_seeker_skills`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `job_seeker_skills_job_seeker_id_skill_id_unique` (`job_seeker_id`,`skill_id`),
  ADD KEY `job_seeker_skills_skill_id_foreign` (`skill_id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `messages_sender_id_foreign` (`sender_id`),
  ADD KEY `messages_receiver_id_foreign` (`receiver_id`),
  ADD KEY `messages_job_id_foreign` (`job_id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notifications_user_id_foreign` (`user_id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indexes for table `saved_jobs`
--
ALTER TABLE `saved_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `saved_jobs_job_seeker_id_job_id_unique` (`job_seeker_id`,`job_id`),
  ADD KEY `saved_jobs_job_id_foreign` (`job_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `skills`
--
ALTER TABLE `skills`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `skills_name_unique` (`name`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `applications`
--
ALTER TABLE `applications`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `application_status_history`
--
ALTER TABLE `application_status_history`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `company_profiles`
--
ALTER TABLE `company_profiles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `cv_parsed_data`
--
ALTER TABLE `cv_parsed_data`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `email_verification_tokens`
--
ALTER TABLE `email_verification_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `job_posts`
--
ALTER TABLE `job_posts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `job_post_views`
--
ALTER TABLE `job_post_views`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `job_required_skills`
--
ALTER TABLE `job_required_skills`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT for table `job_seeker_profiles`
--
ALTER TABLE `job_seeker_profiles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `job_seeker_skills`
--
ALTER TABLE `job_seeker_skills`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `saved_jobs`
--
ALTER TABLE `saved_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `skills`
--
ALTER TABLE `skills`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=91;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `applications`
--
ALTER TABLE `applications`
  ADD CONSTRAINT `applications_job_id_foreign` FOREIGN KEY (`job_id`) REFERENCES `job_posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `applications_job_seeker_id_foreign` FOREIGN KEY (`job_seeker_id`) REFERENCES `job_seeker_profiles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `application_status_history`
--
ALTER TABLE `application_status_history`
  ADD CONSTRAINT `application_status_history_application_id_foreign` FOREIGN KEY (`application_id`) REFERENCES `applications` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `application_status_history_changed_by_foreign` FOREIGN KEY (`changed_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `company_profiles`
--
ALTER TABLE `company_profiles`
  ADD CONSTRAINT `company_profiles_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `cv_parsed_data`
--
ALTER TABLE `cv_parsed_data`
  ADD CONSTRAINT `cv_parsed_data_job_seeker_id_foreign` FOREIGN KEY (`job_seeker_id`) REFERENCES `job_seeker_profiles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `email_verification_tokens`
--
ALTER TABLE `email_verification_tokens`
  ADD CONSTRAINT `email_verification_tokens_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `job_posts`
--
ALTER TABLE `job_posts`
  ADD CONSTRAINT `job_posts_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `company_profiles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `job_post_views`
--
ALTER TABLE `job_post_views`
  ADD CONSTRAINT `job_post_views_job_id_foreign` FOREIGN KEY (`job_id`) REFERENCES `job_posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `job_post_views_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `job_required_skills`
--
ALTER TABLE `job_required_skills`
  ADD CONSTRAINT `job_required_skills_job_id_foreign` FOREIGN KEY (`job_id`) REFERENCES `job_posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `job_required_skills_skill_id_foreign` FOREIGN KEY (`skill_id`) REFERENCES `skills` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `job_seeker_profiles`
--
ALTER TABLE `job_seeker_profiles`
  ADD CONSTRAINT `job_seeker_profiles_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `job_seeker_skills`
--
ALTER TABLE `job_seeker_skills`
  ADD CONSTRAINT `job_seeker_skills_job_seeker_id_foreign` FOREIGN KEY (`job_seeker_id`) REFERENCES `job_seeker_profiles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `job_seeker_skills_skill_id_foreign` FOREIGN KEY (`skill_id`) REFERENCES `skills` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_job_id_foreign` FOREIGN KEY (`job_id`) REFERENCES `job_posts` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `messages_receiver_id_foreign` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `messages_sender_id_foreign` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `saved_jobs`
--
ALTER TABLE `saved_jobs`
  ADD CONSTRAINT `saved_jobs_job_id_foreign` FOREIGN KEY (`job_id`) REFERENCES `job_posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `saved_jobs_job_seeker_id_foreign` FOREIGN KEY (`job_seeker_id`) REFERENCES `job_seeker_profiles` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
