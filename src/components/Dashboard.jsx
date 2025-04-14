import React, { useEffect, useState } from "react";
import api from "../api";
import Column from "./Column";

const Dashboard = () => {
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const boardId = 1; // Örnek olarak sabit bir ID kullanıyoruz, bunu dinamik hale getirin
        const res = await api.get(`/boards/${boardId}`);
        setColumns(res.data.columns); // Eğer Board içinde columns varsa
      } catch (error) {
        console.error("Veri alınamadı:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex gap-4 px-4">
      {columns && columns.length > 0 ? (
        columns.map((column) => <Column key={column.id} column={column} />)
      ) : (
        <p>Yükleniyor veya veri bulunamadı...</p>
      )}
    </div>
  );
};

export default Dashboard;
