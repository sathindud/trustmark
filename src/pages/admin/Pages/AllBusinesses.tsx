import { useEffect, useState } from "react";
import axios from "axios";

interface Business {
  id: number;
  name: string;
  phoneNumber: string;
  email: string;
  createdAt: string;
  isVerified: boolean;
}

export default function AllBusinesses() {
  const [businesses, setBusinesses] = useState<Business[]>([]);

  useEffect(() => {
    axios.get("/api/admin/businesses/all")
      .then((res) => setBusinesses(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleAction = (id: number, action: "approve" | "disapprove" | "delete") => {
    const url = `/api/businesses/${id}/${action}`;
    const method = action === "delete" ? "delete" : "put";

    axios({ method, url })
      .then(() => {
        setBusinesses((prev) => prev.filter(b => b.id !== id));
      })
      .catch(console.error);
  };

  return (
    <div>
      <h2>All Businesses</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th><th>Phone</th><th>Email</th><th>Created</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {businesses.map((b) => (
            <tr key={b.id}>
              <td>{b.name}</td>
              <td>{b.phoneNumber}</td>
              <td>{b.email}</td>
              <td>{new Date(b.createdAt).toLocaleDateString()}</td>
              <td>{b.isVerified ? "Verified" : "Unverified"}</td>
              <td>
                <button onClick={() => handleAction(b.id, "approve")}>Approve</button>
                <button onClick={() => handleAction(b.id, "disapprove")}>Disapprove</button>
                <button onClick={() => handleAction(b.id, "delete")}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}