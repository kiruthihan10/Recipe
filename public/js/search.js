function result_render(link, img_link, alt, name, backup_img = "")
{
    var render = "<div class='column'>"+
        "<div class='card'>"+
            "<a href="+link+">"+
                "<img src = "+img_link+" alt="+alt+" style='width:100%' onerror='javascript:this.src=\"/img/default_chef.jpg\"'>"+
                "<div class='container'>"+
                        "<h2>"+name+"</h2>"+
                        "<p><button class='button'>View</button></p>"+
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
        result = "";
        for(var i = 0; i < myobj.recipes.length; i++) {
            var recipe = myobj.recipes[i];
            result += result_render(recipe.link, recipe.img_link, recipe.alt, recipe.name);
        }
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
        result = "";
        for(var i = 0; i < myobj.chefs.length; i++) {
            const chef = myobj.chefs[i];
            result += result_render(chef.url, chef.img_link, chef.alt, chef.name);
        }
        document.getElementById("Results").innerHTML = result;
    };
    xmlhttp.open("GET","/api/chefs?name="+name);
    xmlhttp.send();
}