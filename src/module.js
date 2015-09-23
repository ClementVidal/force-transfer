window.graphLayout = {
    newGraph: function() {
        return new Graph();
    },
    newLayout: function(graph, options) {
        return new Layout(graph, options);
    },
    newDivAdaptor: function( nodeSelector, rootElement ) {
        return new DivAdaptor(nodeSelector, rootElement);
    }
}
