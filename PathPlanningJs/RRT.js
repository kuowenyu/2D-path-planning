function initRRT(q) {

    // create tree object
    var tree = {};

    // initialize with vertex for given configuration
    tree.vertices = [];
    tree.vertices[0] = {};
    tree.vertices[0].vertex = q;
    tree.vertices[0].edges = [];
    tree.vertices[0].cost = 0;

    // maintain index of newest vertex added to tree
    tree.newest = 0;

    return tree;
}

function iterateRRT() {


    // STENCIL: implement a single iteration of an RRT algorithm.
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

    else if ( Math.round(T_a.vertices[T_a.newest].vertex[0]*100)/100 !== q_goal[0] || Math.round(T_a.vertices[T_a.newest].vertex[1]*100)/100 !== q_goal[1]) {
        var q_rand;
        if (search_iter_count%10 === 0) q_rand = q_goal;
        else q_rand = randomConfig();
        extendRRT(T_a, q_rand);

        return "extended";
    }

    else {

        var path = [];
        var last_vertix;
        path.push(T_a.vertices[T_a.newest]);
        last_vertix = T_a.vertices[T_a.newest];
        while (last_vertix !== T_a.vertices[0]) {
            path.push(last_vertix.parent);
            last_vertix = last_vertix.parent;
        }


        drawHighlightedPath(path);
        search_iterate = false;
        return "succeeded";
    }
    
}

function extendRRT(tree, q_target) {
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
        insertTreeVertex(tree, q_new.a);
        insertTreeEdge(tree, minIdx, tree.newest);

        if (Math.abs(q_target[0] - q_new.a[0]) < 0.001 && Math.abs(q_target[1] - q_new.a[1]) < 0.001)   return "reached";
        else  return "advanced";
    }
    else return "trapped";
}

function connectRRT(tree1, tree2) {
    var q;
    q = tree2.vertices[tree2.newest].vertex;
    return extendRRT(tree1, q);
}

function randomConfig() {
    var rand_idx = [ Math.floor(Math.random() * G.length), Math.floor(Math.random() * G[0].length) ];
    var q = [G[rand_idx[0]][rand_idx[1]].x, G[rand_idx[0]][rand_idx[1]].y];
    while (testCollision(q) === true) {
        rand_idx = [ Math.floor(Math.random() * G.length), Math.floor(Math.random() * G[0].length) ];
        q = [G[rand_idx[0]][rand_idx[1]].x, G[rand_idx[0]][rand_idx[1]].y];
    }
    return q;
}

function newConfig(q, q_near, q_new) {
    
    var vector = [q[0]-q_near[0], q[1]-q_near[1]];
    var angle = Math.atan2(vector[1], vector[0]);
    if (angle >= -0.393 && angle < 0.393) {
        q_new.a = [q_near[0] + eps, q_near[1]];
    }
    else if (angle >= 0.393 && angle < 1.178) {
        q_new.a = [q_near[0] + eps, q_near[1] + eps];
    }
    else if (angle >= 1.178 && angle < 1.964) {
        q_new.a = [q_near[0], q_near[1] + eps];
    }
    else if (angle >= 1.964 && angle < 2.749) {
        q_new.a = [q_near[0] - eps, q_near[1] + eps];
    }
    else if (angle >= -1.178 && angle < -0.393) {
        q_new.a = [q_near[0] + eps, q_near[1] - eps];
    }
    else if (angle >= -1.964 && angle < -1.178) {
        q_new.a = [q_near[0], q_near[1] - eps];
    }
    else if (angle >= -2.749 && angle < -1.964) {
        q_new.a = [q_near[0] - eps, q_near[1] - eps];
    }
    else {
        q_new.a = [q_near[0] - eps, q_near[1]];
    }

    if (testCollision(q_new.a)) return false;
    else return true;
}