class Poll {
    constructor() {
        this.spinnerContainer = document.getElementById('spinner-container')
        this.content = document.getElementById('content')
    }

    getId() {
        /* Gets the id from the URL */
        let path = window.location.pathname
        path = path.split('/')
        this.id = Number(path[2])
    }

    setSpinner(spinner = Boolean) {
        /* Displays the Spinner if `spinner` is true and displays if it's false */
        if (spinner) {
            this.spinnerContainer.style.display = 'block'
            this.content.style.display = 'none'
        } else {
            this.spinnerContainer.style.display = 'none'
            this.content.style.display = 'block'
        }
    }

    async fetchData() {
        await fetch(`../api/poll/${this.id}`)
        .then( resp => resp.json() )
        .then( data => this.data = data )

        this.setSpinner(false)

        console.log(this.data);
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
    poll.fetchData()
}
