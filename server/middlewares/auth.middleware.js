const TaiKhoan = require('../models/taiKhoan.model')

module.exports.requireAuth = async(req,res,next) => {
    if(!req.signedCookies.userId){
        return res.json({message: "Đăng nhập để thực hiện"})
    }
    let checkCookie =await TaiKhoan.findOne({_id : req.signedCookies.userId});
    if(checkCookie){
         next();
    }
    else {
        res.json({message: "Đăng nhập để thực hiện"})
    }
}