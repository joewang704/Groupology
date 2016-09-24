const pos = require('pos')

exports.measureParticipants = function(messages, members) {
      messages.forEach((element) => {
        const currMember = members[members.findIndex((member) => {
          return member['user_id'] === element['sender_id']
        })]
        currMember.count = (currMember.count === undefined || currMember.count === null) ? 0 : currMember.count + 1 
      });
      // members.total = messages.length
      return members
}
