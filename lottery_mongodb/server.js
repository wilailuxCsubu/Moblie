var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/lottery';
var obj = [],a = [];
const bodyParser = require('body-parser');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

//scraping lottery 
app.post('/', (req,res) => {
    request('http://lottery.kapook.com/',function(err,resp,body){

        if(!err && resp.statusCode==200){
            var $ = cheerio.load(body);
            var prize,money,lottery;
            
            //Day_Month_Year
            $('hgroup span').each(function(){
                var day_month_year = $(this).text();
                a.push({day_month_year:day_month_year});
            });
            
            var day = a[0].day_month_year;
            MongoClient.connect(url, function(err, db) {
                db.collection("data").find({"day":day}).toArray(function(err, result){
                    if(result.length == 0){
                        //first-prize
                        $('article .bigprize .first-prize header ').filter(function(){
                            a = $(this).text().split(" ");
                            prize = a[1]+" "+a[2];
                            lottery = $(this).next().text();
                            a = $(this).next().next().text().split(" ");
                            money = a[1];
                            obj.push({day:day,lottery_number:lottery,prize:{prize_name:prize, money:money}});
                        });
                        //prize front-back3
                        $('.front-back3').each(function(){
                            //front3
                            for(var i=1;i<3;i++){
                                prize = $(this).find('h3').first().text();
                                if(i==1)
                                    lottery = $(this).find('.front3').children().first().text();
                                else
                                    lottery = $(this).find('.front3').children().last().text(); 
                                a = $(this).find('footer').first().text().split(" ");
                                money = a[3];
                                obj.push({day:day,lottery_number:lottery,prize:{prize_name:prize, money:money}});
                            }
                            //back3
                            for(var i=1;i<3;i++){
                                prize = $(this).find('h3').last().text();
                                if(i==1)
                                    lottery = $(this).find('.back3').children().first().text();
                                else
                                    lottery = $(this).find('.back3').children().last().text();
                                a = $(this).find('footer').first().text().split(" ");
                                money = a[3];
                                obj.push({day:day,lottery_number:lottery,prize:{prize_name:prize, money:money}});                    
                            }
                        });
                        //back2
                        $('.back2 header').each(function(){
                            a = $(this).text().split(" ");
                            prize = a[1]+" "+a[2]+" "+a[3];
                            lottery = $(this).parent().find('p').text();
                            a = $(this).parent().find('footer').text().split(" ");
                            money = a[1];
                            obj.push({day:day,lottery_number:lottery,prize:{prize_name:prize, money:money}}); 
                        });

                        //near
                        $('.nearby').each(function(){
                            for(var i=1;i<3;i++){
                                prize = $(this).find('h3').text();
                                if(i==1)
                                    lottery = $(this).find('p').first().text();
                                else
                                    lottery = $(this).find('p').last().text();
                                a = $(this).parent().find('footer').text().split(" ");
                                money = a[2];
                                obj.push({day:day,lottery_number:lottery,prize:{prize_name:prize, money:money}});
                            }
                        });

                        //second-prize
                        $('.second-prize').each(function(){
                            a = $(this).find('p').text();
                            for(var i=1;i<6;i++){
                                prize = $(this).find('h3').text();
                                lottery = a.substring(0+(i-1)*6,i*6);
                                var b = $(this).find('header').text().split(" ");
                                money = b[7];
                                obj.push({day:day,lottery_number:lottery,prize:{prize_name:prize, money:money}});
                            }
                        });

                        //third-prize
                        $('.third-prize').each(function(){
                            a = $(this).find('p').text();
                            for(var i=1;i<11;i++){
                                prize = $(this).find('h3').text();
                                lottery = a.substring(0+(i-1)*6,i*6);
                                var b = $(this).find('header').text().split(" ");
                                money = b[7];
                                obj.push({day:day,lottery_number:lottery,prize:{prize_name:prize, money:money}});
                            }
                        });

                        //four-prize
                        $('.four-prize').each(function(){
                            a = $(this).find('p').text();
                            for(var i=1;i<51;i++){
                                prize = $(this).find('h3').text();
                                lottery = a.substring(0+(i-1)*6,i*6);
                                var b = $(this).find('header').text().split(" ");
                                money = b[7];
                                obj.push({day:day,lottery_number:lottery,prize:{prize_name:prize, money:money}});
                            }
                        });
                    
                        //five-prize
                        $('.five-prize').each(function(){
                            a = $(this).find('p').text();
                            for(var i=1;i<101;i++){
                                prize = $(this).find('h3').text();
                                lottery = a.substring(0+(i-1)*6,i*6);
                                var b = $(this).find('header').text().split(" ");
                                money = b[7];
                                obj.push({day:day,lottery_number:lottery,prize:{prize_name:prize, money:money}});
                            }
                        });
                        db.collection("data").insert(obj, function(err, res) {
                            console.log("documents inserted");
                        });
                    }    
                    date = req.body.date;   
                    db.collection("data").find({"day":date}).toArray(function(err, result){
                       if(result.length > 0){
                        var a =[],j=[];
                        a = req.body.id; 
                        var money = " เงินรางวัล 0 บาท",prize="ไม่ถูกรางวัล";
                        if(Array.isArray(a)){
                            a.forEach(function(element){
                                money = " เงินรางวัล 0 บาท",prize="ไม่ถูกรางวัล";
                                if(element.length ==6){
                                    for (var i=0; i<result.length; i++){
                                        if(result[i].prize.prize_name == "เลขท้าย 2 ตัว" && element.substring(4,6)== result[i].lottery_number){
                                            prize = result[i].prize.prize_name;
                                            money = " เงินรางวัล "+result[i].prize.money+" บาท";
                                        }else if(result[i].prize.prize_name == "เลขหน้า 3 ตัว" && element.substring(0,3)== result[i].lottery_number){
                                            prize = result[i].prize.prize_name;
                                            money = " เงินรางวัล "+result[i].prize.money+" บาท";                    
                                        }else if(result[i].prize.prize_name == "เลขท้าย 3 ตัว" && element.substring(3,6)== result[i].lottery_number){
                                            prize = result[i].prize.prize_name;
                                            money = " เงินรางวัล "+result[i].prize.money+" บาท";                    
                                        }else if(result[i].lottery_number == element){
                                            prize = result[i].prize.prize_name;
                                            money = " เงินรางวัล "+result[i].prize.money+" บาท";                    
                                            break;
                                        }                   
                                    }
                                    j.push({id:element,prize:prize,money:money});
                                }else{
                                    j.push({id:element,note:"กรุณากรอกข้อมูลให้ถูกต้อง!!!"});
                                }
                            });  
            
                        }else{
                            if(a.length ==6){
                                for (var i=0; i<result.length; i++){
                                    if(result[i].prize.prize_name == "เลขท้าย 2 ตัว" && a.substring(4,6)== result[i].lottery_number){
                                        prize = result[i].prize.prize_name;
                                        money = " เงินรางวัล "+result[i].prize.money+" บาท";
                                    }else if(result[i].prize.prize_name == "เลขหน้า 3 ตัว" && a.substring(0,3)== result[i].lottery_number){
                                        prize = result[i].prize.prize_name;
                                        money = " เงินรางวัล "+result[i].prize.money+" บาท";                    
                                    }else if(result[i].prize.prize_name == "เลขท้าย 3 ตัว" && a.substring(3,6)== result[i].lottery_number){
                                        prize = result[i].prize.prize_name;
                                        money = " เงินรางวัล "+result[i].prize.money+" บาท";                    
                                    }else if(result[i].lottery_number == a){
                                        prize = result[i].prize.prize_name;
                                        money = " เงินรางวัล "+result[i].prize.money+" บาท";                    
                                        c=0;
                                        break;
                                    }                   
                                }
                                j.push({id:a,prize:prize,money:money});
                            }else{
                                j.push({id:a,note:"กรุณากรอกข้อมูลให้ถูกต้อง!!!"});
                            }
                            
                        }
                        res.json(j);
                    }else{
                        res.json("ไม่มีวันที่ "+date +" ที่ท่านต้องการค้นหา");
                    }
                    });
                }); 
            });  
        }  
    });
});
app.listen(8000);
