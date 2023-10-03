def reverse_vowels(s):
    """Reverse vowels in a string.

    Characters which re not vowels do not change position in string, but all
    vowels (y is not a vowel), should reverse their order.

    >>> reverse_vowels("Hello!")
    'Holle!'

    >>> reverse_vowels("Tomatoes")
    'Temotaos'

    >>> reverse_vowels("Reverse Vowels In A String")
    'RivArsI Vewols en e Streng'

    reverse_vowels("aeiou")
    'uoiea'

    reverse_vowels("why try, shy fly?")
    'why try, shy fly?''
    """
    vowels = 'aeiouAEIOU'
    s_list = list(s)
    i, j = 0, len(s_list) - 1

    while i < j:
        if s_list[i] in vowels and s_list[j] in vowels:
            s_list[i], s_list[j] = s_list[j], s_list[i]
            i += 1
            j -= 1
        elif s_list[i] in vowels:
            j -= 1
        elif s_list[j] in vowels:
            i += 1
        else:
            i += 1
            j -= 1

    return ''.join(s_list)