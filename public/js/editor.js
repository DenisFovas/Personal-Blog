$(document).ready(function () {
  // Will enable the design mode for the iframe
  editor.document.designMode = 'On'
})

function executeCommand (command) {
  editor.document.execCommand(command, false, null)
};

function executeCommandWithArguments (command, argument) {
  editor.document.execCommand(command, false, argument)
}

function submitTextArea () {
  let content = document.getElementById('text-editor').contentWindow
  console.log(content)
  $('#textarea').val(content)
}
