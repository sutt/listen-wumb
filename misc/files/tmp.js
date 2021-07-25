
function foo() {
    try {
        console.log("Start TRY")
        require("aksjdfhkajsdfkhsakdj")
        console.log("end TRY")
    } catch {
        console.log("start catch")
        return
        console.log("end catch")
    }
    console.log("end func")
    
}

foo()