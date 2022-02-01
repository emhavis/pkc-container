-- create databases
CREATE DATABASE IF NOT EXISTS `matomo`;
CREATE DATABASE IF NOT EXISTS `gitea`;
CREATE DATABASE IF NOT EXISTS `keycloak`;

-- create matomo user
CREATE USER 'matomodb'@'%' IDENTIFIED BY 'matomo-pass';
GRANT ALL PRIVILEGES ON *.* TO 'matomodb'@'%';
GRANT ALL PRIVILEGES ON *.* TO 'matomodb'@'%';

-- create gitea user
CREATE USER 'gitea'@'%' IDENTIFIED BY 'gitea-pass';
GRANT ALL PRIVILEGES ON *.* TO 'gitea'@'%';
GRANT ALL PRIVILEGES ON *.* TO 'gitea'@'%';

-- create keycloak user
CREATE USER 'keycloak'@'%' IDENTIFIED BY 'keycloak-pass';
GRANT ALL PRIVILEGES ON *.* TO 'keycloak'@'%';
GRANT ALL PRIVILEGES ON *.* TO 'keycloak'@'%';