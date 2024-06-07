import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { useCallback, useEffect, useState } from "react";

function App() {
  const [data, setData] = useState();
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();

  const handleTitleChange = (event) => {
    setTitle(event.target.value)
  }

  const handleDescChange = (event) => {
    setDescription(event.target.value)
  }

  const handleGetTasks = () => {
    fetch("http://127.0.0.1:5000/tasks", { method: "GET" })
      .then(async (data) => {
        console.log("data", data);
        var json = await data.json();
        console.log("json", json);
        setData(json);
      })
      .catch((error) => {
        console.error("Error", error);
      });
  };

  useEffect(() => {
    handleGetTasks();
  }, []);

  const handleAddNewTask = () => {
    fetch("http://127.0.0.1:5000/tasks/add", {
      method: "POST",
      body: JSON.stringify({ title: title, description: description}),
    })
      .then(async (data) => {
        console.log("data", data);
        var json = await data.json();
        console.log("json from add", json);
        if (json.success == true){
          handleGetTasks();
          setTitle("")
          setDescription("")
        }else {
          throw "Failed to add task";
        }
      })
      .catch((error) => {
        console.error("Error", error);
      });
  };

  const handleDeleteTask = (id) => {
    fetch(`http://127.0.0.1:5000/tasks/${id}/delete`, { method: "POST" })
      .then(async (data) => {
        console.log("data", data);
        var json = await data.json();
        console.log("json from add", json);
        if (json.success == true) {
          handleGetTasks();
        } else {
          throw "Failed to delete task";
        }
      })
      .catch((error) => {
        console.error("Error", error);
      });
  };

  const handleUpdateTask = (id) => {
    fetch(`http://127.0.0.1:5000/tasks/${id}/complete`, { method: "POST" })
      .then(async (data) => {
        console.log("data", data);
        var json = await data.json();
        console.log("json from add", json);
        if (json.success == true) {
          handleGetTasks();
        } else {
          throw "Failed to complete task";
        }
      })
      .catch((error) => {
        console.error("Error", error);
      });
  };

  const ListItem = useCallback(({ title, description, completed, id }) => {
    return (
        <div style={{display: 'flex', flexDirection: 'row' , justifyContent: 'space-between', alignItems: 'center', width: '100%', margin: '.2em', padding: '.5em', background: '#ddd'}}>
        <div>
            <button onClick={()=> handleDeleteTask(id)}>Delete</button>
          </div>
          <div>
            <b>{title}</b> - {description}
          </div>
          <div>
           {completed ? "Complete!"  :  <button onClick={()=>handleUpdateTask(id)}>Completed</button>}
          </div>
          
        </div>
    );
  }, [data] )

  console.log('data', data)

  return (
    <div className="App" style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%'}}>
      <div style={{width: '100%'}}>
        <h1>To Do list!</h1>
        <div style={{ display: 'flex', flexDirection: 'column', margin: '2em', padding: ".5em", justifyContent: 'center', alignItems: 'center', background: '#eee'}}>
          {data &&
            data.map((item) => {
              return (
                <ListItem
                  title={item.title}
                  description={item.description}
                  completed={item.completed}
                  id={item.id}
                />
              );
            })}
        </div>
      </div>
      <div style={{margin: '1em', padding: '1em', width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: "center", background: '#eee'}}>
        <div><span>Title: </span><input type="text" name="Title" value={title} onChange={handleTitleChange}/></div>
        <div><span>Description: </span><input type="text" name="Title" value={description} onChange={handleDescChange} /></div>
        <button onClick={handleAddNewTask}>Add New</button>
      </div>
    </div>
  );
}

export default App;
