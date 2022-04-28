var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
document.getElementsByTagName('head')[0].appendChild(script);
var qnlink;
function str_pad_left(string, pad, length) {
    return (new Array(length + 1).join(pad) + string).slice(-length);
}

function instructTimer() {
    var hours = Math.floor(time / 3600);
    var mins = Math.floor(time % 3600 / 60);
    var secs = Math.floor(time % 60);
    document.getElementById("startBtn").innerHTML = hours + ':' + str_pad_left(mins, '0', 2) + ':' + str_pad_left(secs, '0', 2);
    if (time < 1) {
        document.getElementById("startBtn").innerHTML = "Start Quiz";
        document.getElementById("startBtn").disabled = false;
        //send start time to server
    } else {
        time -= 1;
        setTimeout(instructTimer, 1000);
    }
}

function mainTimer() {
    var tsec = 90 * 60;
    var hours = Math.floor(time / 3600);
    var mins = Math.floor(time % 3600 / 60);
    var secs = Math.floor(time % 60);
    document.getElementById("clock").innerHTML = hours + ':' + str_pad_left(mins, '0', 2) + ':' + str_pad_left(secs, '0', 2);
    document.getElementById("progress").style.width = time * 150 / tsec + "px";
    if (time < 1) {
        //send start time to server
    } else {
        time -= 1;
        setTimeout(mainTimer, 1000);
    }
}

async function post(meth, id, pword, ans, qn, timer) {
    document.getElementById("load").classList.remove("hidden");
    document.getElementById("load").classList.add("visible");
    let key = "AKfycbyc2f1F20ZfIQ3Uzszl2uyOD5wFI1ai7Ac1Gjox89oky9fA-p8pv0oZ_m-9FQgSChTapA"
    let url = "https://script.google.com/macros/s/" + key + "/exec";
    var req = await jQuery.ajax({
        crossDomain: true,
        url: url,
        method: "POST",
        data: '{"meth": "' + meth + '", "ans": "' + ans + '", "id": "' + id + '", "qn": "' + qn + '", "timer": "' + timer + '", "pword": "' + pword + '"}',
    });
    document.getElementById("load").classList.remove("visible");
    document.getElementById("load").classList.add("hidden");
    return req;
}
async function login() {
    usern = document.getElementById("username").value;
    pword = document.getElementById("password").value;
    var resp = await post(meth = "login", id = usern, pword = pword);
    if (resp == "Login Success") {
        document.cookie = "username=" + usern + ";max-age=7200;path=/";
        document.cookie = "password=" + pword + ";max-age=7200;path=/";
        location.href = 'instructions'
    } else if (resp == "Incorrect Password") {
        document.getElementById("incorrect").innerHTML = "Incorrect Password";
    } else if (resp == "Incorrect Username") {
        document.getElementById("incorrect").innerHTML = "Incorrect Username";
    } else if(resp == "Time Up"){
        location.href = "feedback";
    } else {
        console.log(resp);
        alert("Response error");
    }
}
//TODO - seems useless
/*async function checkLogin() {
    var resp = await post(meth = "login", getCookie("username"), getCookie("password"));
    if (resp == "Login Success") {
    } else if (resp == "Incorrect Password") {
        location.href = "index";
    } else if (resp == "Incorrect Username") {
        location.href = "index";
    } else if(resp == "Time Up"){
        location.href = "feedback";
    }else {
        alert("Response error");
        location.href = "index";
    }
}*/

async function getTime() {
    var resp = await post("get_time", getCookie("username"), getCookie("password"), "", "", "inst");
    console.log(resp);
    if (resp == "Incorrect Password") {
        location.href = "index";
    } else if (resp == "Incorrect Username") {
        location.href = "index";
    } else {
        time = parseInt(resp);
        instructTimer();
    }

}

async function getMainTime() {
    var resp = await post("get_time", getCookie("username"), getCookie("password"), "", "", "main");
    console.log(resp);
    if (resp == "Incorrect Password") {
        location.href = "index";
    } else if (resp == "Incorrect Username") {
        location.href = "index";
    } else {
        time = parseInt(resp);
        mainTimer();
    }

}
async function start() {
    var resp = await post("start_time", getCookie("username"), getCookie("password"));
    console.log(resp);
    if (resp == "Start Time Recorded") {
        var ans_list = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];
        document.cookie = "ans_local=" + JSON.stringify(ans_list) + ";max-age=7200;path=/";
        location.href = 'main';
    }
    else if (resp == "Incorrect Password") {
        location.href = "index";
    } else if (resp == "Incorrect Username") {
        location.href = "index";
    } else { alert("Error. Reload and try again."); }
}

async function getName() {
    var resp = await post("get_name", getCookie("username"), getCookie("password"));
    console.log(resp);
    if (resp == "Error: ID Not Found") { alert("Error: ID Not Found"); }
    else if (resp == "Incorrect Password") {
        location.href = "index";
    } else if (resp == "Incorrect Username") {
        location.href = "index";
    } else if(resp == "Time Up"){
        location.href = "feedback";
    } else { document.getElementById("name").innerHTML = resp; }
}

