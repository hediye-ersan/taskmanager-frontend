import React from "react";

const DashboardPage = () => {
  return (
    <div className="p-6 flex flex-col gap-6 ">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Görev Durumu */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Görev Durumu</h2>
          <p className="text-gray-600">Yapılacak: <span className="font-bold">5</span></p>
          <p className="text-gray-600">Devam Eden: <span className="font-bold">3</span></p>
          <p className="text-gray-600">Tamamlanan: <span className="font-bold">8</span></p>
        </div>

        {/* Son Etkinlikler */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Son Etkinlikler</h2>
          <ul className="text-gray-600 space-y-2">
            <li>VH bir görev tamamladı.</li>
            <li>AG yeni bir görev ekledi.</li>
            <li>ML bir görevi düzenledi.</li>
          </ul>
        </div>

        {/* Hızlı Erişim */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Hızlı Erişim</h2>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
            Yeni Görev Ekle
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;