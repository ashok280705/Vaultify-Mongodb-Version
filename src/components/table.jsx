import React, { useContext, useState } from "react";
import Usercontext from "../context/context";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Table = () => {
  const { currmanager, setcurrmanager, currentUser } = useContext(Usercontext);
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState({ site: "", username: "", password: "" });

  const handleDelete = async (indexToDelete) => {
    const itemToDelete = currmanager[indexToDelete];

    try {
      const response = await fetch("http://localhost:3000/passwords", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          site: itemToDelete.site,
          username: itemToDelete.username,
          password: itemToDelete.password,
          owner: currentUser,
        }),
      });

      const result = await response.json();
      if (result.success) {
        const updatedEntries = currmanager.filter((_, idx) => idx !== indexToDelete);
        setcurrmanager(updatedEntries);
        toast.success("Deleted successfully!");
      } else {
        toast.error(result.message || "Failed to delete");
      }
    } catch (error) {
      toast.error("Error deleting");
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const handleEdit = (idx, item) => {
    setEditIndex(idx);
    setEditData(item);
  };

  const handleSave = async (idx) => {
    const original = currmanager[idx];

    try {
      const response = await fetch("http://localhost:3000/passwords", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          owner: currentUser,
          old: {
            site: original.site,
            username: original.username,
            password: original.password,
          },
          new: {
            site: editData.site,
            username: editData.username,
            password: editData.password,
          },
        }),
      });

      const result = await response.json();

      if (result.success) {
        const updatedEntries = currmanager.map((entry, i) =>
          i === idx ? { ...editData, owner: currentUser } : entry
        );
        setcurrmanager(updatedEntries);
        setEditIndex(null);
        toast.success("Updated successfully!");
      } else {
        toast.error(result.message || "Failed to update");
      }
    } catch (error) {
      toast.error("Error updating");
    }
  };

  return (
    <div className="overflow-auto max-h-[300px] rounded-xl border border-green-200 shadow-inner">
      <table className="table-auto w-full text-left">
        <thead className="sticky top-0 bg-gradient-to-r from-green-400 to-green-600 text-white z-10 shadow">
          <tr>
            <th className="px-6 py-3 text-sm font-semibold tracking-wider">URL</th>
            <th className="px-6 py-3 text-sm font-semibold tracking-wider">Username</th>
            <th className="px-6 py-3 text-sm font-semibold tracking-wider">Password</th>
            <th className="px-6 py-3 text-sm font-semibold tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-green-200">
          {currmanager && currmanager.length > 0 ? (
            currmanager.map((item, idx) => (
              <tr className="hover:bg-green-50 transition" key={idx}>
                {/* SITE */}
                <td className="px-6 py-4">
                  <div className="flex items-center justify-between gap-2">
                    {editIndex === idx ? (
                      <input
                        name="site"
                        value={editData.site}
                        onChange={(e) => setEditData({ ...editData, site: e.target.value })}
                        className="border px-2 py-1 rounded w-full"
                      />
                    ) : (
                      <span className="truncate max-w-[300px]">{item.site}</span>
                    )}
                    <button onClick={() => handleCopy(item.site)}>
                      <lord-icon
                        src="https://cdn.lordicon.com/iykgtsbt.json"
                        trigger="hover"
                        style={{ width: "20px", height: "20px" }}
                      ></lord-icon>
                    </button>
                  </div>
                </td>

                {/* USERNAME */}
                <td className="px-6 py-4">
                  <div className="flex items-center justify-between gap-2">
                    {editIndex === idx ? (
                      <input
                        name="username"
                        value={editData.username}
                        onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                        className="border px-2 py-1 rounded w-full"
                      />
                    ) : (
                      <span className="truncate max-w-[150px]">{item.username}</span>
                    )}
                    <button onClick={() => handleCopy(item.username)}>
                      <lord-icon
                        src="https://cdn.lordicon.com/iykgtsbt.json"
                        trigger="hover"
                        style={{ width: "20px", height: "20px" }}
                      ></lord-icon>
                    </button>
                  </div>
                </td>

                {/* PASSWORD */}
                <td className="px-6 py-4">
                  <div className="flex items-center justify-between gap-2">
                    {editIndex === idx ? (
                      <input
                        name="password"
                        value={editData.password}
                        onChange={(e) => setEditData({ ...editData, password: e.target.value })}
                        className="border px-2 py-1 rounded w-full"
                      />
                    ) : (
                      <span className="truncate max-w-[250px]">{item.password}</span>
                    )}
                    <button onClick={() => handleCopy(item.password)}>
                      <lord-icon
                        src="https://cdn.lordicon.com/iykgtsbt.json"
                        trigger="hover"
                        style={{ width: "20px", height: "20px" }}
                      ></lord-icon>
                    </button>
                  </div>
                </td>

                {/* ACTIONS */}
                <td className="px-6 py-4 flex gap-2 items-center">
                  {editIndex === idx ? (
                    <button
                      className="text-green-700 font-semibold"
                      onClick={() => handleSave(idx)}
                    >
                      Save
                    </button>
                  ) : (
                    <>
                      <button onClick={() => handleEdit(idx, item)}>
                        <lord-icon
                          src="https://cdn.lordicon.com/exymduqj.json"
                          trigger="hover"
                          stroke="bold"
                          colors="primary:#121331,secondary:#000000"
                          style={{ width: "24px", height: "24px" }}
                        ></lord-icon>
                      </button>
                      <button onClick={() => handleDelete(idx)}>
                        <lord-icon
                          src="https://cdn.lordicon.com/jzinekkv.json"
                          trigger="hover"
                          stroke="bold"
                          colors="primary:#121331,secondary:#000000"
                          style={{ width: "24px", height: "24px" }}
                        ></lord-icon>
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="px-6 py-4 text-center text-gray-400" colSpan={4}>
                No data found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;