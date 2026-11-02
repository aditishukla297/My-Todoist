'use client'

import { useMemo, useState } from 'react'
import { CalendarDays, Check, Circle, Plus, Trash2 } from 'lucide-react'

const initialTasks = [
  { id: 1, title: 'Review project brief', category: 'Work', due: 'Today', completed: true },
  { id: 2, title: 'Book dentist appointment', category: 'Personal', due: 'Today', completed: false },
  { id: 3, title: 'Buy flowers for the weekend', category: 'Personal', due: 'Tomorrow', completed: false },
  { id: 4, title: 'Plan next week’s priorities', category: 'Work', due: 'Fri, 14 Jun', completed: false },
]

export default function Page() {
  const [tasks, setTasks] = useState(initialTasks)
  const [newTask, setNewTask] = useState('')
  const [category, setCategory] = useState('Personal')
  const [deadline, setDeadline] = useState(new Date().toISOString().slice(0, 10))
  const [filter, setFilter] = useState('All')
  const todayLabel = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date())
  const todayShort = new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).format(new Date())

  const visibleTasks = useMemo(() => tasks.filter((task) => {
    if (filter === 'Today') return (task.due === 'Today' || task.due === todayShort) && !task.completed
    if (filter === 'Completed') return task.completed
    return true
  }), [filter, tasks])

  const addTask = () => {
    const title = newTask.trim()
    if (!title) return
    const due = new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).format(new Date(`${deadline}T12:00:00`))
    setTasks((current) => [{ id: Date.now(), title, category, due, completed: false }, ...current])
    setNewTask('')
    setCategory('Personal')
    setDeadline(new Date().toISOString().slice(0, 10))
  }

  const toggleTask = (id) => setTasks((current) => current.map((task) => task.id === id ? { ...task, completed: !task.completed } : task))
  const removeTask = (id) => setTasks((current) => current.filter((task) => task.id !== id))
  const completedCount = tasks.filter((task) => task.completed).length

  return (
    <main className="min-h-screen bg-[#fff8fb] px-5 py-8 text-[#2f2029] sm:px-8 sm:py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-[#df6f9b]"><CalendarDays aria-hidden="true" className="size-4" />{todayLabel}</p>
            <h1 className="text-4xl font-black tracking-[-0.04em] text-[#39252f] sm:text-5xl">My tasks</h1>
            <p className="mt-2 text-base text-[#a88796]">A little progress every day.</p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-[#f5d9e5] bg-white px-4 py-3 shadow-[0_8px_30px_rgba(220,119,155,0.08)]">
            <div className="flex size-10 items-center justify-center rounded-full bg-[#fff0f5] text-[#df6f9b]"><Check aria-hidden="true" /></div>
            <div><p className="text-2xl font-black leading-none text-[#39252f]">{completedCount}/{tasks.length}</p><p className="mt-1 text-xs font-semibold text-[#b494a1]">completed</p></div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[220px_1fr]">
          <aside className="flex flex-row gap-2 overflow-auto lg:flex-col lg:gap-1">
            {['All', 'Today', 'Completed'].map((item) => (
              <button key={item} type="button" onClick={() => setFilter(item)} className={`whitespace-nowrap rounded-xl px-4 py-3 text-left text-sm font-bold transition ${filter === item ? 'bg-[#f6b3cc] text-[#542d3e] shadow-[0_8px_20px_rgba(223,111,155,0.16)]' : 'text-[#a88796] hover:bg-white hover:text-[#df6f9b]'}`}>
                {item}{item === 'All' && <span className="ml-2 text-xs opacity-60">{tasks.length}</span>}
              </button>
            ))}
            <div className="mt-auto hidden rounded-2xl bg-[#fff0f5] p-4 text-sm leading-6 text-[#ad718b] lg:block"><span className="font-bold text-[#df6f9b]">Tip:</span> Keep your list small and focused. You’ve got this.</div>
          </aside>

          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-[#f5d9e5] bg-white p-2 pl-4 shadow-[0_8px_30px_rgba(220,119,155,0.08)]">
              <input aria-label="New task" value={newTask} onChange={(event) => setNewTask(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') addTask() }} placeholder="Add a new task..." className="min-w-[180px] flex-1 bg-transparent py-3 text-sm font-medium text-[#39252f] outline-none placeholder:text-[#c6aeba]" />
              <label className="flex shrink-0 items-center gap-2 rounded-lg bg-[#fffafd] px-3 py-2 text-xs font-bold text-[#b494a1]">
                <CalendarDays aria-hidden="true" className="size-4 text-[#df6f9b]" />
                <span className="sr-only">Deadline</span>
                <input aria-label="Task deadline" type="date" value={deadline} onChange={(event) => setDeadline(event.target.value)} className="bg-transparent text-xs font-bold text-[#c47796] outline-none" />
              </label>
              <fieldset className="flex items-center gap-1" aria-label="Task category">
                <legend className="sr-only">Task category</legend>
                {['Personal', 'Work'].map((option) => (
                  <label key={option} className={`flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition ${category === option ? 'bg-[#fff0f5] text-[#c47796]' : 'text-[#b494a1] hover:bg-[#fffafd]'}`}>
                    <input type="radio" name="task-category" value={option} checked={category === option} onChange={() => setCategory(option)} className="accent-[#df6f9b]" />
                    {option}
                  </label>
                ))}
              </fieldset>
              <button type="button" onClick={addTask} aria-label="Add task" className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#df6f9b] text-white transition hover:bg-[#cc5d88] active:scale-95"><Plus aria-hidden="true" /></button>
            </div>

            <div className="overflow-hidden rounded-3xl border border-[#f5d9e5] bg-white shadow-[0_12px_40px_rgba(220,119,155,0.08)]">
              <div className="flex items-center justify-between border-b border-[#fae8ef] px-5 py-4 sm:px-6"><h2 className="font-black text-[#4a2c39]">{filter === 'All' ? 'All tasks' : filter}</h2><span className="text-xs font-bold text-[#c19aaa]">{visibleTasks.length} items</span></div>
              <div className="divide-y divide-[#fae8ef]">
                {visibleTasks.length === 0 ? <div className="px-6 py-14 text-center text-sm text-[#b494a1]">Nothing here yet. Add a task to get started.</div> : visibleTasks.map((task) => (
                  <div key={task.id} className="group flex items-center gap-4 px-5 py-5 transition hover:bg-[#fffafd] sm:px-6">
                    <button type="button" onClick={() => toggleTask(task.id)} aria-label={task.completed ? `Mark ${task.title} incomplete` : `Complete ${task.title}`} className={`flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition ${task.completed ? 'border-[#df6f9b] bg-[#df6f9b] text-white' : 'border-[#e9bfce] text-transparent hover:border-[#df6f9b]'}`}><Check aria-hidden="true" className="size-3.5" /></button>
                    <div className="min-w-0 flex-1"><p className={`truncate text-sm font-bold ${task.completed ? 'text-[#c5aeb8] line-through' : 'text-[#4a2c39]'}`}>{task.title}</p><div className="mt-2 flex items-center gap-3 text-xs font-semibold text-[#b494a1]"><span className="rounded-full bg-[#fff0f5] px-2.5 py-1 text-[#c47796]">{task.category}</span><span className="flex items-center gap-1"><CalendarDays aria-hidden="true" className="size-3.5" />{task.due}</span></div></div>
                    <button type="button" onClick={() => removeTask(task.id)} aria-label={`Delete ${task.title}`} className="flex size-9 items-center justify-center rounded-lg text-[#d8b9c6] opacity-0 transition hover:bg-[#fff0f5] hover:text-[#df6f9b] group-hover:opacity-100 focus:opacity-100"><Trash2 aria-hidden="true" className="size-4" /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}