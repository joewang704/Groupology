$(document).ready(() => {
  getGroups()
})

function getGroups() {
  $.ajax({
    dataType: 'json',
    method: 'GET',
    //url: 'http://localhost:8080/data',
    url: 'https://8aeddd2c.ngrok.io/groups',
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
    //url: 'http://localhost:8080/data',
    url: 'https://8aeddd2c.ngrok.io/groups',
    success: (res) => {
      if (res.auth) {
        $(location).attr('href', '/static/index.html')
      }
    }
  })
}
