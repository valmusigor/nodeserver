const express = require('express');
const app = express();
const articles=[{title:'HEAD'}];
const bodyParser=require('body-parser');
const Article = require('./db').Article;
const read = require('node-readability');
const bcrypt = require('bcrypt');
app.set('port',process.env.PORT||3001);
app.use(bodyParser.json());//поддерживат тела запросов закодированные в json
app.use(bodyParser.urlencoded({extended:true}));//поддерживает тела запросов в кодировке формы
let id={};
app.post('/rent',(req,res,next)=>{
    debugger;
    const price = req.body.price;
    const square = req.body.square;
    const firma = req.body.firma;
    const address = req.body.address;
    const floor = req.body.floor;
    const currentPage = req.body.currentPage;
    Article.findAdsRentCount({price, square, firma, address, floor},(err, countAds)=>{
    //debugger;
    if(err) return next(err);
    if(countAds.length!=0 && countAds[0].totalCount!=0){
    Article.findAdsRent({price, square, firma, address, floor, currentPage},(err, listAds)=>{
    //debugger;
        if(err) return next(err);
    res.json(JSON.stringify({status:'ok', listAds, totalPageSize:countAds[0].totalCount}));
    });
    }
    else
    res.json(JSON.stringify({status:'bad'}));
    });
});

app.get('/cabinet/user',(req,res,next)=>{
    debugger
    const token = req.headers['x-access-token'];
    if(!token) return res.status(401).send({status:'bad'});
    Article.decodeWebToken(token, (decoded)=>{
        debugger;
        if(!decoded) res.status(500).send({status:'bad'});
        Article.find({id:decoded.id},(err,article)=>{
            if(err) return next(err);
              if(article.length!=0)
                {
                  res.json(JSON.stringify({status:'ok', login:article[0].login, email: article[0].email,
                   dataReg: article[0].dataReg, firma: article[0].firma, unp: article[0].unp,
                   address: article[0].address, tel: article[0].tel}));
                }
              else res.json(JSON.stringify({status:'bad'}));
            }); 
    });
});
app.post('/signin',(req,res,next)=>{
    if(req.body.login){
    Article.find({email:req.body.login},(err,article)=>{
    if(err) return next(err);
      if(article.length!=0){
        bcrypt.compare(req.body.pass, article[0].password, function(err, result) {
            if(result)
            res.json(JSON.stringify({status:'ok', token:Article.generateWebToken(article[0].id)}));
            else if(!result || err)
            res.json(JSON.stringify({status:'bad'}));
            });
      }
      else res.json(JSON.stringify({status:'bad'}));
    });  
    }
});
app.post('/signup',(req,res,next)=>{

    if(req.body.login && req.body.pass){
        Article.find({email:req.body.login},(err,article)=>{
            if(err) return next(err);
              if(article.length!=0){
                res.json(JSON.stringify({status:'exist'}));  
            }
              else 
                Article.create({email:req.body.login, pass:bcrypt.hashSync(req.body.pass, 3)}, (err, article)=>{
                        if(err) return next(err);
                        if(article)
                        res.json(JSON.stringify({status:'ok', token:Article.generateWebToken(article[0].id)}));
                        else
                        res.json(JSON.stringify({status:'bad'}));
                });
        });
    }
});
/*
app.post('/articles',(req,res,next)=>{
    const url=req.body.url;
    read(url,(err,result)=>{
        if(err||!result) res.status(500).send('Error downloading article');
        Article.create({title:result.title, content:result.content},(err)=>{
        if(err) return next(err);
        res.send('OK');
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
app.delete('/articles/:id',(req,res,next)=>{
    const id= req.params.id;
    Article.deleteItem(id,(err)=>{
    if(err) return next(err);
    else
    res.send({message:'Deleted'});
    }); 
});*/
app.listen(app.get('port'),()=>{
    console.log(`App start on port: ${app.get('port')}`);
});
module.exports=app;