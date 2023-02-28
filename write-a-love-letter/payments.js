function editTxt(selector) {
    $(function() {
        var newHtml = '';
        var sentences = $(selector).html().split(/(\. |\n)/);
        for (i = 0; i < sentences.length; i++) {
            var sentence = sentences[i];
            newHtml += '<span class="unreadable">' + sentence + '</span>';
        }
        $(selector).html(newHtml);
        console.log(newHtml);
    });
}
$(function() {
    var hoverCount = 0;
    var maxHoverCount = 50;
    editTxt('#hiddenLetterDisplay');
    $('#hiddenLetterDisplay span').live('mouseover', function() {
        if (hoverCount < maxHoverCount) {
            console.log("made readable");
            $(this).removeClass('unreadable');
            $(this).addClass('readable');
            hoverCount++;
            if (hoverCount === maxHoverCount) {
                $('#hiddenLetterDisplay span').die('mouseover');
                // $('#modal').show();
            }
        }
    });
    $('#hiddenLetterDisplay span').live('mouseout', function() {
        console.log("made unreadable");
        $(this).removeClass('readable');
        $(this).addClass('unreadable');
    });
});


function countLines(text) {
    let lines = text.split("\n");
    let lineCount = 0;
    for (let line of lines) {
        lineCount += Math.ceil(line.length / 70);
    }
    lineCount += lines.length - 1;
    return lineCount;
}

function updateTextArea(event) {
    const textarea = event.target;
    if (countLines(textarea.value) > 28) {
        textarea.value = lastState;
    } else {
        lastState = textarea.value;
    }
    const count = textarea.value.length;
    const label = document.getElementById("characterCountLabel");
    var lineCount = countLines(textarea.value);
    label.innerText = `Letter Count: ${count} / 1200 & Line Count is Good`;
    if (count >= 1200) {
        label.style.color = "red";
        label.innerText = `Letter Count: ${count} / 1200 & But Line Count is Good`;
    }
    if (lineCount > 28) {
        label.style.color = "red";
        label.innerText = `Letter Count: ${count} / 1200 & Line Count is Bad`;
    } else {
        label.style.color = "green";
    }
}

async function updateCount() {
const count = await getCount();

if(count <= 0){
    document.getElementById("cardsLeft").innerHTML = `Out of stock! Check back again in 6 hours`;
    document.getElementById("mailButton").innerText = `Out of stock! Check back again in 6 hours`;
}
document.getElementById("cardsLeft").innerHTML = `Only ${count} cards left`;
document.getElementById("mailButton").innerText = `Sent my one of ${count} remaining stock`;

}

async function getCount() {
const response = await fetch('https://qbzbb2equb.execute-api.us-east-2.amazonaws.com/default/updateLettersLeft', {
    method: 'GET', headers: {
    "Content-Type": "application/json"
    }
});
const data = await response.json();
let letterBatchSent = JSON.parse(data.body).count;
console.log(letterBatchSent);
let tempCount = 53 - letterBatchSent;
if (tempCount < 0) {return 0}

return tempCount;


}
updateCount();
// Attach an event listener to the form submit button
document.getElementById("letterboxContainer").addEventListener("submit", function(event) {
    if (updateCount()<=0) {
        event.preventDefault();
    }
});


const form = document.getElementById("initialForm");

const retrieveButton = document.getElementById("retrieveDraftButton");
const checkoutButton = document.getElementById("checkout-button");
const email = document.getElementById("email");
const lovedOneFirstName = document.getElementById("lovedOneFirstName");
const writerFirstName = document.getElementById("writerFirstName");

const checkoutForm = document.getElementById("letterboxContainer");

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
  console.log("Visible Input Value: ", this.value);
document.getElementById("hiddenEmailInput").value = this.value;
  console.log("Hidden Input Value: ", document.getElementById("hiddenEmailInput").value);

});

document.getElementById("lovedOneFirstName").addEventListener("input", function() {
  console.log("Visible Input Value: ", this.value);
document.getElementById("hiddenlovedOneFirstName").value = this.value;
  console.log("Hidden Input Value: ", document.getElementById("hiddenlovedOneFirstName").value);

});


retrieveButton.addEventListener("click", (e) => {
      fbq('track', 'RetrievedLetter', {
    value: 0,
    currency: 'USD',
  });
    e.preventDefault();

  if (!email.value || !lovedOneFirstName.value || !writerFirstName.value) {
    alert("To retrieve a draft, please fill the email, and both first names.");
    return;
  }

  const data = {
    email: email.value,
    lovedOneFirstName: lovedOneFirstName.value,
    writerFirstName: writerFirstName.value
  };

  fetch("https://api.penandpaperlove.com/retrieve", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then((res) => res.json())
    .then((json) => {

      let parsedJson = JSON.parse(json.body);
      hideForm();
      displayLetter(parsedJson.responseText);
    });
});

form.addEventListener("submit", (event) => {
      fbq('track', 'generatedLoveLetter', {
    value: 0,
    currency: 'USD',
  });
    event.preventDefault();

hideForm();
showLoading();

//Generate form data
  const formData = new FormData(form);
  const email = formData.get("email");
  const lovedOneFirstName = formData.get("loved-one-first-name");
  const writerFirstName = formData.get("writer-first-name");
  const whatMakesThemSpecial = formData.get("what-makes-them-special");
  const momentWeShared = formData.get("moment-we-shared");
  const whatImProudOf = formData.get("what-im-proud-of");

  const data = {
    email,
    lovedOneFirstName,
    writerFirstName,
    whatMakesThemSpecial,
    momentWeShared,
    whatImProudOf,
  };

    console.log(data);

//Server request
    fetch("https://api.penandpaperlove.com/write", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {

        hideLoading();
        displayLetter(data.body);

        });
    });


    function displayLetter(text){

        document.getElementById("letterboxContainer").style.display = "block";

        const textarea = document.getElementById('letterbox');
        let index = 0;

        const updateText = (text) => {

        setTimeout(() => {
            textarea.value = text.substring(0, index);
            index++;
            if (index <= text.length) {
            updateText(text);
            }
        }, 30);

        }

        hideLoading();
        updateText(text);
        document.getElementById("letterbox").disabled = false;

//End typewriter
    }

 function showLoading(){    
    //Shows loading message
    document.getElementById("loadingText").classList.remove('hidden');
    }

    function hideLoading(){
            //Disable all input areas
        document.getElementById("loadingText").style.display = "none";
    }

    function hideForm(){

    // Hides write the letter button and marketing message
    document.getElementById("marketingMessage").style.display = "none";
    document.getElementById("initialForm").classList.add('hidden');

    }


