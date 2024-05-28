const cloudinary = require('./config'); 

async function add(file,folder){
    const result = await cloudinary.uploader.upload(file.tempFilePath, {folder : folder});
    return {
          success: true,
          url: result.secure_url,
          public_id: result.public_id,
    };
}
async function update(file, existingPublicId,folder){
    let result; 
    if (existingPublicId) {
        result = await cloudinary.uploader.upload(file.tempFilePath, {
            public_id: existingPublicId,
            overwrite: true,
            folder: folder
        });
    } else {
        result = await cloudinary.uploader.upload(file.tempFilePath, folder);
    }
    return {
          success: true,
          url: result.secure_url,
          public_id: result.public_id,
    };
}

module.exports ={
    add,
    update, 
}