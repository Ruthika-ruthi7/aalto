-- MySQL Root Password Reset Script
-- This script resets the root password to 'Ruthi@21'
-- 
-- IMPORTANT: Run this script as an administrator with MySQL privileges
--
-- To execute this script:
-- 1. Open MySQL Command Line Client or MySQL Workbench
-- 2. Log in with your current MySQL credentials
-- 3. Run: SOURCE path/to/resetPassword.sql
--    Or copy and paste the commands below

-- Reset root password
ALTER USER 'root'@'localhost' IDENTIFIED BY 'Ruthi@21';

-- For MySQL 5.7 and older, use this instead:
-- SET PASSWORD FOR 'root'@'localhost' = PASSWORD('Ruthi@21');

-- Flush privileges to apply changes
FLUSH PRIVILEGES;

-- Verify the change
SELECT 'Password reset successfully!' as Status;
