
const product = require('../models/products'); 
const cloudinary=require('cloudinary').v2
const upload=require('../middleware/multer')


function isFileTypeSupported(type, supportedTypes) {
    return supportedTypes.includes(type);
}


async function uploadFileToCloudinary(file, folder, quality) {
    const options = {folder};
    console.log("temp file path", file.tempFilePath);

    if(quality) {
        options.quality = quality;
    }

    options.resource_type = "auto";
    return await cloudinary.uploader.upload(file.tempFilePath, options);
}

// Function to create a new product
exports.registerProduct = async (req, res) => {
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
            origin,
        } = req.body;

        let uploadImageUrl = '';
        const uploaded=req.files.uploadImage
        //console.log("The request is",req)
       // console.log("the uploaded file is",uploaded)
        console.log(uploaded.tempFilePath)
    if (uploaded) {
      const uploadResult = await cloudinary.uploader.upload(uploaded.tempFilePath);
      uploadImageUrl = uploadResult.secure_url;
    }
       // console.log(uploadImageUrl)
            
        // const files = req.files?.imageFiles; // Assuming imageFiles is an array of files
        /*console.log(files)
        
        if (!files || files.length === 0) {
             return res.status(400).json({
                 success: false,
                 message: 'No files uploaded',
             });
         }*/

        // Limit the number of files to 4
        // if (files.length > 4) {
        //     return res.status(400).json({
        //         success: false,
        //         message: 'You can upload a maximum of 4 files',
        //     });
        // }

        // // Validation
        // const supportedTypes = ["jpg", "jpeg", "png"];
        // const uploadPromises = files.map(async (file) => {
        //     const fileType = file.name.split('.').pop().toLowerCase(); // Get the file extension
        //     console.log("File Type:", fileType);

        //     if (!isFileTypeSupported(fileType, supportedTypes)) {
        //         throw new Error('File format not supported');
        //     }

        //     console.log("Uploading to Infyair");
        //     const response = await uploadFileToCloudinary(file, "Infyair");
        //     console.log(response);

        //     return response.secure_url; // Collect response URL for each file
        // });

        // // Wait for all uploads to finish
        // const uploadedImageUrls = await Promise.all(uploadPromises);
     //uploadImage=uploadImageUrl
        let netWeight=unitWeight*numberOfUnits;

        // Create a new product instance
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
            origin,
            uploadImage:uploadImageUrl
        });

        // Save the product to the database
        await newProduct.save();
        

        return res.status(200).json({
            success:true,
            message: 'Product created successfully', 
            product: newProduct });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error creating product', error: error.message });
    }
};

exports.getAllProducts=async(req,res)=>{
    try {
        console.log("hello")
        const getProducts=await product.find()
        console.log(getProducts)
        console.log("hello")

        return res.status(400).json({
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
        return res.status(400).json({
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

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params; // Extract the product ID from the URL parameters
        const {
            productName,
            productBrand,
            superCategory,
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
            origin,
            addedBy
        } = req.body; // Destructure the fields from the request body

        // Calculate netWeight based on the unitWeight and numberOfUnits
        let netWeight = unitWeight * numberOfUnits;

        // Initialize array for image URLs
        let imageUrls = [];

        // Handle image uploads if files are included
        if (req.files && req.files.imageFiles) {
            const files = Array.isArray(req.files.imageFiles) ? req.files.imageFiles : [req.files.imageFiles];

            for (const file of files) {
                // Validate file type
                const supportedTypes = ["jpg", "jpeg", "png"];
                const fileType = file.name.split('.').pop().toLowerCase();

                if (!supportedTypes.includes(fileType)) {
                    return res.status(400).json({
                        success: false,
                        message: 'File format not supported',
                    });
                }

                // Upload to Cloudinary
                const result = await cloudinary.uploader.upload(file.tempFilePath, {
                    folder: "Infyair",
                    resource_type: "auto"
                });

                // Collect image URLs
                imageUrls.push(result.secure_url);
            }
        }

        // Find the product by ID and update it with the new values
        const updatedProduct = await product.findByIdAndUpdate(
            id,
            {
                productName,
                productBrand,
                superCategory,
                numberOfUnits,
                siUnits,
                unitWeight,
                netWeight, // Set the calculated netWeight
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
                origin,
                addedBy,
                uploadImage: imageUrls // Update the image URLs
            },
            { new: true } // Return the updated document
        );

        // If the product is not found, return a 404 response
        if (!updatedProduct) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Return the updated product
        return res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            product: updatedProduct
        });
    } catch (error) {
        console.error('Error updating product:', error);
        return res.status(500).json({
            success: false,
            message: 'Error updating product',
            error: error.message
        });
    }
};