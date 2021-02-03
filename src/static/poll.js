const cookieRegex = /voted_polls=(.[^;]*)/ig
const commaRegex = /\%2C/g


class Chart {
    constructor(data) {
        this.data = data
        this.el_bar = document.getElementById('bar-chart')
        this.el_pie = document.getElementById('pie-chart')
    }

    async drawLineDiagramm() {
        this.el_bar.appendChild('')
    }
}

class Poll {

    checkVoted() {
        // Check if there is a cookie voted_polls
        if ( document.cookie.match(cookieRegex) ) {
            // Parse cookie
            let [ voted_polls ] = cookieRegex.exec(document.cookie)
            voted_polls = JSON.parse(decodeURI(voted_polls.split('=')[1]).replace(commaRegex, ','))
            
            console.log('Voted polls:', voted_polls)

            // Check if current pollid is in voted_polls
            if (voted_polls.indexOf(id) != -1) 
                console.log('Already voted')
        }
    }

    findSelectedOption() {
        let options = document.getElementsByClassName('input-option')
        console.log(options)
        for ( let i = 0; i < options.length; i++ ) {
            if ( options[i].checked )
                return i
        }

        return false
    }

    vote() {
        const url = `../../api/vote/${id}`

        const selectedID = this.findSelectedOption()

        if (selectedID || selectedID === 0) {
            fetch(url, {
                method: 'POST',
                mode: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    option: selectedID
                })
            })
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(err => console.error(err))
        }
    }
}

let poll = new Poll

document.body.onload = () => {
    poll.checkVoted()
}
