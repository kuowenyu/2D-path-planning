function iterateRRTConnect() {


    // STENCIL: implement a single iteration of an RRT-Connect algorithm.
    //   An asynch timing mechanism is used instead of a for loop to avoid 
    //   blocking and non-responsiveness in the browser.
    //
    //   Return "failed" if the search fails on this iteration.
    //   Return "succeeded" if the search succeeds on this iteration.
    //   Return "extended" otherwise.
    //
    //   Provided support functions:
    //
    //   testCollision - returns whether a given configuration is in collision
    //   tree_init - creates a tree of configurations
    //   insertTreeVertex - adds and displays new configuration vertex for a tree
    //   insertTreeEdge - adds and displays new tree edge between configurations
    //   drawHighlightedPath - renders a highlighted path in a tree

    if (search_iter_count >= search_max_iterations) {
        search_iterate = false;
        return "failed";
    }

    else if (search_result === "advanced") {
        return connectRRT(T_a, T_b);
    }

    else if (search_result === "reached") {
        insertTreeVertex(T_a, T_b.vertices[T_b.newest].vertex);
        insertTreeEdge(T_a, T_a.newest-1, T_a.newest);

        var path = [];
        var last_vertix;
        path.push(T_a.vertices[T_a.newest]);
        last_vertix = T_a.vertices[T_a.newest];
        while (last_vertix !== T_a.vertices[0]) {
            path.push(last_vertix.parent);
            last_vertix = last_vertix.parent;
        }
        drawHighlightedPath(path);

        path = [];
        path.push(T_b.vertices[T_b.newest]);
        last_vertix = T_b.vertices[T_b.newest];
        while (last_vertix !== T_b.vertices[0]) {
            path.push(last_vertix.parent);
            last_vertix = last_vertix.parent;
        }

        drawHighlightedPath(path);
        
        search_iterate = false;
        return "succeeded"; 
    }

    else {
        var q_rand;
        q_rand = randomConfig();
        if (extendRRT(T_b, q_rand) !== "trapped"){
            return "advanced";
        }
        else {
            var temp = T_a;
            T_a = T_b;
            T_b = temp;
            return "extended";
        }
    }


}

function extendRRTStar(tree, q_target) {
    var i; var dist = [];
    for (i = 0; i < tree.vertices.length; i++) {
        dist.push(calDistance(q_target, tree.vertices[i].vertex));
    }

    var minIdx = 0;
    var minVal;
    for (i = 0; i < dist.length; i++){
        minVal = dist[minIdx];
        if (dist[i] < minVal){
            minIdx = i;
        }
    }

    var q_near = tree.vertices[minIdx].vertex.slice();
    var q_new = {a:[0,0]};
    if (newConfig(q_target, q_near, q_new)) {
        
        var n = 5;
        Q_near = near(tree, q_near, n);

        var q_min = chooseParent(Q_near, q_near, minIdx, q_new.a, tree);
        
        insertTreeVertex(tree, q_new.a);
        insertTreeEdge(tree, q_min.idx, tree.newest);

        if (Math.abs(q_target[0] - q_new.a[0]) < 0.001 && Math.abs(q_target[1] === q_new.a[1]) < 0.001)   return "reached";
        else  return "advanced";
    }
    else return "trapped";
}

function near(tree, q_near, n) {
    // var dist = [];
    // for (i = 0; i < tree.vertices.length; i ++) {
    //     a = calDistance(q_near, tree.vertices[i].vertex);
    //     minheaper.insert(dist, a);
    // }


    var i;
    var dist = [];
    var dict = {};
    for (i = 0; i < tree.vertices.length; i++) {
        var node = {};
        node.priority = calDistance(q_near, tree.vertices[i].vertex);
        node.idx = i;
        minheaper.insert(dist, node);
    }
    
    var Q_near = [];
    n = Math.min(n, dist.length);
    for (i = 0; i < n; i++) {
        var q = {idx:0, vertex:[0,0]};
        node = minheaper.extract(dist);
        q.idx = node.idx;
        q.vertex = tree.vertices[ q.idx ].vertex;
        Q_near.push(q);
    }

    return Q_near;
}

function chooseParent(Q_near, q_nearest, idx_nearest, q_new, tree) {
    var q_min = {idx:0, vertex: [0,0]};
    q_min.vertex = q_nearest;
    q_min.idx = idx_nearest;
    c_min = tree.vertices[q_min.idx].cost + calDistance(tree.vertices[q_min.idx].vertex, q_new);

    var c;
    for (var i = 0; i < Q_near.length; i++) {
        c = tree.vertices[Q_near[i].idx].cost + calDistance(tree.vertices[Q_near[i].idx].vertex, q_new);
        if (c < c_min && testEdgeCollision(tree.vertices[Q_near[i].idx].vertex, q_new)) {
            q_min.vertex = Q_near[i].vertex;
            q_min.idx = Q_near[i].idx;
            c_min = c;
        }
    }

    return q_min;
}

function testEdgeCollision(q1, q2) {
    var vector = [q2[0]-q1[0], q2[1] - q1[1]];
    var norm = Math.sqrt(vector[0]*vector[0]+vector[1]*vector[1]);
    var num = norm/eps;

    for (var i = 1; i < num; i++) {
        var q = [q1[0] + vector[0]/norm*i*eps, q1[1] + vector[1]/norm*i*eps];
        if (testCollision(q) == true) return false;
    }
    
    return true;
}
