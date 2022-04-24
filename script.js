var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
document.getElementsByTagName('head')[0].appendChild(script);

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
        setTimeout(mainTimer, 10);
    }
}

async function post(meth, id, pword, ans, qn, timer) {
    let key = "AKfycbz1oe-lmovYvwKcdL5BYALtodBz2-EK6Pp0J-UVU_sKzvPu2TNHtOCPgWN0mt0MflfZHA"
    let url = "https://script.google.com/macros/s/" + key + "/exec";
    var req = await jQuery.ajax({
        crossDomain: true,
        url: url,
        method: "POST",
        data: '{"meth": "' + meth + '", "ans": "' + ans + '", "id": "' + id + '", "qn": "' + qn + '", "timer": "' + timer + '", "pword": "' + pword + '"}',
    });
    return req;
}
async function login() {
    //spinner
    usern = document.getElementById("username").value;
    pword = document.getElementById("password").value;
    var resp = await post(meth = "login", id = usern, pword = pword);
    //end spinner
    if (resp == "Login Success") {
        location.href = 'instructions.html';
    } else if (resp == "Incorrect Password") {
        alert("Incorrect Password");
    } else if (resp == "Incorrect USername") {
        alert("Incorrect Username");
    } else {
        alert("Not sons");
    }

}

async function getTime() {
    var resp = await post("get_time", "17lee", "", "", "", "inst");
    console.log(resp);
    time = parseInt(resp);
    instructTimer();
}

async function getMainTime() {
    var resp = await post("get_time", "17lee", "", "", "", "main");
    console.log(resp);
    time = parseInt(resp);
    mainTimer();
}
async function start() {
    var resp = await post("start_time", "17lee");
    console.log(resp);
    if (resp == "Start Time Recorded") { location.href = 'main.html'; }
    else { alert("Error. Reload and try again."); }
}

async function getName() {
    var resp = await post("get_name", "17lee");
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
            var resp = await post("save_ans", "17lee", pword = "", ans = ans, qn = qn);
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
            var resp = await post("save_ans", "17lee", pword = "", ans = ans, qn = qn);
            if (resp == "Error: ID Not Found") { alert("Error: ID Not Found"); }
            else {console.log(resp);}
        }
    }
}
async function getQn() {
    var resp = await post("get_qn", "17lee", pword = "", ans = "", qn = qn);
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



var ans_list = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];
//on submit, check all ans saved again, ignore empty because of reload