async function saveAns() {
    if (qn < 11) {
        var checked = document.querySelectorAll('input[type=checkbox]:checked');
        if (checked.length == 0) {
            alert("No answer selected");
        } else if (checked.length == 1) {
            ans = checked[0].value;

            var ans_list = JSON.parse(getCookie("ans_local"));
            ans_list[qn - 1] = ans;
            document.cookie = "ans_local=" + JSON.stringify(ans_list) + ";max-age=7200;path=/";

            var resp = await post("save_ans", getCookie("username"), pword = getCookie("password"), ans = ans, qn = qn);
            console.log(resp);
            if (resp == "Error: ID Not Found") { alert("Error: ID Not Found"); }
            else if (resp == "Incorrect Password") {
                location.href = "index";
            } else if (resp == "Incorrect Username") {
                location.href = "index";
            }
        } else {
            alert("Error. More than 1 option selected");
        }
    } else {
        var ans = document.getElementById('open').value;
        if (ans == "") {
            alert("No answer entered");
        } else {
            var ans_list = JSON.parse(getCookie("ans_local"));
            ans_list[qn - 1] = ans;
            document.cookie = "ans_local=" + JSON.stringify(ans_list) + ";max-age=7200;path=/";
            
            var resp = await post("save_ans", getCookie("username"), pword = getCookie("password"), ans = ans, qn = qn);
            console.log(resp);
            if (resp == "Error: ID Not Found") { alert("Error: ID Not Found"); }
            else if (resp == "Incorrect Password") {
                location.href = "index";
            } else if (resp == "Incorrect Username") {
                location.href = "index";
            }
        }
    }
    shadeQNum();
}
async function initQn() {
    var resp = await post("get_qn", getCookie("username"), pword = getCookie("password"), ans = "", qn = qn);
    console.log(resp);
    if (resp == "Incorrect Password") {
        location.href = "index";
    } else if (resp == "Incorrect Username") {
        location.href = "index";
    } else {
        qnlink = JSON.parse(resp);
        for (var i = 0; i < 15; i++) {
            preload(qnlink[i],i);
        }
        changeQn(1);
    }
}
function getQn() {
    document.getElementById("question-img").removeChild(document.getElementById("question-img").lastChild);
    document.getElementById("question-img").appendChild(images[qn - 1]);
}
function changeQn(q) {
    qn = q;
    document.getElementById("question-num").innerHTML = "Question " + qn;
    var checkboxes = document.getElementsByName('opt[]');
    for (var checkbox of checkboxes) {
        checkbox.checked = false;
    }
    var ans_list = JSON.parse(getCookie("ans_local"));
    if(qn>10){
        document.getElementById('open').value = ans_list[qn-1];
    }else{
        //check the checkbox corresponds to .value = ans_list[qn-1]
        if(ans_list[qn-1] != ""){
        document.getElementById("opt"+ans_list[qn-1]).checked = true;
        }
    }

    
    getQn();
    if (qn < 11) {
        toggle_visibility('input-mcq', 'show');
        toggle_visibility('input-open', 'hide');
    } else {
        toggle_visibility('input-mcq', 'hide');
        toggle_visibility('input-open', 'show');
    }
}
function nextQn() {
    if (qn < 15) {
        changeQn(qn + 1);
    }
    console.log(ans_list);
}
async function shadeQNum() {
    var resp = await post("get_completed_qn", getCookie("username"), pword = getCookie("password"));
    console.log(resp);
    if (resp == "Incorrect Password") {
        location.href = "index";
    } else if (resp == "Incorrect Username") {
        location.href = "index";
    } else {
        var ansqn = resp.split(',');
        for (var i = 1; i < 16; i++) {
            if (ansqn[i - 1] == "") {
                document.getElementById("q" + i).style.backgroundColor = '';
            } else {
                document.cookie = "ans_local=" + JSON.stringify(ansqn) + ";max-age=7200;path=/";
                document.getElementById("q" + i).style.backgroundColor = "lightgreen";
            }
        }
        
    }

}
function toggle_visibility(id, cs) {
    if (cs == "show") {
        document.getElementById(id).style.display = 'flex';
    } else if (cs == "hide") {
        document.getElementById(id).style.display = 'none';
    }
}
function submit() {
    document.getElementById('confirmSubmit').classList.remove('visible');
    document.getElementById('confirmSubmit').classList.add('hidden');
    //submit ans
    location.href = 'finish';
}
function enlarge() {
    document.getElementById("lightbox").style.visibility = "visible";
    document.getElementById("img-enlarge").removeChild(document.getElementById("img-enlarge").firstChild);
    document.getElementById("img-enlarge").appendChild(images[qn-1].cloneNode(true));
}
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
var images = [];
function preload(url,i) {
    images[i] = new Image();
    images[i].src = url;
    images[i].style = "max-width: 100%;max-height:100%;object-fit:cover;margin:auto";
}

//TODO - GET ANSWERS FROM SERVER
//on submit, check all ans saved again, ignore empty because of reload