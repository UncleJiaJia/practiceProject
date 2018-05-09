// 点击每个框，即焦点在那个字段上时，出线那个字段的提示
// 焦点离开时，tip消失

var inputs = document.getElementsByTagName('input');

var userpsw = '';

var tips = {
    'userName':
        ['名称可用','名称不为空/名称长度不得超过16个字符'],
    'psw':
        ['密码可用','密码不为空/密码长度不得超过16个字符'],
    'rpsw':
        ['密码输入一致','密码输入不一致'],
    'mail':
        ['邮箱格式正确','邮箱格式不正确'],
    'phoneNum':
        ['手机号码格式正确','手机号码格式错误']
}


for(var i = 0;i<inputs.length;i++){
    inputs[i].onfocus = function(){
        this.nextElementSibling.style.display = 'block';
    }
    inputs[i].onblur = function(){
        this.nextElementSibling.style.display = 'none';
    }

    inputs[i].onchange = function(){
        var value = this.value;
        var boo = checkValue(this.name,value);//传入input的值和name。检查value是否符合该input的规则；
        console.log('boo' + boo);
        changeElement(this,boo);
        // console.log(this.name);
    }
}

function checkValue(inputName,inputValue){
    // console.log(inputName);
    switch(inputName){
        case 'userName':
            return judgeName(inputValue);
            break;
        case 'psw':
            return judgePsw(inputValue);
            break;
        case 'rpsw':
            return judgeRpsw(inputValue);
            break;
        case 'mail':
            return judgeMail(inputValue);
            break;
        case 'phoneNum':
            return judgePhoneNum(inputValue);
    }
}

function judgeName(value){
    var narr = value.split('');
    var sum = 0;
    narr.forEach(function(x){
        if(x.charCodeAt() > 127 || x.charCodeAt() == 94 ){
            sum += 2;
        }
        else{
            sum ++;
        }
    });
    if(sum>=4 && sum <= 16){
        return true;
    }
    return false;
}
function judgePsw(value){
    var len = value.length;
    if(len <= 16){
        userpsw = value;
        return true;
    }
    return false;
}

function judgeRpsw(value){
    if(value == userpsw){
        return true;
    }
    return false;
}

function judgeMail(value){
    var reg = /([a-zA-Z0-9-_])+@([a-zA-Z0-9-_])+.([a-zA-Z0-9-_])/;
    return reg.test(value);
}

function judgePhoneNum(value){
    var reg = /1[3587][0-9]{9}/;
    return reg.test(value);
}
function changeElement(ele,tnf){
    if(tnf){ //如果格式正确。就变为绿色
        ele.style.border = '2px solid green';
        ele.nextElementSibling.innerHTML = tips[ele.name][0];
        ele.nextElementSibling.style.display = 'block';
    }
    else{
        ele.style.border = '2px solid red';
        ele.nextElementSibling.innerHTML = tips[ele.name][1];
        ele.nextElementSibling.style.display = 'block';
    }
    ele.onblur = null;
}