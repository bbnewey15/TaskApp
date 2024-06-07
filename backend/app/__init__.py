from flask import Flask, jsonify
from flask_cors import CORS

from flask import request, jsonify
from app.models import Task, db
import json


def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tasks.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    @app.route('/test')
    def index():
        return jsonify({"data": "test"})
    
    @app.route('/tasks', methods=['GET', 'POST'])
    def handle_tasks():
        if request.method == 'GET':
            tasks = Task.query.all()
            print(f"tasks: {tasks}")
            return jsonify([{'id': task.id, 'title': task.title, 'description': task.description, 'completed': task.completed} for task in tasks]), 200
        
        return
        
     
    @app.route("/tasks/add", methods=["GET", "POST"])
    def task_add():
        if request.method == "POST":
            data = json.loads(request.data)

            task = Task(
                title=data["title"],
                description=data["description"],
            )
            db.session.add(task)
            db.session.commit()
            return jsonify({"success": True, "id": task.id})
        
        return


    @app.route("/tasks/<int:id>/complete", methods=["GET", "POST"])
    def task_complete(id):
        task = db.get_or_404(Task, id)

        if request.method == "POST":
            db.session.query(Task).filter_by(id=id).update({"completed": True})
            db.session.commit()
            return jsonify({"success": True})

        return

    @app.route("/tasks/<int:id>/delete", methods=["GET", "POST"])
    def task_delete(id):
        task = db.get_or_404(Task, id)

        if request.method == "POST":
            db.session.delete(task)
            db.session.commit()
            return jsonify({"success": True})

        return
            
    
        

    CORS(app)
    db.init_app(app)

    with app.app_context():
        
        db.create_all()

    return app