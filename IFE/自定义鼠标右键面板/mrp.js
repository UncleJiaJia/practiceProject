let maEle = document.getElementById('mA');
let f = document.getElementById('father');
let rm = document.getElementById('rm');
maEle.addEventListener('contextmenu',function(e){
    // 这个E，是个事件对象，包含着所有与事件有关的信息。如果是鼠标事件，则包含鼠标位置的信息等
    // 如果是键盘事件，则包含与按下的键的信息
    // 而e.target则指的是事件的目标（某个元素） 
    rm.style.display = 'block'; //必须先将元素显现，不然rmWidth和rmHeight读取不出元素的高度和宽度
    let thisWidth = e.target.clientWidth; // 鼠标所在的元素的宽度
    let thisHeight = e.target.clientHeight; // 鼠标所在的元素的高度
    let rmWidth = rm.clientWidth; // 菜单列表的宽度
    let rmHeight = rm.clientHeight; // 菜单列表的高度度
    let offsetX = e.clientX; //鼠标当前所在的 X 轴位置
    let offsetY = e.clientY; //鼠标当前所在的 Y 轴位置
    if(offsetX + rmWidth > thisWidth){ //如果鼠标位置 + 菜单列表宽度 > 元素的宽度
        offsetX = offsetX - rmWidth;
    }
    if(offsetY + rmHeight > thisHeight){ //如果鼠标位置 + 菜单列表高度 > 元素的高度
        offsetY = offsetY - rmHeight;
    }
    e.preventDefault();
    // e.stopPropagation();
    rm.style.left = offsetX + 'px';
    rm.style.top = offsetY + 'px';
});
document.getElementsByTagName('body')[0].addEventListener('click',function(){
   rm.style.display = 'none'; 
});
rm.addEventListener('click',function(e){
    if(e.target.className = 'sonmune'){
        alert(e.target.innerHTML);
    }
});
