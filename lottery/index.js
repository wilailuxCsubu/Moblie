var request = require('request');
var cheerio = require('cheerio');
var url = require('url')
var http = require('http')
var url = require('url')
var fs = require('fs');
var contents = fs.readFileSync("./lottery.json");
var jsonContent = JSON.parse(contents);
var a;

http.createServer(function(req,res){
  res.writeHead(200,{'content-Type':'test/plain'});
  request('http://lottery.kapook.com/',function(err,res,body){
      if(!err && res.statusCode==200){
        var $ = cheerio.load(body);
        var prize,money,lottery;
        var obj = {table:[]};

        // first-prize
        $('article .bigprize .first-prize header ').filter(function(){
              a = $(this).text().split(" ");
              prize = a[1]+" "+a[2];
              lottery = $(this).next().text();
              a = $(this).next().next().text().split(" ");
              money = a[1]+" "+a[2];
              obj.table.push({prize:prize, lottery:lottery, money:money});
        });

        //prize front-back3
        $('.front-back3').each(function(){
            for(var i=1;i<3;i++){
                prize = $(this).find('h3').first().text();
                if(i==1)
                  lottery = $(this).find('.front3').children().first().text();
                else
                  lottery = $(this).find('.front3').children().last().text();

                a = $(this).find('footer').first().text().split(" ");
                money = a[3]+" "+a[4];
                obj.table.push({prize:prize, lottery:lottery, money:money});
            }

            for(var i=1;i<3;i++){
                prize = $(this).find('h3').last().text();
                if(i==1)
                  lottery = $(this).find('.back3').children().first().text();
                else
                  lottery = $(this).find('.back3').children().last().text();

                a = $(this).find('footer').first().text().split(" ");
                money = a[3]+" "+a[4];
                obj.table.push({prize:prize, lottery:lottery, money:money});
            }
          });

          //back2
          $('.back2 header').each(function(){
            a = $(this).text().split(" ");
            prize = a[1]+" "+a[2]+" "+a[3];
            lottery = $(this).parent().find('p').text();
            a = $(this).parent().find('footer').text().split(" ");
            money = a[1]+" "+a[2];
            obj.table.push({prize:prize, lottery:lottery, money:money});
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
                money = a[2]+" "+a[3];
                obj.table.push({prize:prize, lottery:lottery, money:money});
            }
          });

          //second-prize
          $('.second-prize').each(function(){
            a = $(this).find('p').text();
            for(var i=1;i<6;i++){
              prize = $(this).find('h3').text();
              lottery = a.substring(0+(i-1)*6,i*6);
              var b = $(this).find('header').text().split(" ");
              money = b[7]+" "+b[8];
              obj.table.push({prize:prize, lottery:lottery, money:money});
              }
          });

          //third-prize
          $('.third-prize').each(function(){
            a = $(this).find('p').text();
            for(var i=1;i<11;i++){
              prize = $(this).find('h3').text();
              lottery = a.substring(0+(i-1)*6,i*6);
              var b = $(this).find('header').text().split(" ");
              money = b[7]+" "+b[8];
              obj.table.push({prize:prize, lottery:lottery, money:money});
              }
          });

          //four-prize
          $('.four-prize').each(function(){
            a = $(this).find('p').text();
            for(var i=1;i<51;i++){
              prize = $(this).find('h3').text();
              lottery = a.substring(0+(i-1)*6,i*6);
              var b = $(this).find('header').text().split(" ");
              money = b[7]+" "+b[8];
              obj.table.push({prize:prize, lottery:lottery, money:money});
              }
          });

          //five-prize
          $('.five-prize').each(function(){
            a = $(this).find('p').text();
            for(var i=1;i<101;i++){
              prize = $(this).find('h3').text();
              lottery = a.substring(0+(i-1)*6,i*6);
              var b = $(this).find('header').text().split(" ");
              money = b[7]+" "+b[8];
              obj.table.push({prize:prize, lottery:lottery, money:money});
              }
          });
      }

      fs.writeFile('lottery.json' , JSON.stringify(obj), function(err){
        console.log('File successfully written! - Check your project directory for the lottery.json file');
      });
  });


  data = url.parse(req.url,true).query
  var m = 0,p = "ไม่ถูกรางวัล"
  for(var i=0;i<173;i++){
    if(jsonContent.table[i].prize == "เลขท้าย 2 ตัว" && data.num.substring(4,6)== jsonContent.table[i].lottery){
        res.write(p = jsonContent.table[i].prize+"  ");
        res.write(m = jsonContent.table[i].money+"\n");

    }else if(jsonContent.table[i].prize == "เลขหน้า 3 ตัว" && data.num.substring(0,3)== jsonContent.table[i].lottery){
        res.write(p = jsonContent.table[i].prize+"  ");
        res.write(m = jsonContent.table[i].money+"\n");
    }else if(jsonContent.table[i].prize == "เลขท้าย 3 ตัว" && data.num.substring(3,6)== jsonContent.table[i].lottery){
        res.write(p = jsonContent.table[i].prize)+"  ";
        res.write(m = jsonContent.table[i].money+"\n");
    }else  if(jsonContent.table[i].lottery == data.num && jsonContent.table[i].money){
        res.write(p = jsonContent.table[i].prize+"  ");
        res.write(m = jsonContent.table[i].money+"\n");
    }else if(m == 0 && i==172){
      res.write(p+"\n");
    }

}
  res.end()
}).listen(8088)
