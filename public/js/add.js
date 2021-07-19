var array = Array();
var x = 0;
function add_item(select_id, quantity_id) {
    selected_value = document.getElementById(select_id).value
    selected_quantity = document.getElementById(quantity_id).value
    //if (document.getElementById("label_"+selected_value).style.display == "none"){
    if (!document.getElementById('ingredients_list').innerHTML.includes(selected_value)){
        //document.getElementById('label_'+selected_value).style.display = "inline"
        //document.getElementById('label_'+selected_value).innerHTML = selected_value + " " + selected_quantity;
        document.getElementById('Ingredients').value = document.getElementById('Ingredients').value+selected_value+","+selected_quantity+";"
        var li = document.createElement("li")
        var label = document.createElement("label")
        label.innerHTML = selected_value+ " " + selected_quantity
        label.addEventListener("click", remove.bind(this))
        label.id = 'label_'+selected_value
        li.appendChild(label)
        document.getElementById('ingredients_list').appendChild(li)
        //document.getElementById('ingredients_list').innerHTML += "<li><label id = 'label_"+selected_value+"' onclick='remove(this)'>"+selected_value+ " " + selected_quantity+"</label></li>"
    }
}

function remove(label) {
    label = label.srcElement.id
    label = document.getElementById(label)
    selected_value = label.id.substring(6,label.id.length).trim()//To remove label
    const ingredients = document.getElementById('Ingredients').value.split(";")
    act_value = ""
    for (i=0;i<ingredients.length-1;i++) {
        if (ingredients[i].split(",")[0].trim() == selected_value) 
        {
            console.log(ingredients[i])
            delete ingredients[i]
        }
        else {
            act_value += ingredients[i]+"\n"
        }
    }
    document.getElementById('Ingredients').value = act_value
    document.getElementById('ingredients_list').removeChild(label.parentNode)
    
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