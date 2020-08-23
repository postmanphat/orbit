var canvas = document.getElementById("html-canvas");
var planets = [];
var radius = 5;
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
var context = canvas.getContext("2d");
setup()

function drawPlanet(x, y, radius, border, border_colour, fill_colour) {
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI);
    context.strokeStyle = border_colour;
    context.fillStyle = fill_colour;
    context.lineWidth = border;
    context.closePath();
    context.fill();
    context.stroke();
}

function drawTrail(trail) {
    console.log("Drawtrail called! Trail length: " + trail.length);
    for (i = 0; i < trail.length-1; i++) {
        context.beginPath()
        context.strokeStyle = 'rgba(255, 255, 255, ' + (1-(i/100)) + ')';
        context.moveTo(trail[i][0], trail[i][1]);
        context.lineTo(trail[i+1][0], trail[i+1][1]);
        context.lineWidth = 4;
        context.stroke();
    }
}


function getDelta(planet1, planet2) {
    return [planet1.x-planet2.x, planet1.y-planet2.y];
}

function getDistance(planet1, planet2) {
    var deltaX = getDelta(planet1, planet2)[0];
    var deltaY = getDelta(planet1, planet2)[1];
    var absDistance = Math.sqrt((Math.pow(deltaX, 2)) + (Math.pow(deltaY, 2)));
    return absDistance;
}

function getDirection(planet1, planet2) {
    var deltaX = getDelta(planet1, planet2)[0];
    var deltaY = getDelta(planet1, planet2)[1];
    var rad = Math.atan2(deltaY, deltaX);
    return rad;
}

function updateTrail(planet) {
    planet.trail.unshift([planet.x, planet.y]);
    if (planet.trail.length > 100) {
        planet.trail.pop();
    }
}

function getGForce(planet1, planet2) {
	var G = 0.02;
	var m1 = planet1.mass;
	var m2 = planet2.mass;
	var r = getDistance(planet1, planet2);
	var force = (G*m1*m2)/(Math.pow(2*r, 2));
	return -force;
}


function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    main(planets);
    planets.forEach((function (planet) {
        drawTrail(planet.trail);
        drawPlanet(planet.x, planet.y, radius, 5, planet.colour, planet.colour);
    }));
    requestAnimationFrame(draw);
    }

    function setup() {
        //Adding planets
        planets.push({
            x: canvas.width * 4/10,
            y: canvas.height / 2,
            colour: '#FFFF00',
            direction: -Math.PI/2,
            velocity: 2,
            id: 0,
            mass: 1000000,
            trail: []
        });
        planets.push({
            x: canvas.width * 6/10,
            y: canvas.height / 2,
            colour: '#00FFFF',
            direction: Math.PI/2,
            velocity: 2,
            id: 1,
            mass: 1000000,
            trail: []
        });
        // planets.push({
        //     x: canvas.width * 7/10,
        //     y: canvas.height / 2,
        //     colour: '#0000FF',
        //     direction: Math.PI/2,
        //     velocity: 2,
        //     id: 2,
        //     mass: 1000000,
        //     trail: []
        // });
        // planets.push({
        //     x: canvas.width/4,
        //     y: canvas.height*4/5,
        //     colour: '#FFFFFF',
        //     direction: -Math.PI/2,
        //     velocity: 2,
        //     id: 3,
        //     mass: 1000000,
        //     trail: []
        // });
        draw()
    }

function main(planets) {
    planets.forEach(function(planet) {
        var forces = []
        //For every other planet, calculate the force and angle
        planets.forEach(function (otherPlanet) {
            if (otherPlanet.id !== planet.id) {
                // console.log("Direction: " + getDirection(planet, otherPlanet));
                forces.push({size: getGForce(planet, otherPlanet), dir: getDirection(planet, otherPlanet)});
                // planet.direction = direction;
            }
        })
        var currentXVel = planet.velocity * Math.cos(planet.direction);
        var currentYVel = planet.velocity * Math.sin(planet.direction);
        forces.forEach(function (force) {
            currentXVel += (force.size/planet.mass) * Math.cos(force.dir);
            currentYVel += (force.size/planet.mass) * Math.sin(force.dir);
        })
        planet.velocity = Math.sqrt(Math.pow(currentXVel, 2) + Math.pow(currentYVel, 2));
        planet.direction = Math.atan2(currentYVel, currentXVel);
        // if (planet.id === 1) {
        //     // console.log(planet.direction);
        // }
    });
    planets.forEach(function (planet) {
        planet.x += planet.velocity * Math.cos(planet.direction);
        planet.y += planet.velocity * Math.sin(planet.direction);
        updateTrail(planet);
    })
}