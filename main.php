 <html>
     <head>
         <link href="https://fonts.googleapis.com/css2?family=ZCOOL+XiaoWei&display=swap" rel="stylesheet">
         <link href="https://fonts.googleapis.com/css2?family=Josefin+Sans&display=swap" rel="stylesheet">
        <link
        rel="stylesheet"
		href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
        />
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
         <script type="text/javascript" src="script.js"></script>
         <link rel="stylesheet" href="style.css">
     </head>
     
    <body style="margin:0px">
        <div id="main-title">
            Welcome Team <?php echo $_POST["team"]; ?>
            <img src="yis.png" style="height:50px" align="right">
        </div>
        <div style="padding:20px;justify-content:center;display:flex" id="buff"></div>
        <script type="text/javascript">
            var MyJSStringVar = "<?php Print($_POST["team"]); ?>";
            getTeam(MyJSStringVar);
        </script>
        <div style="display:flex;justify-content:center">
            <div id=question0 class="question" onClick="setQuestion(0,10)">
                <span class="puzzle-title">
                    Puzzle #1
                </span>
            </div>
        </div>
        <br>
        <div style="display:flex;justify-content:center">
            <div id=question1 class="question" onClick="setQuestion(1,5)">
                <span class="puzzle-title">
                    Puzzle #2
                </span>
            </div>
        </div>
        <br>
        <div style="display:flex;justify-content:center">
            <div id=question2 class="question" onClick="setQuestion(2,7)">
                <span class="puzzle-title">
                    Puzzle #3
                </span>
            </div>
        </div>
        <br>
        <div style="display:flex;justify-content:center">
            <div id=question3 class="question" onClick="setQuestion(3,4)">
                <span class="puzzle-title">
                    Puzzle #4
                </span>
            </div>
        </div>
        <br>
        <div style="display:flex;justify-content:center">
            <div id=question4 class="question" onClick="setQuestion(4,8)">
                <span class="puzzle-title">
                    Puzzle #5
                </span>
            </div>
        </div>
        <br>
        <div style="display:flex;justify-content:center">
            <div id=question5 class="question" onClick="setQuestion(5,6)">
                <span class="puzzle-title">
                    Puzzle #6
                </span>
            </div>
        </div>
        <br>
        <div style="display:flex;justify-content:center">
            <div id=question6 class="question" onClick="setQuestion(6,9)">
                <span class="puzzle-title">
                    Puzzle #7
                </span>
            </div>
        </div>
        <br>
        <div style="display:flex;justify-content:center">
            <div id=question7 class="question" onClick="setQuestion(7,5)">
                <span class="puzzle-title">
                    Puzzle #8
                </span>
            </div>
        </div>
        <br>
        <div style="display:flex;justify-content:center">
            <div id=question8 class="question" onClick="setQuestion(8,4)">
                <span class="puzzle-title">
                    Puzzle #9
                </span>
            </div>
        </div>
        <div style="padding:20px"></div>
        <script>
        init();
        function createQ(qnum, len){
            let q = document.getElementById("question" + String(qnum));
            let row = document.createElement("div");
            row.className = "question-row";
            for (let j = 0; j < len; j++) {
                let box = document.createElement("div")
                box.className = "letter-box"
                row.appendChild(box)
            } 
        
            let button=document.createElement("button");
            button.innerText="Submit";
            button.className = "button";
            button.type="button";
            
            function print(){checkGuess(qnum);}
            
            button.addEventListener("click", print);
            
            q.appendChild(row);
            q.appendChild(button);
            
        }
        createQ(0,10);
        createQ(1,5);
        createQ(2,7);
        createQ(3,4);
        createQ(4,8);
        createQ(5,6);
        createQ(6,9);
        createQ(7,5);
        createQ(8,4);
        
        
        
        
        
        
        document.addEventListener('DOMContentLoaded', function() {
           document.getElementsByClassName("disclaimer")[0].remove();
        }, false);
        
        </script>
    <div id="tail" style="display:flex;justify-content:center">
        &copy 2022 LWK | All Rights Reserved
    </div>
    </body>
</html>

