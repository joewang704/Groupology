$(document).ready(() => {
  getGroups()
})

//var url = 'http://localhost:8069/groups'
//var url = 'https://8aeddd2c.ngrok.io/groups'
var url = 'https://groupology.herokuapp.com/groups'

function getGroups() {
  $.ajax({
    dataType: 'json',
    method: 'GET',
    url,
    //url: 'https://8aeddd2c.ngrok.io/groups',
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
    url,
    //url: 'https://8aeddd2c.ngrok.io/groups',
    success: (res) => {
      if (res.auth) {
        $(location).attr('href', '/static/index.html')
      }
    }
  })
}
