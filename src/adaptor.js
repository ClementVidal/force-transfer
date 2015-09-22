/**
 * Provide an adaptor to create a graph from a set of dom elements
 */
function DivAdaptor() {

}

/**
 * This should be called on each layout update to move the dom elements according to the current state of the layout
 * @param  {[type]} graph [description]
 * @return {[type]}       [description]
 */
DivAdaptor.prototype.apply = function(graph) {
    graph.forEachNode(function(n) {
        n.data.offset( {top:  n.pos.y, left:  n.pos.x } );
    });
}

/**
 * Build the graph
 * @param  graph        The graph to setup
 * @param  nodeSelector CSS selector to select with childs elements of rootElement should be interpreted as nodes
 * @param  rootElement  The root element
 */
DivAdaptor.prototype.setup = function(graph, nodeSelector, rootElement) {

    var nodes = rootElement.querySelectorAll(nodeSelector);

    for (var i = 0; i < nodes.length; i++) {

        var tr = nodes[i].style.transform;
        var x = 0;
        var y = 0;

        x = nodes[i].offset().left;
        y = nodes[i].offset().top;

        graph.addNode(x, y, nodes[i].offsetWidth, nodes[i].offsetHeight, nodes[i]);
    }
    for (var i = 0; i < nodes.length; i++) {
        for (var j = 0; j < nodes.length; j++) {
            if (j != i) {
                graph.addEdge(i, j);
            }
        }
    }
    return graph;
}
