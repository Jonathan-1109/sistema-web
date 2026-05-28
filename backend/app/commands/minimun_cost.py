from .base_transport import transport

class minimun_cost_method(transport):

    def __init__(self, matrix, offers, demands):
        super().__init__(matrix, offers, demands)

    def resolve_minimun_cost(self):
        cont = 0

        while True:

            minimun = float('inf')
            x = 0
            y = 0

            for i in range(len(self.matrix)):
                for j in range(len(self.matrix[0])):
                    if self.matrix[i][j] < minimun:
                        minimun = self.matrix[i][j]
                        y = i
                        x = j

            min_of_dem = self.demands[x] if self.demands[x] < self.offers[y] else self.offers[y]
            self.save_matrix(min_of_dem, minimun, x,y, cont)
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