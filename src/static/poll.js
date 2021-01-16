class Poll {
    constructor() {
        this.spinnerContainer = document.getElementById('spinner-container')
        this.content = document.getElementById('content')
        this.msgContainer = document.getElementById('msg-container')
    }

    getId() {
        /* Gets the id from the URL */
        let path = window.location.pathname
        path = path.split('/')
        this.id = Number(path[2])
    }

    setSpinner(spinner = Boolean) {
        /* Displays the Spinner if `spinner` is true and displays if it's false */
        this.msgContainer.style.display = 'none'
        if (spinner) {
            this.spinnerContainer.style.display = 'block'
            this.content.style.display = 'none'
        } else {
            this.spinnerContainer.style.display = 'none'
            this.content.style.display = 'block'
        }
    }

    vote() {
        console.log(`Voted option: `)
    }

    showMsg(msg = String, closeable = Boolean, type = String) {
        let p = document.createElement('p')

        p.innerHTML = msg

        this.msgContainer.appendChild(p)
        this.msgContainer.style.display = 'flex'

        this.content.style.display, this.spinnerContainer.style.display = 'none'
        
        console.error(`Msg: ${msg}`)
    }

    async fetchData() {
        return await fetch(`../api/poll/${this.id}`)
            .then(resp => {
                if (!resp.ok) {
                    //console.log(`resp.json():`, resp)
                    throw new Error(resp.json())
                }

                return resp.json()
            })
            .then(data => {
                this.data = data

                return true
            })
            .catch(err => {
                console.log(`Hier:`, err)
                this.showMsg(err.error_message, false, 'err')

                return false
            })
    }

    setTitle() {
        document.title = `POLLX: ${this.data.title}`
        document.getElementById('poll-title').innerHTML = this.data.title
    }

    setDescription() {
        document.getElementById('poll-description').innerHTML = this.data.description
    }

    setQuestions() {
        let pollContainer = document.getElementsByClassName('poll')[0]

        for (let i = 0; i < this.data.answers.length; i++) {
            let option = document.createElement('div')
            option.classList.add('option')

            let input = document.createElement('input')
            input.setAttribute('type', 'radio')
            input.setAttribute('name', 'option')
            input.setAttribute('id', `option${i}`)

            let span = document.createElement('span')
            span.classList.add('checkmark')

            let label = document.createElement('label')
            label.setAttribute('for', `option${i}`)
            label.innerHTML = this.data.answers[i]

            option.appendChild(input)
            option.appendChild(span)
            option.appendChild(label)

            pollContainer.appendChild(option)
        }

        let button = document.createElement('button')
        button.classList.add('vote')
        button.id = 'vote'
        button.innerHTML = 'Vote!'

        button.onclick = () => {
            this.vote()
        }

        pollContainer.appendChild(button)
    }

    async displayPoll() {
        if (await this.fetchData()) {

            this.setTitle()
            this.setDescription()
            this.setQuestions()

            this.setSpinner(false)
        }
    }
}


class chart {
    constructor(data) {
        this.data = data
        this.el_bar = document.getElementById('bar-chart')
        this.el_pie = document.getElementById('pie-chart')
    }

    async drawLineDiagramm() {
        this.el_bar.appendChild('')
    }
}

const poll = new Poll()

document.body.onload = () => {
    poll.getId()
    poll.displayPoll()
}
