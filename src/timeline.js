// @ts-check

function setupTimeline(csv) {
  // references
  let container = window.document.getElementById('timeline');
  let timelineSvg = d3.select('#timeline');
  var div = d3
    .select('body')
    .append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);

  //svg width and height
  timelineSvg
    .attr('width', size.container.width)
    .attr('height', size.container.height);

  function yearForCrash(crash) {
    return new Date(crash.date).getFullYear();
  }

  var yearData = {};
  function calculateBy() {
    csv.forEach(crash => {
      let year = yearForCrash(crash);
      let row = yearData[year] || {
        year: year,
        all: {
          all: 0,
          uninjured: 0,
          fatal: 0,
          serious: 0
        },
        bombardier: {
          all: 0,
          uninjured: 0,
          fatal: 0,
          serious: 0
        },
        boeing: {
          all: 0,
          uninjured: 0,
          fatal: 0,
          serious: 0
        },
        mcdonnell_douglas: {
          all: 0,
          uninjured: 0,
          fatal: 0,
          serious: 0
        },
        embraer: {
          all: 0,
          uninjured: 0,
          fatal: 0,
          serious: 0
        },
        airbus: {
          all: 0,
          uninjured: 0,
          fatal: 0,
          serious: 0
        }
      };

      yearData[year] = {
        year: year,
        all: {
          all: row.all.all + (crash.fatal + crash.serious),
          uninjured: row.all.uninjured + crash.uninjured,
          fatal: row.all.fatal + crash.fatal,
          serious: row.all.serious + crash.serious
        },
        bombardier:
          crash.plane_make == 'Bombardier'
            ? {
                all: row.bombardier.all + (crash.fatal + crash.serious),
                uninjured: row.bombardier.uninjured + crash.uninjured,
                fatal: row.bombardier.fatal + crash.fatal,
                serious: row.bombardier.serious + crash.serious
              }
            : row.bombardier,
        boeing:
          crash.plane_make == 'Boeing'
            ? {
                all: row.boeing.all + (crash.fatal + crash.serious),
                uninjured: row.boeing.uninjured + crash.uninjured,
                fatal: row.boeing.fatal + crash.fatal,
                serious: row.boeing.serious + crash.serious
              }
            : row.boeing,
        mcdonnell_douglas:
          crash.plane_make == 'McDonnell Douglas'
            ? {
                all: row.mcdonnell_douglas.all + (crash.fatal + crash.serious),
                uninjured: row.mcdonnell_douglas.uninjured + crash.uninjured,
                fatal: row.mcdonnell_douglas.fatal + crash.fatal,
                serious: row.mcdonnell_douglas.serious + crash.serious
              }
            : row.mcdonnell_douglas,
        embraer:
          crash.plane_make == 'Embraer'
            ? {
                all: row.embraer.all + (crash.fatal + crash.serious),
                uninjured: row.embraer.uninjured + crash.uninjured,
                fatal: row.embraer.fatal + crash.fatal,
                serious: row.embraer.serious + crash.serious
              }
            : row.embraer,
        airbus:
          crash.plane_make == 'Airbus'
            ? {
                all: row.airbus.all + (crash.fatal + crash.serious),
                uninjured: row.airbus.uninjured + crash.uninjured,
                fatal: row.airbus.fatal + crash.fatal,
                serious: row.airbus.serious + crash.serious
              }
            : row.airbus
      };
    });
  }

  calculateBy();

  var injuriesExtent = d3.extent(Object.values(yearData), function(row) {
    return row.all.all;
  });

  //axis setup
  var xScale = d3
    .scaleBand()
    .domain(Object.keys(yearData))
    .rangeRound([0, size.inset.width])
    .paddingInner(0.3)
    .padding(0.3);

  var yScale = d3
    .scaleLinear()
    .domain([0, injuriesExtent[1]])
    .range([size.inset.height, 0]);

  timelineSvg
    .append('text')
    .attr('class', 'label')
    .attr(
      'transform',
      `translate(10,${size.container.height / 2 + 20}) rotate(-90)`
    )
    .text('Injuries')
    .attr('style', 'font-size: 12px');

  timelineSvg
    .append('g')
    .attr('class', 'y axis')
    .attr('transform', `translate(${padding},${padding})`)
    .call(d3.axisLeft(yScale));

  timelineSvg
    .append('text')
    .attr('class', 'label')
    .attr(
      'transform',
      `translate(${size.container.width / 2 - 50},${size.container.height})`
    )
    .text('Year')
    .attr('style', 'font-size: 12px');

  timelineSvg
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
    .attr('transform', 'rotate(-65)');

  var groups = timelineSvg
    .selectAll('year_rects')
    .data(Object.values(yearData))
    .enter()
    .append('g');

  var byYear = groups.append('rect');

  byYear
    .on('mouseover', function(s) {
      var injuryData;

      if (filterByBoeing) {
        injuryData = s.boeing;
        d3.select(this).attr('fill', colors.boeingHighlight);
      } else if (filterByBombardier) {
        injuryData = s.bombardier;
        d3.select(this).attr('fill', colors.bombardierHighlight);
      } else if (filterByAirbus) {
        injuryData = s.airbus;
        d3.select(this).attr('fill', colors.airbusHighlight);
      } else if (filterByEmbraer) {
        injuryData = s.embraer;
        d3.select(this).attr('fill', colors.ermbraerHighlight);
      } else if (filterByMcdonnell) {
        injuryData = s.mcdonnell_douglas;
        d3.select(this).attr('fill', colors.mcdonnellHighlight);
      } else if (filterAll) {
        injuryData = s.all;
        d3.select(this).attr('fill', colors.allHighlight);
      }

      div
        .transition()
        .duration(200)
        .style('opacity', 0.9);
      div
        .html(
          `<strong>All Injuries:</strong> ${injuryData.all}<br/><strong>Serious Injuries:</strong> ${injuryData.serious}<br/><strong>Fatal Injuries:</strong> ${injuryData.fatal}<br/><br/><strong>Uninjured:</strong> ${injuryData.uninjured}`
        )
        .style('left', d3.event.pageX + 'px')
        .style('top', d3.event.pageY - 28 + 'px');
    })
    .on('mousemove', function() {
      div
        .style('top', d3.event.pageY - 10 + 'px')
        .style('left', d3.event.pageX + 10 + 'px');
    })
    .on('mouseout', function(s) {
      if (filterByBoeing) {
        d3.select(this).attr('fill', colors.boeingMain);
      } else if (filterByBombardier) {
        d3.select(this).attr('fill', colors.bombardierMain);
      } else if (filterByAirbus) {
        d3.select(this).attr('fill', colors.airbusMain);
      } else if (filterByEmbraer) {
        d3.select(this).attr('fill', colors.embraerMain);
      } else if (filterByMcdonnell) {
        d3.select(this).attr('fill', colors.mcdonnellMain);
      } else if (filterAll) {
        d3.select(this).attr('fill', colors.allMain);
      }

      div
        .transition()
        .duration(500)
        .style('opacity', 0);
    });

  //////////////////////////////////////////////////////////////////////////////
  var colors = {
    boeingMain: '#8d9db6',
    boeingHighlight: '#bccad6',
    bombardierMain: '#ffcc5c',
    bombardierHighlight: '#ffeead',
    mcdonnellMain: '#ff7b25',
    mcdonnellHighlight: '#f2ae72',
    airbusMain: '#034f84',
    airbusHighlight: '#87bdd8',
    embraerMain: '#034f84',
    ermbraerHighlight: '#92a8d1',
    allMain: '#c94c4c',
    allHighlight: '#eea29a'
  };

  function all() {
    filterByBoeing = false;
    filterByBombardier = false;
    filterByAirbus = false;
    filterByEmbraer = false;
    filterByMcdonnell = false;
    filterAll = true;

    byYear
      .transition()
      .duration(600)
      .ease(d3.easeLinear)
      .attr('x', s => xScale(s.year))
      .attr('y', s => yScale(s.all.all))
      .attr('height', s => yScale(0) - yScale(s.all.all))
      .attr('width', xScale.bandwidth())
      .attr('fill', s => colors.allMain)
      .attr('transform', `translate(${padding},${padding})`);
  }

  function boeingAll() {
    filterByBoeing = true;
    filterByBombardier = false;
    filterByAirbus = false;
    filterByEmbraer = false;
    filterByMcdonnell = false;
    filterAll = false;

    byYear
      .transition()
      .duration(600)
      .ease(d3.easeLinear)
      .attr('x', s => xScale(s.year))
      .attr('y', s => yScale(s.boeing.all))
      .attr('height', s => yScale(0) - yScale(s.boeing.all))
      .attr('width', xScale.bandwidth())
      .attr('fill', s => colors.boeingMain)
      .attr('transform', `translate(${padding},${padding})`);
  }

  function bombardierAll() {
    filterByBoeing = false;
    filterByBombardier = true;
    filterByAirbus = false;
    filterByEmbraer = false;
    filterByMcdonnell = false;
    filterAll = false;

    byYear
      .transition()
      .duration(600)
      .ease(d3.easeLinear)
      .attr('x', s => xScale(s.year))
      .attr('y', s => yScale(s.bombardier.all))
      .attr('height', s => yScale(0) - yScale(s.bombardier.all))
      .attr('width', xScale.bandwidth())
      .attr('fill', s => colors.bombardierMain)
      .attr('transform', `translate(${padding},${padding})`);
  }

  function airbusAll() {
    filterByBoeing = false;
    filterByBombardier = false;
    filterByAirbus = true;
    filterByEmbraer = false;
    filterByMcdonnell = false;
    filterAll = false;

    byYear
      .transition()
      .duration(600)
      .ease(d3.easeLinear)
      .attr('x', s => xScale(s.year))
      .attr('y', s => yScale(s.airbus.all))
      .attr('height', s => yScale(0) - yScale(s.airbus.all))
      .attr('width', xScale.bandwidth())
      .attr('fill', s => colors.airbusMain)
      .attr('transform', `translate(${padding},${padding})`);
  }

  function mcdonnellAll() {
    filterByBoeing = false;
    filterByBombardier = false;
    filterByAirbus = false;
    filterByEmbraer = false;
    filterByMcdonnell = true;
    filterAll = false;

    byYear
      .transition()
      .duration(600)
      .ease(d3.easeLinear)
      .attr('x', s => xScale(s.year))
      .attr('y', s => yScale(s.mcdonnell_douglas.all))
      .attr('height', s => yScale(0) - yScale(s.mcdonnell_douglas.all))
      .attr('width', xScale.bandwidth())
      .attr('fill', s => colors.mcdonnellMain)
      .attr('transform', `translate(${padding},${padding})`);
  }

  function embraerAll() {
    filterByBoeing = false;
    filterByBombardier = false;
    filterByAirbus = false;
    filterByEmbraer = true;
    filterByMcdonnell = false;
    filterAll = false;

    byYear
      .transition()
      .duration(600)
      .ease(d3.easeLinear)
      .attr('x', s => xScale(s.year))
      .attr('y', s => yScale(s.embraer.all))
      .attr('height', s => yScale(0) - yScale(s.embraer.all))
      .attr('width', xScale.bandwidth())
      .attr('fill', s => colors.embraerMain)
      .attr('transform', `translate(${padding},${padding})`);
  }

  function setup() {
    // setting up where the rects will go
    byYear
      .transition()
      .duration(600)
      .ease(d3.easeLinear)
      .attr('x', s => xScale(s.year))
      .attr('y', s => 400)
      .attr('height', s => 0)
      .attr('width', xScale.bandwidth())
      .attr('fill', s => 'orange')
      .attr('transform', `translate(${padding},${padding})`);
  }

  all();

  return {
    hide: () => {
      container.style.opacity = 0;
    },
    show: () => {
      setup();
      container.style.opacity = 1;
    },
    all: all,
    boeingAll: boeingAll,
    bombardierAll: bombardierAll,
    airbusAll: airbusAll,
    mcdonnellAll: mcdonnellAll,
    embraerAll: embraerAll
  };
}
