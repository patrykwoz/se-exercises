"""Word Finder: finds random words from a dictionary."""
from random import choice


class WordFinder:
    """Machine read a .txt file and pick random words from that file

    >>>wf = WordFinder("test.txt")
    1 words read

    >>>wf.random()
    'test'
    """
    def __init__(self, path):
        self.path = path
        self.list_words = self.read_words()
        self.init_msg()
    def __repr__(self):
        return f"<WordFinder('{self.path}')>"
        
    def read_words(self):
        words_from_file = []
        with open(self.path, 'r') as file:
            for line in file:
                words_from_file.append(line.strip())
        return words_from_file
    def random(self):
        rnd_word = choice(self.list_words)
        return rnd_word
    def init_msg(self):
        msg = f'{len(self.list_words)} words read.'
        print(msg)


class SpecialWordFinder(WordFinder):
    """Machine read a .txt file and pick random words from that file
    it will ignore empty lines and comments starting with #

    >>>sf = SpecialWordFinder("test_special.txt")
    3 words read

    >>>sf.random()
    'test'
    """
    def __init__(self,path):
        super().__init__(path)
        self.list_words = self.remove_special()
    def remove_special(self):
        clean_words = [word for word in self.list_words if ((word != '') and (word[0] != '#'))]
        return clean_words
    def __repr__(self):
        return f"<SpecialWordFinder('{self.path}')>"