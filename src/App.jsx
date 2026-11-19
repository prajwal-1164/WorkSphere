import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  Bell,
  Settings,
  Search,
  Plus,
  Trash2,
  CalendarDays,
  CircleCheck,
  CircleAlert,
  Menu,
  X,
  ArrowUpRight,
  ChevronDown,
} from "lucide-react";

const initialProjects = [
  {
    id: "p1",
    name: "Website Redesign",
    category: "Design",
    progress: 78,
    color: "#8b5cf6",
    status: "In Progress",
    deadline: "2026-12-08",
  },
  {
    id: "p2",
    name: "Mobile Application",
    category: "Development",
    progress: 45,
    color: "#22c55e",
    status: "In Progress",
    deadline: "2026-12-18",
  },
  {
    id: "p3",
    name: "CRM Dashboard",
    category: "Software",
    progress: 92,
    color: "#f59e0b",
    status: "Almost Done",
    deadline: "2026-11-28",
  },
];

const initialTasks = [
  {
    id: "t1",
    title: "Design new dashboard UI",
    project: "Website Redesign",
    status: "In Progress",
    priority: "High",
    due: "2026-11-24",
  },
  {
    id: "t2",
    title: "Implement authentication",
    project: "Mobile Application",
    status: "To Do",
    priority: "High",
    due: "2026-11-26",
  },
  {
    id: "t3",
    title: "Fix responsive layout",
    project: "CRM Dashboard",
    status: "Completed",
    priority: "Medium",
    due: "2026-11-20",
  },
];

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [page, setPage] = useState("Dashboard");

  const [projects, setProjects] = useState(() =>
    readStorage("worksphere_projects", initialProjects)
  );

  const [tasks, setTasks] = useState(() =>
    readStorage("worksphere_tasks", initialTasks)
  );

  const [search, setSearch] = useState("");
  const [modal, setModal] = useState("");
  const [mobileNav, setMobileNav] = useState(false);
  const [toast, setToast] = useState("");

  const [projectDraft, setProjectDraft] = useState({
    name: "",
    category: "Development",
    deadline: "",
  });

  const [taskDraft, setTaskDraft] = useState({
    title: "",
    project: "",
    status: "To Do",
    priority: "Medium",
    due: "",
  });

  useEffect(() => {
    localStorage.setItem("worksphere_projects", JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem("worksphere_tasks", JSON.stringify(tasks));
  }, [tasks]);

  const completed = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const overdue = tasks.filter(
    (task) =>
      task.status !== "Completed" &&
      task.due &&
      new Date(task.due) < new Date(new Date().toDateString())
  ).length;

  function showToast(message) {
    setToast(message);
    setTimeout(() => setToast(""), 2500);
  }

  function createProject(event) {
    event.preventDefault();

    const newProject = {
      id: crypto.randomUUID(),
      ...projectDraft,
      progress: 0,
      status: "Planning",
      color: "#6366f1",
    };

    setProjects((previous) => [newProject, ...previous]);

    setProjectDraft({
      name: "",
      category: "Development",
      deadline: "",
    });

    setModal("");
    showToast("Project created successfully");
  }

  function deleteProject(projectId) {
    const project = projects.find((item) => item.id === projectId);

    setProjects((previous) =>
      previous.filter((item) => item.id !== projectId)
    );

    if (project) {
      setTasks((previous) =>
        previous.filter((task) => task.project !== project.name)
      );
    }

    showToast("Project deleted");
  }

  function createTask(event) {
    event.preventDefault();

    const newTask = {
      id: crypto.randomUUID(),
      ...taskDraft,
    };

    setTasks((previous) => [newTask, ...previous]);

    setTaskDraft({
      title: "",
      project: projects[0]?.name || "",
      status: "To Do",
      priority: "Medium",
      due: "",
    });

    setModal("");
    showToast("Task created successfully");
  }

  function updateTaskStatus(taskId, newStatus) {
    setTasks((previous) =>
      previous.map((task) =>
        task.id === taskId
          ? { ...task, status: newStatus }
          : task
      )
    );

    showToast("Task status updated");
  }

  function deleteTask(taskId) {
    setTasks((previous) =>
      previous.filter((task) => task.id !== taskId)
    );

    showToast("Task deleted");
  }

  const filteredTasks = tasks.filter((task) =>
    `${task.title} ${task.project} ${task.status} ${task.priority}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const navItems = [
    ["Dashboard", LayoutDashboard],
    ["Projects", FolderKanban],
    ["Tasks", CheckSquare],
    ["Team", Users],
    ["Notifications", Bell],
  ];

  return (
    <div className="shell">
      <aside className={`sidebar ${mobileNav ? "show" : ""}`}>
        <div className="brand">
          <span className="brand-mark">W</span>
          <span>WorkSphere</span>

          <button
            className="mobile-close"
            onClick={() => setMobileNav(false)}
          >
            <X />
          </button>
        </div>

        <div className="workspace-chip">
          <span className="workspace-dot"></span>

          <div>
            <b>My Workspace</b>
            <small>Personal workspace</small>
          </div>

          <ChevronDown size={16} />
        </div>

        <div className="nav-label">WORKSPACE</div>

        <nav>
          {navItems.map(([label, Icon]) => (
            <button
              key={label}
              className={`nav-item ${page === label ? "active" : ""}`}
              onClick={() => {
                setPage(label);
                setMobileNav(false);
              }}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <button className="nav-item">
            <Settings size={18} />
            <span>Settings</span>
          </button>

          <div className="user-card">
            <div className="avatar">PA</div>

            <div className="user-meta">
              <b>Prajwal Ahirkar</b>
              <small>Administrator</small>
            </div>
          </div>
        </div>
      </aside>

      {mobileNav && (
        <div
          className="scrim"
          onClick={() => setMobileNav(false)}
        ></div>
      )}

      <main className="main">
        <header className="topbar">
          <button
            className="mobile-menu"
            onClick={() => setMobileNav(true)}
          >
            <Menu />
          </button>

          <div className="crumb">
            <small>Workspace / {page}</small>
            <h2>{page}</h2>
          </div>

          <div className="top-actions">
            <label className="search-box">
              <Search size={17} />

              <input
                placeholder="Search tasks..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>

            <button className="round-btn">
              <Bell size={18} />
            </button>

            <button
              className="primary-btn"
              onClick={() => setModal(page === "Tasks" ? "task" : "project")}
            >
              <Plus size={17} />
              {page === "Tasks" ? "Create Task" : "Create Project"}
            </button>
          </div>
        </header>

        <div className="page-content">
          <section className="welcome">
            <div>
              <h1>
                Good afternoon, Prajwal 👋
              </h1>
              <p>Here's what's happening with your workspace today.</p>
            </div>

            <div className="date-chip">
              <CalendarDays size={16} />
              November 19, 2026
            </div>
          </section>

          {page === "Dashboard" && (
            <>
              <section className="stats">
                {[
                  {
                    title: "Total Projects",
                    value: projects.length,
                    desc: "Projects in workspace",
                    Icon: FolderKanban,
                  },
                  {
                    title: "Total Tasks",
                    value: tasks.length,
                    desc: "Tasks across projects",
                    Icon: CheckSquare,
                  },
                  {
                    title: "Completed",
                    value: completed,
                    desc: "Tasks completed",
                    Icon: CircleCheck,
                  },
                  {
                    title: "Overdue",
                    value: overdue,
                    desc: "Needs attention",
                    Icon: CircleAlert,
                  },
                ].map((stat) => (
                  <article className="stat-card" key={stat.title}>
                    <div className="stat-head">
                      <span>{stat.title}</span>
                      <i>
                        <stat.Icon size={18} />
                      </i>
                    </div>

                    <strong>{stat.value}</strong>
                    <small>{stat.desc}</small>
                  </article>
                ))}
              </section>

              <section className="middle-grid">
                <article className="panel">
                  <PanelHead
                    title="Projects Overview"
                    subtitle="Track your ongoing projects"
                    action="View all"
                    onAction={() => setPage("Projects")}
                  />

                  <div className="project-list">
                    {projects.slice(0, 4).map((project) => (
                      <div className="project-row" key={project.id}>
                        <div className="project-top">
                          <div>
                            <span
                              className="project-dot"
                              style={{ background: project.color }}
                            ></span>

                            <b>{project.name}</b>
                            <small>{project.category}</small>
                          </div>

                          <span className="percent">
                            {project.progress}%
                          </span>
                        </div>

                        <div className="bar">
                          <span
                            style={{
                              width: `${project.progress}%`,
                              background: project.color,
                            }}
                          ></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="panel quick-panel">
                  <PanelHead
                    title="Workspace Activity"
                    subtitle="Productivity summary"
                  />

                  <div className="quick-list">
                    <Quick
                      icon={<CircleCheck />}
                      color="purple"
                      title={`${completed} Tasks Completed`}
                      desc="Across your projects"
                    />

                    <Quick
                      icon={<CircleAlert />}
                      color="orange"
                      title={`${overdue} Tasks Overdue`}
                      desc="Review pending deadlines"
                    />

                    <Quick
                      icon={<Users />}
                      color="green"
                      title="Team Workspace"
                      desc="Collaborate and deliver together"
                    />
                  </div>
                </article>
              </section>

              <article className="panel task-panel">
                <PanelHead
                  title="Recent Tasks"
                  subtitle="Latest tasks from your workspace"
                  action="View all"
                  onAction={() => setPage("Tasks")}
                />

                <TaskTable
                  tasks={filteredTasks.slice(0, 5)}
                  onStatus={updateTaskStatus}
                  onDelete={deleteTask}
                />
              </article>
            </>
          )}

          {page === "Projects" && (
            <article className="panel">
              <PanelHead
                title="All Projects"
                subtitle={`${projects.length} projects in your workspace`}
                action="New project"
                onAction={() => setModal("project")}
              />

              <div className="project-cards">
                {projects.map((project) => (
                  <div className="project-card" key={project.id}>
                    <div
                      className="card-color"
                      style={{ background: project.color }}
                    />

                    <h3>{project.name}</h3>
                    <p>
                      {project.category} · {project.status}
                    </p>

                    <div className="bar">
                      <span
                        style={{
                          width: `${project.progress}%`,
                          background: project.color,
                        }}
                      ></span>
                    </div>

                    <div className="card-foot">
                      <span>{project.progress}% complete</span>
                      <span>Due {project.deadline || "Not set"}</span>
                    </div>

                    <button
                      className="delete-btn"
                      onClick={() => deleteProject(project.id)}
                    >
                      <Trash2 size={15} /> Delete
                    </button>
                  </div>
                ))}
              </div>
            </article>
          )}

          {page === "Tasks" && (
            <article className="panel task-panel">
              <PanelHead
                title="Task Management"
                subtitle="Manage, filter and update your tasks"
                action="New task"
                onAction={() => setModal("task")}
              />

              <TaskTable
                tasks={filteredTasks}
                onStatus={updateTaskStatus}
                onDelete={deleteTask}
              />
            </article>
          )}

          {page === "Team" && (
            <article className="panel empty-panel">
              <div className="empty-icon">
                <Users />
              </div>
              <h3>Team workspace</h3>
              <p>Team collaboration features are coming soon.</p>
            </article>
          )}

          {page === "Notifications" && (
            <article className="panel empty-panel">
              <div className="empty-icon">
                <Bell />
              </div>
              <h3>You're all caught up</h3>
              <p>Notifications will appear here in future updates.</p>
            </article>
          )}
        </div>
      </main>

      {modal && (
        <div
          className="modal-overlay"
          onClick={() => setModal("")}
        >
          <div className="modal" onClick={(event) => event.stopPropagation()}>
            <div className="modal-head">
              <div>
                <h2>
                  {modal === "project" ? "Create a project" : "Create a task"}
                </h2>
                <p>Fill in the details below.</p>
              </div>

              <button
                className="close-btn"
                onClick={() => setModal("")}
              >
                <X size={19} />
              </button>
            </div>

            {modal === "project" ? (
              <form onSubmit={createProject}>
                <label>
                  Project name
                  <input
                    required
                    placeholder="e.g. Website Redesign"
                    value={projectDraft.name}
                    onChange={(event) =>
                      setProjectDraft({
                        ...projectDraft,
                        name: event.target.value,
                      })
                    }
                  />
                </label>

                <label>
                  Category
                  <input
                    placeholder="Design, Development..."
                    value={projectDraft.category}
                    onChange={(event) =>
                      setProjectDraft({
                        ...projectDraft,
                        category: event.target.value,
                      })
                    }
                  />
                </label>

                <label>
                  Deadline
                  <input
                    type="date"
                    value={projectDraft.deadline}
                    onChange={(event) =>
                      setProjectDraft({
                        ...projectDraft,
                        deadline: event.target.value,
                      })
                    }
                  />
                </label>

                <div className="form-actions">
                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={() => setModal("")}
                  >
                    Cancel
                  </button>

                  <button className="primary-btn">
                    Create project
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={createTask}>
                <label>
                  Task title
                  <input
                    required
                    placeholder="What needs to be done?"
                    value={taskDraft.title}
                    onChange={(event) =>
                      setTaskDraft({
                        ...taskDraft,
                        title: event.target.value,
                      })
                    }
                  />
                </label>

                <label>
                  Project
                  <select
                    value={taskDraft.project}
                    onChange={(event) =>
                      setTaskDraft({
                        ...taskDraft,
                        project: event.target.value,
                      })
                    }
                  >
                    <option value="">No project</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.name}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="form-two">
                  <label>
                    Status
                    <select
                      value={taskDraft.status}
                      onChange={(event) =>
                        setTaskDraft({
                          ...taskDraft,
                          status: event.target.value,
                        })
                      }
                    >
                      <option>To Do</option>
                      <option>In Progress</option>
                      <option>Completed</option>
                    </select>
                  </label>

                  <label>
                    Priority
                    <select
                      value={taskDraft.priority}
                      onChange={(event) =>
                        setTaskDraft({
                          ...taskDraft,
                          priority: event.target.value,
                        })
                      }
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  </label>
                </div>

                <label>
                  Due date
                  <input
                    type="date"
                    value={taskDraft.due}
                    onChange={(event) =>
                      setTaskDraft({
                        ...taskDraft,
                        due: event.target.value,
                      })
                    }
                  />
                </label>

                <div className="form-actions">
                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={() => setModal("")}
                  >
                    Cancel
                  </button>

                  <button className="primary-btn">
                    Create task
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

function PanelHead({ title, subtitle, action, onAction }) {
  return (
    <div className="panel-header">
      <div>
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>

      {action && (
        <button className="link-btn" onClick={onAction}>
          {action}
          <ArrowUpRight size={15} />
        </button>
      )}
    </div>
  );
}

function Quick({ icon, color, title, desc }) {
  return (
    <div className="quick-item">
      <span className={`quick-icon ${color}`}>{icon}</span>

      <div>
        <b>{title}</b>
        <small>{desc}</small>
      </div>
    </div>
  );
}

function TaskTable({ tasks, onStatus, onDelete }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Task</th>
            <th>Project</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Due</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {tasks.length === 0 ? (
            <tr>
              <td colSpan="6" className="no-tasks">
                No tasks found. Create a task to get started.
              </td>
            </tr>
          ) : (
            tasks.map((task) => (
              <tr key={task.id}>
                <td className="task-name">{task.title}</td>
                <td>{task.project || "—"}</td>

                <td>
                  <select
                    className={`status-select ${task.status
                      .toLowerCase()
                      .replaceAll(" ", "-")}`}
                    value={task.status}
                    onChange={(event) =>
                      onStatus(task.id, event.target.value)
                    }
                  >
                    <option>To Do</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                  </select>
                </td>

                <td>
                  <span className={`priority ${task.priority.toLowerCase()}`}>
                    {task.priority}
                  </span>
                </td>

                <td>{task.due || "—"}</td>

                <td>
                  <button
                    className="delete-btn"
                    onClick={() => onDelete(task.id)}
                    title="Delete task"
                  >
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}