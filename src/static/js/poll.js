const cookieRegex = /voted_polls=(.[^;]*)/ig
const commaRegex = /\%2C/g


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

    async afterVoting() {
        // Disabling Vote button
        let voteBtn = document.getElementById('vote-btn')
        voteBtn.classList.add('disabled')
        voteBtn.setAttribute('onclick', 'let toast = new Toast({"message": "You already voted on this poll!","ok": true,"cancel": false,"custom": false,"close": false,"decay": true,"time": 10});toast.create().then();')

        // Loading results
        await this.getResults()

        // Set voted class for the CSS
        document.getElementsByClassName('poll-and-result-container')[0].classList.add('voted')

        // Render diagram
        this.diagram = new Chart(this.results)
        this.diagram.create()
        let resultElement = document.getElementById('result')
        resultElement.style.display = 'block'

        console.log('Data in Chart class', this.diagram.data, 'Total in Chart class', this.diagram.total)
    }

    async getResults() {
        const url = `../../api/results/${id}`

        await fetch(url).then(res => res.json()).then(data => this.results = data).catch(err => console.error(err))
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
    displayRandomPolls()
    poll.checkVoted()
}
