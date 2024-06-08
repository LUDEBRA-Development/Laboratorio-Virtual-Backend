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

        // Verificar si existe un ID público existente
        if (existingPublicId) {
            console.log("Actualizando archivo existente...");
            result = await cloudinary.uploader.upload(file.tempFilePath, {
                public_id: existingPublicId,
                overwrite: true,
                folder: folder
            });
        } else {
            console.log("Subiendo nuevo archivo...");
            result = await cloudinary.uploader.upload(file.tempFilePath, { folder: folder });
        }

        console.log("URL del archivo actualizado:", result.secure_url);
        console.log("Public ID del archivo actualizado:", result.public_id);

        return {
            success: true,
            url: result.secure_url,
            public_id: result.public_id
        };
    } catch (error) {
        console.error("Error al actualizar el archivo:", error);
        return {
            success: false,
            error: error.message // Puedes ajustar el manejo de errores según tus necesidades
        };
    }
}


module.exports ={
    add,
    update, 
}