function result_render(link, img_link, alt, name, backup_img = "")
{
    var render =
        "<div class='column is-one-quarter'>"+
            "<div class='card'>"+
                "<a href="+link+">"+
                    "<div class='card-image'>"+
                        "<figure class='image is-256x256 is-4by3'>"+
                        "<img src = "+img_link+" alt="+alt+" onerror='javascript:this.src=\"/img/default_chef.jpg\"'>"+
                        "</figure>"+
                    "</div>"+
                    "<div class='content'>"+
                        "<center>"+
                            "<h2>"+name+"</h2>"+
                            "<p><button class='button'>View</button></p>"+
                        "</center>"+
                    "</div>"+
                "</a>"+
            "</div>"+
        "</div>";
    return render;
}

function load_recipe_data()
{
    const name = document.getElementById("name").value;
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onload = function() {
        const myobj = JSON.parse(this.responseText);
        result = "<div class='columns'>";
        for(var i = 0; i < myobj.recipes.length; i++) {
            var recipe = myobj.recipes[i];
            result += result_render(recipe.link, recipe.img_link, recipe.alt, recipe.name);
        }
        result += "</div>"
        document.getElementById("Results").innerHTML = result;
    };
    xmlhttp.open("GET","/api/recipes?name="+name);
    xmlhttp.send();
}

function load_chef_data()
{
    const name = document.getElementById("name").value;
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onload = function() {
        const myobj = JSON.parse(this.responseText);
        result = "<div class='columns'>";
        for(var i = 0; i < myobj.chefs.length; i++) {
            const chef = myobj.chefs[i];
            result += result_render(chef.url, chef.img_link, chef.alt, chef.name);
        }
        result += "</div>"
        document.getElementById("Results").innerHTML = result;
    };
    xmlhttp.open("GET","/api/chefs?name="+name);
    xmlhttp.send();
}