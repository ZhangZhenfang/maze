function Maze(n){
    this.n = n;
    this.maze = new Array(n);
    for(var i = 0; i < this.maze.length; i++){
        this.maze[i] = new Array(n);
    }
    for(var i = 0; i < this.maze.length; i++){
        for(var j = 0; j < this.maze[i].length; j++){
            this.maze[i][j] = new Node(i, j);
        }
    }
    for(var i = 1; i < this.maze.length; i += 2){
        for(var j = 1; j < this.maze[i].length; j += 2){
            this.maze[i][j].type = 1;
        }
    }
}

Maze.prototype.render = function(e){
    var maze = this.maze;
    var table = '<table id="maze">content</table>';
    var tableContent = '';
    for(var i = 0; i < maze.length; i++){
        var tr = '<tr>content</tr>';
        // str = "";
        var trContent = '';
        for(var j = 0; j < maze[i].length; j++){
            trContent += '<td class="' + (maze[i][j].type == 0 ? 'wall' : 'road') + '"></td>';
            // str += " " + maze[i][j].type;
        }
        tr = tr.replace("content", trContent);
        // console.log(str);
        tableContent += tr;
    }
    table = table.replace("content", tableContent);
    // console.log(table);
    e.innerHTML =  table;
};
Maze.prototype.depthFirstGen = async function(e, enable){
    var n = this.n;
    var maze = this.maze;
    
    var startX = 1;
    var startY = 1;
    var visited = [];
    var index = 1;
    visited[0] = {x : 0, y : 0};
    visited[index++] = {x : startX, y : startY};
    var current = visited[1];
    maze[startX][startY].visited = true;    
    while(index != 0){
        var up = {x : current.x, y : current.y + 2};
        var right = {x : current.x + 2, y : current.y};
        var down = {x : current.x, y : current.y - 2};
        var left = {x : current.x - 2, y : current.y};
        var tmp = [];
        
        if(!(up.x < 0 || up.x >= n || up.y < 0 || up.y >= n)){
            if(!maze[up.x][up.y].visited){
                tmp.push(up);
            }
        }
        if(!(right.x < 0 || right.x >= n || right.y < 0 || right.y >= n)){
            if(!maze[right.x][right.y].visited){
                tmp.push(right);
            }
        }
        if(!(down.x < 0 || down.x >= n || down.y < 0 || down.y >= n)){
            if(!maze[down.x][down.y].visited){
                tmp.push(down);
            }    
        }
        if(!(left.x < 0 || left.x >= n || left.y < 0 || left.y >= n)){
            if(!maze[left.x][left.y].visited){    
                tmp.push(left);
            }    
        }
        if(tmp.length == 0){
            if(index <= 2)
                break;
            current = visited[--index];
            var td = e.getElementsByTagName("tr")[current.x].getElementsByTagName("td")[current.y];
            td.setAttribute("class", "road");

            current = visited[--index];
            var td = e.getElementsByTagName("tr")[current.x].getElementsByTagName("td")[current.y];
            td.setAttribute("class", "road");
            current = visited[index - 1];
        }
        else{
            var r = Math.ceil(Math.random() * tmp.length);
            r--;
            var rX = (tmp[r].x + current.x) / 2;
            var rY = (tmp[r].y + current.y) / 2;
            maze[rX][rY].type = 1;
            e.getElementsByTagName("tr")[rX].getElementsByTagName("td")[rY].setAttribute("class", "current");
            visited[index++] = maze[rX][rY];
            maze[tmp[r].x][tmp[r].y].visited = true;
            visited[index++] = maze[tmp[r].x][tmp[r].y];
            current = visited[index - 1];    
            var td = e.getElementsByTagName("tr")[current.x].getElementsByTagName("td")[current.y];
            td.setAttribute("class", "current");
        }
        await sleep(1);
    }
    enable();
};


Maze.prototype.randomPrimGen = async function(e, enable){
    var n = this.n;
    var maze = this.maze;
    
    var startX = 1;
    var startY = 1;
    var visited = [];
    var index = 1;
    visited[0] = {x : 1, y : 1};
    visited[index++] = {x : startX, y : startY};
    var current = visited[1];
    maze[startX][startY].visited = true;    
    while(index != 0){
        var up = {x : current.x, y : current.y + 2};
        var right = {x : current.x + 2, y : current.y};
        var down = {x : current.x, y : current.y - 2};
        var left = {x : current.x - 2, y : current.y};
        var tmp = [];
        
        if(!(up.x < 0 || up.x >= n || up.y < 0 || up.y >= n)){
            if(!maze[up.x][up.y].visited){
                tmp.push(up);
            }
        }
        if(!(right.x < 0 || right.x >= n || right.y < 0 || right.y >= n)){
            if(!maze[right.x][right.y].visited){
                tmp.push(right);
            }
        }
        if(!(down.x < 0 || down.x >= n || down.y < 0 || down.y >= n)){
            if(!maze[down.x][down.y].visited){
                tmp.push(down);
            }    
        }
        if(!(left.x < 0 || left.x >= n || left.y < 0 || left.y >= n)){
            if(!maze[left.x][left.y].visited){    
                tmp.push(left);
            }    
        }
        if(tmp.length == 0){
            if(index <= 1)
                break;
            current = visited[currentIndex];
            var td = e.getElementsByTagName("tr")[current.x].getElementsByTagName("td")[current.y];
            td.setAttribute("class", "road");

            current = visited[currentIndex - 1];
            var td = e.getElementsByTagName("tr")[current.x].getElementsByTagName("td")[current.y];
            td.setAttribute("class", "road");
            
            for(var i = currentIndex; i < index - 2; i++){
                visited[i - 1] = visited[i + 1];
                visited[i] = visited[i + 2];
            }
            index -= 2;
            
            currentIndex = Math.ceil(Math.random() * index);
            currentIndex--;
            if(currentIndex % 2 == 0){
                currentIndex++;
            }
            current = visited[currentIndex];
        }
        else{
            var r = Math.ceil(Math.random() * tmp.length);
            r--;
            var rX = (tmp[r].x + current.x) / 2;
            var rY = (tmp[r].y + current.y) / 2;
            maze[rX][rY].type = 1;
            e.getElementsByTagName("tr")[rX].getElementsByTagName("td")[rY].setAttribute("class", "current");
            visited[index++] = maze[rX][rY];
            maze[tmp[r].x][tmp[r].y].visited = true;
            visited[index++] = maze[tmp[r].x][tmp[r].y];
            current = visited[index - 1];    
            e.getElementsByTagName("tr")[current.x].getElementsByTagName("td")[current.y].setAttribute("class", "current");

            currentIndex = Math.ceil(Math.random() * index);
            currentIndex--;
            if(currentIndex % 2 == 0){
                currentIndex++;
            }
            current = visited[currentIndex];
        }
        await sleep(1);
    }
    enable();
};

Maze.prototype.findpath = async function(e, enable){
    var n = this.n;
    var maze = this.maze;
    var start = {x : 1, y : 1};
    var end = {x : n - 2, y : n - 2};

    for(var i = 0; i < maze.length; i++){
        for(var j = 0; j < maze[i].length; j++){
            maze[i][j].visited = false;
        }
    }    
    var queue = [];
    var front = 0, rear = 0;
    maze[end.x][end.y].level = 0;
    queue[rear++] = maze[end.x][end.y];
    var current = maze[end.x][end.y];
    var pre = current;
    while(front != rear){
        pre = current;
        current = queue[front++];
        current.visited = true;
        e.getElementsByTagName("tr")[current.x].getElementsByTagName("td")[current.y].setAttribute("class", "visited");

        if(current.x == start.x && current.y == start.y){
            while(front != rear){
                current = queue[front++];
                e.getElementsByTagName("tr")[current.x].getElementsByTagName("td")[current.y].setAttribute("class", "visited");
            }
            break;
        }
        var up = {x : current.x, y : current.y + 2};
        var right = {x : current.x + 2, y : current.y};
        var down = {x : current.x, y : current.y - 2};
        var left = {x : current.x - 2, y : current.y};

        if(!(up.x < 0 || up.x >= n || up.y < 0 || up.y >= n)){
            if(maze[(current.x + up.x) / 2][(current.y + up.y) / 2].type == 1){
                if(!maze[up.x][up.y].visited){
                    maze[up.x][up.y].visited = true;
                    maze[up.x][up.y].level = current.level + 1;
                    queue[rear++] = maze[up.x][up.y];
                    e.getElementsByTagName("tr")[up.x].getElementsByTagName("td")[up.y].setAttribute("class", "current");
                    e.getElementsByTagName("tr")[(current.x + up.x) / 2].getElementsByTagName("td")[(current.y + up.y) / 2].setAttribute("class", "visited");
                }
            }
        }
        if(!(right.x < 0 || right.x >= n || right.y < 0 || right.y >= n)){
            if(maze[(current.x + right.x) / 2][(current.y + right.y) / 2].type == 1){
                if(!maze[right.x][right.y].visited){
                    maze[right.x][right.y].visited = true;
                    maze[right.x][right.y].level = current.level + 1;
                    queue[rear++] = maze[right.x][right.y];
                    e.getElementsByTagName("tr")[right.x].getElementsByTagName("td")[right.y].setAttribute("class", "current");
                    e.getElementsByTagName("tr")[(current.x + right.x) / 2].getElementsByTagName("td")[(current.y + right.y) / 2].setAttribute("class", "visited");
                }
            }
        }
        if(!(down.x < 0 || down.x >= n || down.y < 0 || down.y >= n)){
            if(maze[(current.x + down.x) / 2][(current.y + down.y) / 2].type == 1){
                if(!maze[down.x][down.y].visited){
                    maze[down.x][down.y].visited = true;
                    maze[down.x][down.y].level = current.level + 1;
                    queue[rear++] = maze[down.x][down.y];
                    e.getElementsByTagName("tr")[down.x].getElementsByTagName("td")[down.y].setAttribute("class", "current");
                    e.getElementsByTagName("tr")[(current.x + down.x) / 2].getElementsByTagName("td")[(current.y + down.y) / 2].setAttribute("class", "visited");
                }    
            }
        }
        if(!(left.x < 0 || left.x >= n || left.y < 0 || left.y >= n)){
            if(maze[(current.x + left.x) / 2][(current.y + left.y) / 2].type == 1){
                if(!maze[left.x][left.y].visited){
                    maze[left.x][left.y].visited = true;    
                    maze[left.x][left.y].level = current.level + 1;
                    queue[rear++] = maze[left.x][left.y];
                    e.getElementsByTagName("tr")[left.x].getElementsByTagName("td")[left.y].setAttribute("class", "current");
                    e.getElementsByTagName("tr")[(current.x + left.x) / 2].getElementsByTagName("td")[(current.y + left.y) / 2].setAttribute("class", "visited");
                }    
            }
        }
        await sleep(1);
    }
    current  = maze[start.x][start.y];
    pre = current;
    while(true){
        e.getElementsByTagName("tr")[(current.x + pre.x) / 2].getElementsByTagName("td")[(current.y + pre.y) / 2].setAttribute("class", "current");
        e.getElementsByTagName("tr")[current.x].getElementsByTagName("td")[current.y].setAttribute("class", "current");
        await sleep(20);
        if(current.x == end.x && current.y == end.y){
            break;
        }
        var up = {x : current.x, y : current.y + 2};
        var right = {x : current.x + 2, y : current.y};
        var down = {x : current.x, y : current.y - 2};
        var left = {x : current.x - 2, y : current.y};

        if(!(up.x < 0 || up.x >= n || up.y < 0 || up.y >= n)){
            if(maze[(current.x + up.x) / 2][(current.y + up.y) / 2].type == 1){
                if(maze[up.x][up.y].level == current.level - 1){
                    pre = current;
                    current = maze[up.x][up.y];
                    continue;
                }
            }
        }
        if(!(right.x < 0 || right.x >= n || right.y < 0 || right.y >= n)){
            if(maze[(current.x + right.x) / 2][(current.y + right.y) / 2].type == 1){
                if(maze[right.x][right.y].level == current.level - 1){
                    pre = current;
                    current = maze[right.x][right.y];
                    continue;
                }
            }
        }
        if(!(down.x < 0 || down.x >= n || down.y < 0 || down.y >= n)){
            if(maze[(current.x + down.x) / 2][(current.y + down.y) / 2].type == 1){
                if(maze[down.x][down.y].level == current.level - 1){
                    pre = current;
                    current = maze[down.x][down.y];
                    continue;
                }  
            }
        }
        if(!(left.x < 0 || left.x >= n || left.y < 0 || left.y >= n)){
            if(maze[(current.x + left.x) / 2][(current.y + left.y) / 2].type == 1){
                if(maze[left.x][left.y].level == current.level - 1){
                    pre = current;
                    current = maze[left.x][left.y];
                    continue;
                }  
            }
        }
        break;
        
    }
    enable();
};

function Node(x, y){
    this.x = x;
    this.y = y;
    this.level = 0;
    this.visited = false;
    this.type = 0;
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
