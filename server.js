/*
TODO:
1. Grab labels via API from OneBody
2. Copy over Checkin.LabelSet code from OneBody
3. Connect via CUPS to Dymo to print
*/

var Pusher = require('pusher-client');
var pusher = new Pusher(
    process.env.PUSHER_API_KEY,
    {
        secret: process.env.PUSHER_API_SECRET,
        channel_data: {
            user_id: process.env.PRINTER_ID,
            user_info: {
                name: 'checkin-printer-node'
            }
        }
    }
);

var prints = pusher.subscribe('private-prints-' + process.env.PRINTER_ID);

var presence = pusher.subscribe('presence-prints');

prints.bind('print', function(data) {
    console.log('print');
    console.log(data);
})

pusher.connection.bind('state_change', function(state) {
    console.log(state.current);
});
