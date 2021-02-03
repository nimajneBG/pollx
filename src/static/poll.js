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
        if (document.cookie.match(cookieRegex)) {
            // Parse cookie
            let [voted_polls] = cookieRegex.exec(document.cookie)
            voted_polls = JSON.parse(decodeURI(voted_polls.split('=')[1]).replace(commaRegex, ','))

            console.log('Voted polls:', voted_polls)

            // Check if current pollid is in voted_polls
            if (voted_polls.indexOf(id) != -1)
                this.afterVoting()
        }
    }

    findSelectedOption() {
        let options = document.getElementsByClassName('input-option')
        console.log(options)
        for (let i = 0; i < options.length; i++) {
            if (options[i].checked)
                return i
        }

        return false
    }

    afterVoting() {
        // Disabling Vote button
        let voteBtn = document.getElementById('vote-btn')
        voteBtn.classList.add('disabled')
        voteBtn.setAttribute('onclick', 'let toast = new Toast({"message": "You already voted on this poll!","ok": true,"cancel": false,"custom": false,"close": false,"decay": true,"time": 10});toast.create().then();')

        // Loading results
        this.getResults()

        console.log(this.results)

        // Render diagram
        const test = this.results
        this.diagram = new Chart(test)
        this.diagram.create()

        console.log(this.diagram.total)
    }

    getResults() {
        const url = `../../api/results/${id}`

        fetch(url).then(res => res.json()).then(data => this.results = data).catch(err => console.error(err))
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
                .then(data => {
                    if (data.msg) {
                        let toast = new Toast({
                            "message": data.msg,
                            "ok": true,
                            "cancel": false,
                            "custom": false,
                            "close": false,
                            "decay": true,
                            "time": 10
                        })

                        toast.create().then()
                    }
                })
                .catch(err => console.error(err))
        }
    }
}

let poll = new Poll

document.body.onload = () => {
    poll.checkVoted()
}
