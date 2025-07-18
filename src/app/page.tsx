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
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [apiLoading, setApiLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      console.log("fetching advocates...");
      setApiLoading(true);
      const response = await fetch(`/api/advocates?searchTerm=${searchTerm}`);
      const responseJson: IJsonResult<IAdvocate> = await response.json();
      setAdvocates(responseJson.data);
      setApiLoading(false);
    })();
  }, [searchTerm]);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
  };

  const onClick = () => {
    console.log(advocates);
    setSearchTerm("");
    document.getElementById("search-input")?.focus();
  };

  return (
    <main style={{margin: "24px"}}>
      <h1 className="mb-5">Solace Advocates</h1>
      <div>
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
          <label className="input">
            <i className={apiLoading ? "fa-solid fa-spinner fa-spin" : "fa-solid fa-magnifying-glass opacity-50"} />
            <input
              id="search-input"
              type="text"
              placeholder="Search for an advocate..."
              onChange={onChange}
              value={searchTerm}
            />
            <button
              className="btn btn-circle btn-ghost btn-xs"
              onClick={onClick}
            >
              <i className="fa-solid fa-circle-xmark opacity-50"></i>
            </button>
          </label>
        </fieldset>
      </div>

      <div className="mt-2 overflow-x-auto rounded-box border border-gray-700 bg-base-100">
        <table className="table">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>City</th>
              <th>Degree</th>
              <th>Specialties</th>
              <th>Years of Experience</th>
              <th>Phone Number</th>
            </tr>
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
                    <ul className="list-disc">
                      {advocate.specialties.map((s) => (
                        <li key={`${advocate.id}{s}`}>{s}</li>
                      ))}
                    </ul>
                  </td>
                  <td>{advocate.yearsOfExperience}</td>
                  <td>
                    <i className="fa-solid fa-phone mr-2"></i>
                    <a
                      className="link"
                      href={"tel:" + advocate.phoneNumber}
                    >
                      {advocate.phoneNumber}
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
);
}
