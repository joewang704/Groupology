var endpoint = '/groups'

function accessGroup(groupId) {
  $.ajax({
    dataType: 'json',
    method: 'POST',
    data: JSON.stringify({
      groupId,
    }),
    contentType: 'application/json',
    url: endpoint,
    success: (res) => {
      if (res.auth) {
        $(location).attr('href', '/dataPage')
      }
    }
  })
}
