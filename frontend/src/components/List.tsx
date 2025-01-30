import { useEffect, useState } from "react";
import axios from "axios";
import url from "../assets/config";

interface user {
  name: string;
  age: number;
}

function List() {
  const [userList, setUserList] = useState<user[]>([]);

  useEffect(() => {
    async function getList() {
      const response = await axios.get(`${url}/api/users`);
      setUserList(response.data);
    }
    getList();
  }, [userList]);

  return (
    <div>
      <h1> User List </h1>
      <ul>
        {userList.map((user, index) => (
          <li key={index}>
            <p>Name: {user.name}</p>
            <p>Age: {user.age}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default List;
