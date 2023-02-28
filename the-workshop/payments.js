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
