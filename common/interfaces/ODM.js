class ODM {
  async findOne(selector = {}, options = {}) {
    const { fields } = options;
    return this.COLLECTION.findOne(selector).select(fields).lean();
  }

  async find(selector = {}, options = {}) {
    const {
      fields, skip, limit, sort,
    } = options;
    return this.COLLECTION.find(selector)
      .select(fields)
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .lean();
  }

  async findOneAndUpdate(query, newParams, options = {}) {
    return this.COLLECTION.findOneAndUpdate(query, newParams, {
      new: true,
      runValidators: true,
      ...options,
    });
  }

  async count(selector = {}) {
    return this.COLLECTION.countDocuments(selector);
  }

  async updateMany(query, newParams, options = {}) {
    return this.COLLECTION.updateMany(query, newParams, {
      ...options,
      new: true,
    });
  }

  async updateOne(_id, newParams, options = {}) {
    return this.COLLECTION.updateOne({ _id }, newParams, {
      new: true,
      runValidators: true,
      ...options,
    });
  }

  async create(params) {
    return this.COLLECTION.create(params);
  }

  async update(_id, newParams, options = {}) {
    return this.COLLECTION.findByIdAndUpdate(_id, newParams, {
      ...options,
      new: true,
    });
  }

  async deleteById(_id) {
    return this.COLLECTION.deleteOne({ _id });
  }

  async deleteByQuery(query) {
    return this.COLLECTION.deleteMany(query);
  }

  async aggregate(pipeline, options = {}) {
    return this.COLLECTION.aggregate(pipeline)
      .sort(options.sort || 'createdAt')
      .skip(options.skip || 0);
  }
}

export default ODM;
