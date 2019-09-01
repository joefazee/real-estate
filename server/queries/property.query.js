const Property = require('../models/property.model');
const sequelize = require('../config/database');

class PropertyQueries {
	constructor(Model) {
		this.Model = Model;
	}

	create(payload) {
		return this.Model.create(payload);
	}

	findByUserId(user_id) {
		return this.Model.findOne({
			where: {
				user_id
			}
		});
	}

	hasNoFilterOrFilter(search, { limit, offset }) {
		return sequelize.query(
			`SELECT * FROM properties WHERE id IN
	(SELECT id FROM properties WHERE location = :location OR category_id = :category_id OR name LIKE :name)
	 AND price BETWEEN :minPrice and :maxPrice ORDER by price ASC LIMIT :offset, :limit`,
			{
				replacements: { ...search, offset, limit },
				type: sequelize.QueryTypes.SELECT
			}
		);
	}

	async findByPropertyId(id) {
		return this.Model.findOne({ where: { id } });
	}
}

const propertyQuery = new PropertyQueries(Property);

module.exports = propertyQuery;
