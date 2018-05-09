var green = document.getElementById('green');
var red = document.getElementById('red');
var yellow = document.getElementById('yellow');
var blue = document.getElementById('blue');

var screen = document.getElementById('screen');
var start = document.getElementById('start');
var sirict = document.getElementById('sirict');

var oo = document.getElementById('oo');
var onoff = document.getElementById('onoff');
var yd = document.getElementById('yd');

var arr = [];//存 亮起的色块的 顺序 数组
var userarr = [];
var userindex = 0;
var n = 1;
var ctimeout; 
var ltimeout;
var mtimeout;

var ms;
var colorBlocks = [green,red,yellow,blue];

var isSirict = false;
// 开关按钮：
// 开: 1 按钮移动
//     2 start 和 sirict 按钮解锁
//     3 screen显示屏激活,颜色变成 on
// 关: 跟开相反就是了 start和sirict按钮赋值空函数

var ydContorl = false; //小黄点 开关控制标志
var ooContorl = false; //总开关控制标志
oo.addEventListener('click',function(){
    ooContorl = !ooContorl;
    if(ooContorl){  //总开关 开
        ooTrue();
    }
    else{
        ooFalse();
    }
});

function ooTrue(){
    onoff.className = 'kg kg-right'; //总开关 开
    screen.className = 'screen led-on'; //屏幕亮起

    // 为start 和 sirict 添加 鼠标按落 按起 添加函数
    // start 点击运行 startDown函数
    start.onmousedown = function(){startDown(this)}; 
    start.onmouseup = function(){startUp(this)}
    sirict.onmousedown = function(){sirictDown(this)};
    sirict.onmouseup = function(){sirictUp(this)};
}

function ooFalse(){
    init();
    onoff.className = 'kg kg-left';
    screen.className = 'screen led-off';
    screen.innerHTML = '- -';
    isSirict = false;
    yd.className = 'yd yd-off';
    start.onmousedown = function(){};
    start.onmouseup = function(){}
    sirict.onmousedown = function(){};
    sirict.onmouseup = function(){};
}

function startDown(e){
    mdown(e); //按下效果

    init(); //初始化 电脑色块亮起顺序的数组清空
            //       屏幕显示数字 重设为 1;
            //       clearTimeout(ltimeout); 中断电脑亮起色块的
            //       clearTimeout(ctimeout); 中断-五秒没操作就执行警告的 函数
            //       clearTimeout();中断屏幕字体闪烁的函数
    messageFlash('- -',2) //屏幕闪烁2次；
    .then(function(){
        gameStart(n,true);  // 闪烁 2 次后，执行gameStart函数
    });
}
//start 游戏开始后：
// -- 抖两下 √
// screen 显示 1 
// 某个色块变色。
// 如果两秒内没人点击对应色块 screen 显示 !!
// 或者如果点错色块。screen显示 !! 3下 游戏重新开始
function gameStart(message,boo){
   if(boo){ //如果boo为true 为arr加多一个元素
        addNumToArr();
   }
    userarr = [];   //用户点击色块的顺序 数组
    userindex = 0;  //第几次点击

    message = message<10?'0'+message : message; 
    screen.innerHTML = message; //显示屏 显示message 
    
    ms = 1000 - 25 * n; //电脑色块亮起的间隔时间
    lightColor(arr,ms)  // 电脑 色块 亮起
    .then(function(){  
        colorUpDown();  //亮起后执行colorUpDown函数。
    });
}


