
/**
 * 
 * @param {Object} context 需要绑定的对象
 */
Function.prototype.call2 = function(context) {
     var context = context || global;
     context.fn = this;

     var args = [];
     for(let i = 1, len = arguments.length; i < len; i++) {
         args.push('arguments[' + i + ']');
     }
     var result = eval('context.fn(' + args + ')');
    //  context.fn();
     delete context.fn;
     return result;
}

Function.prototype.apply2 = function(context, arr) {
    var context = Object(context) || global;
    context.fn = this;

    var result;
    if(!arr) {
        retult = context.fn();
    }else {
        var args = [];
        for(var i = 0, len = arr.length; i < len; i++) {
            args.push('arr[' + i + ']');
        }
        result = eval('context.fn(' + args + ')')
    }

    delete context.fn;
    return result;
}
// var foo = {
//     value: 1
// }

// function bar() {
//     console.log(this.value);
// }

// bar.call2(foo);
let a = 1;
function bar() {
    console.log(this.a);
}
// bar.call(null);