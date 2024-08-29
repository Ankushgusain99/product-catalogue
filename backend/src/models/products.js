const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    productBrand: {
        type: String,
        required: true
    },
    superCategory: {
        type: String, // Change from embedded schema to String
        required: true,
      },
      category: {
        type: String, // Change from embedded schema to String
        required: true,
      },
      subCategory: {
        type: String, // Change from embedded schema to String
        required: true,
      },
    numberOfUnits: {
        type: Number,
        required: true
    },
    siUnits: {
        type: String,
        required:true
    },
    unitWeight: {
        type: Number,
        required: true
    },
    netWeight: {
        type: Number,
        //required: true
    },
    grossWeight: {
        type: Number,
        required: true
    },
    productDescription: {
        type: String,
        required: true
    },
    calories: {
        type: Number,
        required: true
    },
    fat: {
        type: Number,
        required: true
    },
    saturatedFat: {
        type: Number,
        required: true
    },
    carbs: {
        type: Number,
        required: true
    },
    fibre: {
        type: Number,
        required: true
    },
    sugar: {
        type: Number,
        required: true
    },
    protein: {
        type: Number,
        required: true
    },
    salt: {
        type: Number,
        required: true
    },
    ingredients: {
        type: String,
        required: true
    },
    dietary: [{
        type: String,
        required:true
    }],
    storage: {
        type: String,
        required: true
    },
    productIdPrefix:{
        type:String,
        required:true
    },
    origin: [{
        type: String,
        required: true
    }],
    addedBy: {
        type: String, 
        required:true
    },
    uploadImage: {
        type: [String], 
        required:true
    }
});

module.exports = mongoose.model('products', productSchema);
