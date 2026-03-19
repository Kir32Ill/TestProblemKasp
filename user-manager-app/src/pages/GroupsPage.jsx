import React, { useState } from 'react';
import { Modal } from '../components/Modal';

const GroupsPage = ({ groups, setGroups, users, setUsers }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [groupNameInput, setGroupNameInput] = useState('');
  const [activeGroup, setActiveGroup] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const openAddModal = () => {
    setIsEditing(false);
    setGroupNameInput('');
    setIsFormOpen(true);
  };

  const openEditModal = (name) => {
    setIsEditing(true);
    setActiveGroup(name);
    setGroupNameInput(name);
    setIsFormOpen(true);
  };

  const openDeleteModal = (name) => {
    setActiveGroup(name);
    setIsDeleteOpen(true);
  };

  const handleSaveGroup = (e) => {
    e.preventDefault();
    if (!groupNameInput.trim()) return;

    if (isEditing) {
      setGroups(groups.map(g => g === activeGroup ? groupNameInput : g));
      setUsers(users.map(u => u.group === activeGroup ? { ...u, group: groupNameInput } : u));
    } else {
      if (!groups.includes(groupNameInput)) {
        setGroups([...groups, groupNameInput]);
      }
    }
    setIsFormOpen(false);
  };

  const confirmDeleteGroup = () => {
    setGroups(groups.filter(g => g !== activeGroup));
    setUsers(users.map(u => u.group === activeGroup ? { ...u, group: 'Unmanaged' } : u));
    setIsDeleteOpen(false);
    setActiveGroup(null);
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Группы доступа</h1>
          <p className="text-gray-500 text-sm">Управление организационными структурами</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-blue-100 transition-all active:scale-95"
        >
          + Создать группу
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((name) => {
          const count = users.filter(u => u.group === name).length;
          return (
            <div
              key={name}
              className="group bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-50 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <svg className="w-20 h-20 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                </svg>
              </div>

              <div className="relative z-10">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                
                <h3 className="text-xl font-black text-gray-800 mb-1 truncate pr-10">{name}</h3>
                <p className="text-sm font-bold text-blue-500 mb-6 uppercase tracking-widest">{count} участников</p>
                
                <div className="flex gap-3 pt-4 border-t border-gray-50">
                  <button
                    onClick={() => openEditModal(name)}
                    className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    Изменить
                  </button>
                  <button
                    onClick={() => openDeleteModal(name)}
                    className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={isEditing ? "Редактирование группы" : "Создание новой группы"}
      >
        <form onSubmit={handleSaveGroup} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Название группы</label>
            <input
              autoFocus
              className="w-full bg-gray-50 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold text-gray-700"
              placeholder="Введите имя..."
              value={groupNameInput}
              onChange={(e) => setGroupNameInput(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-[0.98]"
          >
            {isEditing ? "Сохранить изменения" : "Подтвердить создание"}
          </button>
        </form>
      </Modal>

      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Удаление структуры"
      >
        <div className="text-center">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <h4 className="text-xl font-black text-gray-800 mb-2 uppercase tracking-tight">Вы уверены?</h4>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">
            Группа <span className="font-bold text-gray-800">"{activeGroup}"</span> будет удалена. Все участники автоматически получат статус <span className="italic">Unmanaged</span>.
          </p>
          <div className="flex gap-4">
            <button
              onClick={confirmDeleteGroup}
              className="flex-1 bg-red-500 text-white py-4 rounded-2xl font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-100 active:scale-95"
            >
              Удалить
            </button>
            <button
              onClick={() => setIsDeleteOpen(false)}
              className="flex-1 bg-gray-100 text-gray-500 py-4 rounded-2xl font-bold hover:bg-gray-200 transition-all active:scale-95"
            >
              Отмена
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default GroupsPage;