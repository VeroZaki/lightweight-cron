import registeredSchema from './registeredSchema.js';
import ODM from '../../common/interfaces/ODM.js';

class ModelManager extends ODM {
  constructor() {
    super();
    this.COLLECTION = null;
    this.models = registeredSchema;
  }

  use(schema) {
    this._checkSchema(schema);
    this.COLLECTION = this.models[schema];
    return this;
  }

  getModel(schema) {
    this._checkSchema(schema);
    return this.models[schema];
  }

  _checkSchema(schema) {
    if (!this.models[schema]) {
      throw new Error(`Schema ${schema} is not registered`);
    }
    return true;
  }

  clone() {
    return { ...this };
  }
}

export default new ModelManager();
