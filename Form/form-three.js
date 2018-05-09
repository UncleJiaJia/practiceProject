
var city = ['北京','广州','杭州','深圳','上海'];
var schoolName = {
    '北京':['北京大学','清华大学','北京师范大学','北京政法大学'],
    '广州':['广州大学','广东金融学院','中山大学','华南理工大学'],
    '杭州':['浙江大学','浙江理工大学','杭州电子科技大学','中国美术学院'],
    '深圳':['深圳大学','南方科技大学','香港中文大学(深圳)','深圳职业技术学院'],
    '上海':['复旦大学','同济大学','上海交通大学','华东政法大学']
}

//一级联动
function radioInit(){
    var inschool = document.getElementById('inSchool');
    var notInSchool = document.getElementById('notInSchool');

    var intext = document.getElementById('intext');
    var outtext = document.getElementById('outtext');

    var wordPalce = document.getElementById('wordPlace');
    inschool.onfocus = function(){
        intext.style.display = 'block';
        outtext.style.display = 'none'; 
        init();
    }

    notInSchool.onfocus = function(){
        outtext.style.display = 'block';
        intext.style.display = 'none';
        wordPalce.value = '';
    }
}

// 初始化两个选框中的值
function init(){
    var area = document.getElementById('area');
    // area.innerHTML = '';
    var str = '';
    city.forEach(function(x){
        str += '<option>' + x + '</option>';
    });
    area.innerHTML = str;


    var school = document.getElementById('school');
    var sstr = '';
    schoolName['北京'].forEach(function(x){
        sstr += '<option>' + x +'</option>';
    });
    school.innerHTML = sstr;
}

//二级联动
function liandong(){
    var area = document.getElementById('area');
    var school = document.getElementById('school');

    area.addEventListener('change',function(e){
        
        var city = e.target.value;
        // console.log(e.target.value);
        var sstr = '';
        schoolName[city].forEach(function(x){
            sstr += '<option>' + x +'</option>';
        });
        school.innerHTML = sstr;
        });
}
window.onload = function(){
    init();
    radioInit();
    liandong();
}