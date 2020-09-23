// // @ts-check

function setupExplore(csv) {
  // elements
  let container = window.document.getElementById('explore-container');
  let svgElement = document.getElementById('explore-svg');
  var svg = d3.select('#explore-svg');

  function calculateBy(key) {
    var data = {};
    csv.forEach(crash => {
      let row = data[key(crash)] || {
        metric: key(crash),
        all: 0
      };

      data[key(crash)] = {
        metric: key(crash),
        all: row.all + crash.fatal + crash.serious
      };
    });
    return data;
  }

  function drawForMetric(metric, label) {
    svgElement.innerHTML = '';
    svg = d3.select('#explore-svg');

    let data = calculateBy(crash => {
      return crash[metric];
    });

    let allInjuriesExtent = d3.extent(Object.values(data), function(row) {
      return row.all;
    });

    //axis setup
    var xScale = d3
      .scaleBand()
      .domain(Object.keys(data))
      .rangeRound([0, size.inset.width])
      .paddingInner(0.3)
      .padding(0.3);

    var yScale = d3
      .scaleLinear()
      .domain([0, allInjuriesExtent[1]])
      .range([size.inset.height, 0]);

    svg
      .append('text')
      .attr('class', 'label')
      .attr(
        'transform',
        `translate(10,${size.container.height / 2 + 20}) rotate(-90)`
      )
      .text('Injuries')
      .attr('style', 'font-size: 12px');

    svg
      .append('g')
      .attr('class', 'y axis')
      .attr('transform', `translate(${padding},${padding})`)
      .call(d3.axisLeft(yScale));

    svg
      .append('text')
      .attr('class', 'label')
      .attr(
        'transform',
        `translate(${size.container.width / 2 - 50},${size.container.height -
          10})`
      )
      .text(label)
      .attr('style', 'font-size: 12px');

    svg
      .append('g')
      .attr('class', 'x axis')
      .attr(
        'transform',
        `translate(${padding},${size.container.width - padding})`
      )
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-10px')
      .attr('dy', '0')
      .attr('transform', 'rotate(-45)');

    var groups = svg
      .selectAll('explore-data')
      .data(Object.values(data))
      .enter()
      .append('g');

    groups
      .append('rect')
      .attr('x', s => xScale(s.metric))
      .attr('y', s => yScale(s.all))
      .attr('height', s => yScale(0) - yScale(s.all))
      .attr('width', xScale.bandwidth())
      .attr('fill', s => 'orange')
      .attr('transform', `translate(${padding},${padding})`);
  }

  let weatherButton = document.getElementById('weatherExplore');
  let makeButton = document.getElementById('makeExplore');
  let modelButton = document.getElementById('modelExplore');
  let phaseButton = document.getElementById('phaseExplore');

  function byModel() {
    drawForMetric('plane_model', 'Plane Model');
  }

  weatherButton.onclick = () => {
    drawForMetric('weather', 'Weather Condition');
  };

  makeButton.onclick = () => {
    drawForMetric('plane_make', 'Plane Make');
  };

  modelButton.onclick = () => {
    byModel();
  };

  phaseButton.onclick = () => {
    drawForMetric('flight_phase', 'Phase of Flight');
  };

  //svg width and height
  svg.attr('width', size.container.width).attr('height', size.container.height);

  byModel();

  return {
    hide: () => {
      container.style.opacity = 0;
    },
    show: () => {
      container.style.opacity = 1;
    }
  };
}
