
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
        }
        $input.val($input.val()+value);
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

// Click to toggle dialog
function setupDialogs() {
    $('*[data-dialog]').click(function(e) {
        e.preventDefault();
        var dialog = $(e.currentTarget).attr('data-dialog');

        $('#dialog-'+dialog).toggleClass('active');
    });

    $(document).keyup(function(e) {
        if (e.keyCode == 27) $('.dialog-container').removeClass('active');
    });
}

// Setup audio player
function setupAudioPlayers() {
    $('.audio-player').each(function() {
        var $player = $(this);
        var audio = $player.find('audio').get(0);
        var $position = $player.find('.position');
        var loaded = false;

        audio.onplaying = function() {
            $player.addClass('playing');
            $player.removeClass('paused');
        };
        audio.onpause = function() {
            $player.addClass('playing');
            $player.addClass('paused');
        };
        audio.onended = function() {
            $player.removeClass('playing');
            $player.removeClass('paused');
        };
        audio.ontimeupdate = function() {
            var t = audio.currentTime;
            var msg = "";

            msg = Math.floor(t/60)+':'+Math.ceil(t % 60);

            $position.text(msg);
        };

        $player.find('.do-play').click(function(e) {
            e.preventDefault();
            if (!loaded) {
                audio.load();
                loaded = true;
            }
            audio.play();
        });

        $player.find('.do-pause').click(function(e) {
            e.preventDefault();
            audio.pause();
        });

        $player.find('.do-stop').click(function(e) {
            e.preventDefault();
            audio.pause();
            audio.currentTime = 0;
        });
    });
}

// Handle call and sms links in the app
function setupLinks() {
    $('a').click(function(e) {
        var $a = $(e.currentTarget);
        var val = decodeURIComponent($a.attr('href'));

        if (val.indexOf('tel:') === 0) {
            e.preventDefault();
            $('#dialog-dial').addClass('active')
                .find('.dial-input')
                .val(val.slice('tel:'.length));

        } else if (val.indexOf('sms:') === 0) {
            e.preventDefault();
            $('#dialog-sms').addClass('active')
                .find('.dial-input')
                .val(val.slice('tel:'.length));
        }
    })
}


$(document).ready(function() {
    setupDialogs();
    setupAudioPlayers();
    setupDialDialog();
    setupLinks();
});
