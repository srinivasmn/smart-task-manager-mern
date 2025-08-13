// app/users/page.js
import { useQuery, gql } from "@apollo/client";

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      email
    }
  }
`;

export default function UsersPage() {
  const { loading, error, data } = useQuery(GET_USERS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">User List</h1>
      <ul className="space-y-2">
        {data.users.map((user) => (
          <li key={user.id} className="bg-white shadow p-4 rounded">
            {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}
