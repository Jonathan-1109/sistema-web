from json import dumps, loads, JSONDecodeError

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

def serialize(data_to_serialize: dict):
    return {key: dumps(value) if isinstance(value, dict) or isinstance(value, list) or isinstance(value, bool) else value for key,value in data_to_serialize.items()}

def deserialize(data_to_deserialize: dict):
        deserialized = {}
        for key, value in data_to_deserialize.items():
            try:
                deserialized[key.decode()] = loads(value)
            except JSONDecodeError:
                if isinstance(value, bytes):
                    value = value.decode()
                deserialized[key.decode()] = value
        return deserialized

def get_name(name:str):
    match name:
        case "costo_minimo":
            return "Costo minimo"
        case "esquina_noroeste":
            return "Esquina noroeste"
        case "vogel":
            return "Aproximación de vogel"
        case "hungaro":
                return "Método húngaro"
        case _:
            return name.capitalize()