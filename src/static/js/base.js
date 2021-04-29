async function displayRandomPolls () {
    const url = '/api/random'

    let data;

    await fetch(url).then(res => res.json()).then(json => data = json).catch(err => console.error(err))

    console.table(data)

    document.getElementById('preview-spinner-container').remove()

    let container = document.getElementById('polls-preview')

    for (let i = 0; i < data.length; i++) {
        let card = document.createElement('A')
        card.classList = 'poll-card'
        card.setAttribute('href', `/poll/${data[i].id}`)

        let title = document.createElement('P')
        title.classList = 'poll-card-title pollx'
        title.innerText = data[i].title
        card.appendChild(title)

        let description = document.createElement('P')
        description.classList = 'poll-card-description'
        description.innerText = data[i].description
        card.appendChild(description)

        container.appendChild(card)
    }
}
