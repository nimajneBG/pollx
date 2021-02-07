const cookieRegex = /voted_polls=(.[^;]*)/ig
const commaRegex = /\%2C/g

const xmlns = "http://www.w3.org/2000/svg"


class Chart {
    constructor(data) {
        this.data = data
        this.total = new Number
    }

    computeValues() {
        this.data.forEach(i => this.total += i)
    }

    create() {
        if (typeof this.data === 'object' && this.data.length > 0) {
            this.computeValues()

            this.drawLineDiagramm()
        }
    }

    drawLineDiagramm() {
        let parentBarChart = document.getElementsByClassName('charts')[0]

        this.barChart = document.createElementNS(xmlns, 'svg')
        this.barChart.id = 'bar-chart'
        this.barChart.classList.add('chart')
        console.log(this.barChart)

        // Generate viewBox
        const viewBox = [0, 0, ( 15 * this.data.length + 5 ), 110]
        this.barChart.setAttributeNS(null, 'viewBox', `${viewBox[0]} ${viewBox[1]} ${viewBox[2]} ${viewBox[3]}`)

        console.log('SVG viewBox', viewBox)

        // Generate background lines
        let linesG = document.createElementNS(xmlns, 'g')
        const linesYCoordinates = [5, 30, 55, 80, 105]

        for ( let i = 0; i <= 4; i++ ) {
            let line = document.createElementNS(xmlns, 'path')
            const xRight = viewBox[2] - 2
            line.setAttributeNS(null, 'd', `M 2 ${linesYCoordinates[i]} L ${xRight} ${linesYCoordinates[i]}`)
            line.setAttributeNS(null, 'stroke-width', '0.1')
            line.setAttributeNS(null, 'stroke', '#000')
            linesG.appendChild(line)
        }

        this.barChart.appendChild(linesG)

        // Generate Bars
        let barsG = document.createElementNS(xmlns, 'g')

        for ( let i = 0; i < this.data.length; i++ ) {
            const percent = this.data[i] / this.total * 100

            console.log(i, percent)

            let bar = document.createElementNS(xmlns, 'rect')
            bar.classList.add('bar', `color${i}`)
            bar.setAttributeNS(null, 'width', '10')
            bar.setAttributeNS(null, 'x', String(5 + 15 * i))
            bar.setAttributeNS(null, 'y', String(105 - percent))
            bar.setAttributeNS(null, 'height', String(percent))

            barsG.appendChild(bar)
        }

        this.barChart.appendChild(barsG)

        parentBarChart.appendChild(this.barChart)


    }

    createDescription() {

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

    async afterVoting() {
        // Disabling Vote button
        let voteBtn = document.getElementById('vote-btn')
        voteBtn.classList.add('disabled')
        voteBtn.setAttribute('onclick', 'let toast = new Toast({"message": "You already voted on this poll!","ok": true,"cancel": false,"custom": false,"close": false,"decay": true,"time": 10});toast.create().then();')

        // Loading results
        await this.getResults()

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
    poll.checkVoted()
}
