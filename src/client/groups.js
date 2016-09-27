$(document).ready(() => {
  getGroups()
})

var endpoint = '/groups'

function getGroups() {
  $.ajax({
    dataType: 'json',
    method: 'GET',
    url: endpoint,
    success: (groups) => {
      const html = groups.reduce((acc, group) => {
        return acc + `
          <div
            style="cursor: pointer"
            onClick="accessGroup(${group.id})"
          >${group.name}</div>`
      }, '')
      $('#content').append(html)
    },
  })
}

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
        $(location).attr('href', '/static/index.html')
      }
    }
  })
}
