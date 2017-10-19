// tinymce.init({ 
//     selector: 'textarea#text-editor',
//     toolbar: "styleselect | bold italic underline | alignleft aligncenter alignright alignjusify | indent outdent | blockquote | undo redo",
//     menubar: false,
//     theme: "modern",
//     // This is the css file for the text editor.
//     content_css: "/css/editor.css",
//     allow_unsafe_link_targer: true
// });

$(document).ready( function() {
    // Will enable the design mode for the iframe
    editor.document.designMode = "On";
});

function executeCommand (command) {
    editor.document.execCommand(command, false, null);
};

function executeCommandWithArguments(command, argument) {
    editor.document.execCommand(command, false, argument);
}

$('#text-editor').change(function () {
    // Todo: Realize WTF is this shit
    $('#textarea', window.parent.document).val($(this).val());
    console.log(document.getElementById('textarea'));
});

function doSubmit() {
    setTimeout(function () {
        var iframe = document.getElementById("text-editor");
        var textarea = document.getElementById('textarea');
        var newValue = $('#text-editor').contents().find("html").html();
        $('#textarea').val(newValue);
        doSubmit();
    }, 500);
    // if (!doSubmit()) {
    //    // Delay
    // }
    
    // document.getElementById('textarea').value = editor.body.innerHTML;
    // console.log(document.getElementById('textarea'));
}
$("#submit-button").on('click', function() {
    
    doSubmit();
    // var iframe = document.getElementById("text-editor");
    // var textarea = document.getElementById('textarea');
    // var newValue = iframe.document.body.innerHTML;
    // $(textarea).val(newValue);
});