import React, { useEffect, useState } from "react";
import { getLicences } from "../services/licenceService";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from "recharts";

function AbonnementsM365() {
  const [abonnements, setAbonnements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLicences()
      .then((response) => {
        setAbonnements(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des abonnements:", error);
        setLoading(false);
      });
  }, []);

  // Transform data for chart
  const chartData = abonnements.map((item) => ({
    plan: item.plan,
    assigned: item.assigned,
    disponible: item.total - item.assigned,
  }));

  if (loading) return <div className="container mt-4">Chargement...</div>;

  return (
    <div className="container-fluid mt-4">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb bg-white px-0">
          <li className="breadcrumb-item"><a href="#">Accueil</a></li>
          <li className="breadcrumb-item active" aria-current="page">Abonnements M365</li>
        </ol>
      </nav>
      
      {/* Chart */}
      <div className="mb-5" style={{ height: 300 }}>
        <h5>Utilisation des licences par plan</h5>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="plan" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="assigned" stackId="a" fill="#0d6efd" name="Attribuées" />
            <Bar dataKey="disponible" stackId="a" fill="#198754" name="Disponibles" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
      <div>
        <h5>Détails des abonnements</h5>
        <table className="table table-striped table-bordered">
          <thead className="thead-dark">
            <tr>
              <th>Type de plan</th>
              <th>Total</th>
              <th>Attribuées</th>
              <th>Disponibles</th>
            </tr>
          </thead>
          <tbody>
            {abonnements.map((item, idx) => (
              <tr key={idx}>
                <td>{item.plan}</td>
                <td>{item.total}</td>
                <td>{item.assigned}</td>
                <td>{item.total - item.assigned}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AbonnementsM365;
