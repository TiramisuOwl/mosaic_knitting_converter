# Input:
# Row 1: With Color A, k1, sl1, k1, *k3, sl2* (repeat 20 times from *), k1, sl1, k1
# Row 2: Turn work, k1, sl1, k1, *sl2, k3* (repeat 20 times from *), k1, sl1, k1

import re


class input_validation:
    def __init__(self, instructions):
        self.instructions = instructions
        self.rows = instructions.split("\n")

    def validate(self):
        for index, row in enumerate(self.rows):
            if not re.match(r"Row [0-9]+:", row):
                raise ValueError("Error on row " + str(index + 1) + ": Expected each line to start with 'Row [number]:'.")
        return self.instructions

