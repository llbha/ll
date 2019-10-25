let myreg = {
  Moblie: /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/,//手机号
  CardID: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, //身份证号
  phone: /^([0-9]{3,4}-)?[0-9]{7,8}$/  //固话
}

export const formalUlr = "https://api.aiera.tech";
// export const formalUlr = "http://test.aiera.tech";
module.exports.myreg = myreg;