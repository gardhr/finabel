from finabel import finabel
import sys
argv = sys.argv
argc = len(argv)
print("Usage:", argv[0], "[KEY] [SALT] [ROUNDS] [DIGITS] [COST]")
key = ""
if argc > 1:
    key = argv[1]
salt = ""
if argc > 2:
    salt = argv[2]
rounds = 0
if argc > 3:
    rounds = int(argv[3])
digits = 0
if argc > 4:
    digits = int(argv[4])
cost = 0
if argc > 5:
    cost = int(argv[5])
print(finabel(key, salt, rounds, digits, cost))
 
