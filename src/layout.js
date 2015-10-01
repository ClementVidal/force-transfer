function Layout(graph, options) {
    if (options === undefined) {
        options = {};
    }
    this.graph = graph;
    this.springList = {};
    this.options = {};

    this.options.velocityDamping = options.velocityDamping || 0.4; // velocity velocityDamping factor
    this.options.minEnergyThreshold = options.minEnergyThreshold || 3; //threshold used to determine render stop
    this.options.maxIterationCount = options.maxIterationCount || 60 * 3;
    this.options.springStiffness = options.springStiffness || 40.0; // spring stiffness constant
    this.options.springMarginLength = options.springMarginLength || 0;

    if (options.initialLayout) {
        this.options.initialLayout = {};

        this.options.initialLayout.style = options.initialLayout.style || "randomCircle";

        if (this.options.initialLayout.style === "randomCircle") {
            this.options.initialLayout.radius = options.initialLayout.radius || this.repulsionForce;
            this.options.initialLayout.center = options.initialLayout.center || {
                x: 0,
                y: 0
            };
        }
    }

}

Layout.prototype.setupInitialLayout = function() {

    if (this.options.initialLayout.style === "randomCircle") {
        for (var i = 0; i < this.graph.nodeList.length; i++) {
            var frac = (i / (this.graph.nodeList.length)) * Math.PI * 2;

            var radius = this.options.initialLayout.radius * Math.random();
            var xPos = Math.cos(frac) * radius;
            var yPos = Math.sin(frac) * radius;

            this.graph.nodeList[i].pos.x = xPos + this.options.initialLayout.center.x;
            this.graph.nodeList[i].pos.y = yPos + this.options.initialLayout.center.y;
        }
    }
};

Layout.prototype.start = function(onUpdateView, onGraphStable) {

    var self = this;
    var iterationCount = 0;
    var t0 = new Date().getTime();

    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

    if (self.options.initialLayout) {
        self.setupInitialLayout();
    }

    onUpdateView(self.graph);

    requestAnimationFrame(function step() {

        // Compute delta time
        var t1 = new Date().getTime();
        var dt = 0.001 * (t1 - t0);
        t0 = t1;

        iterationCount++;
        self._update(dt);
        onUpdateView(self.graph);

        if (self._isStable() || iterationCount >= self.options.maxIterationCount) {

            if (onGraphStable !== undefined) {
                onGraphStable(self.graph);
            }
        } else {
            requestAnimationFrame(step);
        }
    });
};

Layout.prototype._getSpring = function(edge) {

    function Spring(length, stiffness) {
        this.length = length;
        this.stiffness = stiffness;
    }

    if (!_.contains(this.springList, edge)) {
        var nodes = this.graph.getEdgeNodes(edge);
        var springLength = nodes[0].getDiagonalLength() + nodes[1].getDiagonalLength() + this.options.springMarginLength;

        this.springList[edge] = new Spring(springLength, this.options.springStiffness);
    }

    return this.springList[edge];
};

Layout.prototype._update = function(timestep) {
    this._applyHookesLaw();
    this._updateNodes(timestep);
};


Layout.prototype._applyHookesLaw = function() {
    var self = this;
    self.graph.forEachEdge(function(edge) {

        var spring = self._getSpring(edge);
        var nodes = self.graph.getEdgeNodes(edge);

        var d = nodes[0].vectorTo(nodes[1]);
        var displacement = spring.length - d.magnitude();
        var direction = d.normalise();

        // apply force to each end point
        nodes[0].applyForce(direction.multiply(spring.stiffness * displacement * -0.5));
        nodes[1].applyForce(direction.multiply(spring.stiffness * displacement * 0.5));
    });
};

Layout.prototype._updateNodes = function(timestep) {
    var self = this;
    self.graph.forEachNode(function(node) {
        node.velocity = node.velocity.add(node.acceleration.multiply(timestep));
        node.velocity = node.velocity.multiply(self.options.velocityDamping);
        node.acceleration = new Vector(0, 0);
        node.pos = node.pos.add(node.velocity.multiply(timestep));

    });
};

Layout.prototype._isStable = function() {
    return this.graph.totalEnergy() < this.options.minEnergyThreshold;
};
