var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
document.getElementsByTagName('head')[0].appendChild(script);

var key = getCookie("username");

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
        // TODO change to 1000ms
        setTimeout(mainTimer, 10);
    }
}

async function post(meth, id, pword, ans, qn, timer) {
    document.getElementById("load").classList.remove("hidden");
    document.getElementById("load").classList.add("visible");
    let key = "AKfycbxWNrjelCgB3RaYTjp7FNOm3gdbt82nMJowK2ZCnbwPFBDlsY6qx_rDwXt6KA6fFBNllQ"
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
    console.log(usern, pword);
    var resp = await post(meth = "login", id = usern, pword = pword);
    if (resp == "Login Success") {
        document.cookie = "username="+usern+";path=/";
        //console.log(document.cookie);
        //setTimeout(console.log(),100000);
        location.href = 'instructions.html'
    } else if (resp == "Incorrect Password") {
        document.getElementById("incorrect").innerHTML = "Incorrect Password";
    } else if (resp == "Incorrect Username") {
        document.getElementById("incorrect").innerHTML = "Incorrect Username";
    } else {
        console.log(resp);
        alert("Response error");
    }
    // TODO - Secure Login

}

async function getTime() {
    var resp = await post("get_time", key, "", "", "", "inst");
    console.log(resp);
    time = parseInt(resp);
    instructTimer();
}

async function getMainTime() {
    var resp = await post("get_time", key, "", "", "", "main");
    console.log(resp);
    time = parseInt(resp);
    mainTimer();
}
async function start() {
    console.log(document.cookie);
    console.log(key);
    var resp = await post("start_time", key);
    console.log(resp);
    if (resp == "Start Time Recorded") { location.href = 'main.html'; }
    else { alert("Error. Reload and try again."); }
}

async function getName() {
    //TODO - change id to passed variable
    var resp = await post("get_name", key);
    console.log(resp);
    if (resp == "Error: ID Not Found") { alert("Error: ID Not Found"); }
    else { document.getElementById("name").innerHTML = resp; }
}

async function saveAns() {
    if (qn < 11) {
        var checked = document.querySelectorAll('input[type=checkbox]:checked');
        if (checked.length == 0) {
            alert("No answer selected");
        } else if (checked.length == 1) {
            ans = checked[0].value;
            ans_list[qn - 1] = ans;
            var resp = await post("save_ans", key, pword = "", ans = ans, qn = qn);
            if (resp == "Error: ID Not Found") { alert("Error: ID Not Found"); }
            else {console.log(resp);}
        } else {
            alert("Error. More than 1 option selected");
        }
    }else{
        var ans = document.getElementById('open').value;
        if (ans == null) {
            alert("No answer entered");
        } else {
            ans_list[qn - 1] = ans;
            var resp = await post("save_ans", key, pword = "", ans = ans, qn = qn);
            if (resp == "Error: ID Not Found") { alert("Error: ID Not Found"); }
            else {console.log(resp);}
        }
    }
}
async function getQn() {
    var resp = await post("get_qn", key, pword = "", ans = "", qn = qn);
    console.log(resp);
    document.getElementById("question-img").src = resp;
}

function changeQn(q) {
    qn = q;
    document.getElementById("question-num").innerHTML = "Question " + qn;
    var checkboxes = document.getElementsByName('opt[]');
    for (var checkbox of checkboxes) {
        checkbox.checked = false;
    }
    getQn();
    shadeQNum();
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
function shadeQNum() {
    for (var i = 1; i < 16; i++) {
        document.getElementById("q" + i).style.backgroundColor = "";
    }
    document.getElementById("q" + qn).style.backgroundColor = "pink";
}

function toggle_visibility(id, cs) {
    if (cs == "show") {
        document.getElementById(id).style.display = 'flex';
    } else if (cs == "hide") {
        document.getElementById(id).style.display = 'none';
    }
}
 
function submit(){
    document.getElementById('confirmSubmit').classList.remove('visible');
    document.getElementById('confirmSubmit').classList.add('hidden');
    //submit ans
    location.href = 'finish.html';
}
function enlarge(){
    document.getElementById("lightbox").style.visibility = "visible";
    document.getElementById("img-enlarge").src = document.getElementById("question-img").src;
}
function getCookie(cname) {
    console.log(document.cookie);
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
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
  
var ans_list = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];
//on submit, check all ans saved again, ignore empty because of reload