var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

function Layout(graph) {
    this.graph = graph;
    this.stiffness = 400.0; // spring stiffness constant
    this.repulsion = 400.0; // repulsion constant
    this.damping = 0.5; // velocity damping factor
    this.minEnergyThreshold = 0.01; //threshold used to determine render stop
    this.maxIterationCount = 60 * 4;
}


Layout.prototype.update = function(step) {
    this.applyCoulombsLaw();
    this.applyHookesLaw();
    this.updateNodes();
}

Layout.prototype.start = function(step) {

    var self = this;
    var iterationCount = 0;

    requestAnimationFrame(function step() {
        iterationCount++;
        self.update();

        if (self.isStable() || iterationCount > self.maxIterationCount ) {
            console.log( 'Graph is stable, exiting');

        } else {
            requestAnimationFrame(step);
        }

    });
}


Layout.prototype.applyCoulombsLaw = function() {

    var self = this;
    self.graph.forEachNode(function(n1) {
        self.graph.forEachNode(function(n2) {
            var d = n1.vectorTo(n2);
            console.log( d );
            var distance = d.magnitude() + 0.1; // avoid massive forces at small distances (and divide by zero)
            var direction = d.normalise();

            // apply force to each end point
            n1.applyForce(direction.multiply(this.repulsion).divide(distance * distance * 0.5));
            n2.applyForce(direction.multiply(this.repulsion).divide(distance * distance * -0.5));
        });
    });
};

Layout.prototype.applyHookesLaw = function() {
    this.graph.forEachEdge(function(edge) {

        var d = spring.point2.p.subtract(spring.point1.p); // the direction of the spring
        var displacement = spring.length - d.magnitude();
        var direction = d.normalise();

        // apply force to each end point
        spring.point1.applyForce(direction.multiply(spring.k * displacement * -0.5));
        spring.point2.applyForce(direction.multiply(spring.k * displacement * 0.5));
    });
};

Layout.prototype.updateNodes = function(timestep) {
    this.graph.forEachNode(function(node) {
        node.velocity = node.velocity.add(node.acceleration.multiply(timestep));
        node.velocity = node.velocity.multiply(this.damping);
        node.acceleration = new Vector(0, 0);
        node.pos = node.pos.add(node.velocity.multiply(timestep));
    });
};


Layout.prototype.isStable = function() {
    return this.graph.totalEnergy() < this.minEnergyThreshold;
}
