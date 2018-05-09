
(function(){
var restValue = document.getElementById('restTime');
var restMinus = document.getElementById('restMinus');
var restPlus = document.getElementById('restPlus');

restMinus.addEventListener('click',function(){
    if(restValue.innerHTML/1 > 1){
        restValue.innerHTML = restValue.innerHTML/1 - 1;
    }
});
restPlus.addEventListener('click',function(){
    if(restValue.innerHTML/1 < 30){
        restValue.innerHTML = restValue.innerHTML/1 + 1;
    }
});

var seValue = document.getElementById('seTime');
var seMinus = document.getElementById('seMinus');
var sePlus = document.getElementById('sePlus');
var clockTime = document.getElementById('clockTime');//时钟里的时间
var circle = document.getElementById('circle');

var minute = seValue.innerHTML/1;
var allsecond = minute * 60;

 function allsecondToHMS(alls){
    var h = Math.floor(alls / 3600);
    var m = Math.floor(alls % 3600 / 60);
    var s = Math.floor(alls % 3600 % 60);
    var time = h > 0? h + ' : ' + (m<10?'0':'')+ m + ' : ' +(s<10?'0':' ')+s:
                m +" : "+(s<10?'0':' ')+s;
    return time;
 }

seMinus.addEventListener('click',function(){
    if(minute > 1){
        minute --;
        allsecond = minute * 60;
        seValue.innerHTML = minute;
        clockTime.innerHTML = minute;
    }
});
sePlus.addEventListener('click',function(){
        minute ++;
        allsecond = minute * 60;
        seValue.innerHTML = minute;
        clockTime.innerHTML = minute;
});

var buttons = document.getElementsByTagName('button');
var clock = document.getElementById('clock');
var boo = false;
var stop;
clock.addEventListener('click',function(){
    boo = !boo;
    if(boo){
        btnFalse();
        clockTime.innerHTML = allsecondToHMS(allsecond);
        stop = setInterval(function(){
        
            if(allsecond < 1){
                setAnotherLength();
            }else{
                allsecond --;
                clockTime.innerHTML = allsecondToHMS(allsecond);
                var height = Math.floor(((minute*60 - allsecond) / (minute*60)) * 100) + '%';
                circle.style.height =  height;
            }
        },1000);
    }

    else{
        btnTrue();
        clearInterval(stop);
    }
});
function setAnotherLength(){
    // console.log(circle.style.background);
    if(circle.style.backgroundColor == 'green'){
        // allsecond = restValue.innerHTML/1 * 60;
        minute = restValue.innerHTML/1;
        allsecond = minute * 60;
        var height = Math.floor(((minute*60 - allsecond) / (minute*60)) * 100) + '%';
        circle.style.height = height;
        circle.style.background = 'red';
        tpart.innerHTML = 'REST';    
    }
    else if(circle.style.backgroundColor == 'red'){
         minute = seValue.innerHTML/1;
         allsecond = minute * 60;
         var height = Math.floor(((minute*60 - allsecond) / (minute*60)) * 100) + '%';
         circle.style.height = height;
         circle.style.background = 'green';
         tpart.innerHTML = 'SESSION';
    }
}
function btnFalse(){
    for(var i = 0;i<buttons.length;i++){
        buttons[i].setAttribute('disabled',true);
    }
}
function btnTrue(){
    for(var i = 0;i<buttons.length;i++){
        buttons[i].removeAttribute('disabled');
    }
}
})();