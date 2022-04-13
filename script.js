let cursor=0;
let question=-1;
let currentGuess = [[],[],[],[],[],[],[],[],[]];
let numbox = 0;
let completed = [false,false,false,false,false,false,false,false,false];
let team = 0;
var loading=false;


document.addEventListener("keyup", (e) => {
    if(question>-1 && !loading){
            let pressedKey = String(e.key);
        if (pressedKey === "Backspace" && cursor !== 0) {
            deleteLetter();
            return;
        }
    
        if (pressedKey === "Enter") {
            checkGuess(question);
            return;
        }
    
        let found = pressedKey.match(/[a-z]/i);
        if (!found || found.input.length > 1) {
            return;
        } else {
            insertLetter(pressedKey);
        }
    }
});

function setCursor(curs,ne){
    if(question>-1){
        if(!completed[question]){
            let qn = document.getElementsByClassName("question")[question];
            let row = qn.children[1];
            
                if(curs!=-1 && curs!=numbox){
                    row.children[curs].style.backgroundColor = 'transparent';
                }
                if(ne!=-1 && ne !=numbox){
                    row.children[ne].style.backgroundColor = 'ececec';
                }
    
        }
    }
    
}

function insertLetter (pressedKey) {
    if(!completed[question]){
        if (cursor === numbox) {
            return;
        }
        pressedKey = pressedKey.toUpperCase();
        let qn = document.getElementsByClassName("question")[question];
        let row = qn.children[1];
        let box = row.children[cursor];
        box.textContent = pressedKey;
        box.classList.add("filled-box");
        currentGuess[question].push(pressedKey);

        setCursor(cursor,cursor+1);
        cursor += 1;
    }
}

function deleteLetter () {
    if(!completed[question]){
        let qn = document.getElementsByClassName("question")[question];
        let row = qn.children[1];
        let box = row.children[cursor - 1];
        box.textContent = "";
        box.classList.remove("filled-box");
        currentGuess[question].pop();
        setCursor(cursor,cursor-1);
        cursor -= 1;
    }
}


function checkGuess(qnum) {
    if(!loading){
        question=qnum;
        if(!completed[question] && cursor>0){
            let qn = document.getElementsByClassName("question")[question]; 
    
            let row = qn.children[1];
            
            let guessString = '';
            for (const val of currentGuess[question]) {
                guessString += val;
            }
            
            var load = document.createElement("div");
            load.setAttribute('class', 'loader');
            load.setAttribute('id',"loading");
            
            qn.append(load);
            
            loading=true;
            var rigg = post("check", team, question, guessString);
            rigg.fail(function() {
                
              if (rigg.responseText === "Correct") {
                  qn.style.backgroundColor = '00c851';
                completed[question]=true;
                question=-1;
                
    
            } else if(rigg.responseText ==="Wrong"){
                for (let i = 0; i < numbox; i++) {
                    let box = row.children[i];
                    
                    let j=50;
                    let timer = setInterval( function(){
                        box.style.backgroundColor = 'hsl(0,100%,'+String(j)+'%)';
                        j=j+1;
                        if(j>100){clearInterval(timer);}
                    }, 20);
                }
            }else{alert("Error. Please Contact EXCO.");} 
            loading=false;
            function removeLoader(){
                $( '#loading' ).fadeOut(200, function() {
                  $( '#loading' ).remove();
              });  
            }
            removeLoader();
            });
            
        }
    }
}

function setQuestion(num,bx){
    if(!loading){
        setCursor(cursor,-1);
        question=num;
        numbox=bx;
        let qn = document.getElementsByClassName("question")[question];
        let row = qn.children[1];
        
        for(let i = 0;i<numbox;i++){
            if(!row.children[i].classList.contains("filled-box")){
                
                cursor=i;
                setCursor(-1,cursor);
                break;
            }
        }
    }
}

function getTeam(tem){
    team=tem;
}

function post(meth,team,qn,ans){
    let url = "https://script.google.com/macros/s/AKfycbyde3cX_99LEb1jdRsg-AL_PB8dOOoD_oynX8hqlaXWk_4WHfRVzkWEWiIZ_-s4ykSk/exec?callback=loadData";
            
    var req = jQuery.ajax({
        crossDomain: true,
        url: url,
        method: "POST",
        dataType: "json",
        data: '{"meth": "'+meth+'", "ans": "'+ans+'", "team": "'+team+'", "qn": "'+qn+'"}'
    });
    return req;
    
}

function init(){
    //create big loader
    
    
    var bload = document.createElement("div");
    bload.setAttribute('class', 'loader');
    bload.setAttribute('id',"bloading");
    
    document.getElementById("buff").append(bload);
    
    var req = post("get", team, 0, 0);
    console.log(req);
        req.fail(function() {
            //update thing here
            console.log(req.responseText);
            
            if(req.responseText != ""){
                    var arr = req.responseText.split("");
                    for (const i in arr){
                        
                        document.getElementsByClassName("question")[Number(arr[i])].style.backgroundColor = '00c851';
                    }
            }
            function removeBloader(){
            $( '#bloading' ).fadeOut(200, function() {
              $( '#bloading' ).remove();
              });  
            }
            removeBloader();
        });
        req.done(function() {
            //update thing here
            console.log(req.responseText);
            
            if(req.responseText != ""){
                    var arr = req.responseText.split("");
                    for (const i in arr){
                        
                        document.getElementsByClassName("question")[Number(arr[i])].style.backgroundColor = '00c851';
                    }
            }
            function removeBloader(){
            $( '#bloading' ).fadeOut(200, function() {
              $( '#bloading' ).remove();
              });  
            }
            removeBloader();
        });
    
}