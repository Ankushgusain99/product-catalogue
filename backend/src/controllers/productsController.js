
const product = require('../models/products'); 
const cloudinary=require('cloudinary').v2


exports.registerProduct = async (req, res,next) => {
    try {
        const {
            productName,
            productBrand,
            superCategory,
            category,
            subCategory,
            numberOfUnits,
            siUnits,
            unitWeight,
            grossWeight,
            productDescription,
            calories,
            fat,
            saturatedFat,
            carbs,
            fibre,
            sugar,
            protein,
            salt,
            ingredients,
            dietary,
            storage,
            productIdPrefix,
            origin,
            addedBy
        } = req.body;

        let uploadImageUrls = [];
        const uploadedImages = req.files.uploadImage; // For multiple file uploads

        if (uploadedImages && uploadedImages.length > 0) {
            for (let i = 0; i < uploadedImages.length; i++) {
                const uploadResult = await cloudinary.uploader.upload(uploadedImages[i].tempFilePath);
                uploadImageUrls.push(uploadResult.secure_url);  // Store each image URL
            }
        }
        /*let uploadImageUrl = '';
        const uploaded = req.files.uploadImage; // Single file upload
        console.log(uploaded)
        if (uploaded) {
            const uploadResult = await cloudinary.uploader.upload(uploaded.tempFilePath);
            uploadImageUrl = uploadResult.secure_url;
        }
        console.log(uploadImageUrl)*/
        
        let netWeight = unitWeight * numberOfUnits;

        const newProduct = new product({
            productName,
            productBrand,
            superCategory,
            category,
            subCategory,
            numberOfUnits,
            siUnits,
            unitWeight,
            netWeight,
            grossWeight,
            productDescription,
            calories,
            fat,
            saturatedFat,
            carbs,
            fibre,
            sugar,
            protein,
            salt,
            ingredients,
            dietary,
            storage,
            productIdPrefix,
            origin,
            addedBy,
            uploadImage: uploadImageUrls 
        });

        await newProduct.save();

        return res.status(200).json({
            success: true,
            message: 'Product created successfully',
            product: newProduct
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error creating product', error: error.message });
    }
};


exports.getAllProducts=async(req,res)=>{
    try {
        console.log("hello")
        const getProducts=await product.find()
        console.log(getProducts)
        console.log("hello")

        return res.status(200).json({
            success:true,
            data:getProducts,
            message:'All products fetched successfully'
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            data:"Data cannot be fetched",
            message:error.message
        })
    }
}

exports.deleteProductById=async(req,res)=>{
    try {
        console.log("hello")
        const{id}=req.params
        const deleteProduct=await product.findByIdAndDelete({_id:id})
        console.log(deleteProduct)
        return res.status(200).json({
            success:true,
            data:deleteProduct,
            message:'Product deleted successfully'
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            data:'cannot fetched data',
            message:error.message
        })
    }
}

exports.updateProduct = async (req, res, next) => {
    try {
        const productId = req.params.id; // Assuming product ID is passed as a URL parameter

        const {
            productName,
            productBrand,
            superCategory,
            category,
            subCategory,
            numberOfUnits,
            siUnits,
            unitWeight,
            grossWeight,
            productDescription,
            calories,
            fat,
            saturatedFat,
            carbs,
            fibre,
            sugar,
            protein,
            salt,
            ingredients,
            dietary,
            storage,
            productIdPrefix,
            origin,
            addedBy
        } = req.body;

        // Fetch the product by ID
        const productInfo = await product.findById(productId);
        if (!productInfo) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if there's an image file uploaded
        let uploadImageUrl = productInfo.uploadImage; // Keep existing image URL
        const uploaded = req.files?.uploadImage; // Optional chaining for file
        if (uploaded) {
            // If a new image is uploaded, update the image URL
            const uploadResult = await cloudinary.uploader.upload(uploaded.tempFilePath);
            uploadImageUrl = uploadResult.secure_url;
        }

        // Calculate new net weight if unitWeight or numberOfUnits has changed
        let netWeight = unitWeight ? unitWeight * (numberOfUnits || productInfo.numberOfUnits) : productInfo.netWeight;

        // Update product fields
        productInfo.productName = productName || productInfo.productName;
        productInfo.productBrand = productBrand || productInfo.productBrand;
        productInfo.superCategory = superCategory || productInfo.superCategory;
        productInfo.category = category || productInfo.category;
        productInfo.subCategory = subCategory || productInfo.subCategory;
        productInfo.numberOfUnits = numberOfUnits || productInfo.numberOfUnits;
        productInfo.siUnits = siUnits || productInfo.siUnits;
        productInfo.unitWeight = unitWeight || productInfo.unitWeight;
        productInfo.netWeight = netWeight;
        productInfo.grossWeight = grossWeight || productInfo.grossWeight;
        productInfo.productDescription = productDescription || productInfo.productDescription;
        productInfo.calories = calories || productInfo.calories;
        productInfo.fat = fat || productInfo.fat;
        productInfo.saturatedFat = saturatedFat || productInfo.saturatedFat;
        productInfo.carbs = carbs || productInfo.carbs;
        productInfo.fibre = fibre || productInfo.fibre;
        productInfo.sugar = sugar || productInfo.sugar;
        productInfo.protein = protein || productInfo.protein;
        productInfo.salt = salt || productInfo.salt;
        productInfo.ingredients = ingredients || productInfo.ingredients;
        productInfo.dietary = dietary || productInfo.dietary;
        productInfo.storage = storage || productInfo.storage;
        productInfo.productIdPrefix=productIdPrefix || productInfo.productIdPrefix
        productInfo.origin = origin || productInfo.origin;
        productInfo.addedBy = addedBy || productInfo.addedBy;
        productInfo.uploadImage = uploadImageUrl;

        // Save the updated product
        await productInfo.save();

        return res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            product: productInfo
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error updating product', error: error.message });
    }
};
