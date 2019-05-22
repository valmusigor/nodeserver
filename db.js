let knex = require ('knex')({
    client:'mysql',
    connection:{
    host:'127.0.0.1',
    user:'root',
    password:'1234',
    database:'borviha'
    }
});
const jwt = require('jsonwebtoken');
const env = require('./config');

class Article{
    static generateWebToken(id){
        const today = new Date();
        const expirationDate = new Date(today);
        expirationDate.setDate(today.getDate() + 60);
        return jwt.sign({
            id,
            exp: parseInt(expirationDate.getTime() / 1000, 10),
          }, env.secret);
    }
    static decodeWebToken(token,callback){
        jwt.verify(token, env.secret, function(err, decoded) {
            debugger;
           if (err) callback (false);
           else callback(decoded);
          });
    }
    static findAdsRent(searchParams,callback){
       // debugger;
    knex.select().from('rent').where('price','<=',searchParams.price)
    .andWhere('square','<=',searchParams.square)
    .andWhere('firma','like',(searchParams.firma==='all')?'%':searchParams.firma)
    .andWhere('address','like',(searchParams.address==='all')?'%':searchParams.address)
    .andWhere('floor','like',(searchParams.floor==='all')?'%':searchParams.floor).limit(3).offset(searchParams.currentPage*3)
    .asCallback(callback);
    }
    static findAdsRentCount(searchParams,callback){
        // debugger;
     knex.select().count({totalCount:'*'}).from('rent').where('price','<=',searchParams.price)
     .andWhere('square','<=',searchParams.square)
     .andWhere('firma','like',(searchParams.firma==='all')?'%':searchParams.firma)
     .andWhere('address','like',(searchParams.address==='all')?'%':searchParams.address)
     .andWhere('floor','like',(searchParams.floor==='all')?'%':searchParams.floor).asCallback(callback);
     }
    

    static all(callback){
        knex.select().from('user').asCallback(callback);
    }
    static find(objFind,callback){
        knex.select().from('user').where(`${Object.keys(objFind)[0]}`,'=',`${Object.values(objFind)[0]}`).asCallback(callback);
    }
    static create(data,callback)
    {  
    debugger;
     knex('user').insert({login:data.email.split('@')[0] ,email:data.email, password:data.pass, role:'user'}).asCallback(callback);
    }
    static deleteItem(id, callback)
    {
        if(!id) return callback(new Error('Please provide an id'));
        knex('articles').where('id','=',id).del().asCallback(callback);
    }
}
module.exports = knex;
module.exports.Article=Article;
