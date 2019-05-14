const express = require('express');
const app = express();
const articles=[{title:'HEAD'}];
const bodyParser=require('body-parser');
const Article = require('./db').Article;
const read = require('node-readability');
app.set('port',process.env.PORT||3001);
app.use(bodyParser.json());//поддерживат тела запросов закодированные в json
app.use(bodyParser.urlencoded({extended:true}));//поддерживает тела запросов в кодировке формы
let id={};
app.post('/rent',(req,res,next)=>{
    //debugger;
    const price = req.body.price;
    const square = req.body.square;
    const firma = req.body.firma;
    const address = req.body.address;
    const floor = req.body.floor;
    
    Article.findAdsRent({price, square, firma, address, floor},(err, listAds)=>{
   // debugger;
    if(err) return next(err);
    if(listAds.length!=0 ){
    res.json(JSON.stringify({status:'ok', listAds}));
    }
    else
    res.json(JSON.stringify({status:'bad'}));
    });
});

app.get('/users',(req,resp,next)=>{
    Article.all((err , articles)=>
    {
        if(err) return next(err);
        resp.json(articles);
    });
});
app.post('/articles',(req,res,next)=>{
    const url=req.body.url;
    read(url,(err,result)=>{
        if(err||!result) res.status(500).send('Error downloading article');
        Article.create({title:result.title, content:result.content},(err)=>{
        if(err) return next(err);
        res.send('OK');п
        });
    });
    const article={title:req.body.title};
    articles.push(article);
    res.send(article);
});
app.get('/articles/:id',(req,res,next)=>{
    const id= req.params.id;
    Article.find(id,(err,article)=>{
    if(err) return next(err);
    res.send(article);
    });
});
app.post('/signin',(req,res,next)=>{
    if(req.body.login){
    Article.find(req.body.login,(err,article)=>{
    if(err) return next(err);
    if(article.length!=0 && req.body.pass==article[0].password){
    res.json(JSON.stringify({status:'ok', id:article[0].id}));
    }
    else
    res.json(JSON.stringify({status:'bad'}));
    });
    }
});
app.post('/signup',(req,res,next)=>{no
    if(req.body.email && req.body.pass){
      Article.create({email:req.body.email, pass:req.body.pass}, (err, article)=>{
        if(err) return next(err);
        if(article)
        res.json(JSON.stringify({status:'ok', id:article[0]}));
        else
        res.json(JSON.stringify({status:'bad'}));
      });
    }
});
app.delete('/articles/:id',(req,res,next)=>{
    const id= req.params.id;
    Article.deleteItem(id,(err)=>{
    if(err) return next(err);
    else
    res.send({message:'Deleted'});
    }); 
});
app.listen(app.get('port'),()=>{
    console.log(`App start on port: ${app.get('port')}`);
});
module.exports=app;