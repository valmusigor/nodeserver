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
    static all(callback){
        knex.select().from('user').asCallback(callback);
    }
    static find(id,callback){
        knex.select().from('user').where('email','=',id).asCallback(callback);
    }
    static create(data,callback)
    {
        knex('articles').insert({title:data.title, text:data.content}).asCallback(callback);
    }
    static deleteItem(id, callback)
    {
        if(!id) return callback(new Error('Please provide an id'));
        knex('articles').where('id','=',id).del().asCallback(callback);
    }
}
module.exports = knex;
module.exports.Article=Article;
