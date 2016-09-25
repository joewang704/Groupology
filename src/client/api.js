$(document).ready(() => {
  getData()
})

function modifyImages() {
  $('img').each(function(){
    const img = $(this)
    if (img.get(0).naturalWidth > img.get(0).naturalHeight) {
      img.attr('class', 'icon-resize-wide')
    } else {
      img.attr('class', 'icon-resize-tall')
    }
  })
}

function getData() {
  $.ajax({
    dataType: 'json',
    method: 'GET',
    //url: 'http://localhost:8080/data',
    url: 'https://8aeddd2c.ngrok.io/data',
    success: (data) => {
      console.log(data)
      const { lovers, participants, extremeTimePeople, popularPeople, density } = data
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
          Groupmeme.
        </div>
        <div class="flex-row" style="justify-content: space-around; width: 100%">
          <div class="space-top">
            <div class="user center">
              LOVE BIRDS
            </div>
            <div class="flex-row">
              <div>
                <div class="icon-mask">
                  <img src="${lovers[0].img}"></img>
                </div>
                <div class="center">${lovers[0].name}</div>
              </div>
              <div class="heart" style="margin: 20px;">
                <i class="heart fa fa-heart" aria-hidden="true"></i>
              </div>
              <div>
                <div class="icon-mask">
                  <img src="${lovers[1].img}"></img>
                </div>
                <div class="center">${lovers[1].name}</div>
              </div>
            </div>
          </div>
        <div class="space-top">
          <div class="user center">
            EARLY BIRD
          </div>
          <div class="icon-mask">
            <img class="icon-resize" src="${extremeTimePeople.earlyBird.img}"></img>
          </div>
          <div class="center">
            ${extremeTimePeople.earlyBird.name || 'None'}
          </div>
        </div>
        <div class="space-top">
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
        </div>
        <div class="flex-row" style="justify-content: space-around; width: 100%">
          <div class="space-top">
            <div class="user center">
              MOST POPULAR
            </div>
            <div class="icon-mask">
              <img class="icon-resize" src="${popularPeople.popular.img}"></img>
            </div>
            <div class="center">
              ${popularPeople.popular.name}
            </div>
          </div>
          <div class="space-top">
            <div class="user center">
              MOST LIKED
            </div>
            <div class="icon-mask">
              <img class="icon-resize" src="${popularPeople.liked.img}"></img>
            </div>
            <div class="center">
              ${popularPeople.liked.name}
            </div>
          </div>
          <div class="space-top">
            <div class="user center">
              MOST NOTORIOUS
            </div>
            <div class="icon-mask">
              <img class="icon-resize" src="${popularPeople.hated.img}"></img>
            </div>
            <div class="center">
              ${popularPeople.hated.name}
            </div>
          </div>
          <div class="space-top">
            <div class="user center">
              HAPPIEST PERSON
            </div>
            <div class="icon-mask">
              <img class="icon-resize" src="${popularPeople.happy.img}"></img>
            </div>
            <div class="center">
              ${popularPeople.happy.name}
            </div>
          </div>
          <div class="space-top">
            <div class="user center">
              SADDEST PERSON
            </div>
            <div class="icon-mask">
              <img class="icon-resize" src="${popularPeople.sad.img}"></img>
            </div>
            <div class="center">
              ${popularPeople.sad.name}
            </div>
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
      modifyImages()
    },
  })
}
