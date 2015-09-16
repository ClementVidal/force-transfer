window.graphLayout = {
    newGraph: function() {
        return new Graph();
    },
    newLayout: function(graph) {
        return new Layout(graph);
    },
    newDivAdaptor: function( nodeSelector, rootElement ) {
        return new DivAdaptor(nodeSelector, rootElement);
    }
}
