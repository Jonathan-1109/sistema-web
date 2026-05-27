from .base_transport import transport

class vogel_approximation_method(transport):

    def __init__(self, matrix, offers, demands):
        super().__init__(matrix, offers, demands)

    def resolve_vogel(self):
        cont = 0

        while True:
            row_penalties = []
            for row in self.matrix:
                if len(row) >= 2:
                    sorted_row = sorted(row)
                    row_penalties.append(sorted_row[1] - sorted_row[0])
                elif len(row) == 1:
                    row_penalties.append(row[0])
                else:
                    row_penalties.append(-1)

            col_penalties = []
            if len(self.matrix) > 0:
                for j in range(len(self.matrix[0])):
                    col = [self.matrix[i][j] for i in range(len(self.matrix))]
                    if len(col) >= 2:
                        sorted_col = sorted(col)
                        col_penalties.append(sorted_col[1] - sorted_col[0])
                    elif len(col) == 1:
                        col_penalties.append(col[0])
                    else:
                        col_penalties.append(-1)
            else:
                col_penalties = []

            max_row_pen = max(row_penalties) if row_penalties else -1
            max_col_pen = max(col_penalties) if col_penalties else -1

            y = -1 
            x = -1 

            if max_row_pen >= max_col_pen and max_row_pen != -1:
                y = row_penalties.index(max_row_pen)
                minimun = min(self.matrix[y])
                x = self.matrix[y].index(minimun)
            else:
                if max_col_pen != -1:
                    x = col_penalties.index(max_col_pen)
                    col = [self.matrix[i][x] for i in range(len(self.matrix))]
                    minimun = min(col)
                    y = col.index(minimun)
                else:
                    break

            min_of_dem = self.demands[x] if self.demands[x] < self.offers[y] else self.offers[y]
            self.save_matrix(min_of_dem, minimun, cont, x, y, row_penalties, col_penalties)
            self.values.append(min_of_dem * minimun)

            self.demands[x] = self.demands[x] - min_of_dem
            self.offers[y] = self.offers[y] - min_of_dem

            if (self.demands == [0] and self.offers == [0]):
                self.result = sum(self.values)
                return

            if not self.demands[x]:
                self.demands.pop(x)
                for i in range(len(self.matrix)):
                    self.matrix[i].pop(x)

            if not self.offers[y]:
                self.offers.pop(y)
                self.matrix.pop(y)
                
            cont += 1

    def save_matrix(self, value1, value2, n, x, y, row_penalties, colt_penalties):
        super().save_matrix(value1, value2, x, y, n)
        self.logs[f"iter{n + 1}"][f"penaltiesRows"] = row_penalties
        self.logs[f"iter{n + 1}"][f"penaltiesColt"] = colt_penalties
