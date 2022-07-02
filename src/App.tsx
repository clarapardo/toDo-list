import React, { FC, useEffect, useState } from 'react';
import './App.css';
import TodoTask from './components/TodoTask'
import NewTask from './components/NewTask'
import { getTasks, addTask, updateTask, deleteTask } from './API'
import { currentDay } from './utils/dateFormater'
import DatePicker from 'sassy-datepicker'



const App: FC = () => {

  const [tasks, setTasks] = useState<ITask[]>([])
  const [dailyTasks, setDailyTasks] = useState<ITask[]>([])
  const [date, setDate] = useState(new Date())


  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = (): void => {
    getTasks()
      .then(({ data: { tasks } }: ITask[] | any) => setTasks(tasks))
      .catch((err: Error) => console.log(err))
  }



  const handleSaveTask = (e: React.FormEvent, formData: ITask): void => {
    e.preventDefault()

    addTask(formData)
      .then(({ status, data }) => {

        if (status !== 201) {
          throw new Error("Error! Task not saved")
        }

        setTasks(data.tasks)
        fetchTasks()
      })
      .catch((err: Error) => console.log(err))
  }

  const handleUpdateTask = (task: ITask): void => {

    updateTask(task)
      .then(({ status, data }) => {
        if (status !== 200) {
          throw new Error("Error! Task not updated")
        }
        fetchTasks()
      })
      .catch(err => console.log(err))
  }

  const handleDeleteTask = (_id: string): void => {

    deleteTask(_id)
      .then(({ status, data }) => {
        if (status !== 200) {
          throw new Error("Error! Task not deleted")
        }
        fetchTasks()
      })
      .catch(err => console.log(err))
  }



  const onChange = (newDate: Date) => setDate(newDate)

  const filterByDate = (task: any) => {

    if (new Date(task.deadline).getDate() === date.getDate() &&
      new Date(task.deadline).getMonth() === date.getMonth() &&
      new Date(task.deadline).getFullYear() === date.getFullYear()) {
      return task
    }
  }

  const orderConditions = (taskA: any, taskB: any): number => {

    let deadlineA = new Date(taskA.deadline)
    let deadlineB = new Date(taskB.deadline)

    if (taskB.status === 'toDo' && taskA.status === 'completed') {
      return 1
    } else if (taskA.status === 'toDo' && taskB.status === 'completed') {
      return -1
    } else if (taskB.status === 'toDo' && taskA.status === 'toDo') {
      if (deadlineB.getHours() > deadlineA.getHours()) {
        return -1
      } else if (deadlineB.getHours() < deadlineA.getHours()) {
        return 1
      } else {
        if (deadlineB.getMinutes() > deadlineA.getMinutes()) {
          return -1
        } else {
          return 1
        }
      }
    } else {
      if (deadlineB.getHours() > deadlineA.getHours()) {
        return -1
      } else if (deadlineB.getHours() < deadlineA.getHours()) {
        return 1
      } else {
        if (deadlineB.getMinutes() > deadlineA.getMinutes()) {
          return -1
        } else {
          return 1
        }
      }
    }
  }

  const orderByStatus = (taskA: any, taskB: any): number => {

    if (taskB.status === 'toDo' && taskA.status === 'completed') {
      return -1
    } else {
      return 1
    }
  }


  return (
    <div className="App">

      <div className="left-panel">
        <h1><img className='logo' src="/img/todoList.png" alt="todoList-icon" />daily planner</h1>
        <NewTask saveTask={handleSaveTask} />
        <DatePicker onChange={onChange} />
      </div>

      <div className="right-panel">

        <div className="column1">
          <h1>Today's schedule</h1>
          <h1 className="currentDay">{currentDay(date)}</h1>

          <div>
            {tasks
              .filter(task => filterByDate(task))
              .sort(orderConditions)
              .map((task: ITask) => {
                return <TodoTask key={task._id} updateTask={handleUpdateTask} deleteTask={handleDeleteTask} task={task} />
              })}
          </div>
        </div>

        <div className="column2">
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" id="blobSvg" filter="blur(0.2px)" className='style1' transform="rotate(-3)"><path id="blob" fill="url(#gradient)" className='style1'><animate attributeName="d" dur="10000ms" repeatCount="indefinite" values="M440.5,320.5Q418,391,355.5,442.5Q293,494,226,450.5Q159,407,99,367Q39,327,31.5,247.5Q24,168,89,125.5Q154,83,219.5,68Q285,53,335.5,94.5Q386,136,424.5,193Q463,250,440.5,320.5Z;M453.78747,319.98894Q416.97789,389.97789,353.96683,436.87838Q290.95577,483.77887,223.95577,447.43366Q156.95577,411.08845,105.64373,365.97789Q54.33169,320.86732,62.67444,252.61056Q71.01719,184.3538,113.01965,135.21007Q155.02211,86.06634,220.52211,66.46683Q286.02211,46.86732,335.5,91.94472Q384.97789,137.02211,437.78747,193.51106Q490.59704,250,453.78747,319.98894Z;M411.39826,313.90633Q402.59677,377.81265,342.92059,407.63957Q283.24442,437.46649,215.13648,432.5428Q147.02853,427.61911,82.23325,380.9572Q17.43796,334.29529,20.45223,250.83809Q23.46649,167.38089,82.5856,115.05707Q141.70471,62.73325,212.19045,63.73015Q282.67618,64.72705,352.67308,84.79839Q422.66998,104.86972,421.43486,177.43486Q420.19974,250,411.39826,313.90633Z;M440.5,320.5Q418,391,355.5,442.5Q293,494,226,450.5Q159,407,99,367Q39,327,31.5,247.5Q24,168,89,125.5Q154,83,219.5,68Q285,53,335.5,94.5Q386,136,424.5,193Q463,250,440.5,320.5Z;"></animate></path><defs><linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" className='style2'></stop><stop offset="100%" className='style3'></stop></linearGradient></defs></svg>
          <div className='time-weather'>
            <p>la hora + tiempo</p>
          </div>
          <div className="premium">
            <h4>hazte premium</h4>
          </div>
        </div>

      </div>

    </div>
  )
}

export default App
