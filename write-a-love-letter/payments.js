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


const form = document.getElementById("initialForm");

const retrieveButton = document.getElementById("retrieveDraftButton");
const checkoutButton = document.getElementById("checkout-button");
const email = document.getElementById("email");
const lovedOneFirstName = document.getElementById("lovedOneFirstName");
const writerFirstName = document.getElementById("writerFirstName");

const checkoutForm = document.getElementById("letterboxContainer");



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

//What I do not actually want to do is to rewrite it into a redirect but on the otherhand the redirect to the edit page may make the most sense and form into an upsell


form.addEventListener("submit", (event) => { //This is for the generation of a letter form

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
        document.getElementById("testerDisplay").classList.remove('hidden');
        str = text.replace(/(?:\r\n|\r|\n)/g, '<br>');

        const textarea = document.getElementById('hiddenLetterDisplay');
        textarea.innerHTML = str;
        editTxt("#hiddenLetterDisplay");

        hideLoading();

    }

 function showLoading(){    
    //Shows loading message
    document.getElementById("loadingText").classList.remove('hidden');
    document.getElementById("loadingText").scrollIntoView();
    }

    function hideLoading(){
            //Disable all input areas
        document.getElementById("loadingText").style.display = "none";
    }

    function hideForm(){

    // Hides write the letter button and marketing message
    document.getElementById("initialForm").classList.add('hidden');
    document.getElementById("pricingChart").classList.add('hidden');

    }


