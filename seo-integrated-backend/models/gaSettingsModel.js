// models/gaSettingsModel.js
const mongoose = require('mongoose');

const gaSettingsSchema = new mongoose.Schema({
  propertyId: { type: String, required: true },
  isAuthenticated: { type: Boolean, default: false },
  singletonKey: { type: String, unique: true, default: 'GA' }
});


//Enforce singleton usage
gaSettingsSchema.statics.getSingleton = async function () {
  let record = await this.findOne();
  if (!record) {
    record = await this.create({
      propertyId: '',
      isAuthenticated: false
    });
  }
  return record;
};

module.exports = mongoose.model('GaSettings', gaSettingsSchema);