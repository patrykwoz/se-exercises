def same_frequency(num1, num2):
    """Do these nums have same frequencies of digits?
    
        >>> same_frequency(551122, 221515)
        True
        
        >>> same_frequency(321142, 3212215)
        False
        
        >>> same_frequency(1212, 2211)
        True
    """
    num1Str = str(num1)
    num2Str = str(num2)
    num1_dict = {num:num1Str.count(num) for num in num1Str}
    num2_dict = {num:num2Str.count(num) for num in num2Str}
    return sorted(num1_dict.values()) == sorted(num2_dict.values())