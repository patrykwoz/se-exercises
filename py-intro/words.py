
def print_upper_words(words, must_start_with):
    """ 

    input: Words
    For a list of words, print out each word on a separate line, but in all uppercase.

    input: must_start with
    You are able to pass in a set of letters, and it only prints words that start with one of those letters.
    
    output:
    it prints out the subset of words that starts with one of the letters in must_Start_with
    it also capitalizes each word that it prints

    """
    must_start_with_lower = {char.lower() for char in must_start_with}
    words_lower = [word.lower() for word in words]

    matching_words = [word for word in words_lower if any(word.startswith(char) for char in must_start_with_lower)]
    for word in matching_words:
        print(word.upper())






print_upper_words(["hello", "hey", "goodbye", "yo", "Yes"], must_start_with={"h", "y"})