function  validateMail(Mail) {
    var regex = /^[a-zA-Z0-9._-]+@unicesar\.edu\.co$/;
    return regex.test(Mail);
}
module.exports ={
validateMail,
}