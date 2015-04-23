$(document).ready(function() {
    // Click to toggle dialog
    $('*[data-dialog]').click(function(e) {
        e.preventDefault();
        var dialog = $(e.currentTarget).attr('data-dialog');

        $('#dialog-'+dialog).toggleClass('active');
    });
});
