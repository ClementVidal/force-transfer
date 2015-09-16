function DivAdaptor() {

}

DivAdaptor.prototype.apply = function(graph) {
    graph.forEachNode(function(n) {
        var translate = 'translate(' + n.pos.x + 'px,' + n.pos.y + 'px)';
        n.data.style.transform = translate;
    });
}

DivAdaptor.prototype.setup = function(graph, nodeSelector, rootElement) {

    var nodes = rootElement.querySelectorAll(nodeSelector);

    for (var i = 0; i < nodes.length; i++) {

        var tr = nodes[i].style.transform;
        var x = 0;
        var y = 0;

        if (tr || tr.length) {
            var values = tr.split('(')[1],
                values = values.split(')')[0],
                values = values.split(',');

            x = parseInt(values[0].replace("px", ""));
            y = parseInt(values[1].replace("px", ""));
        }

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
