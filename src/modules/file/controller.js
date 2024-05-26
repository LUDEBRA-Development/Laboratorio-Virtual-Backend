const cloudinary = require('../../DB/cloudinary/config'); 

async function file(file){
    try {
        const result = await cloudinary.uploader.upload(file.tempFilePath);
        return {
          success: true,
          url: result.secure_url,
          public_id: result.public_id,
        };
      } catch (error) {
        throw new Error(error.message);
      }
}

module.exports ={
    file,
}