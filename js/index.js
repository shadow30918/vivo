var mainW = $('.content').width();
var fbinApp = false ;
var official_website = 'http://www.vivo.com/tw/products/nex2?fromBanner=Home_top_bigBanner',
    FB_site = 'https://www.facebook.com/vivotaiwan/';


//表單
var dataInfo = {
    name: '',
    mobile: '',
    email: '',
    i_no:0
 };

//game
var arr=[1,2,3,4,1,2,3,4],
    newArr=[],
    pick = [],
    result,
    match = 0;

var FB_shareIMG = '',
    FB_shareLink = '';

//timer
var timer,
    sec = 0,
    minute = 0,
    hour = 0,
    show_time,
    show_minute,
    show_sec;
    

(function($) {
    $('.skip').click(function(){
        $('.game').hide();
        $('.result,header').fadeIn(500);
    });

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        GEvent('進入網站','進入網站_行動裝置');

        if (/fb|line/i.test(navigator.userAgent)) {
            //webview in app
            fbinApp = true;
            $('.inapp').show();
        }else{
            //not in app
            $('.intro,header').show();

            $(window).on('load',function(){
                //console.log('load');
                $('.loading').fadeOut(300);
                intro();
            })
            $('.ham,.menu_close').click(function(){
                menu();
            });
        
            $('.menu li').click(function(){
                switch($(this).index()) {
                    case 0 :
                        GEvent('menu','menu_回首頁');
                        location.href = 'index.html';
                        break;
                    case 1 :
                        GEvent('menu','menu_活動辦法');
                        $('.rule').fadeIn(300);
                        break;
                    case 2 :
                        GEvent('menu','menu_得獎名單');
                        $('.winner').fadeIn(300);
                        break;
                    case 3 :
                        GEvent('menu','menu_粉絲團');
                        if(fbinApp==true){
                            location.href = FB_site;                        
                        }else{
                            window.open( FB_site ,'_blank');
                        }
                        break;
                    case 4 :
                        GEvent('menu','menu_官網');
                        if(fbinApp==true){
                            location.href = official_website;                        
                        }else{
                            window.open(official_website,'_blank');
                        }
                        break;
                }
                menu();
            });
        
            $('.go_rule').click(function(){
                $('.rule').fadeIn(300);
                GEvent('表單頁','表單_活動辦法');
            })
        
            $('.rule_close,.winner_close').click(function(){
                $('.rule,.winner').fadeOut(300);
            });
        
            $('.play').click(function(){
                GEvent('首頁','首頁_立即挑戰');
                //$('.intro').hide();
                $('.tips').fadeIn(500);
                $('.content,header').addClass('blur');
                
            })
            
            $('.start,.go_play').on('click',function(){
                if($(this).hasClass('start')){
                    GEvent('遊戲說明','遊戲說明_立即挑戰');
                }else{
                    GEvent('結果頁','再玩一次');
                }
                
                $('.tips,.intro,.result,header').hide();
                game_init();
                $('.game').fadeIn(500);
                $('.content,header').removeClass('blur');
                setTimeout(function(){
                    game_start();
                },500)
                
            });
        
            $('.go_form').click(function(){
                GEvent('結果頁','參加抽獎');
                $('.result').hide();
                $('.form').fadeIn(500);
            });

            $('.go_web').click(function(){
                GEvent('結果頁','結果頁_前往官網');
                window.open( official_website ,'_blank');
            });
            

            $('.fb').on('click', function (event) {
                GEvent('結果頁','FB分享');
                event.preventDefault();
                event.stopImmediatePropagation();
        
                var FBDesc      = '翻轉未來！挑戰雙螢記憶翻牌抽vivo NEX雙螢幕及多項好禮！';
                var FBTitle     = 'vivo NEX雙螢幕版 未來不止一面';
                var FBLink      = FB_shareLink;
                var FBPic       = FB_shareIMG;

                
                FB.ui({
                    method: 'share',
                    href: FBLink
                })
            });
        
            //表單
            $('#SUD_Bu_Submit').on('click', function() {
                //dataInfo.i_no=$('#SUD_Img').val();
                dataInfo.name=$('#SUD_Name').val();
                dataInfo.mobile=$('#SUD_Mobile').val();
                dataInfo.email=$('#SUD_EMail').val();
        
                checkdata(dataInfo.name,dataInfo.mobile,dataInfo.email);
            });
        }

    }else{
        GEvent('進入網站','PC');
        $('.pc').show();
    }

    

})( jQuery );

function game_init() {
    arr=[1,2,3,4,1,2,3,4];
    newArr=[];
    index=0;
    sec = 0;
    minute = 0;
    hour = 0;
    match=0;

    cardH = mainW*250/640;

    clearInterval(timer);
    $('.complete').hide();
    $('.time').html('00:00');
    $('.playground').children().remove();
    //$('.game').append('<div class="time"></div>')    
}

