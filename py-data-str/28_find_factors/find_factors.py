def find_factors(num):
    """Find factors of num, in increasing order.

    >>> find_factors(10)
    [1, 2, 5, 10]

    >>> find_factors(11)
    [1, 11]

    >>> find_factors(111)
    [1, 3, 37, 111]

    >>> find_factors(321421)
    [1, 293, 1097, 321421]
    """
    set_factors = set()
    for inte in range(1,int((num**0.5)//1)):
        if num%inte==0:
            set_factors.add(inte)
            set_factors.add(int(num/inte))
            set_factors.add(int(num))
    return set_factors