async function updateCount() {
    const count = await getCount();
    
    if(count <= 0){
        document.getElementById("cardsLeft").innerHTML = `Out of stock! Check back again in 6 hours`;
        document.getElementById("mailButton").innerText = `Out of stock! Check back again in 6 hours`;
    }
    document.getElementById("cardsLeft").innerHTML = `Only ${count} cards left`;
    document.getElementById("mailButton").innerText = `Sent my one of ${count} remaining stock`;
    
    }

    updateCount();
// Attach an event listener to the form submit button
document.getElementById("letterboxContainer").addEventListener("submit", function(event) {
    if (updateCount()<=0) {
        event.preventDefault();
    }
});


var radios = document.forms["letterboxContainer"].elements["card"];
for(var i = 0, max = radios.length; i < max; i++) {
    radios[i].onclick = function() {
    const formData = new FormData();
    
    formData.append('email', email.value);
    formData.append('lovedOneFirstName', lovedOneFirstName.value);
    formData.append('letterbox',  document.getElementById('letterbox').value);
    formData.append('card', this.value);

    const data =  {
        'email': email.value,
        'lovedOneFirstName': lovedOneFirstName.value,
        'letterbox': document.getElementById('letterbox').value,
        'card': this.value
    }
    console.log(data);

    fetch("https://shlo8hrs84.execute-api.us-east-2.amazonaws.com/default/", { method: "POST", headers: {
      "Content-Type": "application/json"
    }, body: JSON.stringify(data)}) 
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
    })
    ;   
    }
}

document.getElementById("email").addEventListener("input", function() {
document.getElementById("hiddenEmailInput").value = this.value;

});

document.getElementById("lovedOneFirstName").addEventListener("input", function() {
document.getElementById("hiddenlovedOneFirstName").value = this.value;

});