function game_start() {
    for ( i = 0; i < arr.length; i++ ) {
        randomSort(arr,newArr);
    }
    console.log(newArr);
    setTimeout(function(){
        $('.card').addClass('delay');
    },100)

    setTimeout(function(){
        $('.card').css('opacity','1').removeClass('delay');
        $('.card').removeClass('pick');
        setTimeout(function(){
            $('.go').addClass('act');
            setTimeout(function(){
                $('.go').removeClass('act');
                timer = setInterval(checkTime,1000);
            },2000);
        },500)
    },2000);
    


    $('.card').on('touchstart',function(){
        if(pick.length<2 && !$(this).hasClass('pick') ){
            $(this).addClass('pick');
            pick.push($(this).attr('data'));
            //console.log(pick);
    
            if(pick.length==2 && pick[0]==pick[1]){
                result = pick[0];
                pick = [];
                $('.pick').each(function(){
                    if(!$(this).hasClass('check')){
                        $(this).addClass('check');
                    }
                })
                score();

            }else if(pick.length==2 && pick[0]!=pick[1]){
                setTimeout(function(){
                    $(".card").each(function(){
                        if(!$(this).hasClass('check')){
                            $(this).removeClass('pick');
                        }
                    });
                    pick = [];
                },1000)
            }
        }
    });
}

function randomSort(arr, newArr) {
    if (arr.length == 1) {
        newArr.push(arr[0]);
        $('.playground').append('<div class="card pick" style="height:'+cardH+'px" data="'+arr[0]+'"><div><img src="img/game_'+arr[0]+'.png"></div></div>')
        return newArr; 
    }

    var random = Math.ceil(Math.random() * arr.length) - 1;
    
    newArr.push(arr[random]);
    index++;//console.log(index);
    $('.playground').append('<div class="card pick" style="height:'+cardH+'px" data="'+arr[random]+'"><div><img src="img/game_'+arr[random]+'.png"></div></div>')

    arr.splice(random, 1);
    return randomSort(arr, newArr);
}



function score(){
    match++;
    show_Match();
    console.log('match:'+match);

    if(match==4){
        setTimeout(function(){
            $('.complete').fadeIn(300);
        },3700);
        
        clearInterval(timer);
        console.log(show_time);

        var $request = $.ajax({
            url: "func.php",
            type: "POST",
            data: {
               func: 'makeImg',
               time: show_time 
            },
            timeout: 30*1000, 
            dataType: "json"
         }).done(function(data) {
            if (toNumber(data.ok)===1) {
                FB_shareIMG = 'https://wwwosc.ad2iction.com/18/vivo/post/'+data.imgNo+'.png';
                FB_shareLink = 'https://wwwosc.ad2iction.com/18/vivo/share.php?num='+data.imgNo;
                setTimeout(function(){
                    GEvent('Game','遊戲完成進入結果頁');
                    $('.game').hide();
                    $('.result,header').fadeIn(500);
                },4300);
            } else {
               alert("完成時間沒有填寫")
            }
         });
    }
}

function show_Match() {
    $('.match>div').hide();
    $('.match>div:nth-child('+result+')').show();
    setTimeout(function(){
        $('.match').fadeIn(300);
        $('.content').toggleClass('blur');
        if($('.menu').hasClass('open')){
            $('.menu').fadeIn(500);
        }else{
            $('.menu').fadeOut(500);
        }
    },500);
    setTimeout(function(){
        $('.match').fadeOut(300);
        $('.content').toggleClass('blur');
        if($('.menu').hasClass('open')){
            $('.menu').fadeIn(500);
        }else{
            $('.menu').fadeOut(500);
        }
    },3500);
}


function toNumber(strNumber) {
    return +strNumber;
 }



function checkTime(){
    sec++;
    second = Math.floor(Math.floor(sec%60));
    minute = Math.floor(Math.floor(sec/60));

    if(second<10){
        show_sec = "0"+second;
    }else{
        show_sec = second;
    }
    if(minute<10){
        show_minute = "0"+minute;
    }else{
        show_minute = minute;
    }
    show_time = show_minute+':'+show_sec;
    $('.time').html(show_time);

    if(minute>59){
        location.href('index.html');
    }
}


function checkdata(name, phone, mail) {

    var mailfrom = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    var phonefrom = /09[0-9]{8}/;

    if (name === "") {
        alert("請輸入名字");
        return false;
    } else if (!phonefrom.test(phone)) {
        alert("手機格式有誤");
        return false;
    } else if (!mailfrom.test(mail)) {
        alert("E-mail格式有誤");
        return false;
    } else if ($('#inn')[0].checked !== true) {
        alert("請勾選同意送出個人資料");
        return false;
    } else {
        var $request = $.ajax({
            url: "func.php",
            type: "POST",
            data: {
               func: 'submit',
               data: dataInfo
            },
            timeout: 30*1000,   //waiting timeout 30sec
            dataType: "json"
        }).done(function(data) {
            if (toNumber(data.ok)===1) {
                GEvent('表單','表單送出');
                alert('成功送出');
                $('input').val('');
                $('.form').hide();
                $('.result').show();
            } else {
               alert("有欄位沒填, 或有問題 ==> "+data.fields)
            }
        });
        return true;
    }
}


function intro () {
    $('.line').css('height',mainW*234/640);
    $('.pathR img,.pathL img').css('width',mainW);

    $('.nex img,.intro .title img,.kv img,.slogan li,.intro .play img').addClass('act');
    setTimeout(function(){
        $('.pathR,.pathL').addClass('act');
    },1000)
    
}

function menu() {
    $('.menu').toggleClass('open');
    $('.content,header').toggleClass('blur');
    if($('.menu').hasClass('open')){
        $('.menu').fadeIn(500);
    }else{
        $('.menu').fadeOut(500);
    }
}