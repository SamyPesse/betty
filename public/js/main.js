
function setupDialDialog() {
    var connection;
    var inCall = false;
    var $dialog = $('#dialog-dial');
    var $input = $dialog.find('.dial-input');
    var $status = $dialog.find('.dial-status');
    var $doHangup = $dialog.find('.do-hangup');
    var $doCall = $dialog.find('.do-call');

    var toggleCallStatus = function(){
        $doCall.toggle(!inCall);
        $doHangup.text(inCall? "Hangup" : "Close");
    }


    $dialog.find('.dial-button').click(function(e) {
        e.preventDefault();
        var value = $(e.currentTarget).val();

        if (connection) {
            connection.sendDigits(value);
        } else {
            $input.val($dialInput.val()+value);
        }
    });

    Twilio.Device.setup($dialog.find('input[name=token]').val());

    $doCall.click(function() {
        params = { "tocall" : $input.val()};
        connection = Twilio.Device.connect(params);
    });
    $doHangup.click(function() {
        Twilio.Device.disconnectAll();
    });

    Twilio.Device.ready(function (device) {
        console.log("Ready");
        $status.text('Ready to start call');
    });

    Twilio.Device.incoming(function (conn) {
        if (confirm('Accept incoming call from ' + conn.parameters.From + '?')) {
            $dialog.addClass('active');
            connection = conn;
            conn.accept();
        }
    });

    Twilio.Device.offline(function (device) {
        console.log("Offline");
        $status.text('Offline');
    });

    Twilio.Device.error(function (error) {
        console.log("Error", error);
        $status.text("Error: "+error.message.message);
    });

    Twilio.Device.connect(function (conn) {
        console.log("Connected");
        $status.text("Successfully established call");
        inCall = true;
        toggleCallStatus();
    });

    Twilio.Device.disconnect(function (conn) {
        console.log("Disconnected");
        if (inCall) $status.text("Call ended");
        inCall = false;
        toggleCallStatus();
    });

    toggleCallStatus();
}


$(document).ready(function() {
    // Click to toggle dialog
    $('*[data-dialog]').click(function(e) {
        e.preventDefault();
        var dialog = $(e.currentTarget).attr('data-dialog');

        $('#dialog-'+dialog).toggleClass('active');
    });

    // Call dialog
    setupDialDialog();
});
