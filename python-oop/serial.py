"""Python serial number generator."""

class SerialGenerator:
    """Machine to create unique incrementing serial numbers.
    
    >>> serial = SerialGenerator(start=100)

    >>> serial.generate()
    100

    >>> serial.generate()
    101

    >>> serial.generate()
    102

    >>> serial.reset()

    >>> serial.generate()
    100
    """
    def __init__(self, start=0):
        """
        Initialize the SerialGenerator with a starting value.

        Args:
            start (int, optional): The starting value for the serial numbers. Default is 0.
        """
        self.start = start
        self.counter = start - 1
    def __repr__(self):
        return f"<SerialGenerator(start={self.start})>"

    def generate(self):
        """
        Generate the next serial number.

        Returns:
            int: The next serial number.
        """
        self.counter += 1
        return self.counter

    def reset(self):
        """Reset the serial number generator to the initial starting value."""
        self.counter = self.start