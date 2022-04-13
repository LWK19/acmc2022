<http>
    <head>
        <link href="https://fonts.googleapis.com/css2?family=Smooch+Sans&display=swap" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Fredoka&display=swap" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@900&display=swap" rel="stylesheet">
        <script type="text/javascript" src="script.js"></script>
        <link rel="stylesheet" href="style.css">
     </head>
     <body style="background-image:url('bg.jpg');background-size: cover;background-repeat: no-repeat;">
        <div style="padding:20px"></div>
        <div style="display:flex;justify-content:center"><img src="yis.png" style="height:120px;display:inline-block;padding:30px" ></div>
        
        <div class='team-title'>YIS Puzzle Day</div>
        <form id="form" action="main.php" method="post" class='team-form'>
            Enter Team Number:
            <input name="team" id="team">
            <input type="submit" id="subm" onClick="getTeam(document.getElementById('team').value)">
        </form>
        
        <script>
            document.addEventListener('DOMContentLoaded', function() {
                document.getElementsByClassName("disclaimer")[0].remove();
            }, false);
        </script>
    </body>
</http>