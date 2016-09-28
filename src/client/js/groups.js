var endpoint = '/groups'

function accessGroup(groupId) {
  $.ajax({
    dataType: 'json',
    method: 'POST',
    data: JSON.stringify({
      groupId: groupId,
    }),
    contentType: 'application/json',
    url: endpoint,
    success: function(res) {
      if (res.auth) {
        $(location).attr('href', '/dataPage')
      }
    }
  })
}
