const services = {
escapeHtmlAndSpaces: (text) => {
    let map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; }).replace(/\s+/g, '');
  },
checkLogin: login => (login.length>0),
checkEmail: email => email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i),
checkFirma: firma => (firma.length>0),
checkUnp: unp => unp.match(/^\d{9}$/i),
checkAddress: address => (address.length>0),
checkTel: tel => tel.match(/^(29|44|25|33){1,}[1-9]{1}[0-9]{6}$/i),
validateData: function(data) { return this.checkLogin(data.login) && this.checkEmail(data.email) && this.checkFirma(data.firma) && this.checkUnp(data.unp) && 
this.checkAddress(data.address) && this.checkTel(data.tel)},
};

module.exports=services;