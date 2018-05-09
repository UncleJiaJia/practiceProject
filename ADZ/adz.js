
const STATE_START = 1;
const STATE_STOP = 2;
const STATE_INITIAL = 0

/**
 * Dom Animation 构造函数
 * @param {Element} ele 
 */
function Animation(ele){
    //{
    //  taskFn：taskFn   
    //}
    //任务队列
    this.taskQueue = [];
    //任务队列指针
    this.index = 0;
    this.ele = ele;
    // 动画状态;
    this.state = STATE_INITIAL;
    this.animationFrameHandler = 0;
    //存放之前的键值对
    this.lastKVP = {};
    // 
    // 
}


/**
 * 设置动画函数
 * @param {Object} kvp key_value_pairs键值对
 * @param {Object} options 选项的键值对
 */
Animation.prototype.add = function(kvp, options){
    // kvp = { "width":100,'height':200} 这种格式
    // 加载选项值。duration easing 等
    this.initOptions(options);
    // 子任务队列。存放当前动画执行列表
    let task = [];
    for(let key in kvp){
        // easing函数参数 的 开始时间
        let t = 0;  
        // 开始的坐标点或者其他什么
        let begin = this._getStyle(this.ele,key,this.lastKVP[key]);
        // 将坐标点或宽长度存放进this.lastKVP
        this.lastKVP[key] = kvp[key];
        // 结束的坐标点或者宽长度
        let endPos = kvp[key] - begin;
        // 动画持续时间 
        let duration = Math.ceil(this.duration/1.3/16.7);
        let me = this;
        // 定义任务，并将任务push进taskQueue任务队列
        // taskFn有个next函数。当满足条件时启动。需在启动taskFn时传入next函数
        let taskFn = function(next){ 
            if(t<duration){
                t++;
                if(key === 'opacity'){
                    me.ele.style[key] = me.easing(t,begin,endPos,duration);
                }else{
                    me.ele.style[key] = me.easing(t,begin,endPos,duration) + 'px';
                }
            }else if(t>=duration){
                t = 0;
                next();
            }
        }
        task.push(taskFn);
    }
    this.taskQueue.push(task);
    // 返回this，方便链式调用
    return this;    
};

/**
 * 默认淡入函数，已定义
 * 
 */
Animation.prototype.fadeIn = function(){
    this.add({
        'opacity':1
    }).start();
}

/**
 * 默认淡出函数，已定义
 */
Animation.prototype.fadeOut = function(){
    this.add({
        'opacity':0
    }).start();
}


/**
 * 开始动画函数，执行任务队列
 */
Animation.prototype.start = function(){
    // 如果动画已经开始，则放回
    if(this.state === STATE_START)
        return;
    if(this.taskQueue.length === 0){
        return;
    }
    // 设置动画状态为开始
    this.state = STATE_START;
    // 重置指针
    this.index = 0;
    // 执行任务
    this._runTask();
   
}

/**
 * 暂停动画函数
 */
Animation.prototype.stop = function(){
    // 取消定时器
    cancelAnimationFrame(this.animationFrameHandler);
    // 设置动画状态
    this.state = STATE_STOP;
    // 释放资源
    this._dispose();

}

/**
 * 重复动画函数。
 * @param {Number} time 重复次数
 */
Animation.prototype.repeat = function(time){
    if(time){
        this._repeatTime = time - 1;
    }else{
        this._repeat = true;
    }
}
/**
 * 初始化选项列表
 * @param {Json} 选项json对象
 */
Animation.prototype.initOptions = function(options){
    // 如果列表存在则options = options，否则为空。下同
    options = options || {};
    this.duration = options['duration'] || 1000;
    this.easing = tween[options['easing']] || tween.linear;
}

/**
 * 获取元素对应的CSS属性的属性值
 * @param {Element} ele 元素节点
 * @param {String} cssAtrr css属性值
 */
Animation.prototype._getStyle = function(ele,cssAtrr,lastCssAtrr){
    // 如果this.latsKVP里有该css属性值，则放回该值当成起始位置|长宽
    if(lastCssAtrr){
         return lastCssAtrr;
    }
    // 否则获取该css属性的属性值
    return parseFloat(document.defaultView.getComputedStyle(ele)[cssAtrr]);
}



/**
 * 执行动画函数
 * @private
 */
Animation.prototype._runTask = function(){
    // 引用this
    let me = this;
    // 如果 index === taskQueue.length; 说明任务队列执行完毕
    if(me.taskQueue.length === me.index){
        // 单次队列执行完毕后，查看是否有设置repeat()函数。
        this._isrepeat();
        return;
    }

    // 取出当前任务 格式为数组：task = [function,function,...];
    let task = this.taskQueue[me.index];
    // 设置标志
    task.boo = 0;
    // 定义next函数.每执行完task里的function触发next时，task.boo+1;
    // 当task.boo 等于task长度时. task里的function都执行完毕，开启下一个任务
    let next = function(){
        task.boo ++;

    }
    function run(){
        // 没循环一次，就执行task里的function一次
        for(let i = 0;i < task.length; i++){
            task[i](next);
        }
        // 设置定时器
        me.animationFrameHandler = requestAnimationFrame(run);
        // 当前任务执行完毕，取消定时器，index++,开启下一个任务
        if(task.boo === task.length){
            cancelAnimationFrame(me.animationFrameHandler);
            me.index++;
            me._runTask();
        }
    }
    run();
}

/**
 * 检查是否存在repeat()函数，存在则执行。不存在则
 */
Animation.prototype._isrepeat = function(){
    // 查看repeat类型。看看是重复次数还是无限次。
    let repeat = this._repeat || this._repeatTime;
    let repeatType = typeof repeat;
    // 如果不存在repeat，释放资源
    if(!repeat){
        this._dispose();
        return;
    }
    // 如果repeat类型为有限次数。
    if(repeatType === 'number'){
        // 如果次数为0，释放资源，否则循环一次任务队列，并且次数-1；
        if(this._repeatTime === 0){
             this._dispose();
        }else{
            this._repeatTime-- ;
            this.index = 0;
            this._runTask(); 
        }
        // 如果repeat类型为boolean，则无限次数。
    }else if(repeatType === 'boolean'){
        this.index = 0;
        this._runTask();
    }
}

Animation.prototype._dispose = function(){
    delete this._repeat;
    delete this._repeatTime;
    this.state = STATE_INITIAL;
    this.taskQueue = [];
    this.lastKVP = {};
}

// 缓动动画算法
var tween = {
    linear: function( t, b, c, d ){ 
        return c*t/d + b; 
    }, 
    easeIn: function( t, b, c, d ){ 
        return c * ( t /= d ) * t + b; 
    }, 
    strongEaseIn: function(t, b, c, d){ 
        return c * ( t /= d ) * t * t * t * t + b; 
    }, 
    strongEaseOut: function(t, b, c, d){ 
        return c * ( ( t = t / d - 1) * t * t * t * t + 1 ) + b; 
    }, 
    sineaseIn: function( t, b, c, d ){ 
        return c * ( t /= d) * t * t + b; 
    }, 
    sineaseOut: function(t,b,c,d){ 
        return c * ( ( t = t / d - 1) * t * t + 1 ) + b; 
    },
    BoundeaseOut: function(t, b, c, d) {
            if ((t /= d) < (1 / 2.75)) {
                return c * (7.5625 * t * t) + b;
            } else if (t < (2 / 2.75)) {
                return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
            } else if (t < (2.5 / 2.75)) {
                return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
            } else {
                return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
            }
    }

}; 