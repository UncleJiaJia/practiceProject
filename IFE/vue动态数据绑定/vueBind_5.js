function Observer(opts){
    this.ele = document.querySelector('#app');
    this.data = opts.data;
    this.taskQueue = {};
    this.ele_html = this.ele.innerHTML;
    
    this.walk(this.data)
    this.render();
    
}
/**
 * 
 */
Observer.prototype.walk = function(data,path){
    let val;
    
    for(let key in data){
        if(data.hasOwnProperty(key)){
            val = data[key];
            path = path ? path + '.' + key : key;
            if(typeof val === 'object'){
                // new Observer(val)
                this.walk(val,path)
            }
            this.convert(data,key,val,path);

            path = path.split('.').slice(0,-1).join('.');
            // console.log(path);
        }
    }
}
Observer.prototype.convert = function(data,key,val,path){
    let self = this;
    Object.defineProperty(data,key,{
        get: function(){
            // console.log(`你访问了${key}`);
            return val;
        },
        set: function(newVal){
            // console.log(`你设置了${key},新的${key}为${newVal}`);
            if(val === newVal) return;
            val = newVal;
            if(typeof val === 'object') self.walk(val);
            self.emit(key,val,path);
            self.render();
        }
    })
}

Observer.prototype.$watch = function(key,fn){
    // this.taskQueue[key] = fn;
    if(!this.taskQueue[key]){
        this.taskQueue[key] = [];
    }
    this.taskQueue[key].push(fn);
}

Observer.prototype.emit = function(key,...argument){
    let path = Array.prototype.pop.call(argument);
    //剩余的argument为参数
    path = path.split('.').reverse();
    for(let en of path){
        if(this.taskQueue[en]){
            let taskarr =  this.taskQueue[en];
            for(let fn of taskarr){
                fn(argument);
            }
        }
    }
}

Observer.prototype.render = function(){
    let self = this;
    let html = this.ele_html;
    let reg = /[\{]{2}[^\{]*[\}]{2}/g;
    html = html.replace(reg,function(match){
        let data_path = match.replace(/[\{\}]/g,'');
        let data = getDate(data_path);
        return data;
    });
    this.ele.innerHTML = html;

    function getDate(path){
        let arr = path.split('.');
        let data = '';
        for(let e of arr){
            data = data ? data[e] : self.data[e]
        }
        return data;
    }
}

let app = new Observer({
    ele:'#app',
    data:{
        user:{
            name:'jiaying',
            age:23
        }
    }
})