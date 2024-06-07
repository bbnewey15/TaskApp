import sqlite3

connection = sqlite3.connect('tasks.db')


with open('schema.sql') as f:
    connection.executescript(f.read())

cur = connection.cursor()

cur.execute("INSERT INTO tasks (title, description) VALUES (?, ?)",
            ('First Post', 'description for the first post')
            )

cur.execute("INSERT INTO tasks (title, description) VALUES (?, ?)",
            ('Second Post', 'description for the second post')
            )

connection.commit()
connection.close()