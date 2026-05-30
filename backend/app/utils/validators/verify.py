def balance_transport(cls, self):
    dem_total = sum(self.demands)
    off_total = sum(self.offers)
    self.balanced = dem_total == off_total

    if dem_total > off_total:
        self.offers.append(dem_total-off_total)
        self.matrix.append([0 for i in range(len(self.demands))])

    elif dem_total < off_total:
        self.demands.append(off_total-dem_total)
        for i in range(len(self.offers)):
            self.matrix[i].append(0)

    return self

def balance_assignment(cls, self):
    while (len(self.matrix) > len(self.matrix[0])):
        for i in range(len(self.matrix)):
            self.matrix[i].append(0)

    while (len(self.matrix) < len(self.matrix[0])):
        self.matrix.append([0 for i in range(len(self.matrix[0]))])

    return self