All this should be done in the powershell console, i reccommend using VSC for this
To run the virtual env on windows firstly run paste this into console while in the python-virtual... folder:
Make sure you have python 3.9.x installed otherwise it will have a hissy fit
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
then run the Activate.ps1 in the Scripts folder. This should make (python-virtual-environment) appear at the start of the command line
now. 
Make sure when you run a command you run it in this terminal

now run 
python -m ensurepip
python -m pip install pip -U
python -m pip install -r  put the path to requirements.txt here

Now this should have installed all the packages

if you add a new package run the command:
pip freeze > requirements.txt
when in the Scripts folder

Not too sure on how to do it on linux but i assume its easier.
