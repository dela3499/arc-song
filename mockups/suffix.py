def uniqueInitialElements (x):
	return unique([xi[0] for xi in x])
def unique (x):
	return list(set(x))
def getInitialMatchingIndices(x,character):
	"finds those elements of a list that start with the provided character"
	myList = []
	for i,xi in enumerate(x):
		if xi[0] == character:
			myList.append(i)
	return myList

def elementsMatch(myList,index):
	"return true if all lists/strings in myList have identical elements at provided index"
	if len(unique([xi[index] for xi in myList])) == 1:
		return True
	else:
		return False

def getLongestSharedPrefix (x):
	lsp = ""
	lengthOfShortestString = min([len(xi) for xi in x])
	for i in range(lengthOfShortestString):
		if elementsMatch(x,i):
			lsp += x[0][i]
	return lsp
	
s = "abcdededeabc"
suffixes = [s[i:] for i in range(len(s))]

def func (x):
	"takes in a list of suffixes"
	uie = uniqueInitialElements(x)
	for e in uie: 
		suffixesStartingWithE = [x[i] for i in getInitialMatchingIndices(x,e)]
		longestSharedPrefix = getLongestSharedPrefix(suffixesStartingWithE)
		suffixTreeBranch = [

	

print func(suffixes)

# I need to decide how to break up the algorithm. I think I'll do everything one at a time, rather than creating lists of things to later evaluate. I think that will produce the clearest code.




suffixTree = []




















