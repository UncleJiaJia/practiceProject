window.onload = function(){
    addTag.init();
}

let inputArea = document.getElementById('inputArea');
let showArea = document.getElementById('showArea');

inputArea.addEventListener('input',function(e){
    let text = e.target.value;   //获取文本
    let strAfterPrase = markdownPrase(text); //文本解析，主要是解析块级元素
    let afterInlinePrase = inlineElePrase(strAfterPrase);//解析行内元素
    showArea.innerHTML = afterInlinePrase; //解析完成，将内容赋予showArea
    addListType('ul'); //为无序列表增加 ul 父级
    addListType('ol'); //为有序列表增加 ol 父级
    clearPele(showArea); // 清楚多余的没内容的 p 元素。前面解析的时候，code那里会出现一些多余的p元素。原因还没找
    console.log(showArea.innerHTML);
});

// 正则
let reg = {
    'h1'    : /^#{1}\s/,
    'h2'    : /^#{2}\s/,
    'h3'    : /^#{3}\s/,
    'h4'    : /^#{4}\s/,
    'h5'    : /^#{5}\s/,
    'h6'    : /^#{6}\s/,
    'quote' : />/,
    'hr'    : /\*{3}/,
    'ul'    : /\-\s/,
    'ol'    : /\d\.\s/,
    'img'   : /!\[.*\]\(.*\)/,
    // 'a'     : /\[.*\]\(.*\)/
}
let addTag = {
    'init':function(){    
        for(let i = 1;i <= 6;i++){
            let r = 'h'+ i;
            addTag[r] = function(wb,tag){
                let str = wb.replace(reg[tag],'');
                return `<${r}>${str}</${r}>`;
            }
        }
    },
    'p':     function(wb,tag){
        return `<p>${wb}</p>`;
    },
    'quote' :function(wb,tag){
        let str = wb.replace(reg[tag],'');
        return `<quote>${str}</quote>`;
    },
    'hr'    :function(wb,tag){
        return '<hr>';
    },
    'ul'    :function(wb,tag){
        let str = wb.replace(reg[tag],'');
        return `<li class='ul'>${str}</li>`;
    },
    'ol'    :function(wb,tag){
        let str = wb.replace(reg[tag],''); 
            return `<li class = 'ol'>${wb.substring(0,2)}${str}</li>`;
    },
    'img'   :function(wb,tag){
        let contentReg = /\[.*\]/;
        let anchorReg = /\(.*\)/;
        let content = wb.match(contentReg)[0].replace(/[\[\]]/g,'');
        let anchor = wb.match(anchorReg)[0].replace(/[\(\)]/g,'');
        return `<img src = '${anchor}' alt = 'content' >`;
    },
    // 'a'     :function(wb,tag){
    //     let contentReg = /\[.*\]/;
    //     let anchorReg = /\(.*\)/;
    //     let content = wb.match(contentReg)[0].replace(/[\[\]]/g,'');
    //     let anchor = wb.match(anchorReg)[0].replace(/[\(\)]/g,'');
    //     let linePrase = wb.replace(reg[tag],`<a href = '${anchor}'>${content}</a>`);
    //     return linePrase;
    // }
}

function markdownPrase(text){
    let lineText = text.split(/\n/);
    let showText = '';
    let lineTag = 'p';
    for(let line of lineText){
        if(line == '') {
            showText += '<br>';
            continue;
        }
        for(let tagName of Object.keys(reg)){
            if(reg[tagName].test(line)){
                lineTag = tagName;
                break;
            }
        }
        showText += addTag[lineTag](line,lineTag);
        lineTag = 'p';
    }
    return showText;
};

function inlineElePrase(text){
    let inlineReg = {
        'i'     :  /[\*]([^\*\s]+?)[\*](?!\*)/g,
        'strong': /[\*_]{2}([^\*_]+?)[\*_]{2}(?!\*)/g,
        'code'  : /```[^`]*```/g,
        'a'   : /\[[^\[]*\]\(.*\)/g
    }
    text = text.replace(inlineReg.i,function(match){
        console.log('i-match:'+match);
        match = match.replace(/\*/g,'');
        return `<i>${match}</i>`;
    });
    
    text = text.replace(inlineReg.strong,function(match){
        match = match.replace(/[\*_]/g,'');
        return `<strong>${match}</strong>`;
    });
    text = text.replace(inlineReg.code,function(match){
        match = match.replace(/`/g,'');
        return `<pre>${match}</pre>`;
    });
    text = text.replace(inlineReg.a,function(mt){
        console.log();
        let contentReg = /\[.*\]/;
        let anchorReg = /\(.*\)/;
        let content = mt.match(contentReg)[0].replace(/[\[\]]/g,'');
        let anchor = mt.match(anchorReg)[0].replace(/[\(\)]/g,'');
        let linePrase = mt.replace(inlineReg.a,`<a href = '${anchor}'>${content}</a>`);
        return linePrase;
    }); 
    return text;
}

 function addListType(listType){
    addUlOl(showArea,listType);
    function addUlOl(parentEle,LT){
        let currentEle = parentEle.firstElementChild;
        while(currentEle)
            if(currentEle.className !== LT){
                currentEle = currentEle.nextElementSibling;
            }else if(currentEle.className == LT && currentEle.previousElementSibling.tagName.toLowerCase() == LT){
                let pre = currentEle.previousElementSibling;
                let next = currentEle.nextElementSibling;
                pre.appendChild(currentEle);//当前元素被添加到其他元素中，便从当前位置消失？
                currentEle = next;

            }else if(currentEle.className == LT && currentEle.previousElementSibling.tagName.toLowerCase() !== LT){
                let next = currentEle.nextElementSibling;
                let ulele = document.createElement(LT);
                ulele.appendChild(currentEle);
                parentEle.insertBefore(ulele,next);
                currentEle = ulele.nextElementSibling;
            }
        }
 }

 function clearPele(ele){
    let currentEle = ele.firstElementChild;
    while(currentEle){
        if(currentEle.childElementCount !== 0){
            clearPele(currentEle);
        }
        if(currentEle.tagName == 'P' && currentEle.innerHTML == ''){
            let next = currentEle.nextElementSibling;
            ele.removeChild(currentEle);
            currentEle = next;
        }else{
            currentEle = currentEle.nextElementSibling;
        }
    }
}
/*
# h1
## h2
### h3
#### h4
##### h5
###### h6

***
分割线
***
无序列表
- list-ul
- list-ul
- list-ul
有序列表
1. 
2. 
4. 自定义序列，不强制排序
这个是普通文本
下面是一个代码块
```
alert("Hello world");
                   // 注释
```

接下来是一个链接
## [百度首页](www.baidu.com)
然后是图片
![计算机之父](https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1488565638123&di=2aaa93e9b000059d0a950e92c4a86d3c&imgtype=0&src=http%3A%2F%2Fimg.shouyoutan.com%2FUploads-s%2Fnews%2F2016-03-22%2F56f0c466a3074.JPG)

>引用：越努力，越美好！
行内元素：*斜体* **粗体** *斜体* **粗体**
*/ 