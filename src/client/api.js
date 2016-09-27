$(document).ready(() => {
  getData()
})

//var url = 'http://localhost:8069/data'
//var url = 'https://8aeddd2c.ngrok.io/data'
var url = 'https://groupology.herokuapp.com/data'

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
    xhrFields: {
      withCredentials:true
    },
    //url: 'http://localhost:8080/data',
    //url: 'https://8aeddd2c.ngrok.io/data',
    url,
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
      /*
        <div class="title flex-row" style="order: -2">
          Groupmeme
        </div>
        */
      $('#container').prepend(`
      `)
      $('#firstRow').prepend(`
        <div class="flex-column" style="justify-content: center; width: 30%">
          <div class="icon-row">
            <div class="space-top">
              <div class="user center">
                MOST TALKATIVE
              </div>
              <div class="icon-mask">
                <img class="icon-resize" src="${maxParticipant.image_url || 'http://style.anu.edu.au/_anu/4/images/placeholders/person.png'}"></img>
              </div>
              <div class="center">
                ${maxParticipant.nickname}
              </div>
            </div>
          <div class="space-top">
            <div class="user center">
              MOST POPULAR
            </div>
            <div class="icon-mask">
              <img class="icon-resize" src="${popularPeople.popular.img || 'http://style.anu.edu.au/_anu/4/images/placeholders/person.png'}"></img>
            </div>
            <div class="center">
              ${popularPeople.popular.name}
            </div>
          </div>
          </div>
          <div class="space-top">
            <div class="user center">
              SECRETLY DATING
            </div>
            <div class="flex-row">
              <div>
                <div class="icon-mask">
                  <img src="${lovers[0].img || 'http://style.anu.edu.au/_anu/4/images/placeholders/person.png'}"></img>
                </div>
                <div class="center">${lovers[0].name}</div>
              </div>
              <div class="heart" style="margin: 20px;">
                <i class="heart fa fa-heart" aria-hidden="true"></i>
              </div>
              <div>
                <div class="icon-mask">
                  <img src="${lovers[1].img || 'http://style.anu.edu.au/_anu/4/images/placeholders/person.png'}"></img>
                </div>
                <div class="center">${lovers[1].name}</div>
              </div>
            </div>
          </div>
          <div class="icon-row">
            <div class="space-top">
              <div class="user center">
                MOST LIKED
              </div>
              <div class="icon-mask">
                <img class="icon-resize" src="${popularPeople.liked.img || 'http://style.anu.edu.au/_anu/4/images/placeholders/person.png'}"></img>
              </div>
              <div class="center">
                ${popularPeople.liked.name}
              </div>
            </div>
            <div class="space-top">
              <div class="user center">
                MOST BULLIED
              </div>
              <div class="icon-mask">
                <img class="icon-resize" src="${popularPeople.hated.img || 'http://style.anu.edu.au/_anu/4/images/placeholders/person.png'}"></img>
              </div>
              <div class="center">
                ${popularPeople.hated.name}
              </div>
            </div>
          </div>
        <div class="icon-row">
          <div class="space-top">
            <div class="user center">
              HAPPIEST
            </div>
            <div class="icon-mask">
              <img class="icon-resize" src="${popularPeople.happy.img || 'http://style.anu.edu.au/_anu/4/images/placeholders/person.png'}"></img>
            </div>
            <div class="center">
              ${popularPeople.happy.name}
            </div>
          </div>
          <div class="space-top">
            <div class="user center">
              SADDEST
            </div>
            <div class="icon-mask">
              <img class="icon-resize" src="${popularPeople.sad.img || 'http://style.anu.edu.au/_anu/4/images/placeholders/person.png'}"></img>
            </div>
            <div class="center">
              ${popularPeople.sad.name}
            </div>
          </div>
        </div>
        <div class="icon-row">
        <div class="space-top">
          <div class="user center">
            EARLY BIRD
          </div>
          <div class="icon-mask">
            <img class="icon-resize" src="${extremeTimePeople.earlyBird.img || 'http://style.anu.edu.au/_anu/4/images/placeholders/person.png'}"></img>
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
            <img class="icon-resize" src="${extremeTimePeople.nightOwl.img || 'http://style.anu.edu.au/_anu/4/images/placeholders/person.png'}"></img>
          </div>
          <div class="center">
            ${extremeTimePeople.nightOwl.name || 'None'}
          </div>
        </div>
        </div>
        </div>
      `)
      change(Object.keys(participants).reduce((acc, key) => {
        if (participants[key].count) {
          acc.push({
            label: participants[key].nickname,
            value: participants[key].count / density.length * 100.0,
          })
        }
        return acc
      }, []))
      changeHist(density)
      setTimeout(modifyImages, 200)
    },
  })
}
