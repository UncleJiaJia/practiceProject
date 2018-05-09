window.onload = function(){
    var bg = document.getElementById('bg');
    var sX = document.getElementById('selectX');
    var sO = document.getElementById('selectO');
    sX.onclick = function(){
        bg.style.display = 'none';
        init(" x",' o');
    }
    sO.onclick = function(){
        bg.style.display = 'none';
        init(' o',' x');
    }
}
function init(u,c){
    var token = []; //存放九个格子的元素
        // 0 1 2
        // 3 4 5
        // 6 7 8
    var model = {  //格子填了的就为 true
        0 : false,
        1 : false,
        2 : false,
        3 : false,
        4 : false,
        5 : false,
        6 : false,
        7 : false,
        8 : false
    }
    var weight = { //各个格子的权重。电脑先下重高的
        0 : 3,
        1 : 2,
        2 : 3,
        3 : 2,
        4 : 2,
        5 : 2,
        6 : 3,
        7 : 2,
        8 : 3
    }
    var line; //线 满三个格子一条线
    var user = u;
    var computer = c;
    var userIndex = []; //记录玩家下的位置
    var computerIndex = [];
    var lSquare = document.getElementsByClassName('littleSquare');

    //将九个格子存放在token里
    for(var i = 0;i<lSquare.length; i++){
        token.push(lSquare[i]);
    }

    //一 电脑先下子 
    function firstPlay(){
        var num = Math.floor((Math.random() * 100) % 9);
        while(num%2 != 0){
            num = Math.floor((Math.random() * 100) % 9);
        }
        model[num] = true;
        token[num].className += computer;
        computerIndex.push(num);
    }
    // 玩家点击下子， 下子后电脑下子
    squareWrap.addEventListener('click',function(e){
        var ele = e.target;
        if(ele.className == 'littleSquare' && ele){
            ele.className += user;  
            model[ele.dataset.id] = true;//
            userIndex.push(ele.dataset.id/1);//把玩家下的子的位置推进去
            line = isBeLine(userIndex);
           
            if(typeof(line) == 'number'){
                var l = 'line-' + line;
                var c = document.getElementById(l);
                c.style.display = 'block';
                gameOver();
            }else{
                computerPlay();
            }
        }    
    });

    //电脑下子考虑几种情况
    // 一:是否存在两个子连一起 再下一个成一条线的情况
    // 二:对手是否存在上面那种情况
    // 三:是否存在权值为三的子位;
    // 四：不满足以上情况的，随便找个权值为2的下
    function computerPlay(){
        //情况一
        var ci = checkArr(computerIndex);
        var ui = checkArr(userIndex);
        var wi = haveWeight(3);
        var li = haveWeight(2);
        var n;
        //情况一
        if(typeof(ci) == 'number'){
            n = ci;
        }

        // 情况二
        else if(typeof(ui) == 'number'){
            n = ui;
        }
        
        //情况三
        else if(typeof(wi) == 'number'){
            n = wi;
        }

        //情况四
        else if(typeof(li) == 'number'){
            n = li;
        }

        token[n].className += computer;
        model[n] = true;
        computerIndex.push(n);
        line = isBeLine(computerIndex);
        var at = allTrue();//是否所有格子都走满了
        if(typeof(line) == 'number'){
                var l = 'line-' + line;
                var c = document.getElementById(l);
                c.style.display = 'block';
                gameOver();
        }
        if(at){ //如果格子都走满了，gameover
            gameOver();
        }
    }

    function checkArr(arr){
        //传入 用户/电脑 的下子的位置数组，判断是否存在已有两个子，再下一个成一线的情况
        //有就返回缺的那一个子的位置。没有就找下一个，实在没有返回false；
        var lineArr = [
            {line:[0,1,2],num:0},{line:[3,4,5],num:0},{line:[6,7,8],num:0},
            {line:[0,3,6],num:0},{line:[1,4,7],num:0},{line:[2,5,8],num:0},
            {line:[0,4,8],num:0},{line:[2,4,6],num:0}
        ];
        var tarr = [];
        var backIndex = false;
        for(var i = 0;i<lineArr.length;i++){
            lineArr.forEach(function(x){
                if(x.line.indexOf(arr[i]) >= 0){
                    x.num += 1;
                }
            });
        }
        lineArr.forEach(function(x){
            if(x.num == 2){
                tarr.push(x.line);
            }
        });
        tarr.forEach(function(x){
            x.forEach(function(y){
                if(!model[y]){
                    backIndex = y;
                }
                });
        });
        return backIndex;
    }

    function haveWeight(w){ //是否存在权重为 w 并且为下子的位置
        var num = [];
        for(x in weight){
            if(weight[x] == w && model[x] == false){
                
                num.push(x/1);
            }
        }
        var n = Math.floor((Math.random()*100) % num.length);
        return num[n];
    }

    function isBeLine(arr){
        // arr = [0,3,6,8];
        var lineNum = false;
        var lineArr = [
            {line:[0,1,2],num:0},{line:[3,4,5],num:0},{line:[6,7,8],num:0},
            {line:[0,3,6],num:0},{line:[1,4,7],num:0},{line:[2,5,8],num:0},
            {line:[0,4,8],num:0},{line:[2,4,6],num:0}
        ];
        for(var i = 0;i<lineArr.length;i++){
            lineArr.forEach(function(x){
                if(x.line.indexOf(arr[i]) >= 0){
                    x.num += 1;
                }
            });
        }
        lineArr.forEach(function(x,index){
            if(x.num == 3){
                lineNum = index;
            }
        });
        return lineNum;
    }

    function gameOver(){
        setTimeout(function(){
            alert('gameOver');
            clear();
        },2000);   
    }
    function clear(){
        for(var x in model){
            model[x] = false;
        }
        for(var i = 0;i<lSquare.length;i++){
            lSquare[i].className = 'littleSquare';
        }
        if(typeof(line) == 'number'){
            var l = 'line-' + line;
            document.getElementById(l).style.display = 'none';
            line = false;
        }
        userIndex = [];
        computerIndex = [];
        firstPlay();
    }
    function allTrue(){
        var boo = true;
        for(var i in model){
            if(model[i] == false){
                boo = false;
            }
        }    
        return boo;
    }
   
    firstPlay();
}