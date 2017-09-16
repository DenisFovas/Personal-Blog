// Client side file

// On deletion, the client side will send to the server the id of the article to be deleted.
$(document).ready(function() {
    $('.delete-article').on('click', function(e) {
        $target = $(e.target);
        var id = $target.attr('data-id');
        $.ajax({
            type: 'DELETE',
            url: '/articles/' + id,
            success: function(response) {
                setTimeout(1000, function () {
                    window.location.href = '/';
                });
            },
            error: function (err) {
                console.log("We got an error");
                console.log(err);
            }
        });
    });
});