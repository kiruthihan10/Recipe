function report(post_name, author) {
    const name = post_name
    const author = author
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onload = function() {
        const myobj = JSON.parse(this.responseText);
        if (myobj.result = 1) {
            alert("Report Submitted")
            document.getElementById("report").style.display = "none"
        }
        else {
            alert("Report Submittion Failed Try Again")
        }
    };
    xmlhttp.open("GET","/api/report?name="+name+"&author="+author);
    xmlhttp.send();
}