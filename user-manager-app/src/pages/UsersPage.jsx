import React, { useState, useMemo } from 'react';
import { Modal } from '../components/Modal';

const UsersPage = ({ users, setUsers, groups }) => {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState({ key: 'fullName', dir: 'asc' });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [formData, setFormData] = useState({
    fullName: '',
    account: '',
    email: '',
    group: 'Unmanaged',
    phone: ''
  });

  const processedUsers = useMemo(() => {
    let result = users.filter(u =>
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.account.toLowerCase().includes(search.toLowerCase())
    );

    result.sort((a, b) => {
      const valA = String(a[sort.key] || '').toLowerCase();
      const valB = String(b[sort.key] || '').toLowerCase();
      if (valA < valB) return sort.dir === 'asc' ? -1 : 1;
      if (valA > valB) return sort.dir === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [users, search, sort]);

  const handleSort = (key) => {
    setSort(prev => ({
      key,
      dir: prev.key === key && prev.dir === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(processedUsers.map(u => u.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (e, id) => {
    e.stopPropagation();
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const openAddModal = () => {
    setCurrentUser(null);
    setFormData({ fullName: '', account: '', email: '', group: 'Unmanaged', phone: '' });
    setIsFormOpen(true);
  };

  const openEditModal = (user) => {
    setCurrentUser(user);
    setFormData({ ...user });
    setIsFormOpen(true);
  };

  const openDeleteModal = (e, id) => {
    e.stopPropagation();
    setUserToDelete(id);
    setIsDeleteOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentUser) {
      setUsers(users.map(u => u.id === currentUser.id ? { ...formData, id: u.id } : u));
    } else {
      setUsers([{ ...formData, id: Date.now() }, ...users]);
    }
    setIsFormOpen(false);
  };

  const confirmDelete = () => {
    setUsers(users.filter(u => u.id !== userToDelete));
    setIsDeleteOpen(false);
    setUserToDelete(null);
    setSelectedIds(prev => prev.filter(id => id !== userToDelete));
  };

  const confirmBulkDelete = () => {
    setUsers(users.filter(u => !selectedIds.includes(u.id)));
    setSelectedIds([]);
    setIsBulkDeleteOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Пользователи</h1>
          <p className="text-gray-500 text-sm">Управление базой данных сотрудников</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Поиск..."
            className="flex-1 md:w-64 bg-white border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {selectedIds.length > 0 && (
            <button
              onClick={() => setIsBulkDeleteOpen(true)}
              className="bg-red-50 text-red-600 px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors"
            >
              Удалить ({selectedIds.length})
            </button>
          )}
          <button
            onClick={openAddModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-200 transition-all active:scale-95"
          >
            + Добавить
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                <th className="p-4 w-12 text-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    onChange={handleSelectAll}
                    checked={processedUsers.length > 0 && selectedIds.length === processedUsers.length}
                  />
                </th>
                {[
                  { label: 'Полное имя', key: 'fullName' },
                  { label: 'Учетная запись', key: 'account' },
                  { label: 'Электронная почта', key: 'email' },
                  { label: 'Группа', key: 'group' },
                  { label: 'Номер телефона', key: 'phone' }
                ].map((col) => (
                  <th
                    key={col.key}
                    className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest cursor-pointer hover:text-blue-600 transition-colors"
                    onClick={() => handleSort(col.key)}
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      {sort.key === col.key && (
                        <span className="text-blue-500">{sort.dir === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                ))}
                <th className="p-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {processedUsers.map((user) => (
                <tr
                  key={user.id}
                  onClick={() => openEditModal(user)}
                  className={`group hover:bg-blue-50/30 transition-colors cursor-pointer ${selectedIds.includes(user.id) ? 'bg-blue-50/60 shadow-inner' : ''}`}
                >
                  <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={selectedIds.includes(user.id)}
                      onChange={(e) => handleSelectOne(e, user.id)}
                    />
                  </td>
                  <td className="p-4 font-bold text-gray-800">{user.fullName}</td>
                  <td className="p-4 text-sm text-gray-500">{user.account}</td>
                  <td className="p-4 text-sm text-gray-500">{user.email}</td>
                  <td className="p-4">
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-black uppercase">
                      {user.group}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-500">{user.phone}</td>
                  <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => openEditModal(user)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => openDeleteModal(e, user.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {processedUsers.length === 0 && (
            <div className="p-20 text-center text-gray-400 font-medium italic">
              Ничего не найдено...
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={currentUser ? "Редактирование данных" : "Новый сотрудник"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">ФИО</label>
            <input
              required
              className="w-full bg-gray-50 border-none rounded-xl p-3.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={formData.fullName}
              onChange={e => setFormData({ ...formData, fullName: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Аккаунт</label>
              <input
                required
                className="w-full bg-gray-50 border-none rounded-xl p-3.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={formData.account}
                onChange={e => setFormData({ ...formData, account: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Группа</label>
              <select
                className="w-full bg-gray-50 border-none rounded-xl p-3.5 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer appearance-none"
                value={formData.group}
                onChange={e => setFormData({ ...formData, group: e.target.value })}
              >
                {groups.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Email</label>
            <input
              required
              type="email"
              className="w-full bg-gray-50 border-none rounded-xl p-3.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Телефон</label>
            <input
              required
              className="w-full bg-gray-50 border-none rounded-xl p-3.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all mt-4 active:scale-[0.98]"
          >
            {currentUser ? "Обновить данные" : "Добавить в систему"}
          </button>
        </form>
      </Modal>

      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Удаление сотрудника"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-gray-600 font-medium mb-8">
            Это действие удалит сотрудника из базы данных безвозвратно. Продолжить?
          </p>
          <div className="flex gap-3">
            <button
              onClick={confirmDelete}
              className="flex-1 bg-red-500 text-white py-3.5 rounded-xl font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-100"
            >
              Удалить
            </button>
            <button
              onClick={() => setIsDeleteOpen(false)}
              className="flex-1 bg-gray-100 text-gray-600 py-3.5 rounded-xl font-bold hover:bg-gray-200 transition-colors"
            >
              Отмена
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isBulkDeleteOpen}
        onClose={() => setIsBulkDeleteOpen(false)}
        title="Массовое удаление"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <p className="text-gray-600 font-medium mb-2">
            Вы действительно хотите удалить выбранных пользователей?
          </p>
          <p className="text-sm text-red-500 font-bold mb-8 uppercase tracking-widest">
            Количество: {selectedIds.length}
          </p>
          <div className="flex gap-3">
            <button
              onClick={confirmBulkDelete}
              className="flex-1 bg-red-500 text-white py-3.5 rounded-xl font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-100"
            >
              Подтвердить
            </button>
            <button
              onClick={() => setIsBulkDeleteOpen(false)}
              className="flex-1 bg-gray-100 text-gray-500 py-3.5 rounded-xl font-bold hover:bg-gray-200 transition-colors"
            >
              Отмена
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UsersPage;