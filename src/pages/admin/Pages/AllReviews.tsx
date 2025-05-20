import { useEffect, useState } from "react";
import axios from "axios";

interface Review {
  id: number;
  title: string;
  userName: string;
  businessName: string;
  createdAt: string;
  status: string;
}

export default function AllReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    axios.get("/api/reviews")
      .then((res) => setReviews(res.data))
      .catch(console.error);
  }, []);

  const handleReviewAction = (id: number, action: "approve" | "reject" | "delete") => {
    const url = `/api/reviews/${id}/${action}`;
    const method = action === "delete" ? "delete" : "put";

    axios({ method, url })
      .then(() => setReviews((prev) => prev.filter(r => r.id !== id)))
      .catch(console.error);
  };

  return (
    <div>
      <h2>All Reviews</h2>
      <table>
        <thead>
          <tr>
            <th>Title</th><th>User</th><th>Business</th><th>Created</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((r) => (
            <tr key={r.id}>
              <td>{r.title}</td>
              <td>{r.userName}</td>
              <td>{r.businessName}</td>
              <td>{new Date(r.createdAt).toLocaleDateString()}</td>
              <td>{r.status}</td>
              <td>
                <button onClick={() => handleReviewAction(r.id, "approve")}>Approve</button>
                <button onClick={() => handleReviewAction(r.id, "reject")}>Reject</button>
                <button onClick={() => handleReviewAction(r.id, "delete")}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
