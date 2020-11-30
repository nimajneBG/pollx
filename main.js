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


let id = 'ckhjfchndw348732947'

poll = new Poll(id)

document.body.onload = () => {
    poll.fetchData()
}