function colorUpDown(){
    //电脑色块亮完后，setTimeout函数挂起。
    // 为各自色块赋值上相应的鼠标事件

    //如果5秒内没有点击 相应的色块，清除几个色块的鼠标事件
    //再执行gameStart函数。
     ctimeout = setTimeout(function(){
        messageFlash('! !',2)
        .then(function(){
            delUpDown();
            if(isSirict){
                init();
                gameStart(n,true);
            }
            else{
                gameStart(n,false);
            }
        });
    },5000);

    colorBlocks.forEach(function(x,index){
        // 每个色块的鼠标按下函数 都会清除 ctimeout 函数 
        // 并且点亮该色块颜色；
        x.onmousedown = function(){
            var a = this;
            colorMoreLight(a);
            clearTimeout(ctimeout);
        }
        // 每个色块的鼠标按起函数 ，色块变暗
        // 为userarr添加该色块所处的位置
        // 如果userarr的元素顺序跟arr的不一样
        //     删除元素的鼠标事件。
        //      并且如果为严格模式的话
        //          初始化 从头开始
        //      如果不是严格模式。
        //         电脑继续演示这一关
        x.onmouseup = function(){
            var a = this;
            colorMoreDim(a);
            userarr.push(colorBlocks.indexOf(a));
            console.log(arr,userarr);
            if(!compare(userarr,arr)){
                delUpDown();
                // if(isSirict){
                //     messageFlash('! !',2)
                //     .then(function(){
                //         init();
                //         gameStart(n,true);
                //     })
                // }else{
                //     messageFlash('! !',2)
                //     .then(function(){
                //         gameStart(n,false);
                //     })
                // }
                messageFlash('! !',2)
                .then(function(){
                    if(isSirict){
                        init();
                        gameStart(n,true);
                    }
                    else{
                        gameStart(n,false);
                    }
                })
            }
            // -------------------
            // 如果一样，则清除色块鼠标事件 
            //          n+=1;如果n到第二十关，就赢
            //          开启下一关
            else{
                userindex++;
                if(userindex == arr.length){
                    console.log(arr.length,userindex);
                    delUpDown();
                    n += 1;
                    if(n == 21){
                        alert('you win');
                    }else{
                        gameStart(n,true);
                    }
                }
                
            }
            

        }
    });

}

function init(){
    n = 1;
    arr = [];
    clearTimeout(ltimeout);
    clearTimeout(ctimeout);
    clearTimeout(mtimeout);
}

function delUpDown(){
    colorBlocks.forEach(function(x){
        x.onmousedown = function(){};
        x.onmouseup = function(){};
    });
}

function compare(larr,barr){
    var boo = true;
    for(var i = 0;i<larr.length; i++){
        if(larr[i] !== barr[i]){
            boo = false;
            break;
        }
    }
    return boo;
}

function colorMoreLight(e){
    e.className += '-change';
}
function colorMoreDim(e){
    e.className = e.className.slice(0,-7);
}

function lightColor(arr,ms){
    var i = 0;
    // var stop;
    return new Promise(function(resolve,reject){
        ltimeout = setInterval(function(){
            if(i == arr.length-1){
                clearInterval(ltimeout);
                resolve();
            }
            changeColor(colorBlocks[arr[i]],ms/2);
            i++;
        },ms);
    });
}

function changeColor(ele,m){
        ele.className += '-change';
        setTimeout(function(){
            ele.className = ele.className.slice(0,-7);
        },m);
}

function startUp(e){
    mup(e);
}
function sirictDown(e){
    mdown(e);
}
function sirictUp(e){
    mup(e);
    //控制小圆点亮与不亮 ------------------
    isSirict = true;
    ydContorl = !ydContorl;
    if(ydContorl){
        yd.className = 'yd yd-on';
        isSirict = true;
    }else{
        yd.className = 'yd yd-off';
        isSirict = false;
    }
    // ----------------------------------- 
}

function mdown(e){
    e.style.boxShadow = 'none';
}
function mup(e){
    e.style.boxShadow = '2px 2px 1px black';
}
function addNumToArr(){
    var i = Math.floor(Math.random() * 100 % 4);
    arr.push(i);
}
function messageFlash(message,n){
    var num = 0;
    var boo = false;
    screen.innerHTML = message;
    return new Promise(function(resolve,reject){
         mtimeout = setInterval(function(){
            if(num === n*2+2){
                clearInterval(mtimeout);
                resolve();
            }
            if(!boo){ //如果是真，就亮
                screen.className = 'screen led-on';
                boo = !boo;
                num++;
            }else{
                screen.className = 'screen led-off';
                boo = !boo;
                num++;
            }
        },400);
    });
}
