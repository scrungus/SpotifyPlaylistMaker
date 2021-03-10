FROM python:3-onbuild  

# Coping source in current directory into the image
# python:3-onbuild expects the source in /usr/src/app
COPY . /usr/src/app

RUN pip install --upgrade pip 
RUN pip install mysql.connector

# Commands in a list
CMD ["python", "main.py"]

# Expose web port
EXPOSE 8002/tcp 