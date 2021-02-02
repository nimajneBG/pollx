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

        if (selectedID) {
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
