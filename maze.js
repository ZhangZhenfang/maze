// Node class for maze cells
class Node {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.level = 0;
        this.visited = false;
        this.type = 0;
    }
}

// Maze class
class Maze {
    constructor(n) {
        this.n = n;
        this.maze = [];
        
        // Initialize maze grid
        for (let i = 0; i < n; i++) {
            this.maze[i] = [];
            for (let j = 0; j < n; j++) {
                this.maze[i][j] = new Node(i, j);
            }
        }
        
        // Mark potential road positions (odd indices)
        for (let i = 1; i < n; i += 2) {
            for (let j = 1; j < n; j += 2) {
                this.maze[i][j].type = 1;
            }
        }
    }

    // Render the maze as an HTML table
    render(container) {
        let tableHTML = '<table id="maze">';
        
        for (let i = 0; i < this.n; i++) {
            tableHTML += '<tr>';
            for (let j = 0; j < this.n; j++) {
                const cellType = this.maze[i][j].type === 0 ? 'wall' : 'road';
                tableHTML += `<td class="${cellType}"></td>`;
            }
            tableHTML += '</tr>';
        }
        
        tableHTML += '</table>';
        container.innerHTML = tableHTML;
    }

    // Get unvisited neighbors in four directions
    _getUnvisitedNeighbors(current, n) {
        const neighbors = [];
        const directions = [
            { x: current.x, y: current.y + 2 },   // up
            { x: current.x + 2, y: current.y },   // right
            { x: current.x, y: current.y - 2 },   // down
            { x: current.x - 2, y: current.y }    // left
        ];

        for (const dir of directions) {
            if (dir.x >= 0 && dir.x < n && dir.y >= 0 && dir.y < n) {
                if (!this.maze[dir.x][dir.y].visited) {
                    neighbors.push(dir);
                }
            }
        }
        return neighbors;
    }

    // Update cell class in the DOM
    _updateCell(element, x, y, className) {
        const td = element.getElementsByTagName("tr")[x].getElementsByTagName("td")[y];
        td.setAttribute("class", className);
    }

    // Depth-First Search maze generation
    async depthFirstGen(element, enableCallback) {
        const n = this.n;
        const maze = this.maze;
        
        const startX = 1;
        const startY = 1;
        const visited = [];
        let index = 1;
        
        visited[0] = { x: 0, y: 0 };
        visited[index++] = { x: startX, y: startY };
        let current = visited[1];
        maze[startX][startY].visited = true;    
        
        while (index !== 0) {
            const tmp = this._getUnvisitedNeighbors(current, n);
            
            if (tmp.length === 0) {
                if (index <= 2) break;
                
                current = visited[--index];
                this._updateCell(element, current.x, current.y, "road");

                current = visited[--index];
                this._updateCell(element, current.x, current.y, "road");
                current = visited[index - 1];
            } else {
                const r = Math.floor(Math.random() * tmp.length);
                const midX = (tmp[r].x + current.x) / 2;
                const midY = (tmp[r].y + current.y) / 2;
                
                maze[midX][midY].type = 1;
                this._updateCell(element, midX, midY, "current");
                
                visited[index++] = maze[midX][midY];
                maze[tmp[r].x][tmp[r].y].visited = true;
                visited[index++] = maze[tmp[r].x][tmp[r].y];
                current = visited[index - 1];    
                this._updateCell(element, current.x, current.y, "current");
            }
            await sleep(1);
        }
        enableCallback();
    }

    // Randomized Prim's algorithm for maze generation
    async randomPrimGen(element, enableCallback) {
        const n = this.n;
        const maze = this.maze;
        
        const startX = 1;
        const startY = 1;
        const visited = [];
        let index = 1;
        let currentIndex = 0;
        
        visited[0] = { x: 1, y: 1 };
        visited[index++] = { x: startX, y: startY };
        let current = visited[1];
        maze[startX][startY].visited = true;    
        
        while (index !== 0) {
            const tmp = this._getUnvisitedNeighbors(current, n);
            
            if (tmp.length === 0) {
                if (index <= 1) break;
                
                current = visited[currentIndex];
                this._updateCell(element, current.x, current.y, "road");

                current = visited[currentIndex - 1];
                this._updateCell(element, current.x, current.y, "road");
                
                // Shift array elements to remove two visited nodes
                for (let i = currentIndex; i < index - 2; i++) {
                    visited[i - 1] = visited[i + 1];
                    visited[i] = visited[i + 2];
                }
                index -= 2;
                
                // Select a random odd index from remaining visited list
                currentIndex = Math.floor(Math.random() * index);
                if (currentIndex % 2 === 0) {
                    currentIndex++;
                }
                current = visited[currentIndex];
            } else {
                const r = Math.floor(Math.random() * tmp.length);
                const midX = (tmp[r].x + current.x) / 2;
                const midY = (tmp[r].y + current.y) / 2;
                
                maze[midX][midY].type = 1;
                this._updateCell(element, midX, midY, "current");
                
                visited[index++] = maze[midX][midY];
                maze[tmp[r].x][tmp[r].y].visited = true;
                visited[index++] = maze[tmp[r].x][tmp[r].y];
                current = visited[index - 1];    
                this._updateCell(element, current.x, current.y, "current");

                // Select a random odd index from visited list
                currentIndex = Math.floor(Math.random() * index);
                if (currentIndex % 2 === 0) {
                    currentIndex++;
                }
                current = visited[currentIndex];
            }
            await sleep(1);
        }
        enableCallback();
    }

    // Find path using BFS
    async findpath(element, enableCallback) {
        const n = this.n;
        const maze = this.maze;
        const start = { x: 1, y: 1 };
        const end = { x: n - 2, y: n - 2 };

        // Reset visited status
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                maze[i][j].visited = false;
            }
        }    
        
        const queue = [];
        let front = 0, rear = 0;
        
        maze[end.x][end.y].level = 0;
        queue[rear++] = maze[end.x][end.y];
        let current = maze[end.x][end.y];
        
        // BFS from end to start
        while (front !== rear) {
            current = queue[front++];
            current.visited = true;
            this._updateCell(element, current.x, current.y, "visited");

            if (current.x === start.x && current.y === start.y) {
                while (front !== rear) {
                    current = queue[front++];
                    this._updateCell(element, current.x, current.y, "visited");
                }
                break;
            }

            const neighbors = this._getUnvisitedNeighbors(current, n);
            for (const neighbor of neighbors) {
                const midX = (current.x + neighbor.x) / 2;
                const midY = (current.y + neighbor.y) / 2;
                
                if (maze[midX][midY].type === 1 && !maze[neighbor.x][neighbor.y].visited) {
                    maze[neighbor.x][neighbor.y].visited = true;
                    maze[neighbor.x][neighbor.y].level = current.level + 1;
                    queue[rear++] = maze[neighbor.x][neighbor.y];
                    
                    this._updateCell(element, neighbor.x, neighbor.y, "current");
                    this._updateCell(element, midX, midY, "visited");
                }
            }
            await sleep(1);
        }

        // Backtrack from start to end following levels
        current = maze[start.x][start.y];
        let previous = current;
        
        while (true) {
            this._updateCell(element, (current.x + previous.x) / 2, (current.y + previous.y) / 2, "current");
            this._updateCell(element, current.x, current.y, "current");
            await sleep(20);
            
            if (current.x === end.x && current.y === end.y) {
                break;
            }

            const neighbors = [
                { x: current.x, y: current.y + 2 },
                { x: current.x + 2, y: current.y },
                { x: current.x, y: current.y - 2 },
                { x: current.x - 2, y: current.y }
            ];

            let found = false;
            for (const neighbor of neighbors) {
                if (neighbor.x >= 0 && neighbor.x < n && neighbor.y >= 0 && neighbor.y < n) {
                    const midX = (current.x + neighbor.x) / 2;
                    const midY = (current.y + neighbor.y) / 2;
                    
                    if (maze[midX][midY].type === 1 && 
                        maze[neighbor.x][neighbor.y].level === current.level - 1) {
                        previous = current;
                        current = maze[neighbor.x][neighbor.y];
                        found = true;
                        break;
                    }
                }
            }
            
            if (!found) break;
        }
        enableCallback();
    }
}

// Utility function for delays
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
