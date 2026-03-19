import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import UsersPage from './pages/UsersPage';
import GroupsPage from './pages/GroupsPage';

function App() {
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data.json')
      .then(res => res.json())
      .then(data => {
        setUsers(data.users);
        setGroups(data.groups);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="flex items-center justify-center h-screen font-bold">Загрузка данных...</div>;

  return (
    <Router>
      <div className="min-h-screen bg-[#F8FAFC]">
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 px-6 h-16 flex items-center gap-10 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg"><span className="text-white font-black italic">K</span></div>
            <span className="font-bold text-gray-900">Portal.Admin</span>
          </div>
          <div className="flex gap-4">
            <NavLink to="/" className={({isActive}) => `px-4 py-2 rounded-lg text-sm font-semibold ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-500'}`}>Главная</NavLink>
            <NavLink to="/users" className={({isActive}) => `px-4 py-2 rounded-lg text-sm font-semibold ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-500'}`}>Пользователи</NavLink>
            <NavLink to="/groups" className={({isActive}) => `px-4 py-2 rounded-lg text-sm font-semibold ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-500'}`}>Группы</NavLink>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-10 px-6">
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/users" element={<UsersPage users={users} setUsers={setUsers} groups={groups} />} />
            <Route path="/groups" element={<GroupsPage groups={groups} setGroups={setGroups} users={users} setUsers={setUsers} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;