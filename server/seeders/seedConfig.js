require('dotenv').config();
const fs = require('fs');
const bcrypt = require('bcrypt');
const uuid = require('uuid/v4');
const seedFile = require('./seedDataBase.json');

const { users, agency_profiles, categories, user_categories, properties } = seedFile;
const allSellers = [];
const allInvestors = [];
const agencyDocuments = [];

const generateCOFOs = () => {
  const COFOs = [1, 0];
  const document = Math.floor(Math.random() * (COFOs.length / 1));
  return COFOs[document];
};
// REFACTORED USERS
const refactorUsers = async users => {
  const promiseUsers = users.map(async user => {
    if (user.user_type === 'seller') {
      allSellers.push(user);
    } else allInvestors.push(user);
    const hash = await bcrypt.genSaltSync(process.env.BCRYPT_ROUND);
    const password = await bcrypt.hash(user.password, hash);
    return [...Object.values({ ...user, password })];
  });

  return await Promise.all(promiseUsers);
};

let refactoredUsers = refactorUsers(users);

// REFACTORED CATEGORIES
const refactoredCategories = categories.reduce((categories, category) => {
  categories.push([...Object.values(category)]);
  return categories;
}, []);

// REFACTORED AGENCY PROFILES FORM USER ID
const refactoredAgencyProfiles = allSellers.reduce((agency, user, index) => {
  const profile = agency_profiles[index];
  profile.user_id = user.id;
  const [firstDoc, secondDoc] = profile.documents;
  firstDoc.name = 'CAC';
  const agencyDocs = {
    user_id: user.id,
    agency_profile_id: profile.id
  };

  agencyDocuments.push([
    ...Object.values({
      ...agencyDocs,
      name: firstDoc.name,
      link: firstDoc.image,
      id: uuid()
    })
  ]);

  agencyDocuments.push([
    ...Object.values({
      ...agencyDocs,
      name: secondDoc.name,
      link: secondDoc.image,
      id: uuid()
    })
  ]);

  delete profile.documents;
  agency.push([...Object.values({ ...profile })]);
  return agency;
}, []);

// REFACTOR FOR USER SELECTED CATEGORY
const refactoredUserCategory = allInvestors.reduce((user_category, user) => {
  const start = Math.floor(Math.random() * (categories.length / 2));
  const end = categories.length - start;
  const categoryOptions = categories.slice(start, end);
  for (const [index, option] of categoryOptions.entries()) {
    let selectedCategory = user_categories[index];
    const id = uuid();
    selectedCategory.category_id = option.id;
    selectedCategory.user_id = user.id;
    user_category.push([...Object.values({ ...selectedCategory, id })]);
  }
  return user_category;
}, []);

// REFACTOR FOR SELLER PROPERTIES
const refactoredProperties = allSellers.reduce((seller_properties, user) => {
  const start = Math.floor(Math.random() * (properties.length / 2));
  const end = properties.length - start;
  const selectedProperties = properties.slice(start, end);
  for (const property of selectedProperties) {
    const id = uuid();
    const randomIdPicker = Math.floor(Math.random() * (categories.length / 2));
    const category = categories[randomIdPicker];
    const images = `${property.images.join(',')}`;
    property.category_id = category.id;
    property.user_id = user.id;
    property.status = 'non_active';
    const payment_duration = property.payment_duration.toString();
    const has_C_of_O = generateCOFOs();
    seller_properties.push([
      ...Object.values({
        ...property,
        images,
        payment_duration,
        has_C_of_O,
        id
      })
    ]);
  }
  return seller_properties;
}, []);

const getSeedData = async () => {
  console.log(agencyDocuments);

  const users = await refactoredUsers;
  const dataBaseSeed = {
    agency_profiles: refactoredAgencyProfiles,
    categories: refactoredCategories,
    user_categories: refactoredUserCategory,
    properties: refactoredProperties,
    documents: agencyDocuments,
    users
  };

  fs.writeFile('./seeders.json', JSON.stringify(dataBaseSeed, null, 2), 'utf8', console.log);
};

getSeedData();
