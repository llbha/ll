const check=() =>{
  let token = wx.getStorageSync('token');
  if (!token){
    wx.redirectTo({
      url: '/pages/login/login',
    })
    return false;
  }
  return true;
}
module.exports = {
  check: check
}