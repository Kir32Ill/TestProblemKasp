import React from 'react';
import { Link } from 'react-router-dom';

const WelcomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center mb-6 animate-bounce">
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
        </svg>
      </div>
      <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Панель управления персоналом</h1>
      <p className="text-gray-500 max-w-md text-lg mb-10 leading-relaxed">
        Добро пожаловать в систему. Здесь вы можете управлять списком сотрудников, фильтровать их по группам и редактировать данные.
      </p>
      <div className="flex gap-4">
        <Link to="/users" className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">
          К пользователям
        </Link>
        <Link to="/groups" className="bg-white text-gray-700 border border-gray-200 px-8 py-3 rounded-2xl font-bold hover:bg-gray-50 transition-all">
          Группы доступа
        </Link>
      </div>
    </div>
  );
};

export default WelcomePage;