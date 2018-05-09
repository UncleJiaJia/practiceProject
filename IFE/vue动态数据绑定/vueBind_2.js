function Observer(opts){
    this.ele = document.querySelector('#app');
    this.obj = opts.data;
    this.taskQueue = {};
    this.ele_html = this.ele.innerHTML;
    
    this._fn_init();
    
}

Observer.prototype._fn_init = function(){
    let self = this;
    this.$watch('data',function(){
        self.render();
    });
    this.walk(this.obj)
    this.render();
}
/**
 * 
 */
Observer.prototype.walk = function(obj,path){
    let val;
    path = path ? path : 'data';
    for(let key in obj){
        if(obj.hasOwnProperty(key)){
            val = obj[key];
            path = path + '.' + key;
            if(typeof val === 'object'){
                this.walk(val,path)
            }
            this.convert(obj,key,val,path);

            path = path.split('.').slice(0,-1).join('.');
        }
    }
}
Observer.prototype.convert = function(obj,key,val,path){
    let self = this;
    Object.defineProperty(obj,key,{
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
            // self.render();
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
            data = data ? data[e] : self.obj[e]
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