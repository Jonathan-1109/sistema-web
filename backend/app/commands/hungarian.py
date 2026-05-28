class hungarian_method:
    def __init__(self, matrix):
        self.matrix: list[list[float]] = matrix
        self.logs = {}
        self.clone: list[list[float]] = [fila[:] for fila in matrix]
        self.pos: list[list[float]] = [] 
        self.values: list[float] = [] 

    def resolve_hungarian(self):

        m = len(self.matrix)
        minorsRows = []
        minorsCols = []

        for i in range(m):
            minor = min(self.matrix[i])
            for j in range(m):
                self.matrix[i][j] -=  minor
            minorsRows.append(minor)
        
        self.logs["step1"] = {"matrix": self.matrix, "minorsRows": minorsRows}

        for i in range(m):
            minor = self.matrix[0][i]
            for j in range(m):
                if minor > self.matrix[j][i]:
                    minor = self.matrix[j][i]
            
            for j in range(m):
                self.matrix[j][i] -=  minor
            minorsCols.append(minor)
        
        self.logs["step2"] = {"matrix": self.matrix, "minorsCols": minorsCols}
        
        rows_covers = [False for i in range(m)]
        cols_covers = [False for i in range(m)]
    
        cont = 0
        while cont < 20: 
            self._cover_zeros(rows_covers,cols_covers)
            self.update_log(cont, rows_covers, cols_covers)
            total = sum(rows_covers) + sum(cols_covers)
            
            if total >= m:
                break
                
            self._ajust_matrix(rows_covers, cols_covers)
            cont += 1
        
        self._assignment()
        result = sum(self.values)
        self.logs["final"] = {"matrix": self.matrix, "values": self.values, "positions": self.pos, "result": result}
        
    def _cover_zeros(self, rows_covers, cols_covers):
        n = len(self.matrix)
        for i in range(n):
            rows_covers[i] = False
            cols_covers[i] = False

        for i in range(n):
            for j in range(n):
                if self.matrix[i][j] == 0 and not rows_covers[i] and not cols_covers[j]:
                    cols_covers[j] = True

            for i in range(n):
                for j in range(n):
                    if self.matrix[i][j] == 0 and not cols_covers[j]:
                        rows_covers[i] = True
        
    def _ajust_matrix(self, rows_covers, cols_covers):
        m = len(self.matrix)
        min_no_covert = float('inf') 
        for i in range(m):
            for j in range(m):
                if not rows_covers[i] and not cols_covers[j]:
                    if self.matrix[i][j] < min_no_covert:
                        min_no_covert = self.matrix[i][j]

        for i in range(m):
            for j in range(m):
                if not rows_covers[i] and not cols_covers[j]:
                    self.matrix[i][j] -= min_no_covert
                if rows_covers[i] and cols_covers[j]:
                    self.matrix[i][j] += min_no_covert

    def _assignment(self):
        cols = [False for i in range(len(self.matrix[0]))]
        cont = []
        while len(self.values) < len(self.matrix):
            minors = []
            for i in range(len(self.matrix)):
                cont = 0
                for j in range(len(self.matrix[0])):
                    if not self.matrix[i][j] and not cols[j]:
                        cont += 1
                minors.append(cont)

            minor = min(filter(lambda x: x != 0, minors))
            send = minors.index(minor)

            for i in range(len(self.matrix[0])):
                if self.matrix[send][i] == 0 and not cols[i]:
                    self.values.append(self.clone[send][i])
                    self.pos.append([send, i])
                    cols[i] = True

    def update_log(self, n:int, rc: list[bool], cc: list[bool]):
        key = f"iter{n+1}"
        dictLog = {key:{"matrix":self.matrix, "rowsCovers": rc, "colsCovers": cc}}
        self.logs.update(dictLog)