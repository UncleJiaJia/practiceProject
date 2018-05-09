Function.prototype.bind2 = function(context) {

    if (typeof this !== "function") {
        throw new Error("Function.prototype.bind - what is trying to be bound is not callable");
      }

    let self = this; // bar.bind(foo)  self:bar; context：foo

    //获取bind函数从第二个参数起到最后一个参数
    var args = Array.prototype.slice.call(arguments, 1);

    var fNOP = function() {}
    var fBound = function() {
        //这个arguments是指bind返回的函数 传入的参数
        var bindArgs = Array.prototype.slice.call(arguments);
        // 在new一个新对象时，会将构造函数中的this指向新创建的对象（实例）
        //此处的this指的是bar.bind()返回的函数的实例;
        // let barBindFoo = bar.bind(foo);
        // let obj = new barBindFoo();  
        // 如例子中的obj实例
        return self.apply(this instanceof fBound ? this : context,args.concat(bindArgs));
    }
    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();
    return fBound;
}

Function.prototype.bind3 = function(context) {
    let self = this;

    let args = Array.prototype.slice.call(arguments);
    let Bound = function() {
        let bindArgs = Array.prototype.slice.call(arguments);
        return self.apply(this instanceof Bound ? this : context, args.concat(bindArgs));
    }
    Bound.prototype = this.prototype;
    return Bound;
}