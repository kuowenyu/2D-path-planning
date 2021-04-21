function iterateRRTStar() {

    if (search_iter_count >= search_max_iterations) {
        search_iterate = false;
        return "failed";
    }

    else if ( Math.round(T_a.vertices[T_a.newest].vertex[0]*100)/100 !== q_goal[0] || Math.round(T_a.vertices[T_a.newest].vertex[1]*100)/100 !== q_goal[1]) {
        var q_rand;
        if (search_iter_count%20 === 0) q_rand = q_goal;
        else q_rand = randomConfig();
        extendRRTStar(T_a, q_rand);

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