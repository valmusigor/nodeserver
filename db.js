let knex = require ('knex')({
    client:'mysql',
    connection:{
    host:'127.0.0.1',
    user:'root',
    password:'1234',
    database:'borviha'
    }
});
class Article{
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
    static find(id,callback){
        knex.select().from('user').where('email','=',id).asCallback(callback);
    }
    static create(data,callback)
    {  
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
