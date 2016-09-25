<<<<<<< 838e14d68a99c93f4b00da40fcfbf2fbb60545cc
{
  const tau = 2 * Math.PI
  var svg = d3.select("#pieChart")
    .append("svg")
    .append("g")

  svg.append("g")
    .attr("class", "slices");
  svg.append("g")
    .attr("class", "labels");
  svg.append("g")
    .attr("class", "lines");
=======
const tau = 2 * Math.PI
var svg = d3.select("#pieChart")
	.append("svg")
	.append("g")

svg.append("g")
	.attr("class", "slices");
svg.append("g")
	.attr("class", "labels");
svg.append("g")
	.attr("class", "lines");

var width = 450,
  height = 450,
  radius = Math.min(width, height) / 2;

var pie = d3.layout.pie()
	.sort(null)
	.value(function(d) {
		return d.value;
	});

var arc = d3.svg.arc()
	.outerRadius(radius * 0.8)
	.innerRadius(radius * 0.7);

var outerArc = d3.svg.arc()
	.innerRadius(radius * 0.9)
	.outerRadius(radius * 0.9);

svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var key = function(d){ return d.data.label; };

var color = d3.scale.category20() .domain(["Lorem ipsum", "dolor sit", "amet", "consectetur", "adipisicing", "elit", "sed", "do", "eiusmod", "tempor", "incididunt"]);



function change(data) {
  apples = []
  oranges = []
  names = {}

  data.forEach((member) => {
        apples.push(1)
        oranges.push(member.value)
        if (!names[member.value]) {
          names[member.value] = []
        }
        names[member.value].push(member.label)
    })
  apples.push(2000)
  dataset = {
    apples,
    oranges
  };
>>>>>>> Redesign everything

  var width = 450,
    height = 450,
    radius = Math.min(width, height) / 2;

  var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) {
      return d.value;
    });

  var arc = d3.svg.arc()
    .outerRadius(radius * 0.8)
    .innerRadius(radius * 0.7);

  var outerArc = d3.svg.arc()
    .innerRadius(radius * 0.9)
    .outerRadius(radius * 0.9);

  svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

<<<<<<< 838e14d68a99c93f4b00da40fcfbf2fbb60545cc
  var key = function(d){ return d.data.label; };
=======
  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      names[d.value].push(names[d.value][0])
      return "<strong>" + names[d.value].shift() + "</strong> <span style='color:red'>" + d.value + "%</span>";
    })
>>>>>>> Redesign everything

  var color = d3.scale.category20() .domain(["Lorem ipsum", "dolor sit", "amet", "consectetur", "adipisicing", "elit", "sed", "do", "eiusmod", "tempor", "incididunt"]);

<<<<<<< 838e14d68a99c93f4b00da40fcfbf2fbb60545cc


  function change(data) {
    apples = []
    oranges = []
    names = {}

    data.forEach((member) => {
          apples.push(1)
          oranges.push(member.value)
          if (!names[member.value]) {
            names[member.value] = []
          }
          names[member.value].push(member.label)
      })
    apples.push(2000)
    dataset = {
      apples,
      oranges
=======
  var arc = d3.svg.arc()
    //.innerRadius(radius - 100)
    .innerRadius(radius - 60)
    .outerRadius(radius - 20)


  var path = svg.selectAll("path")
    .data(pie(dataset.apples))
    .enter().append("path")
    .attr("fill", function(d, i) { return color(i); })
    .attr("d", arc)
    .attr("class", "arc")
    .each(function(d) { this._current = d; }) // store the initial values
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)
  var timeout = setTimeout(change(), 20);

  function change() {
    clearTimeout(timeout);
    path = path.data(pie(dataset.oranges)); // update the data
    // set the start and end angles to Math.PI * 2 so we can transition
    // anticlockwise to the actual values later
    path.enter().append("path")
        .attr("fill", function (d, i) {
          return color(i);
        })
        .attr("d", arc(enterAntiClockwise))
        .each(function (d) {
          this._current = {
            data: d.data,
            value: d.value,
            startAngle: enterAntiClockwise.startAngle,
            endAngle: enterAntiClockwise.endAngle
          };
        }) // store the initial values

    path.exit()
        .transition()
        .duration(750)
        .attrTween('d', arcTweenOut)
        .remove() // now remove the exiting arcs

    path.transition().duration(750).attrTween("d", arcTween); // redraw the arcs
  }

  // Store the displayed angles in _current.
  // Then, interpolate from _current to the new angles.
  // During the transition, _current is updated in-place by d3.interpolate.
  function arcTween(a) {
    var i = d3.interpolate(this._current, a);
    this._current = i(0);
    return function(t) {
    return arc(i(t));
>>>>>>> Redesign everything
    };

    var width = 960,
      height = 450,
      radius = Math.min(width, height) / 2;

    var enterAntiClockwise = {
      startAngle: Math.PI * 2,
      endAngle: Math.PI * 2
    };

    var color = d3.scale.category20();

    var pie = d3.layout.pie()
      .sort(null);

    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        names[d.value].push(names[d.value][0])
        return "<strong>" + names[d.value].shift() + "</strong> <span style='color:red'>" + d.value + "</span>";

      })

  /* Invoke the tip in the context of your visualization */
  svg.call(tip)

    var arc = d3.svg.arc()
      .innerRadius(radius - 100)
      .outerRadius(radius - 20)


    var path = svg.selectAll("path")
      .data(pie(dataset.apples))
      .enter().append("path")
      .attr("fill", function(d, i) { return color(i); })
      .attr("d", arc)
      .attr("class", "arc")
      .each(function(d) { this._current = d; }) // store the initial values
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
    var timeout = setTimeout(change(), 20);

    function change() {
      clearTimeout(timeout);
      path = path.data(pie(dataset.oranges)); // update the data
      // set the start and end angles to Math.PI * 2 so we can transition
      // anticlockwise to the actual values later
      path.enter().append("path")
          .attr("fill", function (d, i) {
            return color(i);
          })
          .attr("d", arc(enterAntiClockwise))
          .each(function (d) {
            this._current = {
              data: d.data,
              value: d.value,
              startAngle: enterAntiClockwise.startAngle,
              endAngle: enterAntiClockwise.endAngle
            };
          }) // store the initial values

      path.exit()
          .transition()
          .duration(750)
          .attrTween('d', arcTweenOut)
          .remove() // now remove the exiting arcs

      path.transition().duration(750).attrTween("d", arcTween); // redraw the arcs
    }

    // Store the displayed angles in _current.
    // Then, interpolate from _current to the new angles.
    // During the transition, _current is updated in-place by d3.interpolate.
    function arcTween(a) {
      var i = d3.interpolate(this._current, a);
      this._current = i(0);
      return function(t) {
      return arc(i(t));
      };
    }
    // Interpolate exiting arcs start and end angles to Math.PI * 2
    // so that they 'exit' at the end of the data
    function arcTweenOut(a) {
      var i = d3.interpolate(this._current, {startAngle: Math.PI * 2, endAngle: Math.PI * 2, value: 0});
      this._current = i(0);
      return function (t) {
        return arc(i(t));
      };
    }
  };
}
