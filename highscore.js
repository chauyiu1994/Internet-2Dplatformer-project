//
// A score record JavaScript class to store the name and the score of a player
//
function ScoreRecord(name, score) {
    this.name = name;
    this.score = score;
}


//
// This function reads the high score table from the cookies
//
function getHighScoreTable() {
    var table = new Array();

    for (var i = 0; i < 10; i++) {
        // Contruct the cookie name
        var cookieName = "record" + i;

        // Get the cookie value using the cookie name
        var theCookie = getCookie(cookieName);

        // If the cookie does not exist exit from the for loop
        if(theCookie == null){
            break;
        }

        // Extract the name and score of the player from the cookie value
        var theCookieData = theCookie.split("~");
        var theScoreRecord = new ScoreRecord(theCookieData[0], theCookieData[1]);

        // Add a new score record at the end of the array
        table.push(theScoreRecord);
    }

    return table;
}


//
// This function stores the high score table to the cookies
//
function setHighScoreTable(table) {
    var expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);

    for (var i = 0; i < 10; i++) {
        // If i is more than the length of the high score table exit
        // from the for loop
        if (i >= table.length) break;

        // Contruct the cookie name
        var cookieName = "record" + i;
        var theCookieData = table[i].name+"~"+table[i].score;

        // Store the ith record as a cookie using the cookie name
        setCookie(cookieName, theCookieData, expires, null, null, null);
    }
}




//
// This function adds a high score entry to the text node
//
function addHighScore(record, node, index) {
    // Create the name text span
    var name = svgdoc.createElementNS("http://www.w3.org/2000/svg", "tspan");

    // Set the attributes and create the text
    name.innerHTML = record.name;
    name.setAttributeNS(null, "x", 100);
    name.setAttributeNS(null, "y", 70+index*30);

    // Add the name to the text node
    node.appendChild(name);

    // Create the score text span
    var score = svgdoc.createElementNS("http://www.w3.org/2000/svg", "tspan");
    score.setAttributeNS(null, "x", 370);
    score.setAttributeNS(null, "y", 70+index*30);

    // Set the attributes and create the text
    score.innerHTML = record.score;

    // Add the score to the text node
    node.appendChild(score);
}


//
// This function shows the high score table to SVG
//
function showHighScoreTable(table) {
    // Show the table
    var node = svgdoc.getElementById("highscoretable");
    node.style.setProperty("visibility", "visible", null);

    // Get the high score text node
    var node = svgdoc.getElementById("highscoretext");
    node.innerHTML="";

    for (var i = 0; i < 10; i++) {
        // If i is more than the length of the high score table exit
        // from the for loop
        if (i >= table.length) break;

        // Add the record at the end of the text node
        addHighScore(table[i], node, i);
    }
}


//
// The following functions are used to handle HTML cookies
//

//
// Set a cookie
//
function setCookie(name, value, expires, path, domain, secure) {
    var curCookie = name + "=" + escape(value) +
        ((expires) ? "; expires=" + expires.toGMTString() : "") +
        ((path) ? "; path=" + path : "") +
        ((domain) ? "; domain=" + domain : "") +
        ((secure) ? "; secure" : "");
    document.cookie = curCookie;
}


//
// Get a cookie
//
function getCookie(name) {
    var dc = document.cookie;
    var prefix = name + "=";
    var begin = dc.indexOf("; " + prefix);
    if (begin == -1) {
        begin = dc.indexOf(prefix);
        if (begin != 0) return null;
    } else
        begin += 2;
    var end = document.cookie.indexOf(";", begin);
    if (end == -1)
        end = dc.length;
    return unescape(dc.substring(begin + prefix.length, end));
}


//
// Delete a cookie
//
function deleteCookie(name, path, domain) {
    if (get_cookie(name)) {
        document.cookie = name + "=" +
        ((path) ? "; path=" + path : "") +
        ((domain) ? "; domain=" + domain : "") +
        "; expires=Thu, 01-Jan-70 00:00:01 GMT";
    }
}


