function showNotifications(data) {
    function toUnix(time) { return Date.parse(time) / 1000; }
    data = $.grep(data, function(msg) { return !last_notify_time || toUnix(msg.date) > last_notify_time });
    if(data.length == 0) return;

    var max_date = 0;
    $(data).each(function(i, msg) {
        if(max_date < toUnix(msg.date)) max_date = toUnix(msg.date);
    });

    var table = $('<table id="notifications" style="padding:5px;background:#ff9;margin:10px;width:600px;"/>');
    $(data).each(function(i, msg) {
        var td1 = $("<td>");
        td1.html("<b>" + msg.date + "</b> " + msg.text);

        var td2 = $("<td>");
        if(i == 0) {
            var close_button = $("<a href='#'><img src='" + site_url + "/images/del.gif'></a>")
            close_button.click(function(evt) {
                $(table).remove()
                $.ajax(site_url + '/?op=admin_settings&last_notify_time=' + max_date + '&token=' + token);
                return false;
            });
            td2.append(close_button);
        }

        var tr = $("<tr>");
        tr.append(td1);
        tr.append(td2);
        table.append(tr);
    });

    var center = $("<center>").append(table);
    $('#messages').append(center);
}

$(document).ready(function() {
   $.ajax({ url: 'https://sibsoft.net/xfilesharing_notifications.js?last_time=' + last_notify_time + '&version=' + xfs_version,
				dataType: 'jsonp',
				jsonpCallback: 'getUpdates',
				success: showNotifications,
          }
   )});
