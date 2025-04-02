import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [ tasks, setTasks ] = useState( [] );
  const [ newTask, setNewTask ] = useState( { title: '', description: '' } );
  const [ editingTask, setEditingTask ] = useState( null );

  const API_URL = 'http://localhost:5000/api/tasks';

  useEffect( () => {
    fetchTasks();
  }, [] );

  const fetchTasks = async () => {
    try
    {
      const response = await axios.get( API_URL );
      setTasks( response.data );
    } catch ( error )
    {
      console.error( 'Error fetching tasks:', error );
    }
  };

  const handleCreateTask = async ( e ) => {
    e.preventDefault();
    try
    {
      await axios.post( API_URL, newTask );
      setNewTask( { title: '', description: '' } );
      fetchTasks();
    } catch ( error )
    {
      console.error( 'Error creating task:', error );
    }
  };

  const handleUpdateTask = async ( e ) => {
    e.preventDefault();
    try
    {
      await axios.put( `${API_URL}/${editingTask.id}`, editingTask );
      setEditingTask( null );
      fetchTasks();
    } catch ( error )
    {
      console.error( 'Error updating task:', error );
    }
  };

  const handleDeleteTask = async ( taskId ) => {
    try
    {
      await axios.delete( `${API_URL}/${taskId}` );
      fetchTasks();
    } catch ( error )
    {
      console.error( 'Error deleting task:', error );
    }
  };


  const toggleTaskCompletion = async ( task ) => {
    try
    {
      await axios.put( `${API_URL}/${task.id}`, {
        ...task,
        completed: !task.completed
      } );
      fetchTasks();
    } catch ( error )
    {
      console.error( 'Error toggling task completion:', error );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">Task Manager</h1>

        {!editingTask && (
          <form onSubmit={handleCreateTask} className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Create New Task</h2>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Task Title"
                className="w-full p-2 border border-gray-300 rounded"
                value={newTask.title}
                onChange={( e ) => setNewTask( { ...newTask, title: e.target.value } )}
                required
              />
            </div>
            <div className="mb-4">
              <textarea
                placeholder="Task Description"
                className="w-full p-2 border border-gray-300 rounded"
                value={newTask.description}
                onChange={( e ) => setNewTask( { ...newTask, description: e.target.value } )}
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Add Task
            </button>
          </form>
        )}

        {editingTask && (
          <form onSubmit={handleUpdateTask} className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Edit Task</h2>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Task Title"
                className="w-full p-2 border border-gray-300 rounded"
                value={editingTask.title}
                onChange={( e ) => setEditingTask( { ...editingTask, title: e.target.value } )}
                required
              />
            </div>
            <div className="mb-4">
              <textarea
                placeholder="Task Description"
                className="w-full p-2 border border-gray-300 rounded"
                value={editingTask.description || ''}
                onChange={( e ) => setEditingTask( { ...editingTask, description: e.target.value } )}
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                Update Task
              </button>
              <button
                type="button"
                onClick={() => setEditingTask( null )}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div>
          <h2 className="text-xl font-semibold mb-3">Tasks</h2>
          {tasks.length === 0 ? (
            <p className="text-gray-500">No tasks yet. Create one!</p>
          ) : (
            <ul className="space-y-3">
              {tasks.map( ( task ) => (
                <li
                  key={task.id}
                  className={`border ${task.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'} rounded-lg p-4 shadow-sm`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className={`text-lg font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="text-gray-600 mt-1">{task.description}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-2">
                        Created: {new Date( task.created_at ).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => toggleTaskCompletion( task )}
                        className={`${task.completed ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'} text-white px-3 py-1 rounded text-sm`}
                      >
                        {task.completed ? 'Undo' : 'Complete'}
                      </button>
                      <button
                        onClick={() => setEditingTask( task )}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTask( task.id )}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ) )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;