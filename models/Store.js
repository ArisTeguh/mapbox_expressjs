const mongoose = require('mongoose');
const geocoder = require('../utils/geocoder');

const StoreSchema = new mongoose.Schema({
  storeId: {
    type: String,
    required: [true, 'Please add a store ID'],
    unique: true,
    trim: true,
    maxlength: [10, 'Store ID must be less then 10 character'],
  },
  address: {
    type: String,
    required: [true, 'Please add an address'],
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      //   required: true,
    },
    coordinates: {
      type: [Number],
      index: '2sphere',
      //   required: true,
    },
    formattedAddress: String,
  },
  createdaT: {
    type: Date,
    default: Date.now,
  },
});

//Geocoder & create location
StoreSchema.pre('save', async function (next) {
  const loc = await geocoder.geocode(this.address);
  this.location = {
    type: 'Point',
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
  };

  //Do not save address
  this.address = undefined;
  next();
});

module.exports = mongoose.model('Store', StoreSchema);
