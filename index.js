let movieDataUrl = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json"

let movieData

let canvas = d3.select("#canvas")
    .attr("width", 1000)
    .attr("height", 600)
let tooltip = d3.select("#tooltip")

let drawTreeMap = () => {
    let hierarchy = d3.hierarchy(movieData, (node) => {
        return node['children']
    }).sum((node) => {
        return node['value']
    }).sort((node1, node2) => {
        return node2['value'] - node1['value']
    })

    let createTreeMap = d3.treemap()
        .size([1000, 600])

    createTreeMap(hierarchy)

    let movieTiles = hierarchy.leaves()

    let block = canvas.selectAll("g")
        .data(movieTiles)
        .enter()
        .append("g")
        .attr("transform",
            (movie) => {
                return "translate(" + movie['x0'] + "," + movie['y0'] + ")"
            }
        )

    block.append("rect")
        .attr("class", "tile")
        .attr("fill", (movie) => {
            let category = movie["data"]["category"]
            if (category === "Action") {
                return '#FF5733'
            } else if (category === "Drama") {
                return '#33FFBD'
            } else if (category === "Adventure") {
                return '#FFC300'
            } else if (category === "Family") {
                return '#75A3FF'
            } else if (category === "Animation") {
                return '#FF75D1'
            } else if (category === "Comedy") {
                return '#FF9F33'
            } else if (category === "Biography") {
                return '#9370DB'
            }
        })
        .attr("data-name", (movie) => {
            return movie["data"]["name"]
        }).attr("data-category", (movie) => {
            return movie["data"]["category"]
        })
        .attr("data-value", (movie) => {
            return movie["data"]["value"]
        })
        .attr("width", (movie) => {
            return movie['x1'] - movie['x0']
        })
        .attr("height", (movie) => {
            return movie['y1'] - movie['y0']
        })
        .on("mouseover", (event, movie) => {
            tooltip.transition()
                .style("display", "block")

            let revenue = movie['data']['value'].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

            tooltip.html(
                '$ ' + revenue + '<hr />' + movie['data']['name']
            )

            tooltip.attr("data-value", movie['data']['value'])
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY + 10) + "px")
        })
        .on("mouseout", (movie) => {
            tooltip.transition()
                .style("display", "none")
        })

    block.append('text')
        .text((movie) => {
            return movie['data']['name']
        })
        .attr("x", 5)
        .attr("y", 20)
}

const legendData = [
    { category: "Action", color: "#FF5733" },
    { category: "Drama", color: "#33FFBD" },
    { category: "Adventure", color: "#FFC300" },
    { category: "Family", color: "#75A3FF" },
    { category: "Animation", color: "#FF75D1" },
    { category: "Comedy", color: "#FF9F33" },
    { category: "Biography", color: "#9370DB" }
]

const legend = d3.select("#legend")
    .attr("width", 1000)
    .attr("height", 60)

legend.selectAll("g")
    .data(legendData)
    .enter()
    .append("g")
    .attr("transform", (d, i) => `translate(${i * 140}, 0)`)

legend.selectAll("g")
    .each(function (d) {
        d3.select(this).append("rect")
            .attr("class", "legend-item") // Ensure class="legend-item"
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 20)
            .attr("height", 20)
            .attr("fill", d.color)

        d3.select(this).append("text")
            .attr("x", 30)
            .attr("y", 15)
            .text(d.category)
    })

d3.json(movieDataUrl).then(
    (data, error) => {
        if (error) {
            console.log(error)
        } else {
            movieData = data
            drawTreeMap()
        }
    }
)