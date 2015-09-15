var nodeCount = 10;

var container = $('.container');

function generateInitialLayout() {
    for (var i = 0; i < nodeCount; i++) {

        var div = $('<div> </div>').appendTo( container );
        div.addClass( "node" );
        div.css( 'transform-origin', 'center center' ) ;
        div.css( 'transform', 'translate( 0, 0 )' ) ;

    }
}

generateInitialLayout();

var graph = graphLayout.newGraph();
var layout = graphLayout.newLayout(graph);

var nodesDiv = $('.node');
for (var i = 0; i < nodesDiv.length; i++) {

    var x = Math.random() * 200 ;
    var y = Math.random() * 200 ;
    graph.addNode( x, y , 0, 0, $(nodesDiv[i]));
}
for (var i = 0; i < nodesDiv.length; i++) {
    for (var j = 0; j< nodesDiv.length; j++) {
        if( j != i ) {
            graph.addEdge(i, j);
        }
    }
}


layout.start(function(graph) {

    graph.forEachNode(function(n) {
        var div = n.data;
        var x = container.width() / 2 - div.width() / 2 + n.pos.x;
        var y = container.height() / 2 - div.height() / 2 + n.pos.y;
        var translate = 'translate( '+x+'px , '+y+'px )';
        div.get(0).style.transform = translate;
    });


});
