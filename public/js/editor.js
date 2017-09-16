tinymce.init({ 
    selector: 'textarea#text-editor',
    toolbar: "styleselect | bold italic underline | alignleft aligncenter alignright alignjusify | indent outdent | blockquote | undo redo",
    menubar: false,
    theme: "modern",
    // This is the css file for the text editor.
    content_css: "/css/editor.css",
    allow_unsafe_link_targer: true
});