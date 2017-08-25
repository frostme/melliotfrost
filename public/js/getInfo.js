var GetIpInfo = function(cb) {
    var info = null;
    var infoUrl = 'http://ipinfo.io';
    $.ajax({
        url: infoUrl,
        type: 'GET',
        dataType: 'json',
        async: false,
        success: function(data) {
          cb(data);
        }
    });
};
