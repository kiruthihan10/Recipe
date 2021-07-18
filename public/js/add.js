var array = Array();
var x = 0;
function add_item(select_id, quantity_id) {
    selected_value = document.getElementById(select_id).value
    selected_quantity = document.getElementById(quantity_id).value
    if (document.getElementById("label_"+selected_value).style.display == "none"){
        document.getElementById('label_'+selected_value).style.display = "inline"
        document.getElementById('label_'+selected_value).innerHTML = selected_value + " " + selected_quantity;
        document.getElementById('Ingredients').value = document.getElementById('Ingredients').value+selected_value+","+selected_quantity+";"
    }
}

function remove(label) {
    selected_value = label.id.substring(6)//To remove label
    selected_value = selected_value.split(" ")[0]
    document.getElementById('label_'+selected_value).style.display = "none"
    document.getElementById('label_'+selected_value).innerHTML = "";
    const ingredients = document.getElementById('Ingredients').value.split(";")
    act_value = ""
    for (i=0;i<ingredients.length;i++) {
        if (ingredients[i].split(",")[0] == selected_value) 
        {
            console.log(ingredients[i])
            delete ingredients[i]
        }
        else {
            act_value += ingredients[i]+"\n"
        }
    }
    document.getElementById('Ingredients').value = act_value
    
}

function add_step(inp_id, render_id, act_id){
    step = document.getElementById(inp_id).value
    array[x] = step
    render_output = "<ol>"
    for (let i=0;i <= x; i++) {
        render_output+="<li>"+array[i]+"</li>"
    }
    render_output+="</ol>"
    document.getElementById(render_id).innerHTML=render_output
    document.getElementById(render_id).style.border="1px solid green"
    x++;
    document.getElementById(act_id).value = document.getElementById(act_id).value+step+";"
}