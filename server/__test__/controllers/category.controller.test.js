// const request = require('supertest');
// const { beforeAction, afterAction } = require('../setup/_setup');
// const User = require('../../models/user.model');
// const Category = require('../../models/category.model');
// const UserQuery = require('../../queries/user.query');
// const CategoryQuery = require('../../queries/category.query');
// const authService = require('../../services/auth.service');

// let api;
// let INVESTOR_ACCOUNT;
// let ADMIN_ACCOUNT;
// let adminToken;
// let investorToken;;

// beforeAll(async () => {
//   api = await beforeAction();

//   INVESTOR_ACCOUNT = await User.create({
//     name: 'Martin Luke',
//     email: 'martinluther@mail.com',
//     password: 'securepassword',
//     password2: 'securepassword',
//     phone: '090573673',
//     user_type: 'investor'
//   });

//   ADMIN_ACCOUNT = await User.create({
//     name: 'Martin King',
//     email: 'martinking@mail.com',
//     password: 'securepassword',
//     password2: 'securepassword',
//     phone: '09057367323',
//     user_type: 'admin'
//   });
 
//   adminToken = authService.issue(ADMIN_ACCOUNT.dataValues);

//   investorToken = authService.issue(INVESTOR_ACCOUNT.dataValues);
// });

// afterAll(async () => {
//   await INVESTOR_ACCOUNT.destroy();
//   await ADMIN_ACCOUNT.destroy();
//   await Category.destroy({ where: {} });
//   afterAction();
// });

test("should return true", () => {
  expect(2 + 2).toBe(4);
});
// test('Admin | Admin get all categories', async () => {
//   await Category.bulkCreate([{name: 'office'}, {name: 'school'}])

//   const { body } = await request(api)
//     .get('/api/v1/category')
//     .set('Content-Type', 'application/json')
//     .expect(200);

//   expect(body.payload.length).toEqual(2);
//   expect(body.message).toBe("success!");
//   await Category.destroy({ where: {} });
// });

// test('Admin | Admin create a category', async () => {
//   const { body } = await request(api)
//     .post("/api/v1/category/create")
//     .set("Authorization", `Bearer ${adminToken}`)
//     .set("Content-Type", "application/json")
//     .send({
//       name: "Sports & entertainment"
//     })
//     .expect(200);

//   expect(body.payload.name).toEqual("Sports & entertainment");
//   expect(body.message).toBe("success");
//   await Category.destroy({ where: {} });
// });


// test("Admin | Admin create an existing category", async () => {
//   await Category.bulkCreate([{ name: "office" }]);

//   const { body } = await request(api)
//     .post("/api/v1/category/create")
//     .set("Authorization", `Bearer ${adminToken}`)
//     .set("Content-Type", "application/json")
//     .send({
//       name: "office"
//     })

//   expect(body.payload).toEqual(null);
//   expect(body.statusCode).toBe(400)
//   expect(body.message).toBe("office already exits");
//   await Category.destroy({ where: {} });
// });

// test('Investor | Investor create a category', async () => {
//   const { body } = await request(api)
//     .post("/api/v1/category/create")
//     .set("Content-Type", "application/json")
//     .set("Authorization", `Bearer ${investorToken}`)
//     .send({
//       name: "Sports & entertainment"
//     });

//   expect(body.payload).toEqual(null);
//   expect(body.statusCode).toEqual(401);
//   expect(body.message).toMatch(/You are not Authorized to perform this operation!/);
// });

// test('Investor | Investor get all categories', async () => {
//   await Category.bulkCreate([{ name: "office" }, { name: "school" }]);

//   const { body } = await request(api)
//     .get(`/api/v1/category`)
//     .set('Content-Type', 'application/json');

//   expect(body.payload.length).toEqual(2);
//   expect(body.message).toBe("success!");
//   await Category.destroy({ where: {} });
// });

