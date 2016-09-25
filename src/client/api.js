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
      $('#container').prepend(`
        <div>
          <div class="title flex-row">
            Groupme Gay App.
          </div>
          <div class="flex-row">
            <div>
              <div>${lovers[0].name}</div>
              <div class="icon-mask">
                <img class="icon-resize" src="${lovers[0].img}"></img>
              </div>
            </div>
            <div class="heart">
              <i class="heart fa fa-heart" aria-hidden="true"></i>
            </div>
            <div>
              <div>${lovers[1].name}</div>
              <div class="icon-mask">
                <img class="icon-resize" src="${lovers[1].img}"></img>
              </div>
            </div>
          </div>
          <div class="flex-row">
            <div>
              Early Bird:
              ${extremeTimePeople.earlyBird.name}
            </div>
            <div>
              Night Owl:
              ${extremeTimePeople.nightOwl.name}
            </div>
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

