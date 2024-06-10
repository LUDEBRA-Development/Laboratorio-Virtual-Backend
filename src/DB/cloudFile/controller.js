const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');


const serverFile= 'https://file-cloud-1lcm.onrender.com/upload'
const serverFilelocal = 'http://localhost:8080/upload';

async function getAll(){
    try {
        const response = await axios.get('serverFile');
        return response.data;
    } catch (error) {
        console.error('Error haciendo la petición:', error);
    }
}

async function add(file) {
    try {
        const formData = new FormData();
        const fileContent = fs.createReadStream(file.tempFilePath); // Lee el contenido del archivo


        formData.append('file', fileContent, { filename: file.name }); 

        const response = await axios.post(serverFile, formData, {
            headers: {
                ...formData.getHeaders(),
            },
        });
        console.log(response.data)
        return response.data
    } catch (error) {
        console.error('Error haciendo la petición:', error);
        return {
            success: false,
            error: error.message,
        };
    }
}

async function update(file,folder,existingPublicId){
    let result; 
    if (existingPublicId) {
        result = await cloudinary.uploader.upload(file.tempFilePath, {
            public_id: existingPublicId,
            overwrite: true,
            folder: folder
        });
    } else {
        result = await cloudinary.uploader.upload(file.tempFilePath, {folder : folder});
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
    getAll,
}