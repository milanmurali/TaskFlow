import React, { useEffect, useState } from 'react';
import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL;

export default function TaskFlow() {

  const [tasks, setTasks] = useState([])

  const [filter, setFilter] = useState('all')
  const [filteredTasks, setFilteredTasks] = useState([])

  const [newTask, setNewTask] = useState('')

  const [editTaskId, setEditTaskId] = useState(null)
  const [editTitle, setEditTitle] = useState('')

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/task/view`)
      setTasks(response.data)
    } catch (error) {
      console.log(error);
    }
  }

  const addTask = async () => {
    if (!newTask.trim()) return;
    try {
      await axios.post(`${BASE_URL}/task/add`, { title: newTask })
      setNewTask('')
      fetchTasks()
    } catch (error) {
      console.log(error);
    }
  }

  const toggleTask = async (id, currentStatus) => {
    try {
      await axios.put(`${BASE_URL}/task/update/${id}`, { status: !currentStatus })
      fetchTasks()
    } catch (error) {
      console.log(error);
    }
  }

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/task/delete/${id}`)
      fetchTasks()
    } catch (error) {
      console.log(error);
    }
  }

  const startEditing = (task) => {
    setEditTaskId(task._id)
    setEditTitle(task.title)
  }

  const cancelEditing = () => {
    setEditTaskId(null)
    setEditTitle('')
  }

  const saveTaskUpdate = async () => {
    if (!editTitle.trim()) return;
    try {
      await axios.put(`${BASE_URL}/task/update/${editTaskId}`, { title: editTitle })
      setEditTaskId(null)
      setEditTitle('')
      fetchTasks()
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])


  useEffect(() => {
    if (filter === 'all') {
      setFilteredTasks(tasks)
    } else if (filter === 'pending') {
      setFilteredTasks(tasks.filter(task => !task.status))
    } else if (filter === 'completed') {
      setFilteredTasks(tasks.filter(task => task.status))
    }
  }, [filter, tasks])


  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">

        {/* Header part */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            TaskFlow
          </h1>

          <span className="text-sm text-gray-500 font-medium">
            {filteredTasks.length} {filter === 'all' ? 'tasks' : filter === 'pending' ? 'pending' : 'completed'}
          </span>
        </div>

        {/* Add Task */}
        <div className="relative">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
            className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-gray-700 placeholder-gray-400"
            placeholder="What needs to be done?"
          />
          <button onClick={addTask} className="absolute right-2 top-2 bottom-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 rounded-md font-medium transition-colors text-sm">
            Add
          </button>
        </div>

        {/* Filters */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {['all', 'pending', 'completed'].map((button) => (
            <button
              key={button}
              onClick={() => setFilter(button)}
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all capitalize ${filter === button
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
            >
              {button}
            </button>
          ))}
        </div>

        {/* Task List */}
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <div key={task._id} className="group flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg hover:shadow-md transition-all">

              {editTaskId === task._id ? (
                // Edit taskkk
                <div className="flex items-center w-full space-x-2">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveTaskUpdate();
                      if (e.key === 'Escape') cancelEditing();
                    }}
                    autoFocus
                    className="flex-1 px-2 py-1 border border-indigo-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none text-gray-700"
                  />
                  <button onClick={saveTaskUpdate} className="text-green-600 hover:text-green-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                  <button onClick={cancelEditing} className="text-red-500 hover:text-red-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

              ) : (

                // View Mode
                <>
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={task.status}
                      onChange={() => toggleTask(task._id, task.status)}
                      className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                    />
                    <span className={`text-gray-700 font-medium ${task.status ? 'line-through text-gray-400' : ''}`}>
                      {task.title}
                    </span>
                  </div>
                  <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => startEditing(task)} className="text-gray-400 hover:text-indigo-600 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button onClick={() => deleteTask(task._id)} className="text-gray-400 hover:text-red-500 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

      </div>
    </div >
  );
};
