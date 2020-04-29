
normal: 
    ExpressionStatement
    EmptyStatement
    DebuggerStatement
    
return break throw continue    
    
    
var x=0;
function foo () {
    var o = {x:1};
    x=2;
    with(o) {
        var x = 3;
    }
    console.log(x);
}

foo();
console.log(x)    