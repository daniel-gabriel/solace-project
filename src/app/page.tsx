"use client";

import {ChangeEvent, useEffect, useState} from "react";

/**
 * Advocate model returned from the API request. Ideally, this would be auto-generated.
 */
interface IAdvocate {
  id: number;
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: number;
  phoneNumber: number;
}

/**
 * Represents a typed JSON response. Makes it easier to deserialize.
 */
interface IJsonResult<TData> {
  data: TData[];
}

export default function Home() {
  const [advocates, setAdvocates] = useState<IAdvocate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    (async () => {
      console.log("fetching advocates...");
      const response = await fetch(`/api/advocates?searchTerm=${searchTerm}`);
      const responseJson: IJsonResult<IAdvocate> = await response.json();
      setAdvocates(responseJson.data);
    })();
  }, [searchTerm]);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);

    const searchTermElement = document.getElementById("search-term");
    if (searchTermElement) {
        searchTermElement.innerHTML = searchTerm;
    } else {
      console.error("search-term element not found");
    }
  };

  const onClick = () => {
    console.log(advocates);
    setSearchTerm("");
  };

  return (
    <main style={{ margin: "24px" }}>
      <h1>Solace Advocates</h1>
      <br />
      <br />
      <div>
        <p>Search</p>
        <p>
          Searching for: <span id="search-term"></span>
        </p>
        <input style={{ border: "1px solid black" }} onChange={onChange} />
        <button onClick={onClick}>Reset Search</button>
      </div>
      <br />
      <br />
      <table>
        <thead><tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>City</th>
          <th>Degree</th>
          <th>Specialties</th>
          <th>Years of Experience</th>
          <th>Phone Number</th></tr>
        </thead>
        <tbody>
          {advocates.map((advocate: IAdvocate) => {
            return (
              <tr key={advocate.id}>
                <td>{advocate.firstName}</td>
                <td>{advocate.lastName}</td>
                <td>{advocate.city}</td>
                <td>{advocate.degree}</td>
                <td>
                  {advocate.specialties.map((s) => (
                    <div key={`${advocate.id}{s}`}>{s}</div>
                  ))}
                </td>
                <td>{advocate.yearsOfExperience}</td>
                <td>{advocate.phoneNumber}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}
