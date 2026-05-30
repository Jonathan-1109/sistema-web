from .base_transport import transport

class nortwest_corner_method(transport):

    def __init__(self, matrix, offers, demands):
        super().__init__(matrix, offers, demands)

    def resolve_nortwest(self):
        cont = 0
        while True:

            if not (self.offers and self.demands):
                self.result = sum(self.values)
                return

            min_of_dem = self.offers[0] if self.offers[0] < self.demands[0] else self.demands[0]
            self.save_matrix(min_of_dem, self.matrix[0][0], 0, 0, cont)
            self.values.append(min_of_dem * self.matrix[0][0])
            self.offers[0] = self.offers[0] - min_of_dem
            self.demands[0] = self.demands[0] - min_of_dem

            if not self.demands[0]:
                self.demands.pop(0)
                for i in range(len(self.matrix)):
                    self.matrix[i].pop(0)

            if not self.offers[0]:
                self.offers.pop(0)
                self.matrix.pop(0)

            cont += 1
