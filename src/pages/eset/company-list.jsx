import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Papa from "papaparse";
import { saveAs } from "file-saver";
import { getDeviceGroups } from "../../services/eset.services"; // your service
import { Link } from "react-router-dom";

export default function EsetDataTable() {
  const [deviceGroups, setDeviceGroups] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      setLoading(true);
      try {
        const response = await getDeviceGroups();
        console.log("Fetched groups:", response.data);
        // ✅ new shape: response.data.groups
        setDeviceGroups(response.data.groups || []);
      } catch (err) {
        console.error("Error fetching device groups:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  const columns = [
    {
      name: "Display Name",
      selector: (row) => row.displayName,
      sortable: true,
      cell: (row) => (
        <Link to={`/eset/company/${row.uuid}/device/list`}>
          {row.displayName}
        </Link>
      ),
    },
    {
      name: "Devices",
      selector: (row) => row.deviceCount ?? 0,
      sortable: true,
      center: true,
    },
    {
      name: "Security Group",
      selector: (row) => (row.isSecurityGroup ? "Yes" : "No"),
      sortable: true,
      center: true,
    },
  ];

  const filteredItems = deviceGroups.filter(
    (item) =>
      item.displayName &&
      item.displayName.toLowerCase().includes(filterText.toLowerCase())
  );

  const exportCSV = () => {
    const csv = Papa.unparse(filteredItems);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "device_groups.csv");
  };

  return (
    <div className="container-fluid mt-4">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb bg-white px-0">
          <li className="breadcrumb-item">
            <a href="#">Accueil</a>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Tableau de bord Eset
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Device Groups
          </li>
        </ol>
      </nav>

      <div className="card card-cockpit-general p-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="mb-0">Device Groups</h4>
          <div className="d-flex gap-2">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Search…"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
            <button
              onClick={exportCSV}
              className="btn btn-outline-primary btn-sm"
            >
              Export CSV
            </button>
          </div>
        </div>

        {loading ? (
          <div className="d-flex justify-content-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredItems}
            pagination
            highlightOnHover
            striped
            dense
            responsive
            defaultSortField="displayName"
          />
        )}
      </div>
    </div>
  );
}
