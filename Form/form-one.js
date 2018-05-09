//点击输入框输入名字
// 点击按钮验证 名字
// 验证正确 错误
var nam = document.getElementById('userName');
var checkBtn = document.getElementById('checkName');
var tip = document.getElementById('dis');


checkBtn.addEventListener('click',function(){
    var n = nam.value;
    var boo = checkName(n);
    changeInput(boo);
});

function checkName(x){
    if(x == ''){
        return '';
    }
    var narr = [];
    narr = x.split('');
    var sum = 0;
    narr.forEach(function(s){
        if(s.charCodeAt() > 127 || s.charCodeAt() == 94){
            sum += 2;
        }else{
            sum ++;
        }
    });
    if(sum <= 16 && sum >= 4){
        return "ok";
    }else if(sum > 16){
        return 'no';
    }
}
function changeInput(n){
    var ti = '';
    var color = '';
    var bc = '';
    switch(n){
        case '':
            ti = "名称长度不为0";
            color = 'red';
            bc = 'red';
            break;
        case 'ok':
            ti = '名称格式正确';
            color = 'green';
            bc = 'green';
            break;
        case 'no':
            ti = '名称长度应不大于16个字符';
            color = 'red';
            bc = 'red';
            break;
    }
    nam.style.border = '2px solid ' + bc;
    tip.innerHTML = ti;
    tip.style.color = color;
}