import mysql.connector
from mysql.connector import Error
import time


def create_connection(host_name, user_name, user_password):

    connection = None

    try:

        connection = mysql.connector.connect(

            host=host_name,

            user=user_name,

            passwd=user_password

        )

        print("Connection to MySQL DB successful")

    except Error as e:

        print(f"The error '{e}' occurred")


    return connection


def start():
    global connection
    connection = create_connection("localhost", "root", "fabio2021")

def end():
    connection.close()

connection = None

start()
end()