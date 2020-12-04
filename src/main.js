class Poll {
    constructor(id) {
        this.id = id
    }

    async fetchData() {
        await fetch('./data.json')
        .then( resp => resp.json() )
        .then( data => this.data = data )

        console.log(this.data);
    }
}


class chart {
    constructor(data) {
        this.data = data
        this.el_bar = document.getElementById('bar-chart')
    }

    async drawLineDiagramm() {
        this.el_bar.appendChild('')
    }
}


let id = 'ckhjfchndw348732947'

poll = new Poll(id)

document.body.onload = () => {
    poll.fetchData()
}