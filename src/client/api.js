$(document).ready(() => {
  getData()
})

function getData() {
  $.ajax({
    dataType: 'json',
    method: 'GET',
    url: 'http://localhost:8080/data',
    success: (data) => {
      console.log(data)
      const { lovers, participants, extremeTimePeople, density } = data
      let max = -1
      let maxParticipant
      participants.forEach((user) => {
        if (max < user.count) {
          maxParticipant = user
          max = user.count
        }
      })
      $('#container').prepend(`
        <div class="title flex-row" style="order: -2">
          Groupme Gay App.
        </div>
        <div class="flex-row" style="justify-content: space-around; width: 100%">
          <div>
            <div class="user center">
              LOVE BIRDS
            </div>
            <div class="flex-row">
              <div>
                <div class="icon-mask">
                  <img class="icon-resize" src="${lovers[0].img}"></img>
                </div>
                <div class="center">${lovers[0].name}</div>
              </div>
              <div class="heart" style="margin: 20px;">
                <i class="heart fa fa-heart" aria-hidden="true"></i>
              </div>
              <div>
                <div class="icon-mask">
                  <img class="icon-resize" src="${lovers[1].img}"></img>
                </div>
                <div class="center">${lovers[1].name}</div>
              </div>
            </div>
          </div>
        <div>
          <div class="user center">
            EARLY BIRD
          </div>
          <div class="icon-mask">
            <img class="icon-resize" src="${extremeTimePeople.earlyBird.img}"></img>
          </div>
          <div class="center">
            ${extremeTimePeople.earlyBird.name}
          </div>
        </div>
        <div>
          <div class="user center">
            NIGHT OWL
          </div>
          <div class="icon-mask">
            <img class="icon-resize" src="${extremeTimePeople.nightOwl.img}"></img>
          </div>
          <div class="center">
            ${extremeTimePeople.nightOwl.name}
          </div>
        </div>
      `)
      $('#firstRow').prepend(`
        <div class="flex-column">
          <div class="user">
            MOST TALKATIVE
          </div>
          <div class="icon-mask">
            <img class="icon-resize" src="${maxParticipant.image_url}"></img>
          </div>
          <div>
            ${maxParticipant.nickname}
          </div>
        </div>
      `)
      change(Object.keys(participants).reduce((acc, key) => {
        if (participants[key].count) {
          acc.push({
            label: participants[key].nickname,
            value: participants[key].count,
          })
        }
        return acc
      }, []))
    changeHist(density)
    },
  })
}

