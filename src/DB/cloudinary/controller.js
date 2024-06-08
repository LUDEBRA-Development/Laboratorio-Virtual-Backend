const cloudinary = require('./config'); 

async function add(file,folder){
    const result = await cloudinary.uploader.upload(file.tempFilePath, {folder : folder});
    return {
          success: true,
          url: result.secure_url,
          public_id: result.public_id,
    };
}

async function update(file, folder, existingPublicId) {
    try {
        let result;
        if (existingPublicId) {
            result = await cloudinary.uploader.upload(file.tempFilePath, {
                public_id: existingPublicId,
                overwrite: true,
                folder: folder
            });
        } else {
            result = await cloudinary.uploader.upload(file.tempFilePath, { folder: folder });
        }
        return {
            success: true,
            url: result.secure_url,
            public_id: result.public_id
        };
    } catch (error) {
        console.error("Error al actualizar el archivo:", error);
        return {
            success: false,
            error: error.message
        };
    }
}


module.exports ={
    add,
    update, 
}