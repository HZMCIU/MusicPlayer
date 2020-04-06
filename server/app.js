var mysql = require('mysql');
var express = require('express');
var http = require('http');
var url = require('url');
var util = require('util');

var app=express();
var connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'123456',
    port:'3306',
    database:'music'
});
connection.connect();

/*favorite music list */
app.get('/get_favorite', function (request,response){
    response.append('Access-Control-Allow-Origin', "*");
    console.log('get favorite list')
    var account=request.query.account;
    var sql = 'SELECT * FROM favorite_music';
    console.log(sql);
    connection.query(sql,function(error,result,fileds){
        response.jsonp(result);
    })
})

/*add favorite music */
/* http://localhost:9000/add_favorite?id=1354477202&songname=路过人间&artist=郁可唯&albumPic=https://p1.music.126.net/Otu98pBAFmTF1oZtpclyCA==/109951164053279186.jpg*/
app.get('/add_favorite',function(request,response){
    response.append('Access-Control-Allow-Origin', "*");
    console.log('add favorite')
    console.log(request.query.songname)
    var id=request.query.id;
    var songname=request.query.songname;
    var artist=request.query.artist;
    var albumPic=request.query.albumPic;
    var sql = "INSERT INTO favorite_music(id,albumPic,songname,artist) VALUES(?,?,?,?)";
    var sqlParams = [id,albumPic,songname,artist];
    connection.query(sql,sqlParams,function(error,result,fileds){
        if (error) {
            response.json({ status: false })
        } else {
            response.jsonp({ status: true })
        }
    })
});
/*remove favorite music */
/**http://localhost:9000/remove_favorite?id=1354477202 */
app.get('/remove_favorite',function(request,response){
    response.append('Access-Control-Allow-Origin', "*");
    console.log('remove favorite')
    console.log(request.query.id)
    var id=request.query.id;
    var sql="DELETE FROM favorite_music WHERE id=?";
    var sqlParams=[id];
    connection.query(sql, sqlParams, function (error, result, fileds) {
        if (error) {
            response.json({ status: false })
        } else {
            response.jsonp({ status: true })
        }
    });
})
var server = app.listen(9000,function(){
    console.log("listenning")
})