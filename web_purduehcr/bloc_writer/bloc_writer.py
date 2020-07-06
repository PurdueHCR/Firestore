import os

def main():
    print("What is the name of this new bloc?")
    print("Enter the name in lowercase with underscores between words and dont include the word bloc.")
    print("Examples: submit_points, link, handle_point")
    name = input("")
    capName = name.replace("_", " ")
    capName = capName.title()
    capName = capName.replace(" ","")
    createFolder(name)
    createHeaderFile(capName, name)
    createBlocFile(capName, name)
    createEventFile(capName, name)
    createStateFile(capName, name)
    createRepositoryFile(capName, name)
    print("Files created. You will have to move them from the directory where this command lives to the correct repository.")
    

def createFolder(dirName):
    try:
        os.mkdir(dirName+"_bloc")
        print("Directory " , dirName ,  " Created ") 
    except FileExistsError:
        print("Directory " , dirName ,  " already exists")

    

def createHeaderFile(capName, name):
    with open('header.txt') as header_template:
        lines = header_template.readlines()

    filename = name+"_bloc/"+name+'.dart'
    with open(filename, 'w') as f:
        for line in lines:
            f.write(line.replace('$',capName).replace('#',name.lower()))

def createBlocFile(capName, name):
    with open('bloc.txt') as header_template:
        lines = header_template.readlines()

    filename = name+"_bloc/"+name+'_bloc.dart'
    with open(filename, 'w') as f:
        for line in lines:
            f.write(line.replace('$',capName).replace('#',name.lower()))

def createEventFile(capName, name):
    with open('event.txt') as header_template:
        lines = header_template.readlines()

    filename = name+"_bloc/"+name+'_event.dart'
    with open(filename, 'w') as f:
        for line in lines:
            f.write(line.replace('$',capName).replace('#',name.lower()))

def createStateFile(capName, name):
    with open('state.txt') as header_template:
        lines = header_template.readlines()

    filename = name+"_bloc/"+name+'_state.dart'
    with open(filename, 'w') as f:
        for line in lines:
            f.write(line.replace('$',capName).replace('#',name.lower()))

def createRepositoryFile(capName, name):
    with open('repository.txt') as header_template:
        lines = header_template.readlines()

    filename = name+"_bloc/"+name+'_repository.dart'
    with open(filename, 'w') as f:
        for line in lines:
            f.write(line.replace('$',capName).replace('#',name.lower()))


if __name__ == '__main__':
    main()
