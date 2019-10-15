/* eslint-disable no-console */
const database = require("../config/database");
const seedFile = require("../seeders/seeders.json");

const dbService = (environment, migrate) => {
  const authenticateDB = () =>
    database
      .authenticate()
      .then(() => {
        console.log("Connection has been established successfully.");
      })
      .catch(err => {
        console.error("Unable to connect to the database:", err);
      });

  const dropDB = () => database.drop();

  const syncDB = () => database.sync();

  const successfulDBStart = () =>
    console.info(
      "connection to the database has been established successfully"
    );

  const errorDBStart = err =>
    console.info("unable to connect to the database:", err);

  const errorSeedingDB = err => console.info("unable to seed database:", err);

  const successfulDBSeeding = () => console.info("seed database successfully");

  const wrongEnvironment = () => {
    console.warn(
      `only development, staging, test and production are valid NODE_ENV variables but ${environment} is specified`
    );
    return process.exit(1);
  };

  const seedDataBase = async () => {
    try {
      await startMigrateFalse();
      const {
        users,
        agency_profiles,
        categories,
        user_categories,
        properties,
        documents
      } = seedFile;

      // SEED USERS
      const userQueryLength = users.map(a => "(?)").join(",");
      const userQuery = `INSERT INTO users (id, avatar, name, email_verified, phone, password, email, user_type, createdAt, updatedAt) VALUES ${userQueryLength};`;
      await database.query(userQuery, {
        replacements: users,
        type: database.QueryTypes.INSERT
      });

      // SEED CATEGORIES
      const categoryQueryLength = categories.map(a => "(?)").join(",");
      const categoryQuery = `INSERT INTO categories (id, name) VALUES ${categoryQueryLength};`;
      await database.query(categoryQuery, {
        replacements: categories,
        type: database.QueryTypes.INSERT
      });

      // SEED USER_CATEGORIES
      const userCategoryQueryLength = user_categories.map(a => "(?)").join(",");
      const userCategoryQueryQuery = `INSERT INTO user_categories (id, user_id, category_id) VALUES ${userCategoryQueryLength};`;
      await database.query(userCategoryQueryQuery, {
        replacements: user_categories,
        type: database.QueryTypes.INSERT
      });

      // SEED AGENCY PROFILE
      const agencyProfileQueryLength = agency_profiles
        .map(a => "(?)")
        .join(",");
      const agencyProfileQueryQuery = `INSERT INTO agency_profiles (id, business_name, isApproved, approvedAt, phone, business_address, email, user_id, website) VALUES ${agencyProfileQueryLength};`;
      await database.query(agencyProfileQueryQuery, {
        replacements: agency_profiles,
        type: database.QueryTypes.INSERT
      });

      // SEED PROPERTIES
      const propertiesQueryLength = properties.map(a => "(?)").join(",");
      const propertiesQueryQuery = `INSERT INTO properties (id, category_id, user_id, name, address, description, location, payment_duration, price, avg_monthly_payment, has_C_of_O, images, createdAt, updatedAt, status) VALUES ${propertiesQueryLength};`;
      await database.query(propertiesQueryQuery, {
        replacements: properties,
        type: database.QueryTypes.INSERT
      });

      // SEED DOCUMENTS
      const documentsQueryLength = documents.map(a => "(?)").join(",");
      const documentsQueryQuery = `INSERT INTO documents (user_id, agency_profile_id, name, link, id) VALUES ${documentsQueryLength};`;
      await database.query(documentsQueryQuery, {
        replacements: documents,
        type: database.QueryTypes.INSERT
      });

      successfulDBSeeding();
    } catch (err) {
      errorSeedingDB(err);
    }
  };

  const startMigrateTrue = async () => {
    try {
      await syncDB();
      successfulDBStart();
    } catch (err) {
      errorDBStart(err);
    }
  };

  const startMigrateFalse = async () => {
    try {
      await dropDB();
      await syncDB();
      successfulDBStart();
    } catch (err) {
      errorDBStart(err);
    }
  };

  const startDev = async () => {
    try {
      await authenticateDB();
      await startMigrateTrue();
    } catch (err) {
      return errorDBStart(err);
    }
  };

  const startStage = async () => {
    try {
      await authenticateDB();

      if (migrate) {
        return startMigrateTrue();
      }

      return startMigrateFalse();
    } catch (err) {
      return errorDBStart(err);
    }
  };

  const startTest = async () => {
    try {
      await authenticateDB();
      await startMigrateFalse();
    } catch (err) {
      errorDBStart(err);
    }
  };

  const startProd = async () => {
    try {
      await authenticateDB();
      await startMigrateFalse();
    } catch (err) {
      errorDBStart(err);
    }
  };

  const start = async () => {
    switch (environment) {
      case "development":
        await startDev();
        break;
      case "staging":
        await startStage();
        break;
      case "testing":
        await startTest();
        break;
      case "production":
        await startProd();
        break;
      default:
        await wrongEnvironment();
    }
  };

  return {
    start,
    seedDataBase
  };
};

module.exports = dbService;
