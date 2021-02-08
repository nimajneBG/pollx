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
            this.createDescription()
        }
    }

    drawLineDiagramm() {
        let barChartParent = document.getElementById('bar-chart-container')

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

        barChartParent.appendChild(this.barChart)


    }

    createDescription() {
        this.descriptionParagraphs = document.getElementsByClassName('description-p')

        for (let i = 0; i < this.descriptionParagraphs.length; i++) {
            const percent = Math.round((this.data[i] / this.total * 100) * 10) / 10

            this.descriptionParagraphs[i].innerHTML += (String(percent) + '%')
        }
    }
}
