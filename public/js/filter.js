function filter_ingredients()  {
    const input = document.getElementById("search").value
    var drop = document.getElementById("ingredient")
    drop = remove_all_child(drop)
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onload = function() {
        const ingredients = JSON.parse(this.responseText).ingredients
        console.log(ingredients[0])
        for (var i = 0; i< ingredients.length; i++) {
            const ingredient = ingredients[i]
            var opt = document.createElement("option")
            opt.value = ingredient
            opt.innerHTML = ingredient
            drop.appendChild(opt)
        }
        console.log(drop)
        document.getElementById("ingredient") = drop
    }
    xmlhttp.open("GET","/api/ingredients?name="+input)
    xmlhttp.send()
}

function remove_all_child(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.lastChild);
      }
    return parent
}