
USE `real_estate` ;

-- -----------------------------------------------------
-- Table `mydb`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(200) NULL,
  `email` VARCHAR(200) NULL,
  `password` VARCHAR(255) NULL,
  `phone` VARCHAR(45) NULL,
  `user_type` ENUM('admin', 'investor', 'seller') NULL DEFAULT 'investor',
  `email_verified` TINYINT(1) NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE,
  UNIQUE INDEX `phone_UNIQUE` (`phone` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`categories`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `categories` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`user_categories`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `user_categories` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `category_id` INT NOT NULL,
  PRIMARY KEY (`id`)
);


-- -----------------------------------------------------
-- Table `mydb`.`verifications`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `verifications` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `code` VARCHAR(45) NULL,
  `expire_at` DATETIME NULL,
  `user_id` INT NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`profiles`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `profiles` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `business_name` VARCHAR(45) NULL,
  `business_address` VARCHAR(45) NULL,
  `website` VARCHAR(45) NULL,
  `phone` VARCHAR(45) NULL,
  `email` VARCHAR(45) NULL,
  `approved_at` DATETIME NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`documents`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `documents` (
  `id` INT NOT NULL,
  `name` VARCHAR(45) NULL,
  `filename` VARCHAR(45) NULL,
  `profile_id` INT NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`locations`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `locations` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  `lat` DECIMAL NULL,
  `lng` DECIMAL NULL,
  `parent_id` INT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`properties`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `properties` (
  `id` INT NOT NULL,
  `name` VARCHAR(200) NULL,
  `description` VARCHAR(1024) NULL,
  `location_id` INT NOT NULL,
  `category_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `price` VARCHAR(45) NULL,
  `has_c_of_o` TINYINT(1) NULL,
  `avg_monthly_payment` VARCHAR(45) NULL,
  `payment_duration` INT NULL,
  `address` VARCHAR(150) NULL,
  `created_at` VARCHAR(45) NULL,
  `status` ENUM('active', 'unlisted', 'sold', 'interested') NULL DEFAULT 'active',
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`images`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `images` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `filename` VARCHAR(255) NULL,
  `property_id` INT NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`interests`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `interests` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `created_at` VARCHAR(45) NULL,
  `user_id` INT NOT NULL,
  `property_id` INT NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;
