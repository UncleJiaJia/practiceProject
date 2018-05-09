
function Observer(obj){
    this.obj = obj;
    this.taskQueue = {};
    this.walk(this.obj)
}

Observer.prototype.walk = function(obj,path){
    let val;
    
    for(let key in obj){
        if(obj.hasOwnProperty(key)){
            val = obj[key];
            path = path ? path + '.' + key : key;
            if(typeof val === 'object'){
                // new Observer(val)
                this.walk(val,path)
            }
            this.convert(obj,key,val,path);

            path = path.split('.').slice(0,-1).join('.');
            // console.log(path);
        }
    }
}
Observer.prototype.convert = function(obj,key,val,path){
    let self = this;
    Object.defineProperty(obj,key,{
        get: function(){
            console.log(`你访问了${key}`);
            return val;
        },
        set: function(newVal){
            console.log(`你设置了${key},新的${key}为${newVal}`);
            if(val === newVal) return;
            val = newVal;
            if(typeof val === 'object')
                self.walk(val);
            self.emit(key,val,path);
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

let app = new Observer({
    user: {
        name: {
            firstname: 'jia',
            lastname: 'ying'
        },
        age: "24"
    },
    address: {
        city: "beijing"
    }
})
// app.$watch('age',function(age){console.log('我变成'+age+'岁')});
// app.obj.user.age = 